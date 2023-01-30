import Weapon from "./Weapon";

type Vector = {
  x: number;
  y: number;
};

type Position = Vector;

type Hitbox = {
  position: Position;
  radius: number;
  destroyed: boolean;
};

type Player = Hitbox & {
  color: string;
  moveInput: Vector;
  isSprint: boolean;
  shootInput: Vector;
  weapon: Weapon;
};

type EnemyInfo = Hitbox & {
  color: string;
};

enum Behavior {
  IDLE,
  MOVE,
  ATTACK,
  SPAWN, //reserved for when enemy spawns
  DESPAWN, //reserved for when enemy despawns
  SPECIAL,
  ACTIVE,
  INACTIVE,
  ALERT,
  TRANSITION,
}

type UpdateContext = {
  targets: Hitbox[];
};

type UpdateReturn = null | {
  projectiles: EnemyProjectile[];
};

interface EnemyBehavior {
  frameCount: number;
  behavior: Behavior;
  update: (context: UpdateContext) => UpdateReturn;
}

interface Enemy extends EnemyInfo, EnemyBehavior {}

interface EnemyProjectile extends Hitbox {
  color: string;
  update: (context: UpdateContext) => void;
}

interface ESmartProjectile extends EnemyProjectile {
  frameCount: number;
  behavior: Behavior;
}

interface AllyProjectile extends Hitbox {
  color: string;
  update: (context: UpdateContext) => void;
}

type Room = {
  x: number;
  y: number;
  roomType: string;
};

type GameState = {
  minimap: Room[][];
  currentRoomX: number;
  currentRoomY: number;
  players: { [key: string]: Player }; //user id to player
  enemies: Enemy[];
  enemyProjectiles: EnemyProjectile[];
  allyProjectiles: AllyProjectile[];
};

export {
  EnemyBehavior,
  Behavior,
  EnemyProjectile,
  ESmartProjectile,
  AllyProjectile,
  UpdateReturn,
  UpdateContext,
};
export { Vector, Position, Player, Enemy, Room, GameState, Hitbox };
