
import {useRef} from 'react';
import { useRefDimensions } from '../util.js/react_util';
import { GameCanvasComponent } from './game_canvas_component';



const SizedGameCanvasComponent = ({ gameData }) => {
    const ref = useRef();
    const [refHeight, refWidth] = useRefDimensions(ref);

    return (<div
        ref={ref}
        className='GameCanvas'>
        <GameCanvasComponent
            gameData={gameData}
            height={refHeight}
            width={refWidth}
        />
        <div className='GameCanvasSizeSelect'>
            {
                // Size setting go here??
                // only if the responsive version doesnt work
            }
        </div>
    </div>)
}

export {
    SizedGameCanvasComponent
}