import { Enemy, Behavior, Position} from "../../shared/GameTypes";
import { distance, moveTowards } from "../../shared/vector-util";
import { Direction, randPos} from "../game-util";
import HomingProjectile from "./HomingProjectile";

const RADIUS = 10;
const SPEED = 3;
const COLOR = "blue";
const IDLE_FRAMES = 30;
const HP = 8;

class HomingShooterEnemy implements Enemy {
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

    update(){
        switch(this.behavior){
            case Behavior.IDLE:
                if (--this.frameCount < 0) {
                    this.behavior = Behavior.ATTACK;
                }
                break;
            case Behavior.ATTACK:
                this.targetPosition = randPos();
                this.behavior = Behavior.MOVE;
                return {
                    projectiles: [new HomingProjectile(this.position)],
                };
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

export default HomingShooterEnemy;