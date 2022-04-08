import { timeStamp } from "console";
import random from "random-seed";
import { generateRandomPiece } from "./game_piece.js";
import { GameState } from "./game_state.js";
import { Player } from "./player.js";
import { VoteSession } from "./vote_session.js";
class GameSession {
    constructor(clients, settings) {
        this.players = {}; // dictionary of id to player objects
        this.winner = null;
        this.onGameUpdated = () => { };
        this.voteDuration = 15000;
        this.votingPhase = false;
        this.onVotesUpdated = () => { };
        this.speed = settings?.speed || 1;
        this.update_delay = 1200 - 60 * this.speed;
        this.timeLeft = 10 * 60 * 1000;
        this.imposterId = null;
        let seed = settings?.seed ?? Math.random();
        this.rng = random.create(seed);

        let i = 0;
        for (let client of clients) {
            this.players[client.id] = new Player(
                client.id,
                client.nickname,
                client.color,
                5 * i++
            );
            
            // TODO: remove this
            if (client.color == "#ff0001") {
                this.imposterId  = client.id;
            }
        }

        let playerIds = Object.keys(this.players);
        playerIds.sort();
        if (!this.imposterId) {
            let randPlayerIdIndex = this.rng.intBetween(0, playerIds.length-1);
            this.imposterId = playerIds[randPlayerIdIndex];
        }

        this.players[this.imposterId].setImposter();

        const boardWidth = 15 + Math.max(0, playerIds.length - 3) * 5;
        this.gameState = new GameState(25, boardWidth, 10);

        // TODO: maybe put this in run() as well?
        for (let playerId in this.players) {
            let player = this.players[playerId];
            player.currentPiece = generateRandomPiece(this.rng, player.init_ofx);
            player.nextPiece = generateRandomPiece(this.rng, player.init_ofx);
        }
    }

    setOnGameUpdated(cbk) {
        this.onGameUpdated = cbk;
    }

    setOnVotesUpdated(cbk) {
        this.onVotesUpdated = cbk;
    }

    run() {
        if (this.winner) return;
        this.running = true;
        this.updateIntervalId = setInterval(
            () => this._update(),
            this.update_delay
        );
    }

    pause() {
        if (this.running) {
            this.running = false;
            clearInterval(this.updateIntervalId);
        }
    }

    endGame(winner) {
        this.winner = winner;
        this.pause();
        this.onGameUpdated("end");
        console.log("The game has ended. The winner: " + winner);
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
            player.nextPiece = generateRandomPiece(this.rng, player.init_ofx);
            return true;
        }
        return false;
    }

    dropPlayerPiece(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            let winner = this.gameState.dropPiece(player.currentPiece, player.id);
            if (winner) {
                this.endGame(winner);
            }
            this.consumePlayerPiece(playerId);
            return true;
        }
        return false;
    }

    _update() {
        this.timeLeft -= this.update_delay;

        if (this.timeLeft <= 0) {
            this.endGame("imposter");
        } else {
            for (let playerId in this.players) {
                let player = this.players[playerId];
                if (player.isExiled) continue;

                player.currentPiece.ofy += 1;
                let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
                if (collisions.has("bottom") || collisions.has("block")) {
                    this.dropPlayerPiece(playerId);
                }
            }
            this.onGameUpdated("step");
        }
    }

    //FRMARKER: FR20:Send.Inputs.Server
    inputEvent(playerId, event) {
        if (this.winner) return false;
        let player = this.getPlayer(playerId);
        if (!player || player.isExiled) return false;

        let result = this._inputEvent(playerId, event);
        if (result) {
            this.onGameUpdated("input");
        }
        return result;
    }

    //FRMARKER: FR20:Send.Inputs.Server
    _inputEvent(playerId, event) {
        switch (event.name) {
            case "captureVote":
                return this.tryCaptureVote(playerId, event.args?.targetPlayerId);
        }

        if(this.votingPhase) return;

        switch (event) {
            case "left":
                console.log(`moving ${playerId} left`)
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
    }

    //FRMARKER: FR20:Send.Inputs.Server
    tryMovePiece(playerId, x, y) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece.ofx += x;
            player.currentPiece.ofy += y;
            let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
            if (
                collisions.size == 0 ||
                (collisions.size == 1 && collisions.has("top"))
            ) {
                return true;
            }
            player.currentPiece.ofx -= x;
            player.currentPiece.ofy -= y;
        }

        return false;
    }

    //FRMARKER: FR20:Send.Inputs.Server
    tryRotatePiece(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            player.currentPiece.rotation += 1;
            let collisions = this.gameState.checkPieceCollisions(player.currentPiece);
            if (
                collisions.size == 0 ||
                (collisions.size == 1 && collisions.has("top"))
            ) {
                return true;
            }
            player.currentPiece.rotation -= 1;
        }
        return false;
    }

    tryDropPiece(playerId) {
        return this.dropPlayerPiece(playerId);
    }

    // FRMARKER: FR29: Send.VotingState 
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
            return true;
        }
    }

    // FRMARKER: FR36: Send.VoteData
    onVoteSessionDone(results) {
        console.log(results);

        this.eliminatePlayer(results.targetPlayerId);

        this.votingPhase = false;

        this.run();
    }

    // FRMARKER: FR37: Return.VoteData
    eliminatePlayer(playerId) {
        let player = this.getPlayer(playerId);
        if (player) {
            if (player.isImposter) {
                this.endGame("civilians");
                return;
            }
            console.log(`eliminating ${player.nickName}`)
            player.isExiled = true;
        }
    }

    trySabotageDrop(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.drop) {
            for (let targetPlayerId in this.players) {
                this.tryDropPiece(targetPlayerId);
            }
            player.hasSabotage.drop = false;
            return true;
        }
    }

    trySabotageProgress(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.progress) {
            if (this.gameState.rowsCompleted) {
                this.gameState.rowsCompleted -= 1;
            }
            player.hasSabotage.progress = false;
            return true;
        }
    }

    trySabotagePieces(playerId) {
        let player = this.getPlayer(playerId);
        if (player && player.isImposter && player.hasSabotage.pieces) {
            for (let targetPlayerId in this.players) {
                this.consumePlayerPiece(targetPlayerId);
            }
            player.hasSabotage.pieces = false;
            return true;
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

    //FRMARKER: FR20:Send.Inputs.Server
    getGameData() {
        let gameData = {
            players: this.players,
            board: this.gameState,
            winner: this.winner,
            speed: this.speed,
            timeLeft: this.timeLeft
        };

        if (this.winner) {
            gameData["imposterId"] = this.imposterId;
        }

        return gameData;
    }

    // DEBUG: printing game data on the gameboard
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
