import GameButtonsComponent from "./gameView/gameButtonsComponent";
import GameInfoComponent from "./gameView/gameInfoComponent";
import { ResponsiveGameCanvasComponent } from "./gameView/responsiveGameCanvasComponent";


const GameViewComponent = ({gameData}) => {

    return (
        <div className="GameViewComponent">
            <div className="GameViewCol1">
                <GameInfoComponent gameData={gameData}/>
                <GameButtonsComponent gameData={gameData} />
                {

                }
            </div>
            <div className="GameViewCol2">
                <ResponsiveGameCanvasComponent />
            </div>
        </div>
    );
}

export default GameViewComponent;