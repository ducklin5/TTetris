import { useRef, useEffect } from "react";
import GameButtonsComponent from "./gameButtonsComponent";
import GameInfoComponent from "./gameInfoComponent";
import GameVotingComponent from "./gameVotingComponent";
import { ResponsiveGameCanvasComponent } from "./responsiveGameCanvasComponent";
import "./gameview.css";


const GameViewComponent = ({socket}) => {
    const innerRef = useRef(null);

    useEffect(() => {
        const div = innerRef.current;
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

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
                break
        }
    };
    

    return (
        <div className="GameViewComponent" ref={innerRef}>
            <div className="GameViewCol1">
                    <GameButtonsComponent />
                    {/* <GameVotingComponent /> */}
            </div>
            <div className="GameViewCol2">
                <ResponsiveGameCanvasComponent />
            </div>
        </div>
    );
}

export default GameViewComponent;