
class Player {
    constructor(id, nickName, color, init_ofx = 0) {
        this.id = id;
        this.nickName = nickName;
        this.color = color;
        this.init_ofx = init_ofx;
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