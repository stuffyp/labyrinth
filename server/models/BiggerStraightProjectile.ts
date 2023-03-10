import { EnemyProjectile, Position, Vector } from "../../shared/GameTypes";
import { randDir } from "../game-util";
import {add, mult} from "../../shared/vector-util";


const RADIUS = 12;
const COLOR = "#b9faf8";
const SPEED = 4;
const DAMAGE = 2;

class BiggerStraightProjectile implements EnemyProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly dir : Vector;
    readonly speed : number;
    readonly damage : number = DAMAGE;

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

export default BiggerStraightProjectile;