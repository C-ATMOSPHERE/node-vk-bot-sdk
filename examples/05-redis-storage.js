const { VkBotSdk, redisStorage } = require('../index');

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.use(redisStorage.middleware({
        config: {
            host: 'localhost',
            port: 6379,
            prefix: 'namespace:',
            password: '...'
        }
    }));

    bot.command(/index/, async (ctx, params, next) => {
        await ctx.storage.set('active_poll', true);
        await ctx.storage.expire('active_poll', 60 * 60);

        ctx.reply('Tell me about you...');
    });

    bot.defaultReply(async (ctx, params, next) => {
        const pollState = await ctx.storage.get('active_poll');

        if(pollState) {
            await ctx.storage.del('poll_state');

            // ctx.orig_message
            // ...

            ctx.reply('Okay, I will remember this')
        }
        else next();
    });

    bot.defaultReply((ctx, params) => {
        ctx.replyKeyboard(`Default reply`);
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
