import { CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, EnemyProjectile} from "../../shared/GameTypes";
import { distance, moveTowards } from "../../shared/vector-util";
import { randPos, randDir } from "../game-util";
import StraightProjectile from "./StraightProjectile";

interface ShooterEnemyInterface extends Enemy {
    targetPosition : Position;
}

const RADIUS = 10;
const SPEED = 3;
const COLOR = "blue";
const IDLE_FRAMES = 30;

class ShooterEnemy implements ShooterEnemyInterface {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    targetPosition : Position;

    constructor(){
        this.destroyed = false;
        this.position = randPos();
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
                    projectiles: [new StraightProjectile(this.position)],
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

export default ShooterEnemy;