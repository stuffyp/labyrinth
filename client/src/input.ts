import { move } from "./client-socket";
import { Vector } from "../../shared/GameTypes";

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    z: false,
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
        const dir : Vector = {
            x: 0,
            y: 0
        }
        if (keysPressed.ArrowLeft) dir.x -= 1;
        if (keysPressed.ArrowRight) dir.x += 1;
        if (keysPressed.ArrowUp) dir.y += 1;
        if (keysPressed.ArrowDown) dir.y -= 1;
        const sprint = keysPressed.z;
        move(roomCode, {
            moveDir : dir,
            sprint: sprint,
        });
      }, 1000 / 60);
    return () => clearInterval(clearID);
}

export default {handleKeydown, handleKeyup, init};