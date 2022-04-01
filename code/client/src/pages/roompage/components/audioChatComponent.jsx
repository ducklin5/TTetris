import Peer from "simple-peer";
import { useState, useEffect, useRef } from "react";

const AudioComponent = (props) => {
    const { peer } = props;
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <audio playsInline autoPlay ref={ref} />
    );
}

const AudioChatComponent = ({ socket, roomID }) => {
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sendSignal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("returnSignal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then(stream => {
            userVideo.current.srcObject = stream;
            socket.emit("getConnectedClients", roomID, (clientInfo) => {
                const peers = [];
                clientInfo.forEach(client => {
                    const peer = createPeer(client.id, socket.id, stream);
                    peersRef.current.push({
                        peerID: client.id,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socket.on("userJoined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socket.on("receiveReturnSignal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, [])

    return (
        <div>
            <audio muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <AudioComponent key={index} peer={peer} />
                )
            })}
        </div>
    );
}

export { AudioChatComponent };