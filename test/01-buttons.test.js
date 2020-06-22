const { Button, TextButton, LinkButton, LocationButton, VKPayButton, VKAppButton } = require('../index');
const { TypeError } = require('../src/exceptions');

const encode = (data) => {
    return JSON.stringify(data);
};

describe('TextButton', () => {
    it('should create button', () => {
        const { button } = new TextButton('label', 'default');

        expect(button.action.type).toBe('text');
        expect(button.action.label).toBe('label');
        expect(button.action.payload).toBe('[]');
        expect(button.color).toBe('default');
    });

    it('should create button with payload', () => {
        const { button } = new TextButton('label', 'default', 'action');

        expect(button.action.payload).toBe(encode('action'));
    });

    it('should create button with payload and args', () => {
        const { button } = new TextButton('label', 'default', [
            'action', ['arg1', 'arg2']
        ]);

        expect(button.action.payload).toBe(encode([
            'action', ['arg1', 'arg2']
        ]));
    });
});

describe('LinkButton', () => {
    it('should create button', () => {
        const { button } = new LinkButton('test', 'https://google.com');

        expect(button.action.type).toBe('open_link');
        expect(button.action.label).toBe('test');
        expect(button.action.link).toBe('https://google.com');
        expect(button.action.payload).toBe('[]');
    });
});

describe('LocationButton', () => {
    it('should create button', () => {
        const { button } = new LocationButton();

        expect(button.action.type).toBe('location');
        expect(button.action.payload).toBe('[]');
    });
});

describe('VKPayButton', () => {
    it('should create button', () => {
        const { button } = new VKPayButton('hash');

        expect(button.action.type).toBe('vkpay');
        expect(button.action.hash).toBe('hash');
        expect(button.action.payload).toBe('[]');
    });

    it('should create button from string', () => {
        const { button } = new VKPayButton('action=transfer-to-group&group_id=1&aid=10');

        expect(button.action.hash).toBe('action=transfer-to-group&group_id=1&aid=10');
    });

    it('should create button from object', () => {
        const { button } = new VKPayButton({ action: 'transfer-to-group', group_id: 1, aid: 1 });

        expect(button.action.hash).toBe('action=transfer-to-group&group_id=1&aid=1');
    });
});

describe('VKAppButton', () => {
    it('should create button', () => {
        const { button } = new VKAppButton('label', {});

        expect(button.action.type).toBe('open_app');
        expect(button.action.label).toBe('label');
        expect(button.action.payload).toBe('[]');

        expect(button.action.app_id).not.toBeDefined();
        expect(button.action.owner_id).not.toBeDefined();
        expect(button.action.hash).not.toBeDefined();
    });

    it('should create button with params', () => {
        const { button } = new VKAppButton('label', { app_id: 1, owner_id: -1, hash: 'hash' });

        expect(button.action.app_id).toBe(1);
        expect(button.action.owner_id).toBe(-1);
        expect(button.action.hash).toBe('hash');
    });
});

describe('Button', () => {
    it('should not allow to create default button', () => {
        expect(() => new Button('asd')).toThrow(TypeError);
    });
});
