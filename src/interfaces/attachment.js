const { TypeError } = require('../exceptions');

/**
 * Class Attachment
 */
class Attachment {
    /**
     * Создает экземпляр
     *
     * @param {AttachmentType|APIAttachmentObject|Object|string} type       - Attachment or type
     * @param {?number} oid                                                 - owner_id
     * @param {?number} id                                                  - id
     * @param {?string} hash                                                - hash
     */
    constructor(type, oid = null, id = null, hash = null) {
        const args = Array.from(arguments);

        this.attachment = '';

        if(args.length === 1) {
            const object = args[0];

            if(typeof object === 'string') this.attachment = object;
            else if(typeof object === 'object') {
                const attArray = [];
                const attObject = object[object['type']];

                attArray.push(object['type'] + attObject['owner_id']);

                if('id' in attObject) attArray.push(attObject['id']);
                if('hash' in attObject) attArray.push(hash);

                this.attachment = attArray.join('_');
            }
            else throw new TypeError('Invalid argument type');
        }
        else if(args.length >= 3 || args.length <= 4) {
            const attArray = [];

            attArray.push(type + oid);

            if(id) attArray.push(id);
            if(hash) attArray.push(hash);

            this.attachment = attArray.join('_');
        }
        else throw new TypeError('Invalid arguments count');
    }

    toString() {
        return this.attachment;
    }
}

module.exports = Attachment;