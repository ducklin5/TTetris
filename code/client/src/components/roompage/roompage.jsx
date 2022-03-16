import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    const copyRoomCode = () => {
        var copyCode = document.getElementById("roomCode");
        copyCode.select();
        navigator.clipboard.writeText(copyCode.value);

        alert("Copied Room Code: " + copyCode.value);
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
            <div class="piece piece-1"></div>
            <div class="piece piece-2"></div>
            <div class="piece piece-3"></div>
            <div class="piece piece-4"></div>
            <div class="piece piece-5"></div>
            <div class="piece piece-6"></div>
            <div>
                <p class="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <button class=" help-button"><i class="bi bi-question-circle fa-lg"></i></button>          
            </div>
            <div className="room-code">
                <span class="h2 text-dark font-weight-bold text-center ">Room:</span>
                <span type="text" value="room code" id="roomCode" class="h2 text-dark font-weight-bold text-center">1234</span>
                <button onclick={copyRoomCode} className="copy-button"><i class="bi bi-clipboard"></i></button>
            </div>
                
            <div class="room-components">
                <div class="room-sections">
                    <div class="room-box-left">
                        <div class="box-align">
                            <PlayerInfoComponent />
                        </div>
                    </div>
                    <div class="room-box-left">
                        <div class="box-align">
                            <ChatboxComponent />
                        </div>
                    </div>
                </div>
                <div class="room-sections">
                    <div class="room-box-right">
                        <div class="box-align">
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