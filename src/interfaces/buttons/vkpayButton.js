const qs = require('querystring');
const Button = require('../button');

class VKPayButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {string|Object} hash
     * @param {Array} payload
     */
    constructor(hash, payload = []) {
        super();

        if(typeof hash === 'object') hash = qs.encode(hash);

        this.button = {
            action: {
                type: 'vkpay',
                hash: hash,
                payload: this.payload(payload)
            }
        };
    }
}

module.exports = VKPayButton;