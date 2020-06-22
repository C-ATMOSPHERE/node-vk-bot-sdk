const { Attachment } = require('../index');

describe('Attachment', () => {
    it('should create attachment from params', () => {
        const { attachment } = new Attachment('wall', -1, 1);

        expect(attachment).toBe('wall-1_1');
    });

    it('should create attachment from params with hash', () => {
        const { attachment } = new Attachment('wall', -10, 100, 'hash');

        expect(attachment).toBe('wall-10_100_hash');
    });

    it('should create attachment from string', () => {
        const { attachment } = new Attachment('wall-29060604_448799_hash');

        expect(attachment).toBe('wall-29060604_448799_hash');
    });

    it('should create attachment from API object', () => {
        const { attachment } = new Attachment({
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

        expect(attachment).toBe('photo-1_1');
    });
});
