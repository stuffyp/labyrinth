import { User } from "../server/models/User";

type Vector = {
    x: number,
    y : number,
}

type Position  = Vector

type Player = Hitbox & {
    color: string,
}

type Enemy = Hitbox & {
    color: string,
}

type Hitbox = {
    position: Position;
    radius: number;
}

type GameState  = {
    players : {[key : string] : Player}, //user id to player
    enemies: Enemy[],
}

export {Vector, Position, Player, Enemy, GameState, Hitbox};