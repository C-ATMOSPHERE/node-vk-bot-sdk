const { Keyboard, TextButton } = require('../index');

describe('Keyboard', () => {
    it('should create and edit keyboard', () => {
        const keyboard = new Keyboard([]).inline().oneTime();

        expect(keyboard.params.inline).toBe(true);
        expect(keyboard.params.one_time).toBe(true);
    });

    it('should create keyboard with params', () => {
        const keyboard = new Keyboard({ inline: true, one_time: true }, []);

        expect(keyboard.params.inline).toBe(true);
        expect(keyboard.params.one_time).toBe(true);
    });

    it('should create keyboard with buttons', () => {
        const keyboard = new Keyboard([
            [ new TextButton('label'), new TextButton('label') ]
        ]);

        expect(keyboard.params.inline).not.toBeDefined();
        expect(keyboard.params.one_time).not.toBeDefined();

        expect(keyboard.buttons.length).toBe(1);
        expect(keyboard.buttons[0].length).toBe(2);
    });
});
