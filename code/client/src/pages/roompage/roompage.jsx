import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Card, Alert } from "react-bootstrap"
import Peer from "simple-peer";
import PlayerInfoComponent from "./components/playerInfoComponent";
import ChatboxComponent from "./components/chatboxComponent";
import GameSettingsComponent from "./components/gameSettingsComponent";
import GameViewComponent from "./components/gameView/gameViewComponent";
import "./roompage.css";

window.gameData = null;

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const VideoComponent = (props) => {
    const {peer} = props;
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    },[]);

    return (
        <video playsInline autoPlay ref={ref} style={{width:300, height:300}}/>
    );
}

const RoomPage = ({ socket }) => {
    const [gameStarted, setGameStarted] = useState(!!window.gameData);
    const [gameData, setGameData] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [playerInfo, setPlayerInfo] = useState({});
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = useParams().roomID;

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

    useEffect(() => {
        if (window.gameData == null) {
            socket.emit("getConnectedClients", roomID, createTempPlayers);
        } else {
            setPlayerInfo(window.gameData.players);
        }

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then(stream => {
            userVideo.current.srcObject = stream;
            socket.emit("getConnectedClients", roomID, (clientInfo) => {
                const peers = [];
                clientInfo.forEach(client => {
                    const peer = createPeer(client.id, socket.id, stream);
                    peersRef.current.push({
                        peerID: client.id,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socket.on("userJoined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socket.on("receiveReturnSignal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    },[])

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sendSignal", {userToSignal, callerID, signal})
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("returnSignal", {signal, callerID})
        })

        peer.signal(incomingSignal);

        return peer;
    }

    socket.on("connectClient", createTempPlayers);

    // Reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    const copyRoomId = () => {
        navigator.clipboard.writeText(roomID);
        setShowAlert(true);
    }
  
    socket.on("gameStarted", (gameData) => {
        window.gameData = gameData;
        setGameStarted(true);
    })

    socket.on("gameDataUpdated", (gameData) => {
        window.gameData = gameData;
    });

    const ShowComponent = () => {
        if (gameStarted) {
            return (
                <GameViewComponent
                    socket={socket}
                />
            )
        } else {
            return (
                <GameSettingsComponent
                    socket={socket}
                    roomID={roomID}
                />
            )
        }
    }

    return (
        <div className="room-page">
            <div className="piece piece-1"></div>
            <div className="piece piece-2"></div>
            <div className="piece piece-3"></div>
            <div className="piece piece-4"></div>
            <div className="piece piece-5"></div>
            <div className="piece piece-6"></div>
            <div className="piece piece-7"></div>
            <div className="piece piece-8"></div>
            <div className="piece piece-9"></div>
            <div className="piece piece-10"></div>
            <div>
                <p className="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <Link to={"/help"} type="button" className=" help-button"><i className="bi bi-question-circle fa-lg"></i></Link>          
            </div>
            <div>
                <video muted ref={userVideo} autoPlay playsInline style={{width:300, height:300}} />
                {peers.map((peer, index) => {
                    return (
                        <VideoComponent key={index} peer={peer} />
                    )
                })}
            </div>
            <div className="room-code">
                <span className="h2 text-dark font-weight-bold text-center ">Room:</span>
                <span type="text" value="room id" id="roomId" className="h2 text-dark font-weight-bold text-center">{roomID}</span>
                <button onClick={copyRoomId} className="copy-button"><i className="bi bi-clipboard fa-lg"></i></button>
            </div>
            <Alert className="mx-5" variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                    You have successfully copied the room code!
            </Alert>
            <div className="room-components">
                <div className="room-sections-left">
                    <Card className="room-box-left">
                            <PlayerInfoComponent playerInfo={playerInfo} />
                    </Card>
                    <Card className="room-box-left">
                            <ChatboxComponent socket={socket}/>
                    </Card>
                </div>
                <div className="room-sections-right">
                    <div className="room-box-right">      
                            <ShowComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;