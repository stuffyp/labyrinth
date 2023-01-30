import { Vector } from "../../shared/GameTypes";
import { InputType } from "../../shared/InputType";

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

const getInput = () : InputType => {
    const dir : Vector = {
        x: 0,
        y: 0
    }
    if (keysPressed.a) dir.x -= 1;
    if (keysPressed.d) dir.x += 1;
    if (keysPressed.s) dir.y -= 1;
    if (keysPressed.w) dir.y += 1;
    const sprint = keysPressed[' '];
    const shootDir : Vector = {
        x: 0,
        y: 0
    }
    if (keysPressed.ArrowLeft) shootDir.x -= 1;
    if (keysPressed.ArrowRight) shootDir.x += 1;
    if (keysPressed.ArrowDown) shootDir.y -= 1;
    if (keysPressed.ArrowUp) shootDir.y += 1;
    return {
        moveDir : dir,
        sprint : sprint,
        shootDir : shootDir,
    };
}

export default {handleKeydown, handleKeyup, getInput};