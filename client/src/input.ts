import { move } from "./client-socket";

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    keysPressed[e.key] = true;
};

const handleKeyup = (e: KeyboardEvent) => {
    keysPressed[e.key] = false;
};

const init = (roomCode : string) : ()=>void => {
    const clearID = setInterval(() => {
        if (keysPressed.ArrowUp && keysPressed.ArrowLeft) {
          move(roomCode, "NW");
        } else if (keysPressed.ArrowUp && keysPressed.ArrowRight) {
          move(roomCode, "NE");
        } else if (keysPressed.ArrowDown && keysPressed.ArrowLeft) {
          move(roomCode, "SW");
        } else if (keysPressed.ArrowDown && keysPressed.ArrowRight) {
          move(roomCode, "SE");
        } else if (keysPressed.ArrowUp) {
          move(roomCode, "N");
        } else if (keysPressed.ArrowDown) {
          move(roomCode, "S");
        } else if (keysPressed.ArrowLeft) {
          move(roomCode, "W");
        } else if (keysPressed.ArrowRight) {
          move(roomCode, "E");
        }
      }, 1000 / 60);
    return () => clearInterval(clearID);
}

export default {handleKeydown, handleKeyup, init};