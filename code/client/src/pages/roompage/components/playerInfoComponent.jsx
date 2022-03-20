import './playerInfoComponent.css';
import playerStatusComponent from "./playerStatusComponent";

const PlayerInfoComponent = (props) => {
    return (
        <div className="players-content">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"></link>
            <span className="player-title font-italic text-center">Players Info</span>
            <div className='player-list'>
                <playerStatusComponent/>
            </div>
        </div>
    );
}
export default PlayerInfoComponent;