import { Enemy, Behavior, Position } from "../../shared/GameTypes";
import { distance, moveTowards } from "../../shared/vector-util";
import { Direction, randPos } from "../game-util";

interface BasicEnemyInterface extends Enemy {
    targetPosition : Position;
}

const RADIUS = 10;
const SPEED = 3;
const COLOR = "green";
const IDLE_FRAMES = 30;

class BasicEnemy implements BasicEnemyInterface {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    targetPosition : Position;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.targetPosition = randPos();
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
    }

    update(){
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

export default BasicEnemy;