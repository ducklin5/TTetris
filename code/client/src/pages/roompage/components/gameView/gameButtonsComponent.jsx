import './gameButtonsComponent.css';

const GameButtonsComponent = ({socket}) => {

    const onSabotagePressed = (type) => {
        return () => {
            socket.emit("game_input", `sabotage:${type}`);
        }
    }
    
    return (
        <div>
            <div className='row-buttons'>
                <button className='emergency-button'><i class="fa fa-exclamation-circle fa-lg"></i></button>
                <div className='timer-frame'>
                    <div className='time-countdown'>1:15</div>
                </div>
            </div>
            <div className='row-buttons'>
                <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
                <button className='sabotage-button sabotage-color1' onClick={onSabotagePressed("Progress")}>
                    <i class="em em-billed_cap" aria-role="presentation" aria-label="BILLED CAP"></i>
                </button>
                <button className='sabotage-button sabotage-color2' onClick={onSabotagePressed("Pieces")}>
                    <i class="em em-smiling_imp" aria-role="presentation" aria-label="SMILING FACE WITH HORNS"></i>
                </button>
                <button className='sabotage-button sabotage-color3' onClick={onSabotagePressed("Drop")}>
                    <i class="em em-droplet" aria-role="presentation" aria-label="DROPLET"></i>
                </button>
            </div>

        </div>

    );
}

export default GameButtonsComponent;