import { useState } from "react";
import { on } from "stream";
import "./gameVotingComponent.css";

const getPlayer = (playerId) => {
    return window.gameData.players[playerId];
}

const getPlayerName = (playerId) => {
    return getPlayer(playerId)?.nickName;
};

const VoteResults = ({ socket }) => {
    let [votes, setVotes] = useState({});

    socket.on("votesUpdated", (_votes) => {
        if (JSON.stringify(votes) !== JSON.stringify(_votes)) {
            setVotes(_votes);
        }
    });
    
    let results = {};

    let allPlayerIds = Object.keys(window.gameData.players);
    
    for (let playerId of allPlayerIds) {
        results[playerId] = [];
        for (let voterId in votes) {
            if (votes[voterId] == playerId) {
                results[playerId].push(voterId);
            }
        }
    }
    
    let resultDivs = allPlayerIds.map((playerId) => {
        let playerName = getPlayerName(playerId);
        let voterIds = results[playerId];
        let voters = voterIds?.map((voterId) => getPlayerName(voterId));
        let votersList = voters?.map((voterName) => voterName + ", ");
        return (
            <div key={playerId}>
                {playerName}: [{votersList}]
            </div>
        );
    });

    return <div className="voteResults">{resultDivs}</div>;
};

const GameVotingComponent = ({ socket }) => {
    let onVotePressed = (playerId) => {
        return () => {
            socket.emit("game_input", {
                name: "captureVote",
                args: {
                    targetPlayerId: playerId,
                },
            });
        };
    };

    let allPlayerIds = Object.keys(window.gameData.players);
    let playerIds = allPlayerIds.filter(
        (playerId) => playerId != window.clientID
    );
    let voteButtons = playerIds.map((playerId) => {
        let player = getPlayer(playerId);
        if (player?.isExiled) return null;

        let playerName = getPlayerName(playerId);
        return (
            <button
                type="button"
                className="btn vote-button-color btn-block"
                key={playerId}
                onClick={onVotePressed(playerId)}
            >
                {playerName}
            </button>
        );
    });

    return (
        <div className="vote-box">
            <span className="vote-title font-italic text-center">
                Guess the Imposter!
            </span>
            <div className="player-select-list">{voteButtons}</div>
            <VoteResults socket={socket} />
        </div>
    );
};

export default GameVotingComponent;
