import { isAssertClause } from "typescript";
import User from "../shared/User";
import { randString } from "./random";
const assert = require("assert");
require("./random");

const ROOM_CODE_LENGTH = 5;

interface Room {
    host_id: string;
    code: string;
    other_player_ids: Array<string>;
};

const roomList : Array<Room> = [];

const getRooms = () => {
    return roomList;
}

const createRoom = (host: User) => {
    const roomsWithSameHost = roomList.filter((room)=>(room.host_id===host._id));
    //TODO: uncomment this when no longer testing!
    //assert(roomsWithSameHost.length===0);

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
    let room : Room|undefined = undefined;
    for(let i = 0; i<roomList.length; i++){
        if(roomList[i].code===roomCode){
            room = roomList[i];
            break;
        }
    }

    assert(room!==undefined);
    assert(room?.other_player_ids.indexOf(user._id)===-1);

    room?.other_player_ids.push(user._id);
}

export default {
    getRooms,
    createRoom,
    joinRoom,
};