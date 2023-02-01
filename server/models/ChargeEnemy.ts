import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, UpdateContext, Vector } from "../../shared/GameTypes";
import { add, distance, moveTowards, mult, normalize, sub } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";


const RADIUS = 15;
const SPEED = 5;
const COLOR = "#20c98e";
const IDLE_FRAMES = 60;
const MIN_CHARGE_FRAMES = 120;
const HP = 40;
const INFINITY = 999999999;

class ChargeEnemy implements Enemy{
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    hp = HP;
    readonly maxHp = HP;
    chargeDir : Vector;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.chargeDir = {x : 1, y: 0};
    }

    update(context : UpdateContext){
        switch(this.behavior){
            case Behavior.IDLE:
                if (--this.frameCount < 0) {
                    this.behavior = Behavior.MOVE;
                    this.frameCount = MIN_CHARGE_FRAMES;
                    let closestTarget : Position = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2};
                    let minDist : number = INFINITY;
                    for (const target of context.targets) {
                        const dist = distance(this.position, target.position);
                        if (dist < minDist){
                            minDist = dist;
                            closestTarget = target.position;
                        }
                    }
                    this.chargeDir = normalize(sub(closestTarget, this.position));
                }
                break;
            case Behavior.MOVE:
                this.position = add(this.position, mult(SPEED, this.chargeDir));
                let onWall = false;
                if (this.position.x < 0){
                    this.position.x = 0;
                    onWall = true;
                }
                if (this.position.y < 0){
                    this.position.y = 0;
                    onWall = true;
                }
                if (this.position.x > CANVAS_WIDTH){
                    this.position.x = CANVAS_WIDTH;
                    onWall = true;
                }
                if (this.position.y > CANVAS_HEIGHT){
                    this.position.y = CANVAS_HEIGHT;
                    onWall = true;
                }
                if (onWall && this.frameCount <= 0) {
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
        return null;
    }

}

export default ChargeEnemy;