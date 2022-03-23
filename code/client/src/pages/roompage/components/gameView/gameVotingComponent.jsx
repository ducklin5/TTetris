import './gameVotingComponent.css';

const GameVotingComponent = (props) => {
    return (
        <div className='vote-box'>
            <span className="vote-title font-italic text-center">Guess the Imposter!</span>
            <div className='player-select-list'>
                <button type="button" class="btn vote-button-color btn-block">Player 1</button>
                <button type="button" class="btn vote-button-color btn-block">Player 2</button>
                <button type="button" class="btn vote-button-color btn-block">Player 3</button>
                <button type="button" class="btn vote-button-color btn-block">Player 4</button>
                <button type="button" class="btn vote-button-color btn-block">Player 5</button>
            </div>
        </div>
    );
}

export default GameVotingComponent;