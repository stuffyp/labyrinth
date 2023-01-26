import { User } from "./models/User";
import {Position, Player, Enemy, GameState} from "./models/GameTypes";
import { randInt } from "./random";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const gameStateMap : Map<string, GameState> = new Map<string, GameState>();

const setupGame = (roomCode: string, users: User[]) => {
    const newGameState : GameState = {players: [], enemies: []};
    for (const user of users){
        newGameState.players.push({
            user: user, 
            position : {x: randInt(0, CANVAS_WIDTH), y: randInt(0, CANVAS_HEIGHT)}, 
            radius: 10, 
            color: "red"
        });
    }
    gameStateMap.set(roomCode, newGameState);
}

const updateGameState = (roomCode: string) => {
    
}

const getGameState = (roomCode: string) => {
    return gameStateMap.get(roomCode);
}

export {CANVAS_WIDTH, CANVAS_HEIGHT};
export {setupGame, getGameState, updateGameState};