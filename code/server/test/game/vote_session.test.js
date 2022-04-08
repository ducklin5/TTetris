import { VoteSession } from 'src/game/vote_session';
import { Client } from 'src/room/client';
import MockedSocket from 'socket.io-mock';
import {describe, expect, test} from '@jest/globals';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("VoteSession", () => {

    let v1 = {};
    var ids = [1,2,3,4];
    var total_time = 1000;


    test("should capture and store votes", async () => {
        const onVoteReceived = (v1) => {
        }

        const onVoteDone = (v1) => {
        }
        let vs = new VoteSession(ids, total_time, onVoteReceived, onVoteDone);
        vs.captureVote(1,2);
        vs.captureVote(2,1);
        vs.captureVote(3,1);

        expect(vs.votes).toEqual({1:2, 2:1, 3:1, 4:null});

    });

    test("should return results when the timer completes", async () => {
        let voteResults = null;
        const onVoteReceived = (v1) => {
        }

        const onVoteDone = (v1) => {
            voteResults = v1;
        }
        
        let vs = new VoteSession(ids, total_time, onVoteReceived, onVoteDone);
        vs.start();
        vs.captureVote(1,3);
        vs.captureVote(2,1);
        vs.captureVote(3,1);

        await sleep(1005);
        expect(voteResults).toEqual({"targetPlayerId": "1"});
    });


});