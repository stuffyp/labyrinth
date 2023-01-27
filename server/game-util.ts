import {Hitbox} from "../shared/GameTypes";

const collides = (h1 : Hitbox, h2: Hitbox) : boolean => {
    const dx = h1.position.x-h2.position.x;
    const dy = h1.position.y-h2.position.y;
    const radiusSum = h1.radius+h2.radius;
    return dx*dx+dy*dy<radiusSum*radiusSum;
}

export {collides};