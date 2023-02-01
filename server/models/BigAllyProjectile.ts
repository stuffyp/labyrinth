import { AllyProjectile, Position, Vector } from "../../shared/GameTypes";
import {add, mult} from "../../shared/vector-util";

const RADIUS = 8;
const COLOR = "#f08080";
const SPEED = 16;
const DAMAGE = 5;
class BigAllyProjectile implements AllyProjectile {
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

export default BigAllyProjectile;