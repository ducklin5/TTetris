class GameState {
    constructor(height, width, requiredRows) {
        this.height = height;
        this.width = width;
        this.grid = [];
        this.rowsCompleted = 0;
        this.requiredRows = requiredRows;
        for (var y = 0; y < height; y++) {
            this.grid.push([]);
            for (var x = 0; x < width; x++) {
                this.grid[y].push(null);
            }
        }
    }

    checkPieceCollisions(piece) {
        // checks if the piece matrix is colliding with the any part of the board 
        let pieceMatrix = piece.getMatrix();
        let size = pieceMatrix.length;

        let collisions = new Set();
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x] === 1) {
                    let gridY = piece.ofy + y;
                    let gridX = piece.ofx + x;
                    let validGridPos = true;

                    if (gridX < 0) {
                        collisions.add("left");
                        validGridPos = false;
                    } else if (gridX >= this.width) {
                        collisions.add("right");
                        validGridPos = false;
                    }

                    if (gridY < 0) {
                        collisions.add("top");
                        validGridPos = false;
                    } else if (gridY >= this.height) {
                        collisions.add("bottom");
                        validGridPos = false;
                    }

                    if (validGridPos && this.grid[gridY][gridX] != null) {
                        collisions.add("block");
                    }
                }
            }
        }

        return collisions;
    }

    // This function is super expensive to ensure the grid is always valid.
    // only call this if you're sure the piece will fit 
    // use `isPieceColliding` before using this. 
    dropPiece(piece, playerId) {
        let collisions = this.checkPieceCollisions(piece);
        let isBlockBottom = (collisions) => collisions.has("block") || collisions.has("bottom");

        if (!isBlockBottom(collisions)) {
            // move it down untill it is
            do {
                piece.ofy += 1;
                collisions = this.checkPieceCollisions(piece);
            } while (!isBlockBottom(collisions))
        }

        // now it must be colliding so move it up untill it isnt/ or it is past the top
        do {
            piece.ofy -= 1;
            collisions = this.checkPieceCollisions(piece);
        } while (isBlockBottom(collisions));

        this._addPiece(piece, playerId);
        
        if (collisions.has("top"))
            return "imposter";

        if (this.rowsCompleted == this.requiredRows) 
            return "civilians";

        return null;
    }

    _addPiece(piece, playerId) {
        let pieceMatrix = piece.getMatrix();
        let size = pieceMatrix.length;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x]) {
                    let gridY = piece.ofy + y;
                    let gridX = piece.ofx + x;

                    if (gridY < this.height && gridY >= 0 && gridX >= 0 && gridX < this.width) {
                        this.grid[gridY][gridX] = playerId;
                    }
                }
            }
        }
        this._eliminateRows();
    }

    _eliminateRows() {
        for (let row = 0; row < this.height; row++) {
            // if this row is full
            if (!this.grid[row].includes(null)) {
                // remove the row
                this.grid.splice(row, 1);
                // and add an empty row to the top
                this.grid.unshift(new Array(this.width).fill(null));
                this.rowsCompleted++;
            }
        }
    }

    printGrid() {
        let gridStr = "";
        for (let j = 0; j < this.grid.length; j++) {
            for (let i = 0; i < this.grid[j].length; i++) {
                let cell = this.grid[j][i] == null ? " " : 1;
                gridStr += cell + " "
            }
            gridStr += "\n";
        }
        console.log(gridStr);
    }
}

export { GameState }