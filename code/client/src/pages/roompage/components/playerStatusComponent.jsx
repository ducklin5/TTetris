import './PlayerStatusComponent.css';

// Reference for wifi button: https://fontawesomeicons.com/bootstrap/icons/wifi-off

const PlayerStatusComponent = (props) => {
    return (
        <div className='player-info'>
            <div className='player-name-button'>                  
                <span className=" text-left font-weight-bold">Player-1</span>
                <button type="button" className="btn btn-link"><span className="bi bi-wifi"></span></button>
                <button type="button" className="btn btn-link"><span className="bi bi-mic"></span></button>
            </div>
            <div className="piece-container">
                <div className="player-piece"></div>
            </div>
        </div>
    );
}

export default PlayerStatusComponent;