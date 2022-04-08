
import React from 'react';
import renderer from 'react-test-renderer';
import PlayerInfoComponent from '../playerInfoComponent';
import SocketMock  from 'socket.io-mock';
import socketIOClient from 'socket.io-client';
import { toMatchDiffSnapshot } from 'snapshot-diff';
const {act} = renderer;

expect.extend({ toMatchDiffSnapshot });

jest.mock('socket.io-client');

let createClient = (id, nick, color) => {
    return {
        "id": id,
        "nickname": nick,
        "color": color
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("PlayerInfoComponent", () => {
    let socket;
    let c1, c2; 

    beforeEach(() => {
        c1 = createClient(1, "test","#000");
        c2 = createClient(2, "test2","#f00");
        socket = new SocketMock();
        socket.on("getConnectedClients", (roomId, done) => {
            console.log("testasdfsf");
            done([c1, c2]);
        })
    })
    test('renders correctly', async () => {
        let component;
        act(() => {
            component = renderer.create(<PlayerInfoComponent socket={socket.socketClient} roomID={"34223"} />);
        });

        await sleep(2000);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("should show player nick name when a socket event is received", async () => {
        let component;
        act(() => {
            component = renderer.create(<PlayerInfoComponent socket={socket.socketClient} roomID={"34223"} />);

        });
        
        let oldTree = component.toJSON();

        // server informs us of player change
        c1.nickname = "newName";
        act(() => {
            socket.emit("connectClient", [c1, c2]);
        })
        
        let newTree = component.toJSON();
        expect(oldTree).toMatchDiffSnapshot(newTree);
    })

    test("should show player color when a socket event is received", async () => {
        let component;
        act(() => {
            component = renderer.create(<PlayerInfoComponent socket={socket.socketClient} roomID={"34223"} />);

        });
        
        let oldTree = component.toJSON();

        // server informs us of player change
        c1.color = "#ff0";
        c2.color = "#000";

        act(() => {
            socket.emit("connectClient", [c1, c2]);
        })
        
        let newTree = component.toJSON();
        expect(oldTree).toMatchDiffSnapshot(newTree);
    })

})

