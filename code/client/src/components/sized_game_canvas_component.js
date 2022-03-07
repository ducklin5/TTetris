import React, { useState, useEffect } from 'react';


const SizedGameCanvasComponent = ({ gameData }) => {
    return (<div
        ref={ref}
        className='GameCanvas'>
        <GameCanvasComponent
            gameData={gameData}
            height={dimensions.height}
            width={dimensions.width}
        />
    </div>)
}

export {
    SizedGameCanvasComponent
}