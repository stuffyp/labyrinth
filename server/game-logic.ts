import { User } from "./models/User";
import {Position, Player, Enemy, GameState} from "./models/GameTypes";
import { randInt } from "./random";

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
    gameStateMap.set(roomCode, newGameState);
}

const updateGameState = (roomCode: string) => {
    
}

const movePlayer = (roomCode: string, user: User, dir: string) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  console.log(gameState);
  console.log(user._id);
  const desiredPosition = {
    x: gameState.players[user._id].position.x,
    y: gameState.players[user._id].position.y,
  };
  if (dir === "up") {
    desiredPosition.y += 10;
  } else if (dir === "down") {
    desiredPosition.y -= 10;
  } else if (dir === "left") {
    desiredPosition.x -= 10;
  } else if (dir === "right") {
    desiredPosition.x += 10;
  }
  gameState.players[user._id].position = desiredPosition;
}

const getGameState = (roomCode: string) => {
    return gameStateMap.get(roomCode);
}

export {CANVAS_WIDTH, CANVAS_HEIGHT};
export {setupGame, getGameState, updateGameState, movePlayer};