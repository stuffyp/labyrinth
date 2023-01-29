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

type UpdateReturn = null | {
    projectiles : EnemyProjectile[];
}

interface EnemyBehavior {
    frameCount : number,
    behavior : Behavior,
    update : ()=>UpdateReturn,
}

interface Enemy extends EnemyInfo, EnemyBehavior{
    
}

interface EnemyProjectile extends Hitbox {
    color : string,
    update : ()=>void,
}

type Hitbox = {
    position: Position;
    radius: number;
    destroyed : boolean;
}

type GameState  = {
    players : {[key : string] : Player}, //user id to player
    enemies: Enemy[],
    enemyProjectiles: EnemyProjectile[],
}

export {EnemyBehavior, Behavior, EnemyProjectile, UpdateReturn} ;
export {Vector, Position, Player, Enemy, GameState, Hitbox};