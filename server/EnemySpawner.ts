import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";
import HomingShooterEnemy from "./models/HomingShooterEnemy";
import { Enemy } from "../shared/GameTypes";
import { Direction } from "./game-util";
import { randInt } from "./random";
import ChargeEnemy from "./models/ChargeEnemy";
import AimEnemy from "./models/AimEnemy";

const getBasic = (side : Direction) => {return new BasicEnemy(side)};
const getShooter = (side : Direction) => {return new ShooterEnemy(side)};
const getHoming = (side : Direction) => {return new HomingShooterEnemy(side)};
const getCharge = (side : Direction) => {return new ChargeEnemy(side)};
const getAim = (side : Direction) => {return new AimEnemy(side)};

const easy = [getBasic, getHoming, getCharge];
const medium = [getHoming, getHoming, getCharge, getShooter, getAim];
const hard = [getCharge, getShooter, getAim];

const getEasy = (side : Direction) : Enemy => {
    return easy[randInt(0, easy.length)](side);
}

const getMedium = (side : Direction) : Enemy => {
    return medium[Math.floor(Math.random()*medium.length)](side);
}

const getHard = (side : Direction) : Enemy => {
    return medium[Math.floor(Math.random()*hard.length)](side);
}

export const spawnEnemies = (difficulty : number, side: Direction) : Enemy[] => {
    const ans : Enemy[] = [];
    let spawner;
    if (difficulty < 5) {
        spawner = getEasy;
    } else if (difficulty < 15) {
        spawner = getMedium;
    } else {
        spawner = getHard;
    }
    for (let i = -10; i<difficulty; i += 5){
        ans.push(spawner(side));
    }
    return ans;
}