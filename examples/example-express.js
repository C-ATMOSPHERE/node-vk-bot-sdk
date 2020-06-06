const express = require('express');

const VkBotSdk = require('../index');

const main = async () => {
    const app = express();

    const sdk = new VkBotSdk({
        debug: true,
        group_id: 0,
        secret: '',
        confirmation: '',
        access_token: ''
    });

    const bot = sdk.getCallback();

    bot.defaultCommand((ctx, params, next) => {
        ctx.reply('Default answer');
    });

    app.use(bot.eventsCallback);

    app.listen(10000);
};

main().then(() => {
    console.log('Initialized');
}).catch((e) => {
    console.error(e);
});
