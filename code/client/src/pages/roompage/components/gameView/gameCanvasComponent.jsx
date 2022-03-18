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
        console.log(`setup p5 canvas with: ${width}:${height}`)
        return p5.createCanvas(width, height);
    }

    p5.updateWithProps = props => {
        if (props.height != height || props.width != width) {
            height = props.height;
            width = props.width;
            p5.resizeCanvas(width, height);
            vUnits = window.gameData.board.height + 4;
            hUnits = window.gameData.board.width + 2;
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

    const drawGameBoard = () => {

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

    const drawProgressBar = () => {

        let barWidth = hUnits - 2;

        p5.fill("#fff");
        p5.rect(0, 0, u(barWidth), u(1));

        let completionRatio =
            window.gameData.rowsCompleted / window.gameData.requiredRows;
        let completionWidth = barWidth * completionRatio;

        p5.fill("#ff0");
        p5.rect(0, 0, u(completionWidth), u(1));
    }

    const drawPieces = () => {
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

    p5.draw = () => {
        p5.background(10, 10, 10);

        p5.translate(u(1), u(1));
        drawProgressBar();

        p5.translate(0, u(2));
        drawGameBoard();

        drawPieces();
    }

}


const GameCanvasComponent = ({ width, height }) => {

    console.log(`draw GamCanvasComponent with: ${width}:${height}`);

    return <ReactP5Wrapper sketch={sketch} height={height} width={width} />
}

export {
    GameCanvasComponent
}