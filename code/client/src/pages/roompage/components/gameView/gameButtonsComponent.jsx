import './gameButtonsComponent.css';

const GameButtonsComponent = (props) => {
    return (
        <div>
            <div className='emergency-timer'>
                <button className='emergency-button'><i class="fa fa-exclamation-circle fa-lg"></i></button>
                <div className='timer-frame'>
                    <div className='time-countdown'>1:15</div>
                </div>
            </div>
            <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
            <button className='sabotage-button '><i class="em em-smiling_imp" aria-role="presentation" aria-label="SMILING FACE WITH HORNS"></i></button>
        </div>

    );
}

export default GameButtonsComponent;