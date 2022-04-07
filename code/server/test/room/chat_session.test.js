import {describe, expect, test} from '@jest/globals';
import ChatSession from 'src/room/chat_session';

describe("ChatSession", () => {
    let chatSession;

    beforeEach(() => {
        chatSession = new ChatSession();
    })

    test("Should add chat to chat history", () => {
        chatSession.addChat("hello", "wonbin", "12:34");
        chatSession.addChat("hi", "azeez", "12:35");
        chatSession.addChat("how are you", "gina", "12:36");

        expect(chatSession.chatHistory.length).toBe(3);
    })
})