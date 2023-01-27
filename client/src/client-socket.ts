import socketIOClient from "socket.io-client";
const endpoint = `${window.location.hostname}:${window.location.port}`;
export const socket = socketIOClient.io(endpoint);

import {drawCanvas} from "./canvasManager";

socket.on("updateGame", (gameState) => {
    drawCanvas(gameState);
});

export const move = (roomCode, dir) => {
  socket.emit("move", {roomCode: roomCode, dir: dir});
};