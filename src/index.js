const events = require('./config/events');

const VkBotSdkApi = require('./api');
const VkBotSdkClient = require('./client');
const VkBotSdkCallback = require('./callback');

const {
    Context, Keyboard, Attachment,
    Button, TextButton, LinkButton, LocationButton, VKPayButton, VKAppButton
} = require('./interfaces');

const {
    redisStorage
} = require('./middlewares');

/**
 * @typedef {{
 *     type: AttachmentType,
 *     ?photo: Object,
 *     ?video: Object,
 *     ?audio: Object,
 *     ?doc: Object,
 *     ?link: Object,
 *     ?market: Object,
 *     ?market_album: Object,
 *     ?wall: Object,
 *     ?wall_reply: Object,
 *     ?sticker: Object,
 *     ?gift: Object
 * }} APIAttachmentObject
 *
 * @typedef {(
 *     'default' | 'primary' | 'positive' | 'negative'
 * )} ButtonColor
 *
 * @typedef {(
 *     'photo' | 'video' | 'audio' | 'doc' | 'link' | 'market' | 'market_album' |
 *     'wall' | 'wall_reply' | 'sticker' | 'gift'
 * )} AttachmentType
 *
 * @typedef {Function<Context, Function>}          CtxCallback
 * @typedef {Function<Error, Context, Function>}   CtxErrorCallback
 * @typedef {Function<Context, Object, Function>}  CtxParamsCallback
 */


/**
 * CLass VkBotSdk
 *
 * @property {VkBotSdkClient}     client
 * @property {VkBotSdkApi}        api
 * @property {VkBotSdkCallback}   callback
 */
class VkBotSdk {
    constructor(options = {}) {
        this.client = new VkBotSdkClient(options);
        this.api = new VkBotSdkApi(this.client);
        this.callback = new VkBotSdkCallback(this.client);
    }

    /**
     * getApi()
     * @returns {VkBotSdkApi}
     */
    getApi() {
        return this.api;
    }

    /**
     * getCallback()
     * @returns {VkBotSdkCallback}
     */
    getCallback() {
        return this.callback;
    }

    /**
     * getClient()
     * @returns {VkBotSdkClient}
     */
    getClient() {
        return this.client;
    }
}

// Sdk exporting
module.exports = VkBotSdk;
module.exports.VkBotSdk = VkBotSdk;

// Interfaces exporting
module.exports.events = events;
module.exports.context = Context;
module.exports.keyboard = Keyboard;
module.exports.attachment = Attachment;
module.exports.button = Button;
module.exports.textButton = TextButton;
module.exports.linkButton = LinkButton;
module.exports.locationButton = LocationButton;
module.exports.vkpayButton = VKPayButton;
module.exports.vkappButton = VKAppButton;

// Interfaces exporting
module.exports.Events = events;
module.exports.Context = Context;
module.exports.Keyboard = Keyboard;
module.exports.Attachment = Attachment;
module.exports.Button = Button;
module.exports.TextButton = TextButton;
module.exports.LinkButton = LinkButton;
module.exports.LocationButton = LocationButton;
module.exports.VKPayButton = VKPayButton;
module.exports.VKAppButton = VKAppButton;

// Middlewares exporting
module.exports.redisStorage = redisStorage;
