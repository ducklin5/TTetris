import { useRef, useEffect, useState } from "react";
import GameButtonsComponent from "./gameButtonsComponent";
import GameInfoComponent from "./gameInfoComponent";
import GameVotingComponent from "./gameVotingComponent";
import { ResponsiveGameCanvasComponent } from "./responsiveGameCanvasComponent";
import "./gameview.css";


const GameViewComponent = ({socket}) => {
    const gameDivRef = useRef(null);
    const [votes, setVotes] = useState(null);


    useEffect(() => {
        const gameDiv = gameDivRef.current;
        window.addEventListener("keydown", handleKeyDown, false);
        return () => {
            window.removeEventListener("keydown", handleKeyDown, false);
        };
    }, []);

    socket.on("votesUpdated", (_votes) => {
        setVotes(_votes);
    });

    const handleKeyDown = (e) => {
        switch(e.key) {
            case "ArrowRight":
                socket.emit("game_input", "right");
                break;
            case "ArrowLeft":
                socket.emit("game_input", "left");
                break;
            case "ArrowUp":
                socket.emit("game_input", "rotate");
                break;
            case "ArrowDown":
                socket.emit("game_input", "down");
                break;
            case " ":
                socket.emit("game_input", "drop");
                e.preventDefault();
                break
        }
    };
    

    return (
        <div className="GameViewComponent">
            <div className="GameViewCol1">
                    <GameButtonsComponent socket={socket} />
                    {
                        (!!votes) ? <GameVotingComponent votes={votes} /> : null
                    }
                    <div className="game-level">Level 1</div>
            </div>
            <div className="GameViewCol2" ref={gameDivRef} tabindex="0">
                <ResponsiveGameCanvasComponent />
            </div>
        </div>
    );
}

export default GameViewComponent;