import { User } from "./User";

type Position  = {
    x : number,
    y: number,
}

type Player = {
    user: User,
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
    players : Player[],
    enemies: Enemy[],
}

export {Position, Player, Enemy, GameState};