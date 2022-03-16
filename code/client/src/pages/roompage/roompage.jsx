import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"
import PlayerInfoComponent from "./components/playerInfoComponent";
import ChatboxComponent from "./components/chatboxComponent";
import GameSettingsComponent from "./components/gameSettingsComponent";
import GameViewComponent from "./components/gameViewComponent";

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const RoomPage = (props) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameData, setGameData] = useState(null);
    const { socket } = props;
    const roomID = useParams().roomID;

    let onGameStarted = () => {
        setGameStarted(true);
        socket.on("gameDataUpdated", (arg1, arg2, arg3) => {
            console.log(arg1); // 1
            console.log(arg2); // "2"
            console.log(arg3); // { 3: '4', 5: ArrayBuffer (1) [ 6 ] }
        });
    }

    const ShowComponent = () => {
        if (gameStarted) {
            return (
                <GameViewComponent gameData={gameData} />
            )
        } else {
            return (
                <GameSettingsComponent
                    socket={socket}
                    roomID={roomID}
                    onGameStarted={onGameStarted} />
            )
        }
    }

    return (
        <Container>
            <Row>
                <Col style={{ "border": "1px solid" }} xs={4}>
                    <Row style={{ "border": "1px solid" }}>
                        <PlayerInfoComponent gameData={gameData} />
                    </Row>
                    <Row style={{ "border": "1px solid" }}>
                        <ChatboxComponent />
                    </Row>
                </Col>
                <Col style={{ "border": "1px solid" }} xs={8}>
                    <ShowComponent />
                </Col>
            </Row>
        </Container>
    )
}

RoomPage.propTypes = RoomPagePropTypes;

export default RoomPage;