/**
 * Class Context
 *
 * @property {string} event
 * @property {Object} data
 * @property {number} group_id
 * @property {number} event_id
 *
 * @property {number} from_id
 * @property {number} peer_id
 * @property {number} message_id
 * @property {string} message
 * @property {string} orig_message
 * @property {array} payload
 *
 * @property {Object} client_info
 */
class Context {
    /**
     * Создает экземпляр
     *
     * @param {VkBotSdkClient} client
     * @param {Object} params
     *
     * @param {string} params.type
     * @param {Object} params.object
     * @param {number} params.group_id
     * @param {number} params.event_id
     */
    constructor(client, params) {
        this.client = client;

        const event = this.event = params.type;
        const data = this.data = params.object;

        this.group_id = params.group_id;
        this.event_id = params.event_id;

        this.from_id = 0;
        this.peer_id = 0;
        this.message_id = 0;
        this.message = '';
        this.orig_message = '';
        this.payload = [];

        this.client_info = {
            button_actions: ['text', 'vkpay', 'open_app', 'location', 'open_link'],
            keyboard: true,
            inline_keyboard: true,
            carousel: true,
            lang_id: 0
        };

        const default_types = {
            user_id: [
                'photo_comment_delete', 'video_comment_delete', 'market_comment_delete',
                'market_order_new', 'market_order_edit',
                'group_leave', 'group_join',
                'user_block', 'user_unblock',
                'poll_vote_new', 'group_officers_edit',
                'group_change_settings', 'group_change_photo',
                'app_payload'
            ],
            owner_id: [
                'photo_new', 'audio_new', 'video_new'
            ],
            from_id: [
                'photo_comment_new', 'photo_comment_edit', 'photo_comment_restore',
                'video_comment_new', 'video_comment_edit', 'video_comment_restore',
                'wall_post_new', 'wall_repost',
                'wall_reply_new', 'wall_reply_edit', 'wall_reply_restore',
                'board_post_new', 'board_post_edit', 'board_post_restore',
                'market_comment_new', 'market_comment_edit', 'market_comment_restore',
                'vkpay_transaction'
            ]
        };

        if(default_types.user_id.includes(event)) {
            this.from_id = data['user_id'];
            this.peer_id = data['user_id'];
        }
        else if(default_types.owner_id.includes(event)) {
            this.from_id = data['owner_id'];
            this.peer_id = data['owner_id'];
        }
        else if(default_types.from_id.includes(event)) {
            this.from_id = data['from_id'];
            this.peer_id = data['from_id'];
        }
        else if(['message_new', 'message_reply', 'message_edit'].includes(event)) {
            let message = data;

            if('message' in data) message = data.message;
            if('client_info' in data) this.client_info = data.client_info;

            this.from_id = message['from_id'];
            this.peer_id = message['peer_id'];
            this.message_id = message['id'];

            this.orig_message = message['text'];
            this.message = message['text'].toLowerCase();

            if(message.payload) {
                try {
                    const payload = JSON.parse(message.payload);
                    this.payload = Array.from(payload);
                }
                catch (e) { }
            }
        }
        else if(['message_allow', 'message_deny'].includes(event)) {
            this.from_id = data.user_id;
            this.peer_id = data.user_id;
        }
        else if(['like_add', 'like_remove']) {
            this.from_id = data['liker_id'];
            this.peer_id = data['liker_id'];
        }
    }

    /**
     * Отправляет ответ с текстом, вложениями и клавиатурой
     *
     * @async
     * @param {TextParameter} text
     * @param {AttachmentParameter} attachment
     * @param {KeyboardParameter} keyboard
     */
    reply(text = '', attachment = null, keyboard = null) {
        return this.client.sendMessage(this.peer_id, text, attachment, keyboard);
    }

    /**
     * Отправляет ответ с текстом и клавиатурой
     *
     * @async
     * @param {TextParameter} text
     * @param {KeyboardParameter} keyboard
     */
    replyKeyboard(text = '', keyboard = null) {
        return this.client.sendMessage(this.peer_id, text, null, keyboard);
    }

    /**
     * Отправляет ответ только с вложениями
     *
     * @async
     * @param {AttachmentParameter} attachment
     */
    replyAttachment(attachment = null) {
        return this.client.sendMessage(this.peer_id, '', attachment);
    }

    /**
     * Отправляет ответ с кастомными параметрами
     *
     * @async
     * @param {Object} params
     */
    replyCustom(params) {
        if(!('peer_id' in params)) params.peer_id = this.peer_id;

        return this.client.sendMessage(params);
    }

    isKeyboardSupported() {
        return !!(this.client_info.keyboard);
    }

    isInlineKeyboardSupported() {
        return !!(this.client_info.inline_keyboard);
    }

    isCarouselSupported() {
        return !!(this.client_info.carousel);
    }
}

module.exports = Context;