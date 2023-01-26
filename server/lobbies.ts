import { isAssertClause } from "typescript";
import User from "../shared/User";
import {randString} from "./random";
import socketManager, { getSocketFromSocketID, getUserFromSocketID } from "./server-socket";
import {setupGame, updateGameState, getGameState} from "./game-logic";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

const ROOM_CODE_LENGTH = 5;
const FPS = 60;
let io: Server;
const roomToHostMap = new Map<string, string>();//room name, user id

const init = () => {
    io = socketManager.getIo();
}

const startGame = async (user: User, roomCode: string) => {
    if(roomToHostMap.get(roomCode)!==user._id){
        return;
    }
    const sockets = await io.in(roomCode).fetchSockets();
    const users = sockets.map((socket) => getUserFromSocketID(socket.id));
    setupGame(roomCode, users.filter(user => user) as User[]);
    const clearID = setInterval(() => {
        if(!getRooms().has(roomCode)){
            clearInterval(clearID);
        }
        updateGameState(roomCode);
        sendGameState(roomCode);
    }, 1000/FPS);
}

const sendGameState = (roomCode: string) => {
    const gameState = getGameState(roomCode);
    io.to(roomCode).emit("updateGame", gameState);
}

const getRooms = () => {
    return io.sockets.adapter.rooms;
}

const createRoom = (host: User) => {
    if (isCurrentlyActive(host)) throw new Error(`${host._id} is already in a lobby.`);
    let roomCode = randString(ROOM_CODE_LENGTH);

    const userSocket = socketManager.getSocketFromUserID(host._id);
    if (!userSocket) throw new Error(`Socket id of ${host._id} does not exist.`);

    userSocket?.join(roomCode);
    roomToHostMap.set(roomCode, host._id);

    return roomCode;

};


const joinRoom = (user: User, roomCode: string) => {
    if (isCurrentlyActive(user)) throw new Error(`${user._id} is already in a lobby.`);
    if(!roomCodeValid(roomCode)) throw new Error(`Room code ${roomCode} does not exist.`);
    
    const userSocket = socketManager.getSocketFromUserID(user._id);
    userSocket?.join(roomCode);

    io.to(roomCode).emit("updateRoom");
}

const isCurrentlyActive = (user: User) : boolean => {
    const userSocket = socketManager.getSocketFromUserID(user._id);
    if (!userSocket) throw new Error(`Socket id of ${user._id} does not exist.`);

    const roomsConnected = userSocket.rooms.size;
    if (roomsConnected) return roomsConnected > 1;
    return false;
}

const roomCodeValid = (roomCode: string) : boolean => {
    return roomCode.length===ROOM_CODE_LENGTH && roomCode.toUpperCase()===roomCode;
}

const kickUser = (user: User) => {
    const userSocket = socketManager.getSocketFromUserID(user._id);
    if (!userSocket) throw new Error(`Socket id of ${user._id} does not exist.`);

    for (const room of userSocket.rooms){
        userSocket.leave(room);
    }
}

type GetRoomReturn = {
    users: string[],
    hostIndex: number,
    isHost: boolean,
}
const getRoom = async (user: User, roomCode: string) : Promise<GetRoomReturn|null> => {
    const userSocket = socketManager.getSocketFromUserID(user._id);
    /*
    if (!userSocket) throw new Error(`Socket id of ${user._id} does not exist.`);
    if (!roomCodeExists(roomCode)) throw new Error(`Room code ${roomCode} does not exist.`);
    if (!userSocket.rooms.has(roomCode)) throw new Error(`Socket id of ${user._id} has not joined room ${roomCode}`);
    */

    if (!userSocket) return null;
    if (!roomCodeValid(roomCode)) return null;

    //if (!isCurrentlyActive(user)) joinRoom(user, roomCode);
    if (!userSocket.rooms.has(roomCode)) return null;

    const originalHost = roomToHostMap.get(roomCode);
    const isHost : boolean = originalHost===user._id;

    const users : Array<string> = [];
    const sockets = await io.in(roomCode).fetchSockets();
    let hostIndex : number = -1;
    for (const socket of sockets){
        const user = socketManager.getUserFromSocketID(socket.id);
        const name = user?.name;
        if (name) {
            users.push(name) 
        } else {
            users.push("Anonymous")
        };

        if(user?._id===originalHost){
            hostIndex = users.length-1;
        }
    }
        
    return {
        users: users,
        hostIndex: hostIndex,
        isHost: isHost,
    };
}

export default {
    init,
    getRooms,
    createRoom,
    joinRoom,
    kickUser,
    getRoom,
    startGame,
};