import socketIOClient from "socket.io-client";
import { Vector } from "../../shared/GameTypes";
import { InputType } from "../../shared/InputType";
const endpoint = `${window.location.hostname}:${window.location.port}`;
export const socket = socketIOClient.io(endpoint);

import {drawCanvas} from "./canvasManager";

socket.on("updateGame", (gameState) => {
    drawCanvas(gameState);
});

const move = (roomCode : string, input : InputType) => {
  socket.emit("move", {roomCode: roomCode, input : input});
};

const shoot = (roomCode : string, input : {shootDir : Vector}) => {
  socket.emit("shoot", {roomCode: roomCode, input : input});
};

export {move, shoot};