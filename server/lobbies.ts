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
    assert(roomsWithSameHost.length===0);

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

};

const joinRoom = (user: User, roomCode: string) => {

}

export {getRooms};