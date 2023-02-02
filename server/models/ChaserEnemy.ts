import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, sub } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";
import { randInt } from "../random";


const RADIUS = 12;
const SPEED = 4;
const COLOR = "#bb9457";
const HP = 45;
const HP_VARIANCE = 10;
const INFINITY = 999999999;
const DECAY_FRAMES = 4;

class ChaserEnemy implements Enemy{
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    hp : number;
    readonly maxHp;
    readonly speed : number;

    constructor(position : Position, speed : number = SPEED){
        this.destroyed = false;
        this.position = position;
        this.behavior = Behavior.SPAWN;
        this.frameCount = DECAY_FRAMES;
        this.speed = speed;
        this.maxHp = HP+randInt(-HP_VARIANCE, HP_VARIANCE);
        this.hp = this.maxHp;
    }

    update(context : UpdateContext){
        let closestTarget : Position = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2};
        let minDist : number = INFINITY;
        for (const target of context.targets) {
            const dist = distance(this.position, target.position);
            if (dist < minDist){
                minDist = dist;
                closestTarget = target.position;
            }
        }
        this.position = moveTowards(this.position, closestTarget, this.speed);
        if (--this.frameCount <= 0){
            this.frameCount = DECAY_FRAMES;
            this.hp -= 1;
            if (this.hp <= 0) this.destroyed = true;
        }
        return null;
    }

}

export default ChaserEnemy;