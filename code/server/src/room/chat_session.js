class ChatSession {
    constructor() {
        this.chatHistory = [];
    }

    addChat(message, nickname, time) {
        const chat = new Chat(message, nickname, time);
        this.chatHistory.push(chat);
    }
}

class Chat {
    constructor(message, nickname, time) {
        this.message = message;
        this.nickname = nickname;
        this.time = time;
    }
}

export default ChatSession;