import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
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
        let settings = {};
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
    }

    const onNicknameChanged = (event) => {
        setNickname(event.target.value);
    }

    const onPieceColorChanged = (event) => {
        setPieceColor(event.target.value);
        socket.emit("changeClientColor", roomID, window.clientID, event.target.value);
    }

    return (
        <div className="game-sections">
            <HostSettingsComponent isHost={isHost} gameSpeed={gameSpeed} onGameSpeedChanged={onGameSpeedChanged} onStartButtonClicked={onStartButtonClicked}/>
            <div className="game-settings-component">
                <div className="settings-content">
                    <span className="game-title font-italic text-center">Player Settings</span>
                    <div className='player-input'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Nickname:</span>
                            </div>
                            <input type="text" onChange={onNicknameChanged} value={nickname} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
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
                    {/* <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-expanded="false">Piece Color
                            </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <button className="dropdown-item" type="button">Action</button>
                            <button className="dropdown-item" type="button">Another action</button>
                            <button className="dropdown-item" type="button">Something else here</button>
                        </div>
                        </div> */}
                </div>
            </div>
        </div>
    );
}

export default GameSettingsComponent;