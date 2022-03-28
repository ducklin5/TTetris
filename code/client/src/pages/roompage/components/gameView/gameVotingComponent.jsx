import { on } from 'stream';
import './gameVotingComponent.css';

const GameVotingComponent = ({ socket }) => {
    let onVotePressed = (playerId) => {
        return () => {
            socket.emit("game_input", {
                name: "captureVote",
                args: {
                    targetPlayerId: playerId
                }
            });
        }
    }

    let allPlayerIds = Object.keys(window.gameData.players);
    let playerIds = allPlayerIds.filter(playerId => playerId != window.clientID);
    let voteButtons = playerIds.map((playerId) => {
        let player = window.gameData.players[playerId];
        let playerName = player.nickName;
        return (
            <button 
                type="button"
                class="btn vote-button-color btn-block"
                key={playerId}
                onClick={onVotePressed(playerId)}
            >
                {playerName}
            </button>
        );
    })

    return (
        <div className='vote-box'>
            <span className="vote-title font-italic text-center">Guess the Imposter!</span>
            <div className='player-select-list'>
                {voteButtons}
            </div>
        </div>
    );
}

export default GameVotingComponent;