import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import Sketch from 'react-p5';
import { getPieceMatrix } from 'util/game_util';

let vUnits = 1;
let hUnits = 1;
let pxPerUnit = 1;

const GameCanvasComponent = ({ width, height }) => {
    const updatePxPerUnit = () => {
        console.log("updating px resolution");
        vUnits = window.gameData.board.height + 4;
        hUnits = window.gameData.board.width + 2;
        pxPerUnit = width < height ? width / hUnits : height / vUnits;
    };

    useEffect(updatePxPerUnit, [width, height])


    const setup = (p5, canvasParentRef) => {
        console.log("setup");
        p5.createCanvas(500, 500).parent(canvasParentRef);
        // updatePxPerUnit();
    }

    const u = (value) => {
        return value * pxPerUnit;
    }

    const getPlayerColor = playerId => {
        return window.gameData.players[playerId].color;
    }

    const drawGameBoard = p5 => {

        let board = window.gameData.board;

        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                let playerID = board.grid[y][x];
                if (playerID != null) {
                    p5.fill(getPlayerColor(playerID));
                } else {
                    p5.fill("#777")
                }
                p5.rect(x * u(1), y * u(1), u(1));
            }
        }
    }

    const drawProgressBar = p5 => {

        let barWidth = hUnits - 2;

        p5.fill("#fff");
        p5.rect(0, 0, u(barWidth), u(1));

        let completionRatio =
            window.gameData.rowsCompleted / window.gameData.requiredRows;
        let completionWidth = barWidth * completionRatio;

        p5.fill("#ff0");
        p5.rect(0, 0, u(completionWidth), u(1));
    }

    const drawPieces = p5 => {
        let players = window.gameData.players;

        for (let playerId in players) {

            let player = players[playerId];
            let piece = player.currentPiece;
            let pieceMatrix = getPieceMatrix(piece);
            let size = pieceMatrix.length;
            

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

    const draw = p5 => {
        p5.background(10, 10, 10);

        p5.translate(u(1), u(1));
        drawProgressBar(p5);

        p5.translate(0, u(2));
        drawGameBoard(p5);

        drawPieces(p5);
    }

    const windowResized = p5 => {
        p5.resizeCanvas(width, height);
    }

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} />
}

export {
    GameCanvasComponent
}