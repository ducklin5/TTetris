import './gameButtonsComponent.css';

const GameButtonsComponent = (props) => {
    return (
        <div className='emergency-timer'>
            <button className='emergency-button'><i class="fa fa-exclamation-circle fa-lg"></i></button>
            <div className='timer-frame'>
                <div className='time-countdown'>1:15</div>
            </div>
        </div>
    );
}

export default GameButtonsComponent;