
const GameSettingsComponent = (props) => {
    const {socket, roomID, onGameStarted} = props;

    const onStartButtonClicked = () => {
        socket.emit("start_game", roomID, (gameData, reason) => {
            if (gameData == null) {
                alert(`The game could not be started because: ${reason}`)
                return;
            }
            alert(`Game Started`);
            onGameStarted(gameData);
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