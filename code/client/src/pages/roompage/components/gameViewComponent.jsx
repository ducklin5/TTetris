import { ResponsiveGameCanvasComponent } from "./responsiveGameCanvasComponent";


const GameViewComponent = () => {

    return (
        <div style={{"display": "flex", "flexFlow": "column", "height": "100%"}}>
            <div>
                <h2>Game View Component</h2>
            </div>
            <ResponsiveGameCanvasComponent />
        </div>
    );
}

export default GameViewComponent;