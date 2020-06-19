const Button = require('../button');

class VKAppButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {string} label
     * @param {Object} params
     * @param {number} [params.app_id=0]
     * @param {number} [params.owner_id=0]
     * @param {string} [params.hash=""]
     * @param {Array} payload
     */
    constructor(label, params = {}, payload = []) {
        super();

        const action = {
            type: 'open_app',
            payload: this.encodePayload(payload)
        };

        if('app_id' in params) action.app_id = params.app_id;
        if('owner_id' in params) action.owner_id = params.owner_id;
        if('hash' in params) action.hash = params.hash;

        this.button = { action: action };
    }
}

module.exports = VKAppButton;
