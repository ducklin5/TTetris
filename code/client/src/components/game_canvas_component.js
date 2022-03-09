import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import Sketch from 'react-p5'

// FIXME: the progress bar currently assumes 20 rows must be completed

const GameCanvasComponent = ({ width, height, gameData }) => {
    let vUnits, hUnits, pxPerUnit;

    const updatePxPerUnit = () => {
        vUnits = gameData.board.height + 4;
        hUnits = gameData.board.width + 2;
        pxPerUnit = width < height? width/hUnits : height/vUnits; 
    };

    useEffect(updatePxPerUnit, [width, height, gameData]);

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(width, height).parent(canvasParentRef);
    }

    const u = (value) => {
        return value * pxPerUnit;
    }

    const getPlayerColor = playerId => {
        return gameData.players[playerId].color;
    }

    const drawGameBoard = p5 => {

        let board = gameData.board;

        for(let y = 0; y < board.height; y++) {
            for(let x = 0; x < board.width; x++) {
                let playerID = board.grid[y][x];
                if (playerID != null) {
                    p5.fill(getPlayerColor(playerID));
                } else {
                    p5.fill("#777")
                }
                p5.rect( x * u(1), y * u(1), u(1));
            }
        }
    }

    const drawProgressBar = p5 => {

        let barWidth = hUnits-2;
        
        p5.fill("#fff");
        p5.rect( 0, 0, u(barWidth), u(1) );

        let completionRatio = gameData.rowsCompleted/gameData.completionGoal;
        let completionWidth = barWidth * completionRatio;
 
        p5.fill("#ff0");
        p5.rect( 0, 0, u(completionWidth), u(1) );
    }

    const draw = p5 => {
        p5.background(10, 10, 10);
        
        p5.translate(u(1), u(1));
        drawProgressBar(p5);
        
        p5.translate(0, u(2));
        drawGameBoard(p5);
    }

    const windowResized = p5 => {
        p5.resizeCanvas(width, height);
    }

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} />
}

export {
    GameCanvasComponent
}