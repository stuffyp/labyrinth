import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../shared/canvas-constants";
import {Hitbox, Position} from "../shared/GameTypes";
import { randInt } from "./random";

const collides = (h1 : Hitbox, h2: Hitbox) : boolean => {
    const dx = h1.position.x-h2.position.x;
    const dy = h1.position.y-h2.position.y;
    const radiusSum = h1.radius+h2.radius;
    return dx*dx+dy*dy<radiusSum*radiusSum;
}

const randPos = () : Position => {
    return {
        x: randInt(0, CANVAS_WIDTH),
        y: randInt(0, CANVAS_HEIGHT)
    };
}

export {collides, randPos};