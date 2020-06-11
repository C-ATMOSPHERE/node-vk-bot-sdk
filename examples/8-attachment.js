const { Attachment } = require('../index');

/**
 * Обычная инициализация
 */
new Attachment('wall', -29060604, 448799, 'hash');

/**
 * Инициализация из строки
 */
new Attachment('wall-29060604_448799');

/**
 * Инициализация из объекта API, полученного в событии / запросе
 */
new Attachment({
    type: 'photo',
    photo: {
        id: 1,
        album_id: 4,
        owner_id: -1,
        user_id: 100,
        text: '',
        date: 1577826000,
        sizes: []
    }
});