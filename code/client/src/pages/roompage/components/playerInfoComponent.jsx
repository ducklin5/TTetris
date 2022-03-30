import './playerInfoComponent.css';
import { Card } from "react-bootstrap";
import PlayerStatusComponent from "./playerStatusComponent";

const PlayerInfoComponent = (props) => {
    const { playerInfo } = props;

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