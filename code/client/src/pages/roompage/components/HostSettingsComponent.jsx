import "./gameSettingsComponent.css";

// Reference for wifi button: https://fontawesomeicons.com/bootstrap/icons/wifi-off

const HostSettingsComponent = (props) => {
    const { isHost, gameSpeed, onGameSpeedChanged, onStartButtonClicked } = props;
    return (
        <div className="game-settings-component">
            <div className="settings-content">
                <span className="game-title font-italic text-center">
                    Host Settings
                </span>
                <div className="host-input">
                    <div className="input-group">
                            <span className="input-group-text" id="inputGroup-sizing-default">
                                Set Speed:
                            </span>
                            <input
                                className="form-control set-speed"
                                type="range"
                                min="1"
                                max="15"
                                onChange={onGameSpeedChanged}
                                value={gameSpeed}
                                disabled={!isHost}
                                step="1"
                            ></input>
                    </div>
                    <button
                        onClick={onStartButtonClicked}
                        disabled={!isHost}
                        className="start-button"
                        role="button"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HostSettingsComponent;
