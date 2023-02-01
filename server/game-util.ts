import { CANVAS_WIDTH, CANVAS_HEIGHT, DOOR_WIDTH, DOOR_DEPTH } from "../shared/canvas-constants";
import {Hitbox, Position, Wall} from "../shared/GameTypes";
import { add } from "../shared/vector-util";
import { randInt } from "./random";

const inWall = (hitbox: Hitbox, wall: Wall) : boolean => {
    const h = hitbox.position;
    const w = wall.center;
    const xExtent = wall.width/2;
    const yExtent = wall.height/2;
    return h.x>w.x-xExtent && h.x<w.x+xExtent && h.y<w.y+yExtent && h.y>w.y-yExtent;
}

const BUFFER = 10;
const handleWall = (hitbox: Hitbox, wall: Wall) => {
    if (!inWall(hitbox, wall)) return;
    //console.log(hitbox.position.x, hitbox.position.y, wall.center, wall.width, wall.height);
    const left = wall.center.x-wall.width/2;
    const right = wall.center.x+wall.width/2;
    const top = wall.center.y+wall.height/2;
    const bottom = wall.center.y-wall.height/2;

    if (hitbox.position.x - left < BUFFER) hitbox.position.x = wall.center.x-wall.width/2;
    if (right-hitbox.position.x < BUFFER) hitbox.position.x = wall.center.x+wall.width/2;
    if (hitbox.position.y - bottom < BUFFER) hitbox.position.y = wall.center.y-wall.height/2;
    if (top - hitbox.position.y < BUFFER) hitbox.position.y = wall.center.y+wall.height/2;
}

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

const randDir = () : Position => {
    const randAngle = 2 * Math.PI * Math.random();
    return {
        x: Math.cos(randAngle),
        y: Math.sin(randAngle),
    };
}

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const createClosedWall = (side : Direction) : Wall => {
    let center : Position = {x : 0, y : 0};
    const leftRight = side===Direction.LEFT||side===Direction.RIGHT;
    switch(side){
        case Direction.UP:
            center = { x : CANVAS_WIDTH/2, y : CANVAS_HEIGHT + DOOR_DEPTH/2};
            break;
        case Direction.DOWN:
            center = { x : CANVAS_WIDTH/2, y : -DOOR_DEPTH/2};
            break;
        case Direction.LEFT:
            center = { x : -DOOR_DEPTH/2, y : CANVAS_HEIGHT/2};
            break;
        case Direction.RIGHT:
            center = { x : CANVAS_WIDTH + DOOR_DEPTH/2, y : CANVAS_HEIGHT/2};
            break;
        default:
            console.log("something went wrong");
            break;
    }
    return {
        center : center,
        width : leftRight ? DOOR_DEPTH : CANVAS_WIDTH+2*DOOR_DEPTH,
        height : leftRight ? CANVAS_HEIGHT+2*DOOR_DEPTH : DOOR_DEPTH,
    };
}

//true for open wall = door, false for closed = no door
const createWall  = (context : Map<Direction, boolean>) : Wall[] => {
    let ans : Wall[] = [];
    for (const [side, isDoor] of context) {
        ans = isDoor ? [...ans, ...createOpenWall(side)] : [...ans, createClosedWall(side)];
    }
    return ans;
}

const createOpenWall = (side : Direction) : Wall[] => {
    let center : Position = {x : 0, y : 0};
    const leftRight = side===Direction.LEFT||side===Direction.RIGHT;
    const centerOffset = ((leftRight ? CANVAS_HEIGHT : CANVAS_WIDTH)+2*DOOR_DEPTH+DOOR_WIDTH)/4;
    switch(side){
        case Direction.UP:
            center = { x : CANVAS_WIDTH/2, y : CANVAS_HEIGHT + DOOR_DEPTH/2};
            break;
        case Direction.DOWN:
            center = { x : CANVAS_WIDTH/2, y : -DOOR_DEPTH/2};
            break;
        case Direction.LEFT:
            center = { x : -DOOR_DEPTH/2, y : CANVAS_HEIGHT/2};
            break;
        case Direction.RIGHT:
            center = { x : CANVAS_WIDTH + DOOR_DEPTH/2, y : CANVAS_HEIGHT/2};
            break;
        default:
            console.log("something went wrong");
            break;
    }
    return [
        {
            center : leftRight ? add(center, {x:0, y:centerOffset}) : add(center, {x:centerOffset, y:0}),
            width : leftRight ? DOOR_DEPTH : 2*centerOffset-DOOR_WIDTH,
            height : leftRight ? 2*centerOffset-DOOR_WIDTH : DOOR_DEPTH,
        },
        {
            center : leftRight ? add(center, {x:0, y:-centerOffset}) : add(center, {x:-centerOffset, y:0}),
            width : leftRight ? DOOR_DEPTH : 2*centerOffset-DOOR_WIDTH,
            height : leftRight ? 2*centerOffset-DOOR_WIDTH : DOOR_DEPTH,
        }
    ];
}

export {collides, randPos, randDir, inWall, handleWall, Direction, createWall};