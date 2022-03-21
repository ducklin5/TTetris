import './gameSettingsComponent.css';

// Reference for wifi button: https://fontawesomeicons.com/bootstrap/icons/wifi-off

const HostSettingsComponent = (props) => {
    const {isHost, gameSpeed, onGameSpeedChanged, onStartButtonClicked} = props;
    console.log(props);
    return (
        <div className="game-settings-component">
                <div className="settings-content">
                    <span className="game-title font-italic text-center">Host Settings</span>
                        <div className='host-input'>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Set Speed:</span>
                                </div>
                                <input type="text" onChange={onGameSpeedChanged} value={gameSpeed} disabled={isHost} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                        <button onClick={onStartButtonClicked} disabled={!isHost} className="start-button" role="button">Start Game</button>
                    </div>
            </div>
        </div>
    );
}

export default HostSettingsComponent;