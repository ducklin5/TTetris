import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import Sketch from 'react-p5'

const GameCanvasComponent = ({ height, width, gameData }) => {
    let size = Math.min(width, height);

    useEffect(() => {
        size = Math.min(width, height);
    }, [width, height])

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(width, height).parent(canvasParentRef)
    }

    const u = (value) => {
        let boardSize = Math.max(gameData.board.height,
            gameData.board.width); 
        return value * (size/boardSize);
    }

    const getPlayerColor = playerId => {
        return gameData.players[playerId].color;
    }

    const draw = p5 => {
        p5.background(10, 10, 10);

        let board = gameData.board;

        for(let y = 0; y < board.height; y++) {
            for(let x = 0; x < board.width; x++) {
                let playerID = board.grid[y][x];
                if (playerID != null) {
                    p5.fill(getPlayerColor(playerID));
                    p5.rect( x * u(1), y * u(1), u(1));
                }
            }
        }

    }

    const windowResized = p5 => {
        p5.resizeCanvas(width, height);
    }

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} />
}

export {
    GameCanvasComponent
}