import { Enemy, Behavior, Position, UpdateContext } from "../../shared/GameTypes";
import { distance, moveTowards } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";

const RADIUS = 15;
const SPEED = 2;
const COLOR = "#5e60ce";
const IDLE_FRAMES = 50;
const HP = 72;

class TankEnemy implements Enemy {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    targetPosition : Position;
    hp = HP;
    readonly maxHp = HP;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.targetPosition = randPos();
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
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
        return null;
    }

}

export default TankEnemy;