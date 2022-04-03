import './playerStatusComponent.css';

// Reference for wifi button: https://fontawesomeicons.com/bootstrap/icons/wifi-off

// FRMARKER: FR15:Display.Players.Information
// FRMARKER: FR14:Display.Player.Connection.Status
const PlayerStatusComponent = (props) => {
    const {player} = props;
    return (
        <div className='player-info'>
            <div className='player-name-button'>                  
                <span className=" text-left font-weight-bold">{player.nickName}</span>
                <button type="button" className="btn btn-link"><span className="bi bi-mic fa-lg"></span></button>
            </div>
            <div className="piece-container">
                <div className="player-piece" style={{"backgroundColor":player.color}}></div>
                {
                    // FRMARKER: FR17:Display.Emergency.Buttons
                    player.hasEmergency? <div className="player-emergency"></div>: null
                }
                <div className="player-emergency"></div>
            </div>
        </div>
    );
}

export default PlayerStatusComponent;