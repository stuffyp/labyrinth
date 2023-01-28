import { User } from "../server/models/User";

type Vector = {
    x: number,
    y : number,
}

type Position  = Vector

type Player = Hitbox & {
    color: string,
    moveInput : Vector,
}

type EnemyInfo = Hitbox & {
    color: string,
}

enum Behavior {
    IDLE,
    MOVE,
    ATTACK,
    SPAWN,//reserved for when enemy spawns
    DESPAWN,//reserved for when enemy despawns
    SPECIAL,
}

interface EnemyBehavior {
    frameCount : number,
    behavior : Behavior,
    update : ()=>void,
}

interface Enemy extends EnemyInfo, EnemyBehavior{
    
}

type Hitbox = {
    position: Position;
    radius: number;
}

type GameState  = {
    players : {[key : string] : Player}, //user id to player
    enemies: Enemy[],
}

export {EnemyBehavior, Behavior} ;
export {Vector, Position, Player, Enemy, GameState, Hitbox};