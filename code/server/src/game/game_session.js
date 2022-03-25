import { eqSet } from "src/util.js";
import { generateRandomPiece } from "./game_piece.js";
import { GameState } from "./game_state.js";
import { Player } from "./player.js";
import { VoteSession } from "./vote_session.js";


class GameSession {
    constructor(clients, settings) {
        this.players = {}; // dictionary of id to player objects
        this.running = false;
        this.done = false;
        this.onGameUpdated = () => { }; 
        this.voteDuration = 15000;
        this.votingPhase = false;
        this.onVotesUpdated = () => { };
        let speed = settings?.speed || 1
        this.update_delay = 1200 - 60 * speed;

        let i = 0;
        for (let client of clients) {
            this.players[client.id] = new Player(
                client.id,
                client.nickname,
                client.color,
                5 * i++
            );
        }

        let playerIds = Object.keys(this.players);
        let randPlayerIdIndex = Math.floor(Math.random() * playerIds.length);
        let randPlayerId = playerIds[randPlayerIdIndex];
        this.players[randPlayerId].setImposter();

        const boardWidth = 15 + Math.max(0, playerIds.length - 3) * 5;
        this.gameState = new GameState(20, boardWidth, 5);

        // TODO: maybe put this in run() as well?
        for (let playerId in this.players) {
            let player = this.players[playerId];
            player.currentPiece = generateRandomPiece(player.init_ofx);
            player.nextPiece = generateRandomPiece(player.init_ofx);
        }
    }

    setOnGameUpdated(cbk) {
        this.onGameUpdated = cbk
    }
    
    setOnVotesUpdated(cbk) {
        this.onVotesUpdated = cbk;
    }

    run() {
        this.running = true;
        this.updateIntervalId = setInterval(
            () => this._update(),
            this.update_delay
        );
    }

    pause() {
        this.running = false;
        clearInterval(this.updateIntervalId);
    }

    _update() {
        //let playerIds = this.players
        for (let playerId in this.players) {
            let player = this.players[playerId];
            player.currentPiece.ofy += 1;
            let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
            if (collisions.has("bottom") || collisions.has("block")) {
                let success = this.gameState.dropPiece(player.currentPiece, player.id);

                if (!success) {
                    this.endGame();
                    return;
                }
                this.consumePlayerPiece(playerId);
            }
        }
        this.onGameUpdated();
    }

    endGame() {
        this.running = false;
        this.done = true;
        this.pause();
        console.log("The game has ended");
    }

    getPlayer(playerId) {
        if (playerId in this.players) {
            return this.players[playerId];
        }
        return null;
    }

    consumePlayerPiece(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece = player.nextPiece;
            player.nextPiece = generateRandomPiece(player.init_ofx);
            return true;
        }
        return false;
    }

    inputEvent(playerId, event) {
        if (this.done || !this.running) return false;
        let result = this._inputEvent(playerId, event);
        if (result) {
            this.onGameUpdated();
        }
        return result
    }

    _inputEvent(playerId, event) {
        switch (event) {
            case "left":
                return this.tryMovePiece(playerId, -1, 0);
            case "right":
                return this.tryMovePiece(playerId, 1, 0);
            case "down":
                return this.tryMovePiece(playerId, 0, 1);
            case "drop":
                return this.tryDropPiece(playerId);
            case "rotate":
                return this.tryRotatePiece(playerId);
            case "emergency":
                return this.tryStartVoting(playerId);
            case "sabotage:Drop":
                return this.trySabotageDrop(playerId);
            case "sabotage:Progress":
                return this.trySabotageProgress(playerId);
            case "sabotage:Pieces":
                return this.trySabotagePieces(playerId);
        }

        switch (event.name) {
            case "captureVote":
                return this.tryCaptureVote(playerId, event.args?.targetPlayerId);
        }
    }

    tryMovePiece(playerId, x, y) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece.ofx += x;
            player.currentPiece.ofy += y;
            let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
            if (collisions.size == 0 || eqSet(collisions, new Set("top"))) {
                return true;
            }
            player.currentPiece.ofx -= x;
            player.currentPiece.ofy -= y;
        }

        return false;
    }

    tryRotatePiece(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece.rotation += 1;
            let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
            if (collisions.size == 0 || eqSet(collisions, new Set("top"))) {
                return true;
            }
            player.currentPiece.rotation -= 1;
        }
        return false;
    }

    tryDropPiece(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            this.gameState.dropPiece(player.currentPiece, playerId);
            this.consumePlayerPiece(playerId);
            return true;
        }
        return false;
    }

    tryStartVoting(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.hasEmergency && !this.votingPhase) {
            player.hasEmergency = false;
            this.votingPhase = true;
            this.pause();
            // create a voting session
            this.voteSession = new VoteSession(
                Object.keys(this.players),
                this.voteDuration,
                this.onVotesUpdated,
                (results) => this.onVoteSessionDone(results)
            );
            this.voteSession.start();
        }
    }

    onVoteSessionDone(results) {
        this.votingPhase = false;
        this.run();
    }

    trySabotageDrop(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.drop) {
            for (let targetPlayerId in this.players) {
                this.tryDropPiece(targetPlayerId);
            }
            player.hasSabotage.drop = false;
        }
    }

    trySabotageProgress(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.progress) {
            if (this.gameState.rowsCompleted) {
                this.gameState.rowsCompleted -= 1;
            }
            player.hasSabotage.progress = false;
        }
    }

    trySabotagePieces(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.pieces) {
            for (let targetPlayerId in this.players) {
                this.consumePlayerPiece(targetPlayerId);
            }
            player.hasSabotage.pieces = false;
        }
    }

    tryCaptureVote(playerId, targetPlayerId) {
        if (this.votingPhase && this.voteSession) {
            this.voteSession.captureVote(playerId, targetPlayerId);
        } else {
            console.log(
                "Gamesession is not in votingPhase or it has no voting session."
            );
        }
    }

    getGameData() {
        let gameData = {
            players: this.players,
            board: this.gameState,
        };
        return gameData;
    }

    //TODO: remove this debugging function
    printGameData() {
        let gameData = this.getGameData();
        let grid = JSON.parse(JSON.stringify(gameData.board.grid));

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
                let cell = grid[j][i] == null ? " " : 1;
                gridStr += cell + " ";
            }
            gridStr += "\n";
        }
        console.log(gridStr);
    }
}

export { GameSession };
