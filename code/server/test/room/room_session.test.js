import { GameSession, RoomSession } from 'src/room/room_session';
import MockedSocket from 'socket.io-mock';
import {describe, expect, test} from '@jest/globals';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("RoomSession", () => {
    let roomSession;
    let socket;

    beforeEach(() => {
        socket = new MockedSocket();
        socket.join("abcd");
        roomSession = new RoomSession("abcd", socket);
    });

    test("should add a client", async () => {
       roomSession.addClient("abcd", true);

       let client = roomSession.getClientByID("abcd");
       expect(client.nickname).toBe("Player1");
       expect(client.isHost).toBe(true);
       expect(client.id).toBe("abcd"); 
    });

    test("should start the game", async () => {
        socket.socketClient.on("gameDataUpdated", (gameData) => {
            expect(gameData).toBeDefined();
            expect(gameData.players["abcd"]).toBeDefined();
        })
        socket.socketClient.on("votesUpdated", (votes) => {
            expect(votes).toBeDefined();
        })
        socket.socketClient.on("gameStarted", (gameData) => {
            expect(gameData.players["abcd"]).toBeDefined();
        })

        let settings = {speed: 3};
        roomSession.addClient("abcd", true);
        roomSession.startGame(settings);

        await sleep(8000);
        
        let gameSession = roomSession.gameSession;
        expect(gameSession).toBeDefined();
        expect(gameSession.players["abcd"]).toBeDefined();
        expect(gameSession.winner).toBeNull();
        expect(gameSession.speed).toBe(3);
        expect(gameSession.running).toBe(true);
    }, 10000);

    test("should get list of connected clients", async () => {
        roomSession.addClient("bin", true);
        roomSession.addClient("azeez", false);
        roomSession.addClient("gina", false);

        roomSession.disconnectClient("azeez");

        let connectedClients = roomSession.getConnectedClients();

        expect(connectedClients.length).toBe(2);
        expect(connectedClients[0].id).toBe("bin");
        expect(connectedClients[1].id).toBe("gina");
    })

});