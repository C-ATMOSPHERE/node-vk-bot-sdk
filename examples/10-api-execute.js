const { VkBotSdk } = require('../index');

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();
    const client = sdk.getClient();

    /*
     * Варианты использования:
     *
     * ctx.request('users.get', { ... });
     * bot.request('users.get', { ... });
     * client.request('users.get', { ... });
     */

    bot.defaultReply(async (ctx, params) => {
        const [user] = await bot.request('users.get', {
            user_ids: ctx.user_id
        });

        ctx.replyKeyboard(`Default reply to ${user['first_name']} ${user['last_name']}`);
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
