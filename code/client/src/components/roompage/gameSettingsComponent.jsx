import './gameSettingsComponent.css';

const GameSettingsComponent = (props) => {
    return (
        <div className="game-sections">
            <div className="game-settings-component">
                <div className="settings-content">
                    <span className="game-title font-italic text-center">Host Settings</span>
                        <div className='host-input'>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Set Speed:</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                            </div>
                            <button className="start-button" role="button">Start Game</button>
                        </div>
                </div>
                
            </div>
            <div className="game-settings-component">
                <div className="settings-content">
                    <span className="game-title font-italic text-center">Player Settings</span>
                    <div className='row'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Nickname:</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Piece Color:</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>
                    {/* <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-expanded="false">Piece Color
                            </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <button className="dropdown-item" type="button">Action</button>
                            <button className="dropdown-item" type="button">Another action</button>
                            <button className="dropdown-item" type="button">Something else here</button>
                        </div>
                        </div> */}
                </div>
            </div>
        </div>
    );
}

export default GameSettingsComponent;