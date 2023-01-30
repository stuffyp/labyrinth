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
} from "../shared/GameTypes";
import { collides, randPos } from "./game-util";
import { normalize, add, mult } from "../shared/vector-util";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DOOR_WIDTH } from "../shared/canvas-constants";
import BasicEnemy from "./models/BasicEnemy";
import ShooterEnemy from "./models/ShooterEnemy";
import HomingShooterEnemy from "./models/HomingShooterEnemy";
import { InputType } from "../shared/InputType";
import StraightAllyProjectile from "./models/StraightAllyProjectile";
import StreamWeapon from "./models/StreamWeapon";
import { WeaponUpdateReturn } from "../shared/Weapon";

const gameStateMap: Map<string, GameState> = new Map<string, GameState>();

const setupGame = (roomCode: string, users: User[]) => {
  const newGameState: GameState = {
    minimap: [],
    currentRoomX: 0,
    currentRoomY: 0,
    players: {},
    enemies: [],
    enemyProjectiles: [],
    allyProjectiles: [],
  };
  for (let i = 0; i < 5; i++) {
    newGameState.minimap.push([]);
    for (let j = 0; j < 5; j++) {
      newGameState.minimap[i].push({
        x: i,
        y: j,
        roomType: "empty",
      });
      if (i == 0 || i == 4 || j == 0 || j == 4) {
        newGameState.minimap[i][j].roomType = "ghost";
      }
    }
  }
  newGameState.currentRoomX = 1;
  newGameState.currentRoomY = 1;
  for (const user of users) {
    newGameState.players[user._id] = {
      position: randPos(),
      destroyed: false,
      radius: 10,
      color: "red",
      moveInput: { x: 0, y: 0 },
      isSprint: false,
      shootInput: { x: 0, y: 0 },
      weapon: new StreamWeapon(),
    };
  }
  //temp
  for (let i = 0; i < 5; i++) {
    newGameState.enemies.push(new HomingShooterEnemy());
  }
  gameStateMap.set(roomCode, newGameState);
};

//const ENEMY_SPEED = 1;
const PLAYER_SPEED = 3;
const SPRINT_SPEED = 8;
const updateGameState = (roomCode: string) => {
  const gameState = gameStateMap.get(roomCode);
  if (!gameState) return;
  const context: UpdateContext = { targets: new Array<Hitbox>() };
  for (const key in gameState.players) {
    const player = gameState.players[key];
    if (player.destroyed) continue;
    const speed = player.isSprint ? SPRINT_SPEED : PLAYER_SPEED;
    player.position = add(player.position, mult(speed, normalize(player.moveInput)));
    if (gameState.enemies.length == 0) checkExitingRoom(gameState, player.position);
    clampBounds(player.position);

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
    if (updateVal) gameState.enemyProjectiles.push(...updateVal.projectiles);
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
  for (const key in gameState.players) {
    if (gameState.players[key].destroyed) delete gameState.players[key];
  }
};

const checkCollisions = (gameState: GameState) => {
  for (const key in gameState.players) {
    const player = gameState.players[key];
    for (const enemy of gameState.enemies) {
      if (player.destroyed) break;
      player.destroyed = collides(player, enemy);
    }
    for (const projectile of gameState.enemyProjectiles) {
      if (player.destroyed) break;
      player.destroyed = collides(player, projectile);
    }
  }
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    if (!gameState) return;
    const enemy = gameState.enemies[i];
    for (const projectile of gameState.allyProjectiles) {
      if (collides(enemy, projectile)) {
        gameState.enemies.splice(i, 1);
      }
    }
  }
};

const enterNewRoom = (gameState: GameState, side: string) => {
  if (side == "up") {
    gameState.currentRoomY += 1;
    for(const key in gameState.players){
        gameState.players[key].position = {
            x: gameState.players[key].position.x,
            y: 0,
        }
    }
    gameState.enemyProjectiles = [];
    gameState.allyProjectiles = [];
  } else if (side == "down") {
    gameState.currentRoomY -= 1;
    for(const key in gameState.players){
        gameState.players[key].position = {
            x: gameState.players[key].position.x,
            y: CANVAS_HEIGHT,
        }
    }
    gameState.enemyProjectiles = [];
    gameState.allyProjectiles = [];
  } else if (side == "right") {
    gameState.currentRoomX += 1;
    for(const key in gameState.players){
        gameState.players[key].position = {
            x: 0,
            y: gameState.players[key].position.y,
        }
    }
    gameState.enemyProjectiles = [];
    gameState.allyProjectiles = [];
  } else if (side == "left") {
    gameState.currentRoomX -= 1;
    for(const key in gameState.players){
        gameState.players[key].position = {
            x: CANVAS_WIDTH,
            y: gameState.players[key].position.y,
        }
    }
    gameState.enemyProjectiles = [];
    gameState.allyProjectiles = [];
  }
};

const checkExitingRoom = (gameState: GameState, position: Position) => {
  if (position.y > CANVAS_HEIGHT && Math.abs(position.x - CANVAS_WIDTH / 2) < DOOR_WIDTH / 2) {
    enterNewRoom(gameState, "up");
  }
  if (position.y < 0 && Math.abs(position.x - CANVAS_WIDTH / 2) < DOOR_WIDTH / 2) {
    enterNewRoom(gameState, "down");
  }
  if (position.x > CANVAS_WIDTH && Math.abs(position.y - CANVAS_HEIGHT / 2) < DOOR_WIDTH / 2) {
    enterNewRoom(gameState, "right");
  }
  if (position.x < 0 && Math.abs(position.y - CANVAS_HEIGHT / 2) < DOOR_WIDTH / 2) {
    enterNewRoom(gameState, "left");
  }
};

const clampBounds = (position: Position) => {
  if (position.x < 0) position.x = 0;
  if (position.x > CANVAS_WIDTH) position.x = CANVAS_WIDTH;
  if (position.y < 0) position.y = 0;
  if (position.y > CANVAS_HEIGHT) position.y = CANVAS_HEIGHT;
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
