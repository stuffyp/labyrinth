import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, rotate, sub } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";
import { randInt } from "../random";
import StraightProjectile from "./StraightProjectile";


const RADIUS = 10;
const SPEED = 4;
const COLOR = "#e349ce";
const IDLE_FRAMES = 30;
const SHOOT_FRAMES = 210;
const HP = 10;
const INFINITY = 999999999;
const BULLET_SPEED = 6;

class AimEnemy implements Enemy{
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    hp = HP;
    readonly maxHp = HP;
    targetPosition : Position;
    shootFrameCount : number;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.targetPosition = randPos();
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.shootFrameCount = SHOOT_FRAMES;
    }

    update(context : UpdateContext){
        switch(this.behavior){
            case Behavior.IDLE:
                if (--this.frameCount < 0) {
                    this.behavior = Behavior.MOVE;
                    this.targetPosition = randPos();
                }
                break;
            case Behavior.MOVE:
                this.position = moveTowards(this.position, this.targetPosition, SPEED);
                if (distance(this.position, this.targetPosition) <= SPEED) {
                    this.behavior = Behavior.IDLE;
                    this.frameCount = IDLE_FRAMES;
                }
                break;
            default:
                this.behavior = Behavior.IDLE;
                this.frameCount = IDLE_FRAMES;
                break;
        }
        if (--this.shootFrameCount < 0){
            this.shootFrameCount = SHOOT_FRAMES;
            let closestTarget : Position = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2};
                let minDist : number = INFINITY;
                for (const target of context.targets) {
                    const dist = distance(this.position, target.position);
                    if (dist < minDist){
                        minDist = dist;
                        closestTarget = target.position;
                    }
                }
            const dir = normalize(sub(closestTarget, this.position));
            return {
            projectiles: [
                new StraightProjectile(this.position, BULLET_SPEED, dir),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 30)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, -30)),
            ]};
        }
        return null;
    }

}

export default AimEnemy;