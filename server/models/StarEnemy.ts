import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, rotate, sub } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";
import { randInt } from "../random";
import StraightProjectile from "./StraightProjectile";


const RADIUS = 12;
const SPEED = 3;
const COLOR = "#e9edc9";
const IDLE_FRAMES = 30;
const SHOOT_FRAMES = 60;
const HP = 16;
const INFINITY = 999999999;
const BULLET_SPEED = 3;

class StarEnemy implements Enemy{
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
    shootAngle : number;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.targetPosition = randPos();
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.shootFrameCount = SHOOT_FRAMES;
        this.shootAngle = 360*Math.random();
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
            const dir = {x : Math.cos(this.shootAngle), y : Math.sin(this.shootAngle)};
            this.shootAngle += 15;
            return {
            projectiles: [
                new StraightProjectile(this.position, BULLET_SPEED, dir),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 72)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 144)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 216)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 288)),
            ]};
        }
        return null;
    }

}

export default StarEnemy;