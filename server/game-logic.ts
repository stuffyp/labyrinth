interface GameState {

}

const gameStateMap : Map<string, GameState> = new Map<string, GameState>();

const updateGameState = (roomCode: string) => {

}

const getGameState = (roomCode: string) => {
    return gameStateMap.get(roomCode);
}

export default {getGameState, updateGameState};