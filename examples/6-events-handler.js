const { VkBotSdk, events: e } = require('../index');

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.on(e.group_join, (ctx, next) => {
        console.log('group_join event', ctx.data);
        next();
    });

    bot.on(e.vkpay_transaction, (ctx, next) => {
        console.log('vkpay_transaction event', ctx.data);
        next();
    });

    bot.on(e.like_add, (ctx, next) => {
        console.log('like_add event', ctx.data);
        next();
    });


    bot.command(/test/, (ctx, params, next) => {
        ctx.reply('test');
    });

    bot.defaultReply((ctx, params) => {
        ctx.reply('Default reply');
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
