import { ResponsiveGameCanvasComponent } from "./responsiveGameCanvasComponent";


const GameViewComponent = (props) => {
    let gameData = {props};

    return (
        <div style={{display: "flex"}}>
            <div>
                <h2>Game View Component</h2>
            </div>
            <ResponsiveGameCanvasComponent />
        </div>
    );
}

export default GameViewComponent;