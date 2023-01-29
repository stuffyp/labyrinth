import { move, shoot } from "./client-socket";
import { Vector } from "../../shared/GameTypes";

const keysPressed = {
    a: false,
    d: false,
    s: false,
    w: false,
    ' ': false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowUp: false,
};

const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    keysPressed[e.key] = true;
};

const handleKeyup = (e: KeyboardEvent) => {
    keysPressed[e.key] = false;
};

const init = (roomCode : string) : ()=>void => {
    const moveLoop = setInterval(() => {
        const dir : Vector = {
            x: 0,
            y: 0
        }
        if (keysPressed.a) dir.x -= 1;
        if (keysPressed.d) dir.x += 1;
        if (keysPressed.s) dir.y -= 1;
        if (keysPressed.w) dir.y += 1;
        const sprint = keysPressed[' '];
        move(roomCode, {
            moveDir : dir,
            sprint: sprint,
        });
      }, 1000 / 60);
    const shootLoop = setInterval(() =>{
        const shootDir : Vector = {
            x: 0,
            y: 0
        }
        if (keysPressed.ArrowLeft) shootDir.x -= 1;
        if (keysPressed.ArrowRight) shootDir.x += 1;
        if (keysPressed.ArrowDown) shootDir.y -= 1;
        if (keysPressed.ArrowUp) shootDir.y += 1;
        if (shootDir.x !=0 || shootDir.y !=0){
            shoot(roomCode, {
                shootDir : shootDir,
            });
        }
    }, 1000 / 10)
    return () => {
        clearInterval(moveLoop);
        clearInterval(shootLoop);
    };
}

export default {handleKeydown, handleKeyup, init};