const { VkBotSdk } = require('../index');

class CustomBotError extends Error { }

const customErrorsHandler = (err, ctx, next) => {
    if(err instanceof CustomBotError) ctx.reply(`Error: ${err.message}`);
    else next();
};

const unknownErrorsHandler = (err, ctx, next) => {
    ctx.reply('Unknown internal error, try to send this command later');
};

const main = async () => {
    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.onError(customErrorsHandler);
    bot.onError(unknownErrorsHandler);

    bot.defaultCommand((ctx, params) => {
        if(!('nonExistParameter' in ctx)) {
            throw new CustomBotError('Invalid ctx');
        }

        ctx.replyKeyboard(`Default command, which will never sent`);
    });

    bot.initLongPoll();
};


main().then(() => {
    console.log('Initialized');
});

