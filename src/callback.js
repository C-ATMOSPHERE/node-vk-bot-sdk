const events = require('./config/events');
const Context = require('./interfaces/context');

const { NotImplementedError } = require('./exceptions');

class VkBotSdkCallback {
    /**
     * Создает экземпляр
     *
     * @param {VkBotSdkClient} client
     */
    constructor(client) {
        this.client = client;

        this.middlewaresHandlers = [];
        this.eventsHandlers = [];
        this.messagesHandlers = [];
        this.errorsHandlers = [];

        this.longpoll = {
            key: '',
            server: '',
            ts: 0
        };

        this.eventsCallback = this.eventsCallback.bind(this);
    }

    /**
     * Добавляет middleware для всех событий
     * @param {CtxCallback} cb - Callback function
     */
    use(cb) {
        this.middlewaresHandlers.push({ cb: cb });
    }

    /**
     * Добавляет обработчик ошибок для всех Callback функций
     * @param {CtxErrorCallback} cb - Error callback function
     */
    onError(cb) {
        this.errorsHandlers.push({ cb: cb });
    }

    /**
     * Добавляет обработчик события
     *
     * @param {string} e - Callback event (https://vk.com/dev/groups_events)
     * @param {CtxCallback} cb - Callback function
     */
    on(e, cb) {
        this.eventsHandlers.push({ event: e, cb: cb });
    }

    /**
     * Добавляет обработчик полезной нагрузки
     *
     * @param {string|string[]} act - Payload action
     * @param {CtxParamsCallback} cb - Callback function with params
     */
    payload(act, cb) {
        this.messagesHandlers.push({
            type: 'payload',
            actions: Array.isArray(act) ? act : [act],
            cb: cb
        });
    }

    /**
     * Добавляет обработчик команды
     *
     * @param {string|string[]|RegExp|RegExp[]} exp - Command keywords / RegExp
     * @param {CtxParamsCallback} cb - Callback function with params
     */
    command(exp, cb) {
        this.messagesHandlers.push({
            type: 'command',
            expressions: Array.isArray(exp) ? exp : [exp],
            cb: cb
        });
    }

    /**
     * Добавляет стандартный обработчик команды
     * @param {CtxParamsCallback} cb - Callback function with params
     */
    defaultReply(cb) {
        this.messagesHandlers.push({ type: 'command', expressions: [],  cb: cb });
    }

    /**
     * Запускает LongPoll соединение
     */
    initLongPoll() {
        const options = this.client.options;

        if(!options.group_id) {
            throw new NotImplementedError('options.group_id is required for longpoll');
        }

        this.request('groups.getLongPollServer', {
            group_id: options.group_id
        }).then(async (data) => {
            this.longpoll.key = data.key;
            this.longpoll.server = data.server;
            this.longpoll.ts = data.ts;

            await this.requestLongPoll();
        });
    }

    /**
     * Выполняет очередной запрос к LongPoll серверу
     */
    async requestLongPoll() {
        const request = await this.client.get(this.longpoll.server, {
            act: 'a_check',
            key: this.longpoll.key,
            ts: this.longpoll.ts,
            wait: 25
        });

        if('failed' in request) {
            setTimeout(() => this.initLongPoll(), 1000);
            return;
        }

        this.longpoll.ts = request.ts;

        for(let event of request['updates']) {
            this.handleEvent(event).then();
        }

        setTimeout(() => this.requestLongPoll(), 1);
    }


    /**
     * Проксирует новые события из Express в VkBotSdkCallback.handleEvent
     *
     * @param {import('express').request} req
     * @param {import('express').response} res
     */
    async eventsCallback(req, res) {
        /**
         * Валидация данных
         */
        const data = req.body;
        const options = this.client.options;

        if(!('type' in data) || !('object' in data)) {
            return req.send('ok');
        }
        else if(options.secret && data.secret !== options.secret) {
            return res.send('Invalid secret');
        }
        else if(data.type === events.confirmation) {
            return res.send(this.client.options.confirmation);
        }
        else res.send('ok');

        await this.handleEvent(data);
    }


    /**
     * Обрабатывает событие из Callback или LongPoll
     *
     * @param {Object} data
     */
    async handleEvent(data) {
        const middlewaresHandlers = [...this.middlewaresHandlers];
        const eventsHandlers = [...this.eventsHandlers];
        const messagesHandlers = [...this.messagesHandlers];
        const errorsHandlers = [...this.errorsHandlers];

        const ctx = new Context(this.client, data);

        const handleCallback = async (task, parameter = null) => {
            try {
                let result;

                if(parameter instanceof Error) result = task.cb(parameter, ctx, handleNextTask);
                else if(parameter !== null) result = task.cb(ctx, parameter, handleNextTask);
                else result = task.cb(ctx, handleNextTask);

                if(result instanceof Promise) return await result;
                else return result;
            }
            catch (e) {
                handleNextTask(e, ctx, handleNextTask);
            }

            return null;
        };
        const handleNextTask = (err = null) => {
            if(err instanceof Error) {
                if(errorsHandlers.length > 0) {
                    const handler = errorsHandlers.splice(0, 1)[0];
                    return handleCallback(handler, err);
                }
            }
            else {
                if(middlewaresHandlers.length > 0) {
                    const middleware = middlewaresHandlers.splice(0, 1)[0];
                    return handleCallback(middleware);
                }
                else if(eventsHandlers.length > 0) {
                    const event = eventsHandlers.splice(0, 1)[0];
                    if(event.event === data.type) return handleCallback(event);

                    return handleNextTask();
                }
                else if(messagesHandlers.length > 0) {
                    const handler = messagesHandlers.splice(0, 1)[0];

                    if(handler.type === 'payload') {
                        const result = this._checkCommandPayloads(ctx, handler);
                        if (result !== false) return handleCallback(handler, result);
                    }
                    else if (handler.type === 'command') {
                        const result = this._checkCommandExpressions(ctx, handler);
                        if (result !== false) return handleCallback(handler, result);
                    }

                    return handleNextTask();
                }
            }
        };

        handleNextTask();
    }

    /**
     * Проверяет типы полезной нагрузки для обработчика "payload"
     *
     * @param {Context} ctx
     * @param {Object} task
     * @returns {boolean|*}
     * @private
     */
    _checkCommandPayloads(ctx, task) {
        if(ctx.payload.length === 0) return false;

        for (let action of task.actions) {
            if(ctx.payload[0] === action) return ctx.payload[1];
        }

        return false;
    }

    /**
     * Проверяет ключевые слова для обработчика "command"
     *
     * @param {Context} ctx
     * @param {Object} task
     * @returns {boolean|*}
     * @private
     */
    _checkCommandExpressions(ctx, task) {
        if(task.expressions.length === 0) return true;

        for (let expression of task.expressions) {
            if(typeof expression === 'string' && ctx.message === expression) return expression;
            else if(expression instanceof RegExp) {
                const result = expression.exec(ctx.message);
                if (result) return result.slice(1);
            }
        }

        return false;
    }

    /**
     * Отправляет запрос к API
     *
     * @param {string} method
     * @param {object} params
     */
    request(method, params) {
        return this.client.request(method, params);
    }

    /**
     * Загружает файл по URL
     *
     * @param {string} url
     * @param {Buffer|PathLike} file
     * @param {string} key
     * @param {string} filename
     */
    uploadFile(url, file, key, filename) {
        return this.client.uploadFile(url, file, key, filename);
    }
}

module.exports = VkBotSdkCallback;