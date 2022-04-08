import React from 'react';
import '@testing-library/jest-dom';
import MockedSocket from 'socket.io-mock';
import RoomPage from 'pages/roompage/roompage';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import GameViewComponent from '../components/gameView/gameViewComponent';
import GameSettingsComponent from '../components/gameSettingsComponent';

describe("Testing Room Page", () => {
    let socket;

    beforeEach(() => {
        socket = new MockedSocket();
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test("Should show up", () => {
        const tree = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<RoomPage socket={socket.socketClient}/>} />
                </Routes>
            </MemoryRouter>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    })

    test("Should show settings component", async () => {
        const component = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<RoomPage socket={socket.socketClient}/>} />
                </Routes>
            </MemoryRouter>)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        let a = await component.root.findAllByProps({socket: socket.socketClient});
        expect(a[4]._fiber.elementType).toEqual(GameSettingsComponent);
    })

    test("Should show game view component", async () => {
        window.clientID = "abcd";
        window.gameData = {players: {"abcd":{
            nickname: "abc",
            color: "#FFF",
            init_ofx: 0,
            currentPiece: null,
            isImposter: false,
            hasEmergency: true,
            isExiled: false,
        }}};
        
        const component = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<RoomPage socket={socket.socketClient}/>} />
                </Routes>
            </MemoryRouter>)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        let a = await component.root.findAllByProps({socket: socket.socketClient});
        expect(a[4]._fiber.elementType).toEqual(GameViewComponent);
    })

    // test("Should copy roomid code on copy roomid button", async () => {
    //     const component = renderer
    //         .create(<MemoryRouter>
    //             <Routes>
    //                 <Route path="/" element={<RoomPage socket={socket.socketClient}/>} />
    //             </Routes>
    //         </MemoryRouter>)

    //     let tree = component.toJSON();
    //     expect(tree).toMatchSnapshot();

    //     const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    //     const writeTextMocks = jest.spyOn(navigator.clipboard, 'writeText').mockImplementation();
    //     let a = await component.root.findAllByType('button');
    //     a[0].props.onClick();

    //     expect(alertMock).toHaveBeenCalled();
    //     expect(writeTextMocks).toHaveBeenCalled();
    // })
})