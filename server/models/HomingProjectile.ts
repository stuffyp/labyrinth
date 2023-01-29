import { Position, Vector, UpdateContext, ESmartProjectile, Behavior } from "../../shared/GameTypes";
import { randDir } from "../game-util";
import {add, sub, distance, magnitude, mult, normalize} from "../../shared/vector-util";


const RADIUS = 5;
const COLOR = "yellow";
const TOP_SPEED = 4;
const ACCELERATION = 0.5;
const HOMING_FRAMES = 180;
const INFINITY = 999999999;

class HomingProjectile implements ESmartProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly topSpeed : number;
    readonly acceleration : number;
    frameCount : number;
    behavior : Behavior;
    velocity : Vector;

    constructor(position : Position, speed : number = TOP_SPEED, acceleration : number = ACCELERATION, dir ?: Vector){
        this.position = position;
        this.destroyed = false;
        this.topSpeed = speed;
        this.acceleration = acceleration;
        this.frameCount = HOMING_FRAMES;
        this.behavior = Behavior.SPAWN;
        if (dir) {
            this.velocity = mult(this.topSpeed, dir);
        } else {
            this.velocity = mult(this.topSpeed, randDir());
        }
    }

    accelerate(dir : Vector) {
        this.velocity = add(this.velocity, mult(this.acceleration, dir));
    }

    update(context : UpdateContext){
        switch(this.behavior){
            case Behavior.SPAWN:
                this.behavior = Behavior.SPECIAL;
                break;
            case Behavior.IDLE:
                break;
            case Behavior.MOVE:
                if (magnitude(this.velocity) < this.topSpeed) {
                    this.accelerate(normalize(this.velocity));
                } else {
                    this.behavior = Behavior.IDLE;
                }
                break;
            case Behavior.SPECIAL:
                let closestTarget : Position|undefined = undefined;
                let minDist : number = INFINITY;
                for (const target of context.targets) {
                    const dist = distance(this.position, target.position);
                    if (dist < minDist){
                        minDist = dist;
                        closestTarget = target.position;
                    }
                }
                if (closestTarget) {
                    this.accelerate(normalize(sub(closestTarget, this.position)));
                    if (magnitude(this.velocity) > this.topSpeed) {
                        this.velocity = mult(this.topSpeed, normalize(this.velocity));
                    }
                }
                if (--this.frameCount < 0) this.behavior = Behavior.MOVE;
                break;
            default:
                this.behavior = Behavior.MOVE;
                break;
        }
        this.position = add(this.position, this.velocity);
    }

}

export default HomingProjectile;