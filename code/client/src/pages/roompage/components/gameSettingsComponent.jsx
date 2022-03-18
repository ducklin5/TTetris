
const GameSettingsComponent = (props) => {
    const {socket, roomID} = props;

    const onStartButtonClicked = () => {
        socket.emit("start_game", roomID, (gameStarted) => {
            if (gameStarted == false) {
                alert(`The game could not be started`)
                return;
            }
            alert(`Game Started`);
        })
    }

    return (
        <>
            <h2>Game Settings Component</h2>
            <button onClick={onStartButtonClicked} type="button" className="btn btn-secondary btn-lg btn-block text-dark font-weight-bold font-italic">
                Start Game
            </button>
        </>
    );
}

export default GameSettingsComponent;