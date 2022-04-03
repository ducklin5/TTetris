import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { getPieceMatrix } from 'util/game_util';

function sketch(p5) {
    let width = 0;
    let height = 0;
    let pxPerUnit = 0;
    let vUnits = 0;
    let hUnits = 0;

    p5.setup = () => {
        return p5.createCanvas(width, height);
    }

    p5.updateWithProps = props => {
        if (props.height != height || props.width != width) {
            height = props.height;
            width = props.width;
            p5.resizeCanvas(width, height);
            vUnits = window.gameData.board.height + 4;
            hUnits = window.gameData.board.width + 7;
            pxPerUnit = height/width > vUnits/hUnits ? width / hUnits : height / vUnits;
        }
    };
    
    p5.windowResized = () => {
        p5.resizeCanvas(width, height);
    }

    const u = (value) => {
        return value * pxPerUnit;
    }

    const getPlayerColor = playerId => {
        return window.gameData.players[playerId].color;
    }

    // FRMARKER: FR24:Display.GameBoard
    const drawGameBoard = (board) => {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                let playerID = board.grid[y][x];
                if (playerID != null) {
                    let playerColor = getPlayerColor(playerID);
                    p5.stroke(playerColor);
                    p5.fill(playerColor);
                } else {
                    p5.stroke("#333");
                    p5.fill("#000")
                }
                p5.strokeWeight(0.1*y*y/board.height);
                p5.rect(x * u(1), y * u(1), u(1));
            }
        }
    }

    // FRMARKER: FR23:Display.ProgressBar
    const drawProgressBar = (board) => {

        let barWidth = board.width;

        p5.fill("#fff");
        p5.rect(0, 0, u(barWidth), u(1));

        let completionRatio =
            window.gameData.board.rowsCompleted / window.gameData.board.requiredRows;
        completionRatio = Math.min(completionRatio, 1.0);
        let completionWidth = barWidth * completionRatio;

        p5.fill("#ff0");
        p5.rect(0, 0, u(completionWidth), u(1));
    }

    // FRMARKER: FR22:Display.Canvas
    const drawPieces = () => {
        let players = window.gameData.players;

        for (let playerId in players) {
            let player = players[playerId];
            if (player.isExiled) continue;

            let piece = player.currentPiece;
            let pieceMatrix = getPieceMatrix(piece);
            let size = pieceMatrix.length;


            p5.strokeWeight(1);
            p5.fill(getPlayerColor(playerId));

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    let gridY = y + piece.ofy;
                    let gridX = x + piece.ofx;

                    if (gridY >= 0 && pieceMatrix[y][x]) {
                        p5.rect(gridX * u(1), gridY * u(1), u(1));
                    }
                }
            }
        }
    }

    // FRMARKER: FR22:Display.Canvas
    const drawPlayerNextPiece = (board) => {
        let players = window.gameData.players;
        let player = players[window.clientID];
        let piece = player.nextPiece;
        let pieceMatrix = getPieceMatrix(piece);
        let size = pieceMatrix.length;
        
        p5.fill(getPlayerColor(window.clientID));

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x]) {
                    p5.rect(u(x), u(y), u(1));
                }
            }
        } 

    }

    // FRMARKER: FR22:Display.Canvas
    const drawPlayingPhase = () => {
        let board = window.gameData.board;
        p5.push();
        p5.translate(u(1), u(1));
        drawProgressBar(board);

        p5.translate(0, u(2));
        drawGameBoard(board);
        drawPieces();
        
        p5.translate(u(board.width+1), 0);
        p5.textSize(u(0.5));
        p5.fill(getPlayerColor(window.clientID));
        p5.text('Next piece:', 0, 0, u(5), u(1));

        p5.translate(0, u(1));
        drawPlayerNextPiece();
        p5.pop();
    }

    // FRMARKER: FR32: Send.Result
    const drawEndPhase = () => {
        let board = window.gameData.board;

        p5.fill("#0009");
        p5.rect(0, 0, p5.displayWidth, p5.displayHeight);


        p5.fill("#fff");

        p5.translate(u(1), u(5));
        
        p5.textSize(u(1));
        p5.textAlign(p5.CENTER);

        p5.text("Game Over!", 0, 0, u(board.width));

        let winner = window.gameData.winner;
        let winner_text = "The civilians won!";
        if (winner == "imposter") {
            winner_text = "The imposter won!";
        }
        p5.text(winner_text, 0, u(4), u(board.width));
        
        let imposterId = window.gameData.imposterId;
        let imposterPlayer = window.gameData.players[imposterId];
        let imposterName = imposterPlayer.nickName;


        p5.text( imposterName + " was the imposter", 0, u(8), u(board.width));
    }

    // FRMARKER: FR27:Update.Frame
    p5.draw = () => {
        p5.background(10, 10, 10);
        
        drawPlayingPhase()
        if (window.gameData.winner) {
            drawEndPhase()
        }
    }

}

// FRMARKER: FR22:Display.Canvas
const GameCanvasComponent = ({ width, height }) => {
    return <ReactP5Wrapper sketch={sketch} height={height} width={width} />
}

export {
    GameCanvasComponent
}