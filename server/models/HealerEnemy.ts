import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, rotate, sub } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";
import { randInt } from "../random";
import HomingProjectile from "./HomingProjectile";
import StraightProjectile from "./StraightProjectile";


const RADIUS = 12;
const SPEED = 3;
const COLOR = "#ee6c4d";
const IDLE_FRAMES = 30;
const SHOOT_FRAMES = 160;
const HP = 24;
const HEAL = 3;

class HealerEnemy implements Enemy{
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
            this.hp += HEAL;
            if (this.hp > this.maxHp) this.hp = this.maxHp;
            return {
            projectiles: [
                new HomingProjectile(this.position, 3),
                new HomingProjectile(this.position, 4),
            ]};
        }
        return null;
    }

}

export default HealerEnemy;