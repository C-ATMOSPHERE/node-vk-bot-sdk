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
        this.tasks = [];

        this.longpoll = {
            key: '',
            server: '',
            ts: 0
        };

        this.eventsCallback = this.eventsCallback.bind(this);
    }

    /**
     * Добавляет middleware для всех событий
     *
     * @param {function(Context, NextFunction)} arguments[0] - Callback function
     */
    use() {
        const args = Array.from(arguments);

        this.tasks.push({
            type: 'middleware',
            cb: args[0]
        });
    }

    /**
     * Добавляет обработчик события
     *
     * @param {string} arguments[0] - Callback event (https://vk.com/dev/groups_events)
     * @param {function(Context, NextFunction)} arguments[1] - Callback function
     */
    on() {
        const args = Array.from(arguments);

        this.tasks.push({
            type: 'event',
            event: args[0],
            cb: args[1]
        });
    }

    /**
     * Добавляет обработчик полезной нагрузки
     *
     * @param {string|string[]} arguments[0] - Payload action
     * @param {function(Context, Object: params)} arguments[1] - Callback function
     */
    payload() {
        const args = Array.from(arguments);

        this.tasks.push({
            type: 'payload',
            actions: Array.isArray(args[0]) ? args[0] : [args[0]],
            cb: args[1]
        });
    }

    /**
     * Добавляет обработчик команды
     *
     * @param {string|string[]|RegExp|RegExp[]} arguments[0] - Command keywords
     * @param {function(Context, Object: data, NextFunction)} arguments[1] - Callback function
     */
    command() {
        const args = Array.from(arguments);

        this.tasks.push({
            type: 'command',
            expressions: Array.isArray(args[0]) ? args[0] : [args[0]],
            cb: args[1]
        });
    }

    /**
     * Добавляет стандартный обработчик команды
     *
     * @param {function(Context, Object: data, NextFunction)} arguments[0] - Callback function
     */
    defaultCommand() {
        const args = Array.from(arguments);

        this.tasks.push({
            type: 'command',
            expressions: [],
            cb: args[0]
        });
    }

    /**
     * Запускает LongPoll соединение
     */
    initLongPoll() {
        const options = this.client.options;

        if(!options.group_id) {
            throw new NotImplementedError('options.group_id is required for longpoll');
        }

        setTimeout(async () => {
            const data = await this.request('groups.getLongPollServer', {
                group_id: options.group_id
            });

            this.longpoll.key = data.key;
            this.longpoll.server = data.server;
            this.longpoll.ts = data.ts;

            this.requestLongPoll().then();
        }, 0);
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
        const tasks = [...this.tasks];
        const ctx = new Context(this.client, data);

        const handleCallback = async (task, params = null) => {
            const result = params ? task.cb(ctx, params, handleNextTask) : task.cb(ctx, handleNextTask);

            if(result instanceof Promise) return await result;
            else return result;
        };
        const handleNextTask = () => {
            if(tasks.length > 0) {
                const task = tasks.splice(0, 1)[0];

                if(task.type === 'middleware') {
                    return handleCallback(task);
                }
                else if(task.type === 'event') {
                    if(task.event === data.type) return handleCallback(task);
                }
                else if(task.type === 'payload') {
                    const result = this._checkCommandPayloads(ctx, task);
                    if (result !== false) return handleCallback(task, result);
                }
                else if (task.type === 'command') {
                    const result = this._checkCommandExpressions(ctx, task);
                    if (result !== false) return handleCallback(task, result);
                }

                return handleNextTask();
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
            console.log('check', ctx.payload[0], action);
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