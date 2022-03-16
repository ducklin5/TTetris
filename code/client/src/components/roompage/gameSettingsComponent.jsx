import './gameSettingsComponent.css';

const GameSettingsComponent = (props) => {
    return (
        <div class="game-sections">
            <div class="settings-vertical">
                <div class="settings-content">
                    <span class="game-title font-italic text-center">Host Settings</span>
                        <div className='row'>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Set Speed:</span>
                                </div>
                                <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                            </div>
                            <button class="button-71" role="button">Start Game</button>
                        </div>
                </div>
                
            </div>
            <div class="settings-vertical">
                <div class="settings-content">
                    <span class="game-title font-italic text-center">Player Settings</span>
                    <div className='row'>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Nickname:</span>
                            </div>
                            <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>
                    <div className='row'>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Piece Color:</span>
                            </div>
                            <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>
                    {/* <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-expanded="false">Piece Color
                            </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <button class="dropdown-item" type="button">Action</button>
                            <button class="dropdown-item" type="button">Another action</button>
                            <button class="dropdown-item" type="button">Something else here</button>
                        </div>
                        </div> */}
                </div>
            </div>
        </div>
    );
}

export default GameSettingsComponent;