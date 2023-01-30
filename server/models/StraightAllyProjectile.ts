import { AllyProjectile, Position, Vector } from "../../shared/GameTypes";
import {add, mult} from "../../shared/vector-util";

const RADIUS = 5;
const COLOR = "pink";
const SPEED = 15;
class StraightAllyProjectile implements AllyProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly dir : Vector;
    readonly speed : number;

    constructor(position : Position, dir : Vector, speed : number = SPEED){
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