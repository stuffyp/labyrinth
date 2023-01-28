import { User } from "./models/User";
import {Position, Player, Enemy, GameState, Vector, EnemyBehavior} from "../shared/GameTypes";
import { randInt } from "./random";
import { collides, randPos} from "./game-util";
import {normalize, add, mult} from "../shared/vector-util";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../shared/canvas-constants";
import BasicEnemy from "./models/BasicEnemy";

const gameStateMap : Map<string, GameState> = new Map<string, GameState>();

const setupGame = (roomCode: string, users: User[]) => {
    const newGameState : GameState = {players: {}, enemies: []};
    for (const user of users){
        newGameState.players[user._id] = {
            position : randPos(), 
            radius: 10, 
            color: "red",
            moveInput : {x : 0, y: 0}
        };
    }
    //temp
    for (let i = 0; i<10; i++){
        newGameState.enemies.push(new BasicEnemy());
    }
    gameStateMap.set(roomCode, newGameState);
}

const ENEMY_SPEED = 1;
const PLAYER_SPEED = 2;
const updateGameState = (roomCode: string) => {
    const gameState = gameStateMap.get(roomCode);
    if(!gameState) return;
    for (const enemy of gameState.enemies){
        enemy.update();
    }
    for (const key in gameState.players){
        const player = gameState.players[key];
        player.position = add(player.position, 
            mult(PLAYER_SPEED, normalize(player.moveInput)));
        clampBounds(player.position);
    }
    checkCollisions(gameState);
}

const checkCollisions = (gameState: GameState) => {
    for (const key in gameState.players){
        const player = gameState.players[key];
        for (const enemy of gameState.enemies){
            if (collides(player, enemy)){
                delete gameState.players[key];
            }
        }
    }
}

const clampBounds = (position: Position) => {
    if (position.x < 0) position.x = 0;
    if (position.x > CANVAS_WIDTH) position.x = CANVAS_WIDTH;
    if (position.y < 0) position.y = 0;
    if (position.y > CANVAS_HEIGHT) position.y = CANVAS_HEIGHT;
}

//TODO sync with the gameplay cycle
const movePlayer = (roomCode: string, user: User, dir: Vector) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  if (!gameState.players[user._id]) return;
  gameState.players[user._id].moveInput = dir;
  /*let desiredPosition : Position = {
    x: gameState.players[user._id].position.x,
    y: gameState.players[user._id].position.y,
  };
  desiredPosition = add(desiredPosition, mult(PLAYER_SPEED, normalize(dir)));
  gameState.players[user._id].position = desiredPosition;*/
}

const getGameState = (roomCode: string) => {
    const gameState = gameStateMap.get(roomCode);
    if (!gameState) return;
    //gameState.enemies = gameState.enemies.map((enemy)=>Object.assign({}, enemy));
    return gameState;
}

export {setupGame, getGameState, updateGameState, movePlayer};