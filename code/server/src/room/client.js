class Client {
    constructor(id, nickname, color, isHost) {
        this.id = id;
        this.nickname = nickname;
        this.color = color;
        this.isHost = isHost;
    }

    getClientID() {
        return this.id;
    }
}

export { Client }