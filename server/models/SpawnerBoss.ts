import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector, EnemyProjectile } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, rotate, sub } from "../../shared/vector-util";
import { Direction, randDir, randPos } from "../game-util";
import BasicEnemy from "./BasicEnemy";
import HomingProjectile from "./HomingProjectile";
import StraightProjectile from "./StraightProjectile";


const RADIUS = 24;
const SPEED = 2;
const CHARGE_SPEED = 8;
const COLOR = "#ccff33";
const IDLE_FRAMES = 270;
const CHARGE_FRAMES = 50;
const PAUSE_FRAMES = 30;
const HP = 750;
const SHOOT_FRAMES = 15;
const INFINITY = 999999999;
const BULLET_SPEED = 3;
const SHOOT_AMOUNT = 15;

class SpawnerBoss implements Enemy{
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
    actionCounter : number;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.chargeDir = {x : 1, y: 0};
        this.shootFrameCount = SHOOT_FRAMES;
        this.actionCounter = 0;
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
                    this.behavior = Behavior.ATTACK;
                    this.shootFrameCount = SHOOT_FRAMES;
                    this.actionCounter = 0;
                }
                this.position = moveTowards(this.position, closestTarget, SPEED);
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
                    this.actionCounter += 1;
                    this.frameCount = CHARGE_FRAMES;
                    this.chargeDir = normalize(sub(closestTarget, this.position));
                    if (this.actionCounter >= 3) {
                        this.behavior = Behavior.IDLE;
                        this.frameCount = IDLE_FRAMES;
                    }
                    if (this.hp*2<this.maxHp) {
                        const dir = randDir();
                        return {projectiles : [
                            new StraightProjectile(this.position, BULLET_SPEED, dir),
                            new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 60)),
                            new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 120)),
                            new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 180)),
                            new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 240)),
                            new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 300)),
                        ]};
                    }
                }
                this.frameCount--;
                break;
            case Behavior.TRANSITION:
                if (--this.frameCount < 0){
                    this.behavior = Behavior.MOVE;
                    this.frameCount = CHARGE_FRAMES;
                    this.chargeDir = normalize(sub(closestTarget, this.position));
                }
                break;
            case Behavior.ATTACK:
                if (this.actionCounter > SHOOT_AMOUNT) {
                    this.actionCounter = 0;
                    this.behavior = Behavior.TRANSITION;
                    this.frameCount = PAUSE_FRAMES;

                    const enemies : Enemy[] = [];
                    for (let i = 0; i<4; i++){
                        const enemy = new BasicEnemy();
                        enemy.position = add(this.position, {
                            x: RADIUS*Math.cos(i*Math.PI/2), 
                            y: RADIUS*Math.sin(i*Math.PI/2)
                        });
                        enemies.push(enemy);
                    }
                    return {projectiles: [], enemies: enemies};
                }
                if (--this.shootFrameCount < 0){
                    this.shootFrameCount = SHOOT_FRAMES;
                    const dir = randDir();
                    const projectiles : EnemyProjectile[] = this.actionCounter%3===0 ? [
                        new StraightProjectile(this.position, 2*BULLET_SPEED, dir),
                        new StraightProjectile(this.position, 2*BULLET_SPEED, rotate(dir, 120)),
                        new StraightProjectile(this.position, 2*BULLET_SPEED, rotate(dir, 240)),
                    ] : [
                        new StraightProjectile(this.position, BULLET_SPEED, dir),
                        new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 60)),
                        new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 120)),
                        new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 180)),
                        new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 240)),
                        new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, 300)),
                    ];
                    this.actionCounter += 1;
                    return {projectiles: projectiles};
                }
                break;
            default:
                this.behavior = Behavior.IDLE;
                this.frameCount = IDLE_FRAMES;
                break;
        }
        
        return null;
    }

}

export default SpawnerBoss;