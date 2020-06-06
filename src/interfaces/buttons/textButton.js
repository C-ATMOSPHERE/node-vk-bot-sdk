const Button = require('../button');

class TextButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {string} label
     * @param {ButtonColor} color
     * @param {Array} payload
     */
    constructor(label, color = 'default', payload = []) {
        super();

        this.button = {
            action: {
                type: 'text',
                label: label,
                payload: this.payload(payload),
            },
            color: color
        };
    }
}

module.exports = TextButton;