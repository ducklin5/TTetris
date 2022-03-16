import { GameSession, MockClient } from 'src/game/game_session';
import MockedSocket from 'socket.io-mock';
import {describe, expect, test} from '@jest/globals';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("GameSession", () => {
    let c1;
    let socket;

    beforeEach(() => {
        c1 = new MockClient(7, "test", "#ff0");
        socket = new MockedSocket();
    });

    test("should send game updates to the socket", async () => {
        let gameUpdatesRecieved = 0;
        socket.socketClient.on("gameDataUpdate", (gameData) => {
            if (gameData) {
                gameUpdatesRecieved++
            }
        })
        
        let gs = new GameSession([c1],socket);
        gs.run();
        await sleep(3000);
        expect(gameUpdatesRecieved).toBeGreaterThan(0);
    });

});