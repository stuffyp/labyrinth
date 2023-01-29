import { User } from "./models/User";
import {Position, Hitbox, GameState, Vector, UpdateReturn, EnemyProjectile} from "../shared/GameTypes";
import { collides, randPos} from "./game-util";
import {normalize, add, mult} from "../shared/vector-util";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../shared/canvas-constants";
import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";

const gameStateMap : Map<string, GameState> = new Map<string, GameState>();

const setupGame = (roomCode: string, users: User[]) => {
    const newGameState : GameState = {players: {}, enemies: [], enemyProjectiles: []};
    for (const user of users){
        newGameState.players[user._id] = {
            position : randPos(),
            destroyed : false, 
            radius: 10, 
            color: "red",
            moveInput : {x : 0, y: 0}
        };
    }
    //temp
    for (let i = 0; i<10; i++){
        newGameState.enemies.push(new ShooterEnemy());
    }
    gameStateMap.set(roomCode, newGameState);
}

//const ENEMY_SPEED = 1;
const PLAYER_SPEED = 2;
const updateGameState = (roomCode: string) => {
    const gameState = gameStateMap.get(roomCode);
    if(!gameState) return;
    for (const enemy of gameState.enemies){
        if (enemy.destroyed) continue;
        const updateVal : UpdateReturn = enemy.update();
        if (updateVal) gameState.enemyProjectiles.push(...updateVal.projectiles);
    }
    for (const key in gameState.players){
        const player = gameState.players[key];
        if (player.destroyed) continue;
        player.position = add(player.position, 
            mult(PLAYER_SPEED, normalize(player.moveInput)));
        clampBounds(player.position);
    }
    for (const projectile of gameState.enemyProjectiles) {
        if (projectile.destroyed) continue;
        projectile.update();
        if (checkOutOfBounds(projectile)) projectile.destroyed = true;
    }
    checkCollisions(gameState);
}

const cleanUpGameState = (roomCode : string) => {
    const gameState = gameStateMap.get(roomCode);
    if(!gameState) return;
    let projectiles : EnemyProjectile[] = gameState.enemyProjectiles;
    gameState.enemyProjectiles = projectiles.filter((x) => !x.destroyed);
    for (const key in gameState.players) {
        if (gameState.players[key].destroyed) delete gameState.players[key];
    }
}

const checkCollisions = (gameState: GameState) => {
    for (const key in gameState.players){
        const player = gameState.players[key];
        for (const enemy of gameState.enemies){
            if (player.destroyed) break;
            player.destroyed = collides(player, enemy);
        }
        for (const projectile of gameState.enemyProjectiles){
            if (player.destroyed) break;
            player.destroyed = collides(player, projectile);
        }
    }

}

const clampBounds = (position: Position) => {
    if (position.x < 0) position.x = 0;
    if (position.x > CANVAS_WIDTH) position.x = CANVAS_WIDTH;
    if (position.y < 0) position.y = 0;
    if (position.y > CANVAS_HEIGHT) position.y = CANVAS_HEIGHT;
}

const checkOutOfBounds = (hitbox: Hitbox) : boolean => {
    const pos = hitbox.position;
    return pos.x<0 || pos.x>CANVAS_WIDTH || pos.y<0 || pos.y>CANVAS_HEIGHT;
}

//TODO sync with the gameplay cycle
const movePlayer = (roomCode: string, user: User, dir: Vector) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  if (!gameState.players[user._id]) return;
  gameState.players[user._id].moveInput = dir;
}

const getGameState = (roomCode: string) => {
    const gameState = gameStateMap.get(roomCode);
    if (!gameState) return;
    return gameState;
}

export {setupGame, getGameState, updateGameState, cleanUpGameState, movePlayer};