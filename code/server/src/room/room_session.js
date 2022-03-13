import { Player } from "../game/player.js";
import { v4 as uuidv4 } from "uuid";

class RoomSession {
    constructor(roomID) {
        this.players = [];
        this.chatSession = [];
        this.roomID = roomID;
    }

    addPlayer() {
        // ref: https://css-tricks.com/snippets/javascript/random-hex-color/
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        let playerID = uuidv4();
        let playerName = `Player${this.players.length+1}`; 
        let player = new Player(playerID, playerName, randomColor);
        this.players.push(player)
    }
}

export { RoomSession }

// + isFull: bool
//       + code: string
//       + startGame(): void
//       + addPlayer(): void
//       + generateRoomCode(): void
//       + getChatHistory(): json