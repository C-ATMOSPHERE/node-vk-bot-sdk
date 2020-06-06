const Button = require('../button');

class LocationButton extends Button {
    /**
     * Создает экземпляр
     *
     * @param {Array} payload
     */
    constructor(payload = []) {
        super();

        this.button = {
            action: {
                type: 'location',
                payload: this.payload(payload)
            }
        };
    }
}

module.exports = LocationButton;