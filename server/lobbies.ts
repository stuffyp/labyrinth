import { isAssertClause } from "typescript";
import User from "../shared/User";
import { randString } from "./random";
const assert = require("assert");
require("./random");

const ROOM_CODE_LENGTH = 5;

interface Room {
    host_id: string|undefined;
    code: string;
    other_player_ids: Array<string>;
};

const roomList : Array<Room> = [];

const getRooms = () => {
    return roomList;
}

const userCurrentlyQueued = (user: User) => {
    roomList.forEach((room) => {
        if(room.host_id===user._id || room.other_player_ids.indexOf(user._id)>-1){
            return true;
        }
    });
    return false;
}

const createRoom = (host: User) => {
    //TODO: uncomment this when no longer testing!
    //assert(!userCurrentlyQueued(host));

    let roomCode = randString(ROOM_CODE_LENGTH);
    while(roomList.filter((room)=>(room.code===roomCode)).length>0){
        roomCode = randString(ROOM_CODE_LENGTH);
    }

    const newRoom : Room = {
        host_id: host._id,
        code: roomCode,
        other_player_ids: [],
    };
    roomList.push(newRoom);

    return roomCode;

};

const joinRoom = (user: User, roomCode: string) => {
    //TODO: uncomment this when no longer testing!
    //assert(!userCurrentlyQueued(user));

    let room : Room|undefined = undefined;
    for(let i = 0; i<roomList.length; i++){
        if(roomList[i].code===roomCode){
            room = roomList[i];
            break;
        }
    }

    assert(room!==undefined);

    room?.other_player_ids.push(user._id);
}

const disconnectUser = (user: User) => {
    roomList.forEach((room) => {
        if(room.host_id===user._id){
            room.host_id = undefined;
        }
        room.other_player_ids = room.other_player_ids.filter((id) => (id!==user._id));
    });
}

//goes from back to front to avoid bugs from modifying array as you loop
const cleanUpRooms = () => {
    for(let i = roomList.length-1; i>=0; i--){
        if(roomList[i].host_id===undefined){
            roomList.splice(i, 1);
        }
    }
}

export default {
    getRooms,
    createRoom,
    joinRoom,
    disconnectUser,
    cleanUpRooms,
};