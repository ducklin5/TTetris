import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap"
import PlayerInfoComponent from "./components/playerInfoComponent";
import ChatboxComponent from "./components/chatboxComponent";
import GameSettingsComponent from "./components/gameSettingsComponent";

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
        <Container>
            <Row>
                <Col style={{"border": "1px solid"}} xs={4}>
                    <Row style={{"border": "1px solid"}}>
                        <PlayerInfoComponent />
                    </Row>
                    <Row style={{"border": "1px solid"}}>
                        <ChatboxComponent />
                    </Row>
                </Col>
                <Col style={{"border": "1px solid"}} xs={8}>
                    <ShowComponent />
                </Col>
            </Row>
        </Container>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;