import { throws } from "assert";

class VoteSession {
    constructor(playerIds, totalTime) {
        this.votes = {};
        for (let playerId of playerIds) {
            this.votes[playerId] = null;
        };
        this.totalTime = totalTime
    }

    captureVote(playerId, targetPlayerId) {
        if (playerId in this.votes && targetPlayerId in this.votes) {
            this.votes[playerId] = targetPlayerId;
        }
    }

    start(onVoteSessionDone) {
        let self = this;
        this.timer = setTimeout(() => self.onTimerDone(onVoteSessionDone), this.totalTime);
    }

    onTimerDone(onVoteSessionDone) {
        let results = {}
        // calculate results
        for (let playerId in this.votes) {
            results[playerId] = 0;
        }
        
        for (let playerId in this.votes) {
            let targetPlayerId = this.votes[playerId];
            if (targetPlayerId) {
                this.votes[targetPlayerId] += 1;
            }
        }

        onVoteSessionDone(results);
    }
}

export {VoteSession};