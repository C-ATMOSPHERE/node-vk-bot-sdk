const { Keyboard, TextButton, LinkButton, LocationButton, VKPayButton, VKAppButton } = require('../index');

/**
 * Обычная клавиатура
 */
new Keyboard([
    [new TextButton('button 1', 'default')],
    [new TextButton('button 2', 'primary')]
]);


/**
 * Инлайн-клавиатуры
 */
new Keyboard({ inline: true }, [
    [new TextButton('button 1', 'positive')],
    [new TextButton('button 2', 'negative')]
]);

new Keyboard(
    [[ new TextButton('button 1', 'default') ]]
).inline();


/**
 * Скрываемые после испольвания клавиатуры
 */
new Keyboard({ one_time: true }, [
    [new TextButton('button 1', 'default')],
    [new TextButton('button 2', 'primary')]
]);

new Keyboard(
    [[ new TextButton('button 1', 'default') ]]
).oneTime();


/**
 * Клавиатура с полезной нагрузкой на кнопках
 */
new Keyboard([
    [ new TextButton('button 1', 'positive', ['payload_action']) ],
    [ new TextButton('button 2', 'negative', ['payload_action', 'argument']) ],
    [ new TextButton('button 2', 'negative', ['payload_action', ['arg1', 'arg2']]) ]
]);


/**
 * Клавиатура с кастомными типами кнопок
 */
new Keyboard([
    [ new LocationButton() ],
    [
        new VKPayButton('action=transfer-to-group&group_id=1&aid=10')
    ],
    [
        new VKPayButton({ action: 'transfer-to-group',  group_id: 1,  aid: 1 })
    ],
    [
        new LinkButton('Открыть ссылку', 'https://google.com')
    ],
    [
        new VKAppButton('Открыть приложение', { app_id: 1,  owner_id: -1, hash: 'debug' })
    ]
]);

