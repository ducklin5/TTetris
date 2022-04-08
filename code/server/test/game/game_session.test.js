import { GameSession } from 'src/game/game_session';
import { Client } from 'src/room/client';
import { describe, expect, test } from '@jest/globals';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import { stringifyGrid } from "src/game/game_state";
import structuredClone from '@ungap/structured-clone';

expect.extend({ toMatchDiffSnapshot });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

expect.addSnapshotSerializer({
    test: (val) => val.board?.grid,
    print: (_data) => {
        let data = structuredClone(_data);
        let grid = data.board.grid;

        // Deleted unnessecary data for better snapshots
        delete data.board.grid;
        for (let id in data.players) {
            delete data.players[id].currentPiece.matrixCache;
            delete data.players[id].nextPiece.matrixCache;
            delete data.players[id].color;
            let cp = data.players[id].currentPiece;
            data.players[id].currentPiece = JSON.stringify(cp);
            let np = data.players[id].nextPiece;
            data.players[id].nextPiece = JSON.stringify(np);
        }

        let dataStr = JSON.stringify(data, null, 4);
        dataStr += "\n[pretty].board.grid:\n";
        dataStr += stringifyGrid(grid, true);
        return dataStr;
    }
})


let getRelevantData = (gs) => {
    let data = structuredClone(gs.getGameData());
    return data;
}


describe("GameSession", () => {
    let settings, clients;
    let currentData, previousData;
    let expectDataDiff = (gs, diff_name) => {
        previousData = currentData;
        currentData = getRelevantData(gs);
        expect({
            diffA: previousData,
            diffB: currentData,
        }).toMatchSnapshot(diff_name);
    }


    beforeEach(() => {
        clients = [];
        for (let i = 0; i < 5; i++) {
            clients[i] = new Client(i, "client" + i, `#ff` + i);
        }

        settings = { speed: 50, seed: 1 };
        currentData = null;
        previousData = null;
    });

    test("should randomly assign an imposter", () => {
        for (let seed = 0; seed < 5; seed++) {
            settings.seed = seed;
            let gs = new GameSession(clients, settings);
            let gs2 = new GameSession(clients, settings);
            expect(gs.imposterId).toEqual(gs2.imposterId);

            // this will only fail if the rng method is changed 
            expect(gs.imposterId).toMatchSnapshot();
        }
    });

    test("should update the game state correctly on each step", (done) => {
        let gs = new GameSession(clients, settings);
        let stepsCompleted = 0;
        let stepsToWait = 26;
        let pieceLastY = -Infinity;

        gs.setOnGameUpdated((type) => {
            if (type !== "step") return;

            let currentPiece = gs.players[0].currentPiece;
            stepsCompleted++;
            let pieceCurrentY = currentPiece.ofy;

            if (stepsCompleted < stepsToWait) {
                // The piece should fall for the first 25 updates
                expect(pieceCurrentY).toBeGreaterThan(pieceLastY);
                pieceLastY = pieceCurrentY;
            } else {
                // A new piece should be created at the top on the 26th update
                expect(pieceCurrentY).toBeLessThan(pieceLastY);
                gs.pause()
                done()
            }
        });
        gs.run();
    }, 3000);

    test("should handle all player actions", (done) => {
        let gs = new GameSession(clients, settings);
        gs.voteDuration = 50;
        gs.gameState.rowsCompleted = 2

        // Snapshot the initial game data
        currentData = getRelevantData(gs);
        expect(currentData).toMatchSnapshot("Initial");
        // check that the data has changed approriately since the last snapshot
        let stepsCompleted = 0;
        let stepsToWait = 26;
        gs.setOnGameUpdated((type) => {
            if (type !== "step") return;
            stepsCompleted++;
            switch (stepsCompleted) {
                case 1: {
                    for (let i = 0; i < 10; i++) gs.inputEvent(0, "left");
                    expectDataDiff(gs, "p0 left x10");
                } break;
                case 2: {
                    gs.inputEvent(1, "right");
                    gs.inputEvent(1, "right");
                    gs.inputEvent(1, "left");
                    gs.inputEvent(2, "rotate");
                    expectDataDiff(gs, "p1 right x2 left; p2 rotate");
                } break;
                case 3: {
                    gs.inputEvent(2, "drop");
                    gs.inputEvent(3, "down");
                    expectDataDiff(gs, "p2 drop; p3 down");
                } break;
                case 4: {
                    for (let i = 0; i < 10; i++) gs.inputEvent(4, "right");
                    expectDataDiff(gs, "p4 right x10");
                } break;
                case stepsToWait: {
                    gs.inputEvent(1, "sabotage:Drop")
                    expectDataDiff(gs, "p1 sabotage:Drop");
                } break;
                case stepsToWait + 1: {
                    gs.inputEvent(1, "sabotage:Progress")
                    expectDataDiff(gs, "p1 sabotage:Progress");
                } break;
                case stepsToWait + 2: {
                    gs.inputEvent(1, "sabotage:Pieces")
                    expectDataDiff(gs, "p1 sabotage:Pieces");
                } break;

                case stepsToWait + 3: {
                    expectDataDiff(gs, "Final");
                    done()
                } break;
            }
        });

        gs.run();
    }, 5000);


    test("should end correctly", (done) => {
        let gs = new GameSession(clients, settings);
        gs.voteDuration = 50;

        // Snapshot the initial game data
        currentData = getRelevantData(gs);
        expect(currentData).toMatchSnapshot("Initial");

        let stepsCompleted = 0;
        gs.setOnGameUpdated((type) => {
            switch (type) {
                case "step": {
                    if (!stepsCompleted) {
                        gs.inputEvent(2, "emergency");
                        expectDataDiff(gs, "p2 emergency");
                        gs.inputEvent(2, {
                            name: "captureVote",
                            args: {
                                targetPlayerId: 1
                            }
                        });
                    }
                    stepsCompleted++;
                } break;
                case "end": {
                    expectDataDiff(gs, "Game ended");
                    done()
                } break;
            }
        });

        gs.run();

    }, 5000)

});