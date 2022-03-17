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


function getPieceMatrix(piece) {
    let currentRotation = mod(piece.rotation, 4);

    if (piece.matrixCache.rotation != currentRotation) {
        let type = pieceTypes[piece._typeId];
        let matrix = pieceMatrices[type];
        piece.matrixCache.matrix = rotatePieceMatrix(matrix, currentRotation);
        piece.matrixCache.rotation = currentRotation;
    }

    return piece.matrixCache.matrix;
}

export {getPieceMatrix}