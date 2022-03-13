class GameState {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.grid = [];
        for (var y = 0; y < height; y++) {
            this.grid.push([]);
            for (var x = 0; x < width; x++) {
                this.grid[y].push(null);
            }
        }
    }

    isPieceColliding(piece) {
        return this.isPieceMatrixColliding(piece.getMatrix(), piece.ofx, piece.ofy);
    }

    isPieceMatrixColliding(pieceMatrix, ofx, ofy) {
        // checks if the piece matrix is colliding with an exisiting block in the board
        // or if the matrix is past the board height
        let size = pieceMatrix.length;

        for (let y = size - 1; y >= 0; y--) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x] === 1) {
                    let gridY = ofy + y;
                    let gridX = ofx + x;

                    if (gridY >= 0) {
                        if (gridY >= this.height || gridX >= this.width ||
                            this.grid[gridY][gridX] != null )
                            return true;

                    }
                }
            }
        }

        return false;
    }

    // This function is super expensive to ensure the grid is always valid.
    // only call this if you're sure the piece will fit 
    // use `isPieceColliding` before using this. 
    playPiece(piece, playerId) {
        let pieceMatrix = piece.getMatrix();

        let isColliding = this.isPieceMatrixColliding(pieceMatrix, piece.ofx, piece.ofy);
        
        if(!isColliding) {
            // move it down untill it is
            do {
                piece.ofy += 1;
                isColliding = this.isPieceMatrixColliding(pieceMatrix, piece.ofx, piece.ofy);
            } while (!isColliding)
        }
        
        // now it must be colliding so move it up untill it isnt/ or it is past the top
        do {
            piece.ofy -= 1;
            isColliding = this.isPieceMatrixColliding(pieceMatrix, piece.ofx, piece.ofy);
        } while (isColliding && piece.ofy >= 0);
         
        if (isColliding) {
            return false;
        }
        
        this._addPieceMatrix(pieceMatrix, piece.ofx, piece.ofy, playerId);
        return true;
    }

    _addPieceMatrix(pieceMatrix, ofx, ofy, playerId) {
        let size = pieceMatrix.length;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x]) {
                    let gridY = ofy + y;
                    let gridX = ofx + x;

                    this.grid[gridY][gridX] = playerId;
                }

            }
        }
    }
}

export {GameState}