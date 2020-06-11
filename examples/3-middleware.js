const { VkBotSdk } = require('../index');

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.use((ctx, next) => {
        ctx.date = new Date();
        next();
    });

    bot.defaultReply((ctx, params) => {
        ctx.replyKeyboard(`Default reply\nCurrent date: ${ctx.date}`);
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
