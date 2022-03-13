import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap"
import PlayerInfoComponent from "./playerInfoComponent";
import ChatboxComponent from "./chatboxComponent";
import GameSettingsComponent from "./gameSettingsComponent";
import './roompage.css';

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const RoomPage = (props) => {
    const [gameStarted, setGameStarted] = useState(false);
    const {socket} = props;
    const roomID = useParams().roomID;

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
            <div><p class="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p>
            <button class="help-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 20 15">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
            </button>
            
            </div>
            <div><p class="h1 text-dark font-weight-bold text-center ">Room: 1234</p></div>
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