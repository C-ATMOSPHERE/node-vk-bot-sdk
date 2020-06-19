const Button = require('../button');

class TextButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {string} label
     * @param {ButtonColor} color
     * @param {Array|string} payload
     */
    constructor(label, color = 'default', payload = []) {
        super();

        this.button = {
            action: {
                type: 'text',
                label: label,
                payload: this.encodePayload(payload),
            },
            color: color
        };
    }
}

module.exports = TextButton;
