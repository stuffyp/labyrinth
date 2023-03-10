import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";
import HomingShooterEnemy from "./models/HomingShooterEnemy";
import { Enemy } from "../shared/GameTypes";
import { Direction } from "./game-util";
import { randInt } from "./random";
import ChargeEnemy from "./models/ChargeEnemy";
import AimEnemy from "./models/AimEnemy";
import StarEnemy from "./models/StarEnemy";
import GolemEnemy from "./models/GolemEnemy";
import GolemBoss from "./models/GolemBoss";
import SpawnerEnemy from "./models/SpawnerEnemy";
import HealerEnemy from "./models/HealerEnemy";
import TankEnemy from "./models/TankEnemy";

const getBasic = (side : Direction) => {return new BasicEnemy(side)};
const getShooter = (side : Direction) => {return new ShooterEnemy(side)};
const getHoming = (side : Direction) => {return new HomingShooterEnemy(side)};
const getCharge = (side : Direction) => {return new ChargeEnemy(side)};
const getAim = (side : Direction) => {return new AimEnemy(side)};
const getStar = (side : Direction) => {return new StarEnemy(side)};
const getGolem = (side : Direction) => {return new GolemEnemy(side)};
const getSpawner = (side : Direction) => {return new SpawnerEnemy(side)};
const getHealer = (side : Direction) => {return new HealerEnemy(side)};
const getTank = (side : Direction) => {return new TankEnemy(side)};

const easy = [getBasic, getHoming, getCharge];
//const easy = [getTank];
const medium = [getBasic, getHoming, getHoming, getCharge, getStar, getAim];
const hard = [getBasic, getShooter, getAim, getStar, getGolem, getSpawner];
const endgame = [getTank, getHealer, getShooter, getGolem, getSpawner];

const getEasy = (side : Direction) : Enemy => {
    return easy[randInt(0, easy.length)](side);
}

const getMedium = (side : Direction) : Enemy => {
    return medium[Math.floor(Math.random()*medium.length)](side);
}

const getHard = (side : Direction) : Enemy => {
    return hard[Math.floor(Math.random()*hard.length)](side);
}

const getEndgame = (side : Direction) : Enemy => {
    return endgame[Math.floor(Math.random()*endgame.length)](side);
}

export const spawnEnemies = (difficulty : number, side: Direction) : Enemy[] => {
    const ans : Enemy[] = [];
    let spawner;
    if (difficulty < 5) {
        spawner = getEasy;
    } else if (difficulty < 14) {
        spawner = getMedium;
    } else if (difficulty < 23) {
        spawner = getHard;
    } else {
        spawner = getEndgame;
    }
    for (let i = -10; i<difficulty; i += 5){
        ans.push(spawner(side));
    }
    return ans;
}