import { GameSession, MockClient } from 'src/game/game_session';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Start a GameSession", () => {
    let c1;

    beforeEach(() => {
        c1 = new MockClient(7, "test", "#ff0");
    });

    test("should print game state after 3s", async () => {
        let gs = new GameSession([c1]);
        gs.run();
        await sleep(4000);
        gs.pause();
        gs.printGameData();
    });

});