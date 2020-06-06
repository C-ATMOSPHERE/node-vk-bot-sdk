const Button = require('../interfaces/button');

const { TypeError } = require('../exceptions');

/**
 * Class Keyboard
 */
class Keyboard {
    /**
     * Создает экземпляр
     *
     * @param {Object|Array} arguments[0]
     * @param {Object} arguments[1]
     */
    constructor() {
        const args = Array.from(arguments);

        this.params = {};
        this.buttons = []

        if(args.length === 1) {
            this.buttons = args[0];
        }
        else if(args.length === 2) {
            this.params = args[0];
            this.buttons = args[1];
        }
        else throw new TypeError('Invalid arguments count');
    }

    /**
     * Устанавливает значение one_time
     *
     * @param value
     * @returns {Keyboard}
     */
    oneTime(value = true) {
        this.params.one_time = value;
        return this;
    }

    /**
     * Устанавливает значение inline
     *
     * @param value
     * @returns {Keyboard}
     */
    inline(value = true) {
        this.params.inline = value;
        return this;
    }

    /**
     * Форматирует сохраненную клавиатуру в JSON
     *
     * @returns {string}
     */
    formatToJSON() {
        const result = {
            one_time: !!(this.params.one_time),
            inline: !!(this.params.inline),
            buttons: this.buttons.map((line) => {
                return line.map((button) => {
                    if(button instanceof Button) return button.value();
                    else return button;
                });
            })
        };

        return JSON.stringify(result);
    }
}

module.exports = Keyboard;