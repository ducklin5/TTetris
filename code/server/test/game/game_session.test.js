import { GameSession } from 'src/game/game_session';
import { Client } from 'src/room/client';
import MockedSocket from 'socket.io-mock';
import {describe, expect, test} from '@jest/globals';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("GameSession", () => {
    let c1;
    let socket;

    beforeEach(() => {
        c1 = new Client(7, "test", "#ff0");
        socket = new MockedSocket();
    });

    test("should run updates", async () => {
        let updatesCompleted = 0;
        
        let gs = new GameSession([c1],socket);
        gs.run(() => {updatesCompleted++});
        await sleep(3000);
        gs.pause();
        expect(updatesCompleted).toBeGreaterThan(0);
    });

    test("should not drop pieces to quickly", async () => {
        
        let gs = new GameSession([c1],socket);
        gs.run(() => {});
        await sleep(2000);
        gs.pause();


        for (let y=0; y < gs.gameState.height; y++) {
            for (let x=0; x<gs.gameState.width; x++) {
                expect(gs.gameState.grid[y][x]).toBeNull();
            }
        }
    }, 60000);

});