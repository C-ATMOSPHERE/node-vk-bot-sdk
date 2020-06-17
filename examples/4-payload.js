const { VkBotSdk, Keyboard, TextButton } = require('../index');

const mainKeyboard = new Keyboard([
    [
        new TextButton('Button 1', 'primary', ['payload_action', ['arg1']])
    ],
    [
        new TextButton('Button 2', 'default', ['payload_action', ['arg2']])
    ]
]);

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.payload('payload_action', (ctx, params, next) => {
        const arg = params[0] || '';

        ctx.reply(`payload_action\n arg[0]: ${arg}`);
    });

    bot.defaultReply((ctx, params) => {
        ctx.replyKeyboard(`Default reply`, mainKeyboard);
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
