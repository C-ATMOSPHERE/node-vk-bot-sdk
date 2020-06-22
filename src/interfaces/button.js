const { TypeError } = require('../exceptions');

/**
 * Class Button
 *
 * @property {Array} buttons
 * @property {boolean} is_one_time
 * @property {boolean} is_inline
 */
class Button {
    constructor() {
        if(!new.target || new.target.name === 'Button') {
            throw new TypeError('Use typed buttons instead of default Button');
        }

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
