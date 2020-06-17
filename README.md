# node-vk-bot-sdk

Небольшое SDK для создания чат-ботов с использованием Node.JS на платформе [сообществ ВКонтакте](https://vk.com/dev/bots_docs).

Рекомендуется использовать с версиями API выше [5.103](https://vk.com/dev/versions).

## Установка
```bash
$ npm install node-vk-bot-sdk
```

## Возможности
* Поддерживает работу с Callback событиями через Express/Koa или LongPoll
* Позволяет добавлять слушатели [произвольных событий в сообществе](https://vk.com/dev/groups_events)
* Позволяет добавлять обработчики команд в сообщениях через RegExp или строки
* Поддерживает работу с присылаемой полезной нагрузкой и данными о клиенте
* Поддерживает установку middleware для всех получеемых событий
* Поддерживает настройку собственных обработчиков ошибок 

## Пример использования
```js
const express = require('express');
const { VkBotSdk } = require('node-vk-bot-sdk');

const app = express();

const sdk = new VkBotSdk({
    group_id: 0,
    secret: '',
    confirmation: '',
    access_token: ''
});

const bot = sdk.getCallback();

bot.command(/test/, (ctx, params) => {
    ctx.reply(`reply to ${ctx.from_id}`);
});

bot.defaultReply((ctx, params) => {
    ctx.reply('Default reply');
});

app.use(express.json());
app.all('/callback', bot.eventsCallback);

app.listen(8080);
```

[Другие варианты использования](https://github.com/m-vts/node-vk-bot-sdk/tree/master/examples)
