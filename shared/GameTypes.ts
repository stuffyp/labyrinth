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

const magnitude = (v : Vector) : number => {
    return Math.sqrt(v.x*v.x+v.y*v.y);
}

const normalize = (v : Vector) : Vector => {
    const length = magnitude(v);
    if (length) return {
        x: v.x/length,
        y: v.y/length
    };
    return v;
}

export {magnitude, normalize};

export {Position, Player, Enemy, GameState, Hitbox};