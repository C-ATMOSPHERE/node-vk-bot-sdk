# node-vk-bot-sdk

Небольшое SDK для создания чат-ботов с использованием Node.JS на платформе [сообществ ВКонтакте](https://vk.com/dev/bots_docs).

Рекомендуется использовать с версиями VK API выше [5.103](https://vk.com/dev/versions).

[![npm version](https://img.shields.io/npm/v/node-vk-bot-sdk)](https://www.npmjs.org/package/node-vk-bot-sdk)
[![install size](https://packagephobia.now.sh/badge?p=node-vk-bot-sdk)](https://packagephobia.now.sh/result?p=node-vk-bot-sdk)
[![npm downloads](https://img.shields.io/npm/dm/node-vk-bot-sdk.svg)](http://npm-stat.com/charts.html?package=node-vk-bot-sdk)
![license: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Установка
```bash
$ npm install node-vk-bot-sdk
```

или

```bash
$ yarn add node-vk-bot-sdk
```

## Возможности
* Поддерживает работу с Callback событиями через Express/Koa или LongPoll
* Позволяет добавлять слушатели [произвольных событий в сообществе](https://vk.com/dev/groups_events)
* Позволяет добавлять обработчики команд в сообщениях через RegExp или строки
* Поддерживает работу с присылаемой полезной нагрузкой и данными о клиенте
* Поддерживает установку middleware для всех получаемых событий
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

[Другие примеры работы](examples)

## Context API
| Значение                              | Тип           | Описание                      |
| ---                                   | ---           | ---                           |
| ctx.event                             | `string`      | Тип полученного события       |   
| ctx.data                              | `object`      | Полученные данные в событии   |   
| ctx.group_id                          | `number`      | ID сообщества                 |   
| ctx.event_id                          | `number`      | ID события                    |   
| ctx.user_id                           | `number`      | Псевдоним для `ctx.from_id`                                                   |
| ctx.from_id                           | `number`      | ID автора сообщения <br> (ID затрагиваемого пользователя для других событий)  |   
| ctx.peer_id                           | `number`      | ID дилога <br> (ID затрагиваемого пользователя события для других событий)    |   
| ctx.message                           | `string`      | Преобразованный текст сообщения (пустая строка для других событий)            |   
| ctx.orig_message                      | `string`      | Оригинальный текст сообщения                                                  |   
| ctx.client_info                       | `object`      | Данные о клиенте пользователя или стандартный объект                          |   
| ctx.reply(text, attachment, keyboard) | `function`    | Отправляет ответ с текстом, вложениями и клавиатурой                          |
| ctx.replyKeyboard(text, keyboard)     | `function`    | Отправляет ответ с текстом и клавиатурой                                      |
| ctx.replyAttachment(attachment)       | `function`    | Отправляет ответ только с вложениями                                          |
| ctx.replyCustom(params)               | `function`    | Отправляет ответ с кастомными параметрами                                     |
| ctx.isKeyboardSupported()             | `function`    | Возвращает информацию из client_info                                          |
| ctx.isInlineKeyboardSupported()       | `function`    | Возвращает информацию из client_info                                          |
| ctx.isCarouselSupported()             | `function`    | Возвращает информацию из client_info                                          |
