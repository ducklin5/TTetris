import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatboxComponent from '../chatboxComponent';
import SocketMock from 'socket.io-mock';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import structuredClone from '@ungap/structured-clone';
const { act } = renderer;

expect.extend({ toMatchDiffSnapshot });

let createClient = (id, nick, color) => {
    return {
        "id": id,
        "nickname": nick,
        "color": color
    }
}

let createMessage = (t, nn, msg) => {
    return {
        time: t,
        nickname: nn,
        message: msg
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("ChatboxComponent", () => {
    let socket;
    let history;
    let now = 1649451049840;

    beforeEach(() => {
        history = [];
        history.push(createMessage(now, "player1", "Lorem"));
        now += 1000;
        history.push(createMessage(now, "player2", "Ipsum"));
        now += 60000;
        history.push(createMessage(now, "player3", "Dolor"));
        
        socket = new SocketMock();
        socket.on("getMessage", (roomId, done) => {
            done(history);
        })
    })
    test('renders correctly', async () => {
        let component;
        act(() => {
            component = renderer.create(<ChatboxComponent socket={socket.socketClient} />);
        });

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("should send user input to socket", (done) => {
        let test_msg = "Hello World";

        socket.on("sendMessage", (roomID, msg, clientID) => {
            expect(msg).toEqual(test_msg);
            done()
        })

        render(<ChatboxComponent socket={socket.socketClient} />);
        userEvent.type(screen.getByTestId("send-box-input"), test_msg);
        userEvent.click(screen.getByText("Send"));
    })

    test('should show message when a socket event is recieved', async () => {
        console.log("test2");
        let component;
        act(() => {
            component = renderer.create(<ChatboxComponent socket={socket.socketClient} />);
        });
        let init = component.toJSON();
        
        now += 60000;
        history.push(createMessage(now, "player2", "Amet"));

        act(() => {
            socket.emit("sendMessageAll", structuredClone(history))
        })

        let final = component.toJSON();
        expect(init).toMatchDiffSnapshot(final);
    });

});
