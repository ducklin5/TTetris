import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap"
import './gameSettingsComponent.css';
import HostSettingsComponent from "./HostSettingsComponent";

const GameSettingsComponent = (props) => {
    const {socket} = props;
    const [gameSpeed, setGameSpeed] = useState(1);
    const [nickname, setNickname] = useState("");
    const [pieceColor, setPieceColor] = useState("");
    const [isHost, setIsHost] = useState(false);
    const roomID = useParams().roomID;

    useEffect(() => {
        socket.emit("getClientInfo", roomID, window.clientID, (clientData) => {
            setNickname(clientData.nickname);
            setPieceColor(clientData.color);
            setIsHost(clientData.isHost);
        })
    },[])
    
    const onStartButtonClicked = () => {
        let settings = {speed: gameSpeed};
        // TODO: accumulate settings here

        socket.emit("start_game", settings, (gameStarted) => {
            if (!gameStarted) {
                alert(`The game could not be started`)
                return;
            }
            alert(`You started the game`);
        })
    }

    const onGameSpeedChanged = (event) => {
        setGameSpeed(event.target.value);
        socket.emit("changeGameSpeed", roomID, event.target.value);
    }

    const onNicknameChanged = (event) => {
        setNickname(event.target.value);
        socket.emit("changeClientName", roomID, window.clientID, event.target.value);
    }

    const onPieceColorChanged = (event) => {
        setPieceColor(event.target.value);
        socket.emit("changeClientColor", roomID, window.clientID, event.target.value);
    }

    return (
        <Card className="game-sections">
            <HostSettingsComponent isHost={isHost} gameSpeed={gameSpeed} onGameSpeedChanged={onGameSpeedChanged} onStartButtonClicked={onStartButtonClicked}/>
            <Card className="game-settings-component">
                <div className="settings-content">
                    <span className="game-title font-italic text-center">Player Settings</span>
                    <div className='player-input'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Nickname:</span>
                            </div>
                            <input type="text" onChange={onNicknameChanged} onKeyDown={onNicknameConfirmed} value={nickname} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>

                    <div className='player-input'>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Piece Color:</span>
                            </div>
                            <input type="color" onChange={onPieceColorChanged} value={pieceColor} style={{"height":"40px"}} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>
                </div>
            </Card>
        </Card>
    );
}

export default GameSettingsComponent;