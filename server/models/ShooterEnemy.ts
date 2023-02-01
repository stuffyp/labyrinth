import { Enemy, Behavior, Position, EnemyProjectile} from "../../shared/GameTypes";
import { distance, moveTowards, rotate } from "../../shared/vector-util";
import { randPos, randDir, Direction } from "../game-util";
import StraightProjectile from "./StraightProjectile";

interface ShooterEnemyInterface extends Enemy {
    targetPosition : Position;
}

const RADIUS = 10;
const SPEED = 3;
const COLOR = "purple";
const IDLE_FRAMES = 30;
const HP = 5;

const BULLET_SPEED = 5;

class ShooterEnemy implements ShooterEnemyInterface {
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
                const projectiles : EnemyProjectile[] = [];
                const dir = randDir();
                for (let i = 0; i<360; i+=15) {
                    projectiles.push(new StraightProjectile(this.position, BULLET_SPEED, rotate(dir, i)));
                }
                if (projectiles) return { projectiles : projectiles};
                return null;
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