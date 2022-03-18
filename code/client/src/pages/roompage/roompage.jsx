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

const RoomPage = ({ socket }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameData, setGameData] = useState({});
    const roomID = useParams().roomID;

    socket.on("gameStarted", (gameData) => {
        console.log(`GameStarted gameData:`);
        console.log(gameData);
        setGameData(gameData);
        window.gameData = gameData;
        setGameStarted(true);
    })

    socket.on("gameDataUpdated", (gameData) => {
        window.gameData = gameData;
        setGameData(gameData);
    });


    const ShowComponent = () => {
        if (gameStarted) {
            return (
                <GameViewComponent
                    gameData={gameData}
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
        <Container style={{ "height": "100%" }}>
            <Row style={{ "height": "100%" }}>
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