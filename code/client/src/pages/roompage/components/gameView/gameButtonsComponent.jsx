import './gameButtonsComponent.css';

const GameButtonsComponent = (props) => {
    return (
        <div>
            <div className='row-buttons'>
                <button className='emergency-button'><i className="fa fa-exclamation-circle fa-lg"></i></button>
                <div className='timer-frame'>
                    <div className='time-countdown'>1:15</div>
                </div>
            </div>
            <div className='row-buttons'>
                <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
                <button className='sabotage-button sabotage-color1'><i className="em em-billed_cap" aria-role="presentation" aria-label="BILLED CAP"></i></button>
                <button className='sabotage-button sabotage-color2'><i className="em em-smiling_imp" aria-role="presentation" aria-label="SMILING FACE WITH HORNS"></i></button>
                <button className='sabotage-button sabotage-color3'><i className="em em-droplet" aria-role="presentation" aria-label="DROPLET"></i></button>
            </div>

        </div>

    );
}

export default GameButtonsComponent;