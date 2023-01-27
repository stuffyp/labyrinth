import { User } from "./models/User";
import {Position, Player, Enemy, GameState, Vector} from "../shared/GameTypes";
import { randInt } from "./random";
import { collides} from "./game-util";
import {normalize, add, mult} from "../shared/vector-util";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const gameStateMap : Map<string, GameState> = new Map<string, GameState>();

const setupGame = (roomCode: string, users: User[]) => {
    const newGameState : GameState = {players: {}, enemies: []};
    for (const user of users){
        newGameState.players[user._id] = {
            position : {x: randInt(0, CANVAS_WIDTH), y: randInt(0, CANVAS_HEIGHT)}, 
            radius: 10, 
            color: "red"
        };
    }
    //temp
    for (let i = 0; i<3; i++){
        newGameState.enemies.push({
            position: {x: randInt(0, CANVAS_WIDTH), y: randInt(0, CANVAS_HEIGHT)},
            radius: 10,
            color: "blue"
        });
    }
    gameStateMap.set(roomCode, newGameState);
}

const updateGameState = (roomCode: string) => {
    const gameState = gameStateMap.get(roomCode);
    if(!gameState) return;
    for (const enemy of gameState.enemies){
        enemy.position.x -= 1;
        if(enemy.position.x<0){
            enemy.position.x = CANVAS_WIDTH;
        }
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

const PLAYER_SPEED = 2;
const movePlayer = (roomCode: string, user: User, dir: Vector) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  if (!gameState.players[user._id]) return;
  let desiredPosition : Position = {
    x: gameState.players[user._id].position.x,
    y: gameState.players[user._id].position.y,
  };
  desiredPosition = add(desiredPosition, mult(PLAYER_SPEED, normalize(dir)));
  gameState.players[user._id].position = desiredPosition;
}

const getGameState = (roomCode: string) => {
    return gameStateMap.get(roomCode);
}

export {CANVAS_WIDTH, CANVAS_HEIGHT};
export {setupGame, getGameState, updateGameState, movePlayer};