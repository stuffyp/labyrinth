import { isAssertClause } from "typescript";
import User from "../shared/User";
import {randString} from "./random";
import socketManager from "./server-socket";
import gameLogic from "./game-logic";
import { Server } from "socket.io";
const assert = require("assert");

const ROOM_CODE_LENGTH = 5;
let io: Server;

const init = () => {
    io = socketManager.getIo();
}

const sendGameState = (roomCode: string) => {
    const gameState = gameLogic.getGameState(roomCode);
    io.to(roomCode).emit("update", gameState);
}

const getRooms = () => {
    return io.sockets.adapter.rooms;
}

const createRoom = (host: User) => {
    assert(!isCurrentlyActive(host));
    let roomCode = randString(ROOM_CODE_LENGTH);

    const userSocket = socketManager.getSocketFromUserID(host._id);
    if (!userSocket) throw new Error(`Socket id ${host._id} does not exist.`);

    userSocket?.join(roomCode);
    return roomCode;

};


//TODO: check that room code is valid
const joinRoom = (user: User, roomCode: string) => {
    assert(!isCurrentlyActive(user));
    assert(roomCodeExists(roomCode));
    
    const userSocket = socketManager.getSocketFromUserID(user._id);
    userSocket?.join(roomCode);
}

const isCurrentlyActive = (user: User) : boolean => {
    const userSocket = socketManager.getSocketFromUserID(user._id);
    if (!userSocket) throw new Error(`Socket id ${user._id} does not exist.`);

    const roomsConnected = userSocket.rooms.size;
    if (roomsConnected) return roomsConnected > 1;
    return false;
}

const roomCodeExists = (roomCode: string) : boolean => {
    if (roomCode.length!==5) return false;
    for (const room of getRooms().keys()) {
        if (room===roomCode) return true;
    }
    return false;
}

const kickUser = (user: User) => {
    const userSocket = socketManager.getSocketFromUserID(user._id);
    if (!userSocket) throw new Error(`Socket id ${user._id} does not exist.`);

    for (const room of userSocket.rooms){
        userSocket.leave(room);
    }
}

export default {
    init,
    getRooms,
    createRoom,
    joinRoom,
    kickUser,
};