import { Socket } from "socket.io";
import { generateRandomPiece } from "./game_piece.js";
import { GameState } from "./game_state.js";
import { Player } from "./player.js";

const UPDATE_DELAY = 300;

class GameSession {
    constructor(clients, channel, settings) {
        this.players = {}; // dictionary of id to player objects
        this.onGameUpdated = () => {};
        this.channel = channel;

        let i = 0;
        for (let client of clients) {
            this.players[client.id] =
                new Player(client.id, client.nickName, client.color, 5 * i++);
        }

        let playerIds = Object.keys(this.players);
        let randPlayerIdIndex = Math.floor(Math.random() * playerIds.length);
        let randPlayerId = playerIds[randPlayerIdIndex]
        this.players[randPlayerId].setImposter();

        const boardWidth = 15 + Math.max(0, playerIds.length - 3) * 5;
        this.gameState = new GameState(20, boardWidth);

        // TODO: maybe put this in run() as well?
        for (let playerId in this.players) {
            let player = this.players[playerId];
            player.currentPiece = generateRandomPiece(player.init_ofx);
            player.nextPiece = generateRandomPiece(player.init_ofx);
        }
    }

    run() {
        let self = this;
        this.updateIntervalId = setInterval(() => self._update(), UPDATE_DELAY);
    }

    pause() {
        clearInterval(this.updateIntervalId);
    }

    _update() {
        //let playerIds = this.players
        for (let playerId in this.players) {
            let player = this.players[playerId];
            player.currentPiece.ofy += 1;
            let collision = this.gameState.checkPieceCollision(player.currentPiece);
            if (collision == "bottom" || collision == "block") {
                let success = this.gameState.dropPiece(player.currentPiece, player.id);
                
                if(!success) {
                    this.endGame();
                    return;
                }
                player.currentPiece = player.nextPiece;
                player.nextPiece = generateRandomPiece(player.init_ofx);
            }
        }
        console.log("game update is sending gameData");
        this.sendGameData();
    }

    endGame() {
        this.pause();
        console.log("The game has ended");
    }

    getPlayer(playerId) {
        if (playerId in this.players) {
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
                if (player) this.gameState.dropPiece(player.currentPiece);
                break;
            case "emergency":
                this.tryStartVoting(playerId);
        }
    }

    tryMovePiece(playerId, x, y) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece.ofx += x;
            player.currentPiece.ofy += y;
            if (this.gameState.checkPieceCollision(player.currentPiece)) {
                player.currentPiece.ofx -= x;
                player.currentPiece.ofy -= y;
            }
            return true;
        }

        return false;
    }

    tryStartVoting(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.hasEmergency) {
            player.hasEmergency = false;
            this.pause();
            // create a voting session
        }
    }

    getGameData() {
        let gameData = {
            players: this.players,
            board: this.gameState,
        };
        return gameData;
    }

    sendGameData() {
        this.channel.emit("gameDataUpdated", this.getGameData());
    }

    //TODO: remove this debugging function
    printGameData() {
        let gameData = this.getGameData();
        let grid = JSON.parse(JSON.stringify(gameData.board.grid))

        for (let playerId in this.players) {
            let player = this.players[playerId];
            let piece = player.currentPiece;
            let pieceMatrix = piece.getMatrix();
            let size = pieceMatrix.length;
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let gridY = piece.ofy + y;
                    let gridX = piece.ofx + x;
                    if (pieceMatrix[y][x] && gridY >= 0 && gridX >= 0) {
                        grid[gridY][gridX] = player.id;
                    }
                }
            }
        }

        let gridStr = "";
        for (let j = 0; j < grid.length; j++) {
            for (let i = 0; i < grid[j].length; i++) {
                let cell = grid[j][i] == null ? " " : grid[j][i];
                gridStr += cell + " "
            }
            gridStr += "\n";
        }
        console.log(gridStr);
    }
}

export {
    GameSession,
}