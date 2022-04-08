import React from 'react';
import '@testing-library/jest-dom';
import MockedSocket from 'socket.io-mock';
import RoomPage from 'pages/roompage/roompage';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import GameVotingComponent from '../gameVotingComponent';

describe("Testing GameVotingComponent", () => {
    let socket;

    beforeEach(() => {
        socket = new MockedSocket();
        window.gameData = {
            players: {
                "abcd":{
                    nickname: "abc",
                    color: "#FFF",
                    init_ofx: 0,
                    currentPiece: null,
                    isImposter: false,
                    hasEmergency: true,
                    isExiled: false,
                },
                "efgh":{
                    nickname: "efg",
                    color: "#FFF",
                    init_ofx: 5,
                    currentPiece: null,
                    isImposter: false,
                    hasEmergency: true,
                    isExiled: false,
                }
            }
        };
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test("Should show up", () => {
        const tree = renderer
            .create(<GameVotingComponent socket={socket.socketClient} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    })

    test("Should send 'game_input' on vote pressed", async () => {
        const component = renderer
            .create(<GameVotingComponent socket={socket.socketClient} />)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        const gameInputCallback = jest.fn();
        socket.on("game_input", gameInputCallback);

        let a = await component.root.findAllByType('button');
        a[0].props.onClick();

        expect(gameInputCallback).toBeCalled();
    })
})