class VkBotSdkApi {
    /**
     * Создает экземпляр
     *
     * @param {VkBotSdkClient} client
     */
    constructor(client) {
        this.client = client;
    }

    request(method, params) {
        return this.client.request(method, params);
    }

    uploadFile(url, file, key, filename) {
        return this.client.uploadFile(url, file, key, filename);
    }
}

module.exports = VkBotSdkApi;