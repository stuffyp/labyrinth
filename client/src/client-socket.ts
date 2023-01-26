import socketIOClient from "socket.io-client";
const endpoint = `${window.location.hostname}:${window.location.port}`;
export const socket = socketIOClient.io(endpoint);

//export const move = (dir) => {
//  socket.emit("move", dir);
//};