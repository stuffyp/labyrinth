import { AllyProjectile, Position, Vector } from "../../shared/GameTypes";
import {add, mult} from "../../shared/vector-util";

const RADIUS = 5;
const COLOR = "pink";
const SPEED = 15;
const DAMAGE = 1;
class StraightAllyProjectile implements AllyProjectile {
    position : Position;
    readonly radius = RADIUS;
    destroyed : boolean;
    readonly color = COLOR;
    readonly dir : Vector;
    readonly speed : number;
    readonly damage : number;

    constructor(position : Position, dir : Vector, speed : number = SPEED, damage : number = DAMAGE){
        this.position = position;
        this.destroyed = false;
        this.speed = speed;
        this.dir = dir;
        this.damage = damage;
    }

    update(){
        this.position = add(this.position, mult(this.speed, this.dir));
    }

}

export default StraightAllyProjectile;