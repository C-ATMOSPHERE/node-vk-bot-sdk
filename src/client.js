const fs = require('fs');
const qs = require('querystring');
const axios = require('axios');
const FormData = require('form-data');

const Keyboard = require('./interfaces/keyboard');
const Attachment = require('./interfaces/attachment');

const { ApiError, UploadError, TypeError, NotImplementedError } = require('./exceptions');

/**
 * Class VkBotSdkClient
 *
 * @property {Object} options
 */
class VkBotSdkClient {
    /**
     * Создает экземпляр
     * @param {Object} options
     */
    constructor(options) {
        this.options = {
            v: '5.107',
            lang: 'ru',
            debug: true,
            group_id: 0,
            secret: '',
            confirmation: '',
            access_token: ''
        };

        if(!options.access_token) {
            throw new NotImplementedError('options.access_token is required');
        }

        if('v' in options) this.options.v = options.v;
        if('lang' in options) this.options.lang = options.lang;
        if('debug' in options) this.options.debug = options.debug;
        if('group_id' in options) this.options.group_id = options.group_id;
        if('secret' in options) this.options.secret = options.secret;
        if('confirmation' in options) this.options.confirmation = options.confirmation;
        if('access_token' in options) this.options.access_token = options.access_token;

        this.client = axios.create({
            baseURL: 'https://api.vk.com/method/'
        }); 
    }

    /**
     * Логирует информацию при options.debug = true
     */
    debug(...args) {
        if(this.options.debug) console.log('[sdk]', ...args);
    }

    /**
     * Отправляет запрос по URL
     *
     * @param {string} url
     * @param {object} params
     */
    async get(url, params) {
        const result = await axios.get(url, {
            headers: {},
            params: params
        });

        return result.data;
    }

    /**
     * Отправляет запрос к API
     *
     * @param {string} method
     * @param {object} params
     */
    async request(method, params) {
        if(!params.v) params.v = this.options.v;
        if(!params.lang) params.lang = this.options.lang;
        if(!params.access_token) params.access_token = this.options.access_token;

        try {
            const result = await this.client.post(method, qs.encode(params), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            });

            if('error' in result.data) {
                throw new ApiError(
                    result.data['error']['error_code'],
                    result.data['error']['error_msg'],
                    result.data['error']['request_params'],
                )
            }

            return result.data['response'];
        }
        catch (e) {
            if(this.options.debug) console.error('[sdk]', e);

            throw new ApiError(0, 'Unknown error', []);
        }
    }

    /**
     * Загружает файл по URL
     *
     * @param {string} url
     * @param {Buffer|PathLike} file
     * @param {string} key
     * @param {string} filename
     */
    async uploadFile(url, file, key, filename) {
        if(typeof file === 'string') {
            file = await fs.readFileSync(file);
        }

        const formData = new FormData();

        formData.append(key, file, {
            filename: filename
        });

        const result = await axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                ...formData.getHeaders()
            }
        });

        if(typeof result.data === 'string') {
            throw new UploadError(result.data);
        }

        return result.data;
    }

    /**
     * Отправляет сообщение с указанными данными
     *
     * @async
     * @param {PeerParameter} arguments[0]           - Получатель/получатели сообщения
     * @param {TextParameter} arguments[1]           - Текст сообщения
     * @param {AttachmentParameter} arguments[2]     - Вложение/вложения
     * @param {KeyboardParameter} arguments[3]       - Клавиатура
     * @param {Object} arguments[4]                  - Собственные параметры
     */
    sendMessage() {
        let args = Array.from(arguments);
        let params = { random_id: 0 };

        let peer, text, attachment, keyboard, props = {};

        /**
         * Преобразование смешанных аргументов
         */
        if(args.length < 1) throw new TypeError('Invalid arguments count');

        if(typeof args[0] === 'object') {
            const object = args[0];

            if('peer_id' in object) peer = object['peer_id'];
            else if('peer_ids' in object) peer = args['peer_ids'];
            else if('user_id' in object) peer = args['user_id'];
            else if('user_ids' in object) peer = args['user_ids'];

            if('text' in object) text = object['text'];
            if('attachment' in object) attachment = object['attachment'];
            if('keyboard' in object) keyboard = object['keyboard'];
            if('params' in object) props = object['params'];
        }
        else {
            if(args[0]) peer = args[0];
            if(args[1]) text = args[1];
            if(args[2]) attachment = args[2];
            if(args[3]) keyboard = args[3];
            if(args[4]) props = args[4];
        }

        /**
         * Подбор и форматирование текста, получателя, вложения и клавиатуры
         */
        if(text !== undefined && text.length > 0) params.message = text;

        if(peer !== undefined && Array.isArray(peer)) params.peer_ids = peer.join(',');
        else params.peer_id = peer;

        if(attachment !== undefined) {
            const attachmentList = Array.isArray(attachment) ? attachment : [attachment];
            const attachmentListResult = [];

            for (let item of attachmentList) {
                if(typeof item === 'string') attachmentListResult.push(item);
                else if(item instanceof Attachment) attachmentList.push(item.toString());
                else throw new TypeError('Invalid attachment type');
            }

            params.attachment = attachmentListResult.join(',');
        }

        if(keyboard !== undefined) {
            if(keyboard instanceof Keyboard) params.keyboard = keyboard.formatToJSON();
            else throw new TypeError('Invalid keyboard type');
        }

        /**
         * Установка кастомных параметров
         */
        const propsKeys = Object.keys(props);

        if(propsKeys.length > 0) {
            for (let key of propsKeys) params[key] = props[key];
        }

        return this.request('messages.send', params);
    }
}

module.exports = VkBotSdkClient;