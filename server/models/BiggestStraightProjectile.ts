import { EnemyProjectile, Position, Vector } from "../../shared/GameTypes";
import { randDir } from "../game-util";
import {add, mult} from "../../shared/vector-util";


const RADIUS = 16;
const COLOR = "#ffb627";
const SPEED = 2;
const DAMAGE = 4;

class BiggestStraightProjectile implements EnemyProjectile {
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

export default BiggestStraightProjectile;