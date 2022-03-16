import './playerInfoComponent.css';

// Reference for wifi button: https://fontawesomeicons.com/bootstrap/icons/wifi-off

const PlayerInfoComponent = (props) => {
    return (
        <div className="players-content">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"></link>
            <span className="player-title font-italic text-center">Players Info</span>
            <div className="player-info">
                <div className='player-name-button'>                  
                    <span className=" text-left font-weight-bold">Player-1</span>
                    <button type="button" class="btn btn-link"><span class="bi bi-wifi"></span></button>
                    <button type="button" class="btn btn-link"><span class="bi bi-mic"></span></button>
                </div>
                <div className="piece-container">
                    <div className="player-piece"></div>
                </div>
            </div>
        </div>
    );
}

export default PlayerInfoComponent;