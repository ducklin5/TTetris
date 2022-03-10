let pieceTypes = ["O", "J", "L", "S", "Z", "T", "I"];
const pieceMatrices = {
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

class GamePiece {
    constructor(typeId, rotation, ofx, ofy) {
        this._typeId = typeId;
        this.rotation = rotation;
        this.ofx = ofx;
        this.ofy = ofy;
        this.matrixCache = {};
    }

    get typeId() {
        return this._typeId;
    }

    set typeId(val) {
        console.log("typeId of a piece cannot be changed once created.")
    }

    getMatrix() {
        let currentRotation = mod(this.rotation, 4);

        if ( this.matrixCache.rotation != currentRotation) {
            let type = pieceTypes[this.typeId];
            let matrix = pieceMatrices[type];
            this.matrixCache.matrix = rotatePieceMatrix(matrix, currentRotation);
            this.matrixCache.rotation = currentRotation;
        }

        return this.matrixCache.matrix;
    }
}

function generateRandomPiece(ofx) {
    let randTypeId = Math.floor(Math.random() * 7);
    let randRotation = Math.floor(Math.random() * 10) - 5;
    
    let pieceType = pieceTypes[randTypeId];
    let ofy = -pieceMatrices[pieceType].length;
    
    return new GamePiece(randTypeId, randRotation, ofx, ofy);
}

export {
    pieceMatrices,
    generateRandomPiece,
    rotatePieceMatrix,
    GamePiece
}