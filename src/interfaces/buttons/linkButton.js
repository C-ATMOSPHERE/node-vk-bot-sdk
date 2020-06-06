const Button = require('../button');

class LinkButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {string} label
     * @param {string} link
     * @param {Array} payload
     */
    constructor(label, link, payload = []) {
        super();

        this.button = {
            action: {
                type: 'open_link',
                link: link,
                label: label,
                payload: this.payload(payload)
            }
        };
    }
}

module.exports = LinkButton;