import {useRef} from 'react';
import { useRefDimensions } from 'util/react_util';
import { GameCanvasComponent } from './gameCanvasComponent';

// FRMARKER: FR16:Display.Game.Canvas
const ResponsiveGameCanvasComponent = () => {
    const ref = useRef();
    const [refHeight, refWidth] = useRefDimensions(ref);

    return (<div
        ref={ref}
        className='GameCanvas'>
        <GameCanvasComponent
            height={refHeight-30}
            width={refWidth-30}
        />
    </div>)
}

export {
    ResponsiveGameCanvasComponent
}