import socketIOClient from "socket.io-client";
import { Vector } from "../../shared/GameTypes";
const endpoint = `${window.location.hostname}:${window.location.port}`;
export const socket = socketIOClient.io(endpoint);

import {drawCanvas} from "./canvasManager";

socket.on("updateGame", (gameState) => {
    drawCanvas(gameState);
});

const move = (roomCode : string, dir : Vector) => {
  socket.emit("move", {roomCode: roomCode, dir: dir});
};

export {move};