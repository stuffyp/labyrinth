import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";
import HomingShooterEnemy from "./models/HomingShooterEnemy";
import { Enemy } from "../shared/GameTypes";
import { Direction } from "./game-util";
import { randInt } from "./random";
import ChargeEnemy from "./models/ChargeEnemy";

const getBasic = (side : Direction) => {return new BasicEnemy(side)};
const getShooter = (side : Direction) => {return new ShooterEnemy(side)};
const getHoming = (side : Direction) => {return new HomingShooterEnemy(side)};
const getCharge = (side : Direction) => {return new ChargeEnemy(side)};
const easy = [getBasic, getHoming, getCharge];
const medium = [getBasic, getHoming, getHoming, getCharge, getShooter];

const getEasy = (side : Direction) : Enemy => {
    return easy[randInt(0, easy.length)](side);
}

const getMedium = (side : Direction) : Enemy => {
    return medium[Math.floor(Math.random()*medium.length)](side);
}

export const spawnEnemies = (difficulty : number, side: Direction) : Enemy[] => {
    const ans : Enemy[] = [];
    const spawner = difficulty < 5 ? getEasy : getMedium;
    for (let i = -10; i<difficulty; i += 5){
        ans.push(spawner(side));
    }
    return ans;
}