/**
 * Class Button
 *
 * @property {Array} buttons
 * @property {boolean} is_one_time
 * @property {boolean} is_inline
 */
class Button {
    constructor() {
        this.button = {};
    }

    value() {
        return this.button;
    }

    encodePayload(data) {
        return JSON.stringify(data);
    }
}

module.exports = Button;
