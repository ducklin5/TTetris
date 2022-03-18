import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import {Container, Row, Col} from "react-bootstrap"
import PlayerInfoComponent from "./playerInfoComponent";
import ChatboxComponent from "./chatboxComponent";
import GameSettingsComponent from "./gameSettingsComponent";
import './roompage.css';

// Reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const RoomPage = (props) => {
    const [gameStarted, setGameStarted] = useState(false);
    const {socket} = props;
    const roomID = useParams().roomID;

    const copyRoomId = () => {
        var copyCode = document.getElementById("roomId");
        copyCode.select();
        navigator.clipboard.writeText(copyCode.value);

        alert("Copied Room Id: " + copyCode.value);
    }

    const ShowComponent = () => {
        if (gameStarted) {
            return (
                <GameSettingsComponent />
            )
        } else {
            return (
                <GameSettingsComponent />
            )
        }
    }

    return (
        <div class="room-page">
            <div className="piece piece-1"></div>
            <div className="piece piece-2"></div>
            <div className="piece piece-3"></div>
            <div className="piece piece-4"></div>
            <div className="piece piece-5"></div>
            <div className="piece piece-6"></div>
            <div>
                <p className="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <Link to={"/help"} type="button" className=" help-button"><i className="bi bi-question-circle fa-lg"></i></Link>          
            </div>
            <div className="room-code">
                <span class="h2 text-dark font-weight-bold text-center ">Room:</span>
                <span type="text" value="room id" id="roomId" className="h2 text-dark font-weight-bold text-center">1234</span>
                <button onclick={copyRoomId} className="copy-button"><i class="bi bi-clipboard fa-lg"></i></button>
            </div>
                
            <div className="room-components">
                <div className="room-sections-left">
                    <div className="room-box-left">
                        <div className="box-align">
                            <PlayerInfoComponent />
                        </div>
                    </div>
                    <div className="room-box-left">
                        <div className="box-align">
                            <ChatboxComponent />
                        </div>
                    </div>
                </div>
                <div className="room-sections-right">
                    <div className="room-box-right">
                        <div className="box-align">
                            <ShowComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;