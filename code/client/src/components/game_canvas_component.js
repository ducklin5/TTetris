import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import Sketch from 'react-p5'

const GameCanvasComponent = ({ height, width, gameData }) => {
    let [GCCp5, setGCCp5] = useState();
    let size = Math.min(width, height);

    const setup = (p5, canvasParentRef) => {
        setGCCp5(p5);
        p5.createCanvas(width, height).parent(canvasParentRef)
    }

    useEffect(() => {
        console.log(`GCC: change size. GCCp5 = ${GCCp5}`);
        if (GCCp5) {
            GCCp5.resizeCanvas(width, height);
            console.log("canvas resized");
        }
        size = Math.min(width, height);
    }, [width, height])

    const u = (value) => {
        return value * size/100.0;
    }

    const draw = p5 => {
        p5.background(255, 130, 20);
        p5.ellipse(u(10), u(10), u(10));
        p5.ellipse(u(20), u(20), u(10));
    }

    return <Sketch setup={setup} draw={draw} />
}

export {
    GameCanvasComponent
}