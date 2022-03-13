
class Player {
    constructor(id, nickName, color) {
        this.id = id;
        this.nickName = nickName;
        this.color = color;
        this.currentPiece = null;
        this.isImposter = false;
        this.hasEmergency = true;
    }

    setImposter() {
        this.isImposter = true;
    }

    /*consumePiece() {
        let playedPiece = this.currentPiece;
        this.currentPiece = generateRandomPiece();
        this.currentPiece.ofx = this.id * 5;
        return playedPiece;
    }*/
}

export {Player}