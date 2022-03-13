import { generateRandomPiece } from "./game_piece.js";
import { GameState } from "./game_state.js";
import { Player } from "./player.js";

class MockClient {
    constructor(nickName, color) {
        this.nickName = nickName;
        this.color = color;
    }
}

class GameSession {
    constructor(clients, settings) {
        this.players = [];
        
        let i = 0;
        for (let client of clients) {
            this.players.push(new Player(i++, client.nickName, client.color));
        }
        
        let imposterIndex = Math.floor(Math.random() * this.players.length);
        this.players[imposterIndex].setImposter();
        
        const boardWidth = 15 + Math.max(0, this.players.length - 3) * 5;
        this.gameState = new GameState(20, boardWidth);
    }

    run() {
        for (let player of this.players) {
            player.currentPiece = generateRandomPiece(player.id * 5);
            player.nextPiece = generateRandomPiece(player.id * 5);
        }
        let self = this;
        this.updateIntervalId = setInterval(() => self._update(), 1000);
    }

    _update() {
        console.log("update");
        for (let player of this.players) {
            player.currentPiece.ofy += 1;
            if (this.gameState.isPieceColliding(player.currentPiece)) {
                this.gameState.playPiece(player.currentPiece, player.id);
                player.currentPiece = player.nextPiece;
                player.nextPiece = generateRandomPiece(player.id * 5);
            }
        }
        this.printGameData();
    }

    getGameData() {
        let gameData = {
            players: this.players,
            board: this.gameState.grid,
        };
        return gameData;
    }

    printGameData() {
        let gameData = this.getGameData();

        for (let j = 0; j < gameData.board.length; j++) {
            let row = "";
            for (let i = 0; i < gameData.board[j].length; i++) {
                row += gameData.board[j][i] + " "
            }
            console.log(row);
        }
    }
}

export {
    GameSession,
    MockClient
}