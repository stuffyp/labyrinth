import { AllyProjectile, Position, Vector } from "../../shared/GameTypes";
import {add, mult} from "../../shared/vector-util";

const RADIUS = 5;
const COLOR = "blue";
const SPEED = 4;
class StraightAllyProjectile implements AllyProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly dir : Vector;
    readonly speed : number;

    constructor(position : Position, speed : number = SPEED, dir : Vector){
        this.position = position;
        this.destroyed = false;
        this.speed = speed;
        this.dir = dir;
    }

    update(){
        this.position = add(this.position, mult(this.speed, this.dir));
    }

}

export default StraightAllyProjectile;