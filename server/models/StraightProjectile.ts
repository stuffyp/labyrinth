import { EnemyProjectile, Position, Vector } from "../../shared/GameTypes";
import { randPos, randDir } from "../game-util";
import {add, mult} from "../../shared/vector-util";


const RADIUS = 5;
const COLOR = "green";
const SPEED = 4;
class StraightProjectile implements EnemyProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly dir : Vector;
    readonly speed : number;

    constructor(position : Position, speed : number = SPEED, dir ?: Vector){
        this.position = position;
        this.destroyed = false;
        this.speed = speed;
        if (dir) {
            this.dir = dir;
        } else {
            this.dir = randDir();
        }
    }

    update(){
        this.position = add(this.position, mult(this.speed, this.dir));
    }

}

export default StraightProjectile;