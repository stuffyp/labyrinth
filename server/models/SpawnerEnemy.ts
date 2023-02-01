import { Enemy, Behavior, Position} from "../../shared/GameTypes";
import { add, distance, moveTowards } from "../../shared/vector-util";
import { Direction, randPos} from "../game-util";
import ChaserEnemy from "./ChaserEnemy";
import HomingProjectile from "./HomingProjectile";

const RADIUS = 15;
const SPEED = 3;
const COLOR = "#ccff33";
const IDLE_FRAMES = 90;
const HP = 16;
const SPAWN_FRAMES = 300;

class SpawnerEnemy implements Enemy {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    frameCount : number;
    behavior : Behavior;
    targetPosition : Position;
    hp = HP;
    readonly maxHp = HP;
    spawnFrameCount : number;

    constructor(side ?: Direction){
        this.destroyed = false;
        this.position = randPos(side);
        this.targetPosition = randPos();
        this.behavior = Behavior.SPAWN;
        this.frameCount = IDLE_FRAMES;
        this.spawnFrameCount = SPAWN_FRAMES;
    }

    update(){
        switch(this.behavior){
            case Behavior.IDLE:
                if (--this.frameCount < 0) {
                    this.targetPosition = randPos();
                    this.behavior = Behavior.MOVE;
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
        if (--this.spawnFrameCount < 0) {
            this.spawnFrameCount = SPAWN_FRAMES;
            return {
                projectiles: [],
                enemies: [
                    new ChaserEnemy({x : this.position.x-RADIUS, y: this.position.y}, 3),
                    new ChaserEnemy({x : this.position.x+RADIUS, y: this.position.y}, 5)
                ],
            };
        }
        return null;
    }

}

export default SpawnerEnemy;