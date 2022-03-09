let colors = ["#f00", "#00f", "#0f0", "#ff0", "#0ff", "#f0f"];

let pieceTypes = ["O", "J", "L", "S", "Z", "T", "I"];
let pieceMatrices = {
    O: [
        [1, 1],
        [1, 1]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]

}

const playerCount = 5;
const boardWidth = 15 + Math.max(0, playerCount - 3) * 5;
class GamePiece {
    constructor(typeId, rotation, ofx, ofy) {
        this.typeId = typeId;
        this.rotation = rotation;
        this.ofx = ofx;
        this.ofy = ofy;
    }
}

function generateRandomPiece() {
    let randTypeId = Math.floor(Math.random() * 7);
    let randRotation = Math.floor(Math.random() * 10) - 5;
    return new GamePiece(randTypeId, randRotation, 0, 0);
}
class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.currentPiece = generateRandomPiece();
        this.currentPiece.ofx = this.id * 5;
    }
    consumePiece() {
        let playedPiece = this.currentPiece;
        this.currentPiece = generateRandomPiece();
        this.currentPiece.ofx = this.id * 5;
        return playedPiece;
    }
}

function generateMockPlayers() {
    const players = []

    for (var i = 0; i < playerCount; i++) {
        let color = colors[i];
        let player = new Player(i, color);
        players.push(player)
    }

    return players
}

function mod(x, n) {
    return ((x % n) + n) % n;
}

function rotatePieceMatrix(pieceMatrix, rotation) {
    let cwRotation = mod(rotation, 4);
    let currMatrix = pieceMatrix;
    // assumption: pieceMatrix is square
    let size = pieceMatrix.length;

    // rotation repititions
    for (var t = 0; t < cwRotation; t++) {
        let newMatrix = [];

        // Rotate clockwise once by 90 degrees
        for (let i = 0; i < size; i++) {
            let newRow = [];
            for (let j = size - 1; j >= 0; j--) {
                newRow.push(currMatrix[j][i]);
            }
            newMatrix.push(newRow);
        }
        currMatrix = newMatrix;
    }

    return currMatrix;
}
class Board {
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

    isPieceMatrixColliding(pieceMatrix, ofx, ofy) {
        // checks if the piece matrix is colliding with an exisiting block in the board
        // or if the matrix is past the board height
        let size = pieceMatrix.length;

        for (let y = size - 1; y >= 0; y--) {
            for (let x = 0; x < size; x++) {
                if (pieceMatrix[y][x] == 1) {
                    let gridY = ofy + y;
                    let gridX = ofx + x;

                    if (gridY >= this.height || gridX >= this.width ||
                        this.grid[gridY][gridX] != null )
                        return true;
                }

            }
        }

        return false;
    }

    playPiece(piece, playerId) {
        let pieceType = pieceTypes[piece.typeId];
        let pieceMatrix = pieceMatrices[pieceType];
        pieceMatrix = rotatePieceMatrix(pieceMatrix, piece.rotation);

        while (!this.isPieceMatrixColliding(pieceMatrix, piece.ofx, piece.ofy)) {
            piece.ofy += 1;
        }

        piece.ofy -= 1;
        this._addPieceMatrix(pieceMatrix, piece.ofx, piece.ofy, playerId);
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

function generateMockGameData() {
    let players = generateMockPlayers();
    let board = new Board(20, boardWidth);

    for (var i = 0; i < 20; i++) {
        let playerId = i % playerCount;
        let piece = players[playerId].consumePiece();
        board.playPiece(piece, playerId);
    }

    return {
        players: players,
        board: board
    }
}

export {generateMockGameData};