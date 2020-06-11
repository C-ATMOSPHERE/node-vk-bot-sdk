const redis = require('redis');

const { MiddlewareError } = require('../exceptions');

/**
 * Class RedisStorageCommands
 */
class RedisStorageCommands {
    /**
     * Constructor
     *
     * @param {function} execute
     * @param {Context} ctx
     */
    constructor(execute, ctx) {
        /** @private */
        this.ctx = ctx;
        this.execute = execute;
    }

    /**
     * @private
     * @param {string} key
     * @returns {string}
     */
    format(key) {
        return `${this.ctx.from_id}:${key}`;
    }

    get(...args) {
        return this.execute('get', this.format(args[0]));
    }

    set(...args) {
        return this.execute('set', this.format(args[0]), args[1], ...args.slice(2));
    }

    del(...args) {
        return this.execute('del', this.format(args[0]));
    }

    incr(...args) {
        return this.execute('incr', this.format(args[0]));
    }

    expire(...args) {
        return this.execute('expire', this.format(args[0]), args[1]);
    }
}

class RedisStorage {
    /**
     * Возвращает Middleware для использования в bot.use()
     *
     * @param {Object} options.config   - Параметры соденения https://github.com/NodeRedis/node-redis#options-object-properties
     * @param {function} options        - Преобразователь для результатов выполнения
     */
    middleware(options = null) {
        this.options = {
            config: {},
            resultFormatter: function (command, result) {
                if(command === 'SET' && result === 'OK') return true;
                else return result;
            }
        };

        if('config' in options) this.options['config'] = options['config'];
        if('resultFormatter' in options) this.options['resultFormatter'] = options['resultFormatter'];

        this.redis = redis.createClient(this.options.config);

        return (ctx, next) => {
            /**
             * @var {RedisStorageCommands} ctx.storage
             */
            ctx.storage = new RedisStorageCommands((...args) => this.execute(...args), ctx);
            next();
        };
    }

    execute(...args) {
        const redis = this.redis;
        const command = args[0] || '';
        const params = args.slice(1) || [];

        return new Promise((resolve) => {
            redis[command](params, (error, result) => {
                if(error) throw new MiddlewareError('Redis: Execute error' + error);
                else {
                    if(typeof this.options.resultFormatter === 'function') {
                        result = this.options.resultFormatter(command, result);
                    }

                    resolve(result);
                }
            });
        });
    }
}

module.exports = new RedisStorage();