import socketIOClient from "socket.io-client";
import { Vector } from "../../shared/GameTypes";
import { InputType } from "../../shared/InputType";
import input from "./input";
const endpoint = `${window.location.hostname}:${window.location.port}`;
export const socket = socketIOClient.io(endpoint);

import {drawCanvas} from "./canvasManager";

let roomCode = '';

export const setRoom = (room : string) => {
  roomCode = room;
}

socket.on("updateGame", (gameState) => {
    drawCanvas(gameState);
    const userInput : InputType = input.getInput();
    socket.emit("input", {roomCode : roomCode, input : userInput});
});
