class Client {
    constructor(id, nickname, color, isHost) {
        this.id = id;
        this.nickname = nickname;
        this.color = color;
        this.isHost = isHost;
        this.connected = true;
    }

    getClientID() {
        return this.id;
    }
}

export { Client }