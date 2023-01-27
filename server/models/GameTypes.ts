import { User } from "./User";

type Position  = {
    x : number,
    y: number,
}

type Player = {
    position: Position,
    radius: number,
    color: string,
}

type Enemy = {
    position: Position,
    radius: number,
    color: string,
}

type GameState  = {
    players : {[key : string] : Player}, //user id to player
    enemies: Enemy[],
}

export {Position, Player, Enemy, GameState};