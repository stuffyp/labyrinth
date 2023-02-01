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
} from "../shared/GameTypes";
import { collides, createWall, Direction, flip, handleWall, randPos } from "./game-util";
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
  for (let i = 0; i < 5; i++) {
    newGameState.minimap.push([]);
    for (let j = 0; j < 5; j++) {
      newGameState.minimap[i].push({
        roomType: RoomType.ENCOUNTER,
      });
      if (i == 0 || i == 4 || j == 0 || j == 4) {
        newGameState.minimap[i][j].roomType = RoomType.GHOST;
      }
      if (i==1 && j==1) {
        newGameState.minimap[i][j].roomType = RoomType.EMPTY;
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
  //for (let i = 0; i < 5; i++) {
  //  newGameState.enemies.push(new HomingShooterEnemy());
  //}
  gameStateMap.set(roomCode, newGameState);
};

//const ENEMY_SPEED = 1;
const PLAYER_SPEED = 3;
const SPRINT_SPEED = 7;
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

const getCurrentRoom = (gameState: GameState) : Room => {
  return gameState.minimap[gameState.currentRoomX][gameState.currentRoomY];
}

const BUFFER = 10;
const enterNewRoom = (gameState: GameState, side: Direction) => {
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
      for (let i = 0; i < 5; i++) {
        gameState.enemies.push(new HomingShooterEnemy(side));
      }
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

  if (position.y > CANVAS_HEIGHT && Math.abs(position.x - CANVAS_WIDTH / 2) < DOOR_WIDTH / 2) {
    if (isGhostRoom(gameState.currentRoomX, gameState.currentRoomY+1)) return;
    enterNewRoom(gameState, Direction.UP);
    return;
  }
  if (position.y < 0 && Math.abs(position.x - CANVAS_WIDTH / 2) < DOOR_WIDTH / 2) {
    if (isGhostRoom(gameState.currentRoomX, gameState.currentRoomY-1)) return;
    enterNewRoom(gameState, Direction.DOWN);
    return;
  }
  if (position.x > CANVAS_WIDTH && Math.abs(position.y - CANVAS_HEIGHT / 2) < DOOR_WIDTH / 2) {
    if (isGhostRoom(gameState.currentRoomX+1, gameState.currentRoomY)) return;
    enterNewRoom(gameState, Direction.RIGHT);
    return;
  }
  if (position.x < 0 && Math.abs(position.y - CANVAS_HEIGHT / 2) < DOOR_WIDTH / 2) {
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
