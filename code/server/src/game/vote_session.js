class VoteSession {
    constructor(playerIds, totalTime, onVotesUpdated, onVoteSessionDone) {
        this.votes = {};
        for (let playerId of playerIds) {
            this.votes[playerId] = null;
        }
        this.totalTime = totalTime;
        this.onVotesUpdated = onVotesUpdated;
        this.onVoteSessionDone = onVoteSessionDone;
    }

    captureVote(playerId, targetPlayerId) {
        if (playerId in this.votes && targetPlayerId in this.votes) {
            console.log(`capture vote: ${playerId} --> ${targetPlayerId}`);
            this.votes[playerId] = targetPlayerId;
            this.onVotesUpdated(this.votes);
        }
    }

    start() {
        // FRMARKER: FR33: Initialize.Timers
        this.timer = setTimeout(() => this.onTimerDone(), this.totalTime);
        this.onVotesUpdated(this.votes);
    }

    onTimerDone() {
        this.onVotesUpdated(null);
        let results = this.buildResults();
        this.onVoteSessionDone(results);
    }

    // FRMARKER: FR31: Handle.VotingResults
    buildResults() {
        let voteCounts = {};

        // calculate voteCounts
        for (let playerId in this.votes) {
            voteCounts[playerId] = 0;
        }

        // FRMARKER: FR34: Count.Votes
        for (let playerId in this.votes) {
            let targetPlayerId = this.votes[playerId];
            if (targetPlayerId) {
                voteCounts[targetPlayerId] += 1;
            }
        }

        // find the player with the most votes
        let playerIds = Object.keys(voteCounts);
        playerIds.sort((p1, p2) => voteCounts[p2] - voteCounts[p1]);

        let results = {};

        if (voteCounts[playerIds[0]] == 0) {
            results.targetPlayerId = null;
            results.noVotes = true;
            return results;
        }

        // FRMARKER: FR35: Handle.Ties
        if ( playerIds.length > 1 
            && voteCounts[playerIds[0]] == voteCounts[playerIds[1]]) {
                results.targetPlayerId = null;
                results.tie = true;
                return results
        }

        results.targetPlayerId = playerIds[0];
        return results
    }
}

export { VoteSession };
