import { User } from "./models/User";
import {
  Position,
  Hitbox,
  GameState,
  Room,
  Vector,
  UpdateReturn,
  EnemyProjectile,
  AllyProjectile,
  UpdateContext,
  RoomType,
  Wall,
  Enemy,
} from "../shared/GameTypes";
import { collides, createWall, Direction, flip, handleWall, randPos } from "./game-util";
import { normalize, add, mult } from "../shared/vector-util";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DOOR_WIDTH, DOOR_DEPTH } from "../shared/canvas-constants";
import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";
import HomingShooterEnemy from "./models/HomingShooterEnemy";
import { InputType } from "../shared/InputType";
import StraightAllyProjectile from "./models/StraightAllyProjectile";
import StreamWeapon from "./models/StreamWeapon";
import SplashWeapon from "./models/SplashWeapon";
import { WeaponUpdateReturn } from "../shared/Weapon";
import HomingProjectile from "./models/HomingProjectile";
import { spawnEnemies } from "./EnemySpawner";
import GolemBoss from "./models/GolemBoss";
import SpawnerBoss from "./models/SpawnerBoss";

const gameStateMap: Map<string, GameState> = new Map<string, GameState>();

const PLAYER_HP = 10;
const PLAYER_IFRAMES = 90;
const setupGame = (roomCode: string, users: User[]) => {
  const newGameState: GameState = {
    minimap: [],
    currentRoomX: 0,
    currentRoomY: 0,
    walls: createWall(new Map<Direction, boolean>([
      [Direction.LEFT, false],
      [Direction.RIGHT, true],
      [Direction.DOWN, false],
      [Direction.UP, true],
    ])),
    players: {},
    enemies: [],
    enemyProjectiles: [],
    allyProjectiles: [],
  };
  for (let i = 0; i < 17; i++) {
    newGameState.minimap.push([]);
    for (let j = 0; j < 17; j++) {
      newGameState.minimap[i].push({
        roomType: RoomType.ENCOUNTER,
      });
      if (i == 0 || i == 16 || j == 0 || j == 16) {
        newGameState.minimap[i][j].roomType = RoomType.GHOST;
      }
      if (i %2 === 0 && j %2 === 0) {
        newGameState.minimap[i][j].roomType = RoomType.GHOST;
      }
      if (i===1 && j===1) {
        newGameState.minimap[i][j].roomType = RoomType.EMPTY;
      }
      if (i===5 && j===5) {
        newGameState.minimap[i][j].roomType = RoomType.BOSS;
      }
      if (i===6 && j<5 || i<5 && j===6) {
        newGameState.minimap[i][j].roomType = RoomType.GHOST;
      }
      if (i===9 && j===9) {
        newGameState.minimap[i][j].roomType = RoomType.BOSS;
      }
      if (i===10 && j<9 || i<9 && j===10) {
        newGameState.minimap[i][j].roomType = RoomType.GHOST;
      }
      if (i===9 && j===9) {
        newGameState.minimap[i][j].roomType = RoomType.BOSS;
      }
    }
  }
  newGameState.currentRoomX = 1;
  newGameState.currentRoomY = 1;
  const playerColors = ["red", "green", "blue", "yellow", "pink"];
  let i = 0;
  for (const user of users) {
    newGameState.players[user._id] = {
      position: randPos(),
      destroyed: false,
      radius: 10,
      color: playerColors[i%5],
      moveInput: { x: 0, y: 0 },
      isSprint: false,
      shootInput: { x: 0, y: 0 },
      weapon: Math.random()>0.5 ? new SplashWeapon() : new StreamWeapon(),
      hp: PLAYER_HP,
      maxHp: PLAYER_HP,
      iFrames: PLAYER_IFRAMES,
      iFrameCount: 0,
    };
    i++;
  }
  //temp
  //for (let i = 0; i < 5; i++) {
  //  newGameState.enemies.push(new HomingShooterEnemy());
  //}
  gameStateMap.set(roomCode, newGameState);
};

//const ENEMY_SPEED = 1;
const PLAYER_SPEED = 7;
const SPRINT_SPEED = 3;
const updateGameState = (roomCode: string) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  const context: UpdateContext = { targets: new Array<Hitbox>() };
  for (const key in gameState.players) {
    const player = gameState.players[key];
    if (player.destroyed) continue;
    if (player.iFrameCount > 0) player.iFrameCount -= 1;

    const speed = player.isSprint ? SPRINT_SPEED : PLAYER_SPEED;
    player.position = add(player.position, mult(speed, normalize(player.moveInput)));
    if (gameState.enemies.length === 0) checkExitingRoom(gameState, player.position);
    clampBounds(player, gameState.walls, gameState.enemies.length > 0);

    const updateVal: WeaponUpdateReturn = player.weapon.update({
      position: player.position,
      shootDir: player.shootInput,
    });
    if (updateVal) gameState.allyProjectiles.push(...updateVal.projectiles);

    const { position, radius, destroyed } = player;
    context.targets.push({
      position: position,
      radius: radius,
      destroyed: destroyed,
    });
  }
  for (const enemy of gameState.enemies) {
    if (enemy.destroyed) continue;
    const updateVal: UpdateReturn = enemy.update(context);
    if (updateVal) {
      gameState.enemyProjectiles.push(...updateVal.projectiles);
      if (updateVal.enemies && gameState.enemies.length < 20) gameState.enemies.push(...updateVal.enemies);
    }
  }
  for (const projectile of gameState.enemyProjectiles) {
    if (projectile.destroyed) continue;
    projectile.update(context);
    if (checkOutOfBounds(projectile)) projectile.destroyed = true;
  }
  for (const projectile of gameState.allyProjectiles) {
    if (projectile.destroyed) continue;
    projectile.update(context);
    if (checkOutOfBounds(projectile)) projectile.destroyed = true;
  }
  checkCollisions(gameState);
};

const cleanUpGameState = (roomCode: string) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  let projectiles: EnemyProjectile[] = gameState.enemyProjectiles;
  gameState.enemyProjectiles = projectiles.filter((x) => !x.destroyed);
  let allyProjectiles: AllyProjectile[] = gameState.allyProjectiles;
  gameState.allyProjectiles = allyProjectiles.filter((x) => !x.destroyed);
  let enemies: Enemy[] = gameState.enemies;
  gameState.enemies = enemies.filter((x) => !x.destroyed);
  for (const key in gameState.players) {
    if (gameState.players[key].destroyed) delete gameState.players[key];
  }
};

const checkCollisions = (gameState: GameState) => {
  for (const key in gameState.players) {
    const player = gameState.players[key];
    for (const enemy of gameState.enemies) {
      if (player.destroyed) break;
      if (collides(player, enemy) && player.iFrameCount<=0){
        player.hp -= 1;
        player.iFrameCount = player.iFrames;
      }
    }
    for (const projectile of gameState.enemyProjectiles) {
      if (player.destroyed) break;
      if (collides(player, projectile) && player.iFrameCount<=0){
        player.hp -= 1;
        player.iFrameCount = player.iFrames;
      }
    }
    if (player.hp<=0) player.destroyed = true;
  }
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    if (!gameState) return;
    const enemy = gameState.enemies[i];
    for (const projectile of gameState.allyProjectiles) {
      if (collides(enemy, projectile)) {
        enemy.hp -= projectile.damage;
        projectile.destroyed = true;
        if (enemy.hp <= 0) {
          enemy.destroyed = true;
          if (enemy.maxHp > 400) healPlayers(gameState); //boss
        }
      }
    }
  }
};

const healPlayers = (gameState : GameState) => {
  for (const key in gameState.players){
    gameState.players[key].maxHp += 5;
    gameState.players[key].hp = gameState.players[key].maxHp;
  }
}

const getCurrentRoom = (gameState: GameState) : Room => {
  return gameState.minimap[gameState.currentRoomX][gameState.currentRoomY];
}

const BUFFER = 10;
const enterNewRoom = (gameState: GameState, side: Direction) => {
  getCurrentRoom(gameState).roomType = RoomType.EMPTY;
  let enterPosition : Position = {x : 0, y : 0};
  switch(side){
    case Direction.UP:
      gameState.currentRoomY += 1;
      enterPosition = {
        x: CANVAS_WIDTH/2,
        y: BUFFER,
      };
      break;
    case Direction.DOWN:
      gameState.currentRoomY -= 1;
      enterPosition = {
        x: CANVAS_WIDTH/2,
        y: CANVAS_HEIGHT-BUFFER,
      };
      break;
    case Direction.RIGHT:
      gameState.currentRoomX += 1;
      enterPosition = {
        x: BUFFER,
        y: CANVAS_HEIGHT/2,
      };
      break;
    case Direction.LEFT:
      gameState.currentRoomX -= 1;
      enterPosition = {
        x: CANVAS_WIDTH-BUFFER,
        y: CANVAS_HEIGHT/2,
      };
      break;
    default:
      break;
  }

  for(const key in gameState.players){
    gameState.players[key].position = enterPosition;
  }
  gameState.enemyProjectiles = [];
  gameState.allyProjectiles = [];

  switch(getCurrentRoom(gameState).roomType){
    case RoomType.EMPTY:
      break;
    case RoomType.ENCOUNTER:
      gameState.enemies = spawnEnemies(gameState.currentRoomX+gameState.currentRoomY, side);
      break;
    case RoomType.BOSS:
      gameState.enemies = gameState.currentRoomX===5 ? [new GolemBoss(side)] : [new SpawnerBoss(side)];
      break;
    default:
      break;
  }

  const isGhostRoom = (dx : number, dy : number) : boolean => {
    return gameState.minimap[gameState.currentRoomX+dx][gameState.currentRoomY+dy].roomType===RoomType.GHOST;
  };

  gameState.walls = createWall(new Map<Direction, boolean>([
    [Direction.LEFT, !isGhostRoom(-1, 0)],
    [Direction.RIGHT, !isGhostRoom(1, 0)],
    [Direction.DOWN, !isGhostRoom(0, -1)],
    [Direction.UP, !isGhostRoom(0, 1)],
  ]));
};

const checkExitingRoom = (gameState: GameState, position: Position) => {
  const isGhostRoom = (x : number, y : number) : boolean => {
    return gameState.minimap[x][y].roomType===RoomType.GHOST;
  };

  if (position.y > CANVAS_HEIGHT+DOOR_DEPTH) {
    if (isGhostRoom(gameState.currentRoomX, gameState.currentRoomY+1)) return;
    enterNewRoom(gameState, Direction.UP);
    return;
  }
  if (position.y < -DOOR_DEPTH) {
    if (isGhostRoom(gameState.currentRoomX, gameState.currentRoomY-1)) return;
    enterNewRoom(gameState, Direction.DOWN);
    return;
  }
  if (position.x > CANVAS_WIDTH+DOOR_DEPTH) {
    if (isGhostRoom(gameState.currentRoomX+1, gameState.currentRoomY)) return;
    enterNewRoom(gameState, Direction.RIGHT);
    return;
  }
  if (position.x < -DOOR_DEPTH) {
    if (isGhostRoom(gameState.currentRoomX-1, gameState.currentRoomY)) return;
    enterNewRoom(gameState, Direction.LEFT);
    return;
  }
};

const clampBounds = (hitbox : Hitbox, walls : Wall[], strict : boolean) => {
  if (strict) {
    if (hitbox.position.x < 0) hitbox.position.x = 0;
    if (hitbox.position.x > CANVAS_WIDTH) hitbox.position.x = CANVAS_WIDTH;
    if (hitbox.position.y < 0) hitbox.position.y = 0;
    if (hitbox.position.y > CANVAS_HEIGHT) hitbox.position.y = CANVAS_HEIGHT;
  } else {
    for (const wall of walls){
      handleWall(hitbox, wall);
    }
  }
};

const checkOutOfBounds = (hitbox: Hitbox): boolean => {
  const pos = hitbox.position;
  return pos.x < 0 || pos.x > CANVAS_WIDTH || pos.y < 0 || pos.y > CANVAS_HEIGHT;
};

//TODO sync with the gameplay cycle
const movePlayer = (roomCode: string, user: User, input: InputType) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  const player = gameState.players[user._id];
  if (!player) return;
  player.moveInput = input.moveDir;
  player.isSprint = input.sprint;
  player.shootInput = input.shootDir;
};

/*const playerShoot = (roomCode: string, user: User, input: {shootDir: Vector}) => {
    const gameState = gameStateMap.get(roomCode);
    if (!gameState) return;
    if (!gameState.players[user._id]) return;
    gameState.allyProjectiles.push(new StraightAllyProjectile(gameState.players[user._id].position, 20, input.shootDir));
}*/

const getGameState = (roomCode: string) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  return gameState;
};

export { setupGame, getGameState, updateGameState, cleanUpGameState, movePlayer };
