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
            <div><p class="h1 text-danger font-weight-bold font-italic text-center ">Treacherous Tetris</p></div>
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
        // <Container>
        //     <Row>
        //         <Col style={{"border": "1px solid"}} xs={4}>
        //             <Row style={{"border": "1px solid"}}>
        //                 <PlayerInfoComponent />
        //             </Row>
        //             <Row style={{"border": "1px solid"}}>
        //                 <ChatboxComponent />
        //             </Row>
        //         </Col>
        //         <Col style={{"border": "1px solid"}} xs={8}>
        //             <ShowComponent />
        //         </Col>
        //     </Row>
        // </Container>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;