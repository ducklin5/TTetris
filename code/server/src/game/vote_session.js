
class VoteSession {
    constructor(playerIds, totalTime, onVotesUpdated, onVoteSessionDone) {
        this.votes = {};
        for (let playerId of playerIds) {
            this.votes[playerId] = null;
        };
        this.totalTime = totalTime;
        this.onVotesUpdated = onVotesUpdated;
        this.onVoteSessionDone = onVoteSessionDone;
    }

    captureVote(playerId, targetPlayerId) {
        if (playerId in this.votes && targetPlayerId in this.votes) {
            this.votes[playerId] = targetPlayerId;
            this.onVotesUpdated(this.votes);
        }
    }

    start() {
        this.timer = setTimeout(() => this.onTimerDone(), this.totalTime);
        this.onVotesUpdated(this.votes);
    }

    onTimerDone() {
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
        this.onVotesUpdated(null);
        this.onVoteSessionDone(results);
    }
}

export {VoteSession};