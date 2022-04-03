import './playerInfoComponent.css';
import { Card } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import PlayerStatusComponent from "./playerStatusComponent";

// FRMARKER: FR15:Display.Players.Information
const PlayerInfoComponent = ({socket, roomID}) => {
    const [playerInfo, setPlayerInfo] = useState({});


    const createTempPlayers = (clientInfo) => {
        // create a temporary, "fake" player info
        let tempPlayerInfo = {};
        clientInfo.forEach(client => {
            tempPlayerInfo[client.id] = {
                id: client.id,
                nickName: client.nickname,
                color: client.color,
                isImposter: false,
                hasEmergency: true,
            }
        })
        setPlayerInfo(tempPlayerInfo);
    }
    const onVotesUpdated = () =>{
        setPlayerInfo(window.gameData.players);
    }

    // FRMARKER: FR14:Display.Player.Connection.Status
    useEffect(() => {
        if (window.gameData == null) {
            socket.emit("getConnectedClients", roomID, createTempPlayers);
        } else {
            setPlayerInfo(window.gameData.players);
        }

        socket.on("connectClient", createTempPlayers);
        socket.on("votesUpdated", onVotesUpdated);
    },[])

    



    return (
        <Card className="players-content">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"></link>
            <Card.Header className="player-title font-italic text-center">Players Info</Card.Header>
            <div className='player-list'>
                {
                    Object.keys(playerInfo).map((key, index) => <PlayerStatusComponent key={index} player={playerInfo[key]} />)
                }
            </div>
        </Card>
    );
}
export default PlayerInfoComponent;