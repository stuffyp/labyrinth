import { CANVAS_WIDTH } from "../../shared/canvas-constants";
import { Enemy, Behavior, Position, EnemyProjectile} from "../../shared/GameTypes";
import { distance, moveTowards } from "../../shared/vector-util";
import { randPos, randDir } from "../game-util";

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
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    targetPosition : Position;

    constructor(){
        this.position = randPos();
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
                    return([{
                        position: this.position,
                        radius: 5,
                        dir: randDir(),
                        speed: 5,
                    }]);
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
        return [];
    }

}

export default ShooterEnemy;