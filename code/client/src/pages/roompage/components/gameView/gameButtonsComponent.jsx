import { useState, useEffect } from "react";
import "./gameButtonsComponent.css";

// FRMARKER: FR19:Display.Sabotage.Button
const ImposterButtons = ({ socket }) => {
    const onSabotagePressed = (type) => {
        return () => {
            socket.emit("game_input", `sabotage:${type}`);
        };
    };

    return (
        <div className="row-buttons">
            <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
            <button
                className="sabotage-button sabotage-color1"
                onClick={onSabotagePressed("Progress")}
            >
                <i
                    class="em em-billed_cap"
                    aria-role="presentation"
                    aria-label="BILLED CAP"
                ></i>
            </button>
            <button
                className="sabotage-button sabotage-color2"
                onClick={onSabotagePressed("Pieces")}
            >
                <i
                    class="em em-smiling_imp"
                    aria-role="presentation"
                    aria-label="SMILING FACE WITH HORNS"
                ></i>
            </button>
            <button
                className="sabotage-button sabotage-color3"
                onClick={onSabotagePressed("Drop")}
            >
                <i
                    class="em em-droplet"
                    aria-role="presentation"
                    aria-label="DROPLET"
                ></i>
            </button>
        </div>
    );
};

const GameButtonsComponent = ({ socket }) => {
    let playerId = window.clientID;
    let player = window.gameData.players[playerId];
    let isImposter = player.isImposter;
    let [timeLeft, setTimeLeft] = useState(0);

    // FRMARKER: FR30: Send.VotingButton 
    const onEmergencyPressed = () => {
        socket.emit("game_input", `emergency`);
    };

    useEffect(() => {
        socket.on("gameDataUpdated", (gameData) => {
            if (timeLeft != gameData.timeLeft) {
                setTimeLeft(gameData.timeLeft);
            }
        });

    }, []);

    let totalSeconds = ~~(timeLeft / 1000);
    const fmtS2MS = s => ~~(s / 60) + ((s %= 60) < 10 ? ":0" : ":") + s;

    return (
        <div>
            <div className="row-buttons">
                {/*/ FRMARKER: FR17:Display.Emergency.Buttons */}
                <button className="emergency-button" onClick={onEmergencyPressed}>
                    <i className="fa fa-exclamation-circle fa-lg"></i>
                </button>
                <div className="timer-frame">
                    <div className="time-countdown">
                        <p>{fmtS2MS(totalSeconds)}</p>
                    </div>
                </div>
            </div>
            {isImposter ? <ImposterButtons socket={socket} /> : null}
        </div>
    );
};

export default GameButtonsComponent;
