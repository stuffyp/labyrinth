import { getPositionOfLineAndCharacter } from "typescript";
import { User } from "./User";

type Position  = {
    x : number,
    y: number,
}

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

export {Position, Player, Enemy, GameState, Hitbox};