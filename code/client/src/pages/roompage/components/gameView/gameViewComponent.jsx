import GameButtonsComponent from "./gameButtonsComponent";
import GameInfoComponent from "./gameInfoComponent";
import { ResponsiveGameCanvasComponent } from "./responsiveGameCanvasComponent";
import "./gameview.css";


const GameViewComponent = ({}) => {

    return (
        <div className="GameViewComponent">
            <div className="GameViewCol1">
                <GameInfoComponent />
                <GameButtonsComponent />
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