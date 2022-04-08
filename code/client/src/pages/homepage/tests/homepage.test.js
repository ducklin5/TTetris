import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockedSocket from 'socket.io-mock';
import HomePage from 'pages/homepage/homepage';
import RoomPage from 'pages/roompage/roompage';
import HelpPage from 'pages/helppage/helppage';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer';

describe("Testing Home Page", () => {
    let socket;

    beforeEach(() => {
        socket = new MockedSocket();
    })

    test("Should show up", () => {
        const tree = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<HomePage socket={socket.socketClient}/>} />
                    <Route path="/room/:roomID" element={<RoomPage socket={socket.socketClient}/>} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </MemoryRouter>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    })

    test("Should send 'createRoom' to socket when the create button is clicked", async () => {
        const component = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<HomePage socket={socket.socketClient}/>} />
                    <Route path="/room/:roomID" element={<RoomPage socket={socket.socketClient}/>} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </MemoryRouter>)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        const createRoomCallback = jest.fn();

        socket.on("create_room", createRoomCallback);

        const a = await component.root.findAllByType('button');
        a[0].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(createRoomCallback).toBeCalled();
    })

    test("Should send 'joinRoom' to socket with the inputed code when the join button is clicked", async () => {
        const component = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<HomePage socket={socket.socketClient}/>} />
                    <Route path="/room/:roomID" element={<RoomPage socket={socket.socketClient}/>} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </MemoryRouter>)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        const joinRoomCallback = jest.fn();
        socket.on("join_room", joinRoomCallback);

        const a = await component.root.findAllByType('button');
        a[1].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(joinRoomCallback).toBeCalled();
    })

    test("Should send alert that the room is full on room join fail", async () => {
        const component = renderer
            .create(<MemoryRouter>
                <Routes>
                    <Route path="/" element={<HomePage socket={socket.socketClient}/>} />
                    <Route path="/room/:roomID" element={<RoomPage socket={socket.socketClient}/>} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </MemoryRouter>)

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        socket.on("join_room", (roomID, done) => {
            done("full");
        });

        // mock alert, and listen for it being called
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        const a = await component.root.findAllByType('button');
        a[1].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(alertMock).toHaveBeenCalled();
    })

    test("Should send navigate to helppage when the help button is pressed", async () => {
        const history = createMemoryHistory();
        render(<MemoryRouter history={history}>
            <Routes>
                <Route path="/" element={<HomePage socket={socket.socketClient}/>} />
                <Route path="/room/:roomID" element={<RoomPage socket={socket.socketClient}/>} />
                <Route path="/help" element={<HelpPage />} />
            </Routes>
        </MemoryRouter>);

        expect(screen.getByRole("link")).toHaveAttribute('href', '/help')
    })
})