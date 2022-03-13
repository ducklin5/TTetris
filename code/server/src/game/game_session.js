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
        
        for (let player of this.players) {
            player.currentPiece = generateRandomPiece(player.id * 5);
            player.nextPiece = generateRandomPiece(player.id * 5);
        }
    }

    run() {
        let self = this;
        this.updateIntervalId = setInterval(() => self._update(), 750);
    }

    pause() {
        clearInterval(this.updateIntervalId);
    }

    _update() {
        for (let player of this.players) {
            player.currentPiece.ofy += 1;
            if (this.gameState.isPieceColliding(player.currentPiece)) {
                this.gameState.playPiece(player.currentPiece, player.id);
                player.currentPiece = player.nextPiece;
                player.nextPiece = generateRandomPiece(player.id * 5);
            }
        }
    }

    getPlayer(playerId) {
        if (playerId >= 0 && playerId < this.players.length) {
            return this.players[playerId];
        }
        return null;
    }

    inputEvent(playerId, event) {
        switch (event) {
            case "left":
                this.tryMovePiece(playerId, -1, 0);
                break;
            case "right":
                this.tryMovePiece(playerId, 1, 0);
                break;
            case "down":
                this.tryMovePiece(playerId, 0, 1);
                break;
            case "drop":
                let player = this.getPlayer(playerId);
                if(player) this.gameState.playPiece(player.currentPiece);
                break;
            case "emergency":
                this.tryStartVoting(playerId);
        }
    }

    tryMovePiece(playerId, x, y) {
        let player = this.getPlayer(playerId);
        if(player) {
            player.currentPiece.ofx += x;
            player.currentPiece.ofy += y;
            if(this.gameState.isPieceColliding(player.currentPiece)) {
                player.currentPiece.ofx -= x;
                player.currentPiece.ofy -= y;
            }
            return true;
        }

        return false;
    }

    tryStartVoting(playerId) {
        let player = this.getPlayer(playerId);
        if(player && player.hasEmergency) {
            player.hasEmergency = false;
            this.pause();
            // create a voting session
        }
    }

    getGameData() {
        let gameData = {
            players: this.players,
            board: this.gameState.grid,
        };
        return gameData;
    }

    //TODO: remove this debugging function
    printGameData() {
        let gameData = this.getGameData();
        let grid = JSON.parse(JSON.stringify(gameData.board))
        
        for(let player of this.players) {
            let piece = player.currentPiece;
            let pieceMatrix = piece.getMatrix();
            let size = pieceMatrix.length;
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let gridY = piece.ofy + y;
                    let gridX = piece.ofx + x;
                    if (pieceMatrix[y][x] && gridY>0 && gridY >0) {
                        grid[gridY][gridX] = player.id;
                    }
                }
            }
        }

        for (let j = 0; j < grid.length; j++) {
            let row = "";
            for (let i = 0; i < grid[j].length; i++) {
                let cell = grid[j][i] == null ? " " : grid[j][i];
                row += cell + " "
            }
            console.log(row);
        }
    }
}

export {
    GameSession,
    MockClient
}