import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector, EnemyProjectile } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, rotate, sub } from "../../shared/vector-util";
import { Direction, randDir, randPos } from "../game-util";
import HomingProjectile from "./HomingProjectile";
import StraightProjectile from "./StraightProjectile";


const RADIUS = 24;
const SPEED = 2;
const CHARGE_SPEED = 8;
const COLOR = "#8ecae6";
const IDLE_FRAMES = 270;
const CHARGE_FRAMES = 50;
const PAUSE_FRAMES = 30;
const HP = 600;
const SHOOT_FRAMES = 30;
const INFINITY = 999999999;
const BULLET_SPEED = 3;

class GolemBoss implements Enemy{
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    hp = HP;
    readonly maxHp = HP;
    chargeDir : Vector;
    shootFrameCount : number;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.chargeDir = {x : 1, y: 0};
        this.shootFrameCount = SHOOT_FRAMES;
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
        switch(this.behavior){
            case Behavior.IDLE:
                if (--this.frameCount < 0) {
                    this.behavior = Behavior.TRANSITION;
                    this.frameCount = PAUSE_FRAMES;
                }
                this.position = moveTowards(this.position, closestTarget, SPEED);
                break;
            case Behavior.TRANSITION:
                if (--this.frameCount < 0) {
                    this.behavior = Behavior.MOVE;
                    this.frameCount = CHARGE_FRAMES;
                    this.chargeDir = normalize(sub(closestTarget, this.position));
                }
                break;
            case Behavior.MOVE:
                this.position = add(this.position, mult(CHARGE_SPEED, this.chargeDir));
                if (this.position.x < 0){
                    this.position.x = 0;
                }
                if (this.position.y < 0){
                    this.position.y = 0;
                }
                if (this.position.x > CANVAS_WIDTH){
                    this.position.x = CANVAS_WIDTH;
                }
                if (this.position.y > CANVAS_HEIGHT){
                    this.position.y = CANVAS_HEIGHT;
                }
                if (this.frameCount <= 0) {
                    this.behavior = Behavior.IDLE;
                    this.frameCount = IDLE_FRAMES;
                }
                this.frameCount--;
                break;
            default:
                this.behavior = Behavior.IDLE;
                this.frameCount = IDLE_FRAMES;
                break;
        }
        if (--this.shootFrameCount < 0){
            this.shootFrameCount = SHOOT_FRAMES;
            const dir = randDir();
            const projectiles : EnemyProjectile[] = [
                new StraightProjectile(this.position, BULLET_SPEED, dir),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 72)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 144)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 216)),
                new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 288)),
            ];
            if (this.hp*2<this.maxHp) projectiles.push(new HomingProjectile(this.position));
            return {projectiles: projectiles};
        }
        return null;
    }

}

export default GolemBoss;