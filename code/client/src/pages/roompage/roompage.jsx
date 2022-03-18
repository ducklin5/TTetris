import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"
import PlayerInfoComponent from "./components/playerInfoComponent";
import ChatboxComponent from "./components/chatboxComponent";
import GameSettingsComponent from "./components/gameSettingsComponent";
import GameViewComponent from "./components/gameViewComponent";
import "./roompage.css";

window.gameData = {};

const RoomPagePropTypes = {
    socket: PropTypes.object.isRequired,
}

const RoomPage = ({socket}) => {
    const [gameStarted, setGameStarted] = useState(false);
    const roomID = useParams().roomID;

    let onGameStarted = (gameData) => {
        console.log(`GameStarted gameData:`);
        console.log(gameData);
        window.gameData = gameData;
        setGameStarted(true);
    }
    socket.on("gameDataUpdated", (gameData) => {
        console.log(`Received GameData: ${gameData}`);
        window.gameData = gameData;
    });
    

    const ShowComponent = () => {
        if (gameStarted) {
            return (
                <GameViewComponent />
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
        <Container style={{"height": "100%"}}>
            <Row style={{"height": "100%"}}>
                <Col style={{ "border": "1px solid" }} xs={4}>
                    <Row style={{ "border": "1px solid" }}>
                        <PlayerInfoComponent gameData={window.gameData} />
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