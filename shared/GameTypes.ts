import Weapon from "./Weapon";

type Vector = {
  x: number;
  y: number;
};

type Position = Vector;

type Wall = {
  center : Position,
  width : number,
  height : number,
}

type Hitbox = {
  position: Position;
  radius: number;
  destroyed: boolean;
};

type HP = {
  hp : number;
  maxHp : number;
  iFrames ?: number;
  iFrameCount ?: number;
}

type Player = Hitbox & HP & {
  color: string;
  moveInput: Vector;
  isSprint: boolean;
  shootInput: Vector;
  weapon: Weapon;
  iFrames : number;
  iFrameCount : number;
};

type EnemyInfo = Hitbox & HP & {
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
  enemies ?: Enemy[];  
};

interface EnemyBehavior {
  frameCount: number;
  behavior: Behavior;
  update: (context: UpdateContext) => UpdateReturn;
}

interface Enemy extends EnemyInfo, EnemyBehavior {}

interface EnemyProjectile extends Hitbox {
  color: string;
  damage ?: number;
  update: (context: UpdateContext) => void;
}

interface ESmartProjectile extends EnemyProjectile {
  frameCount: number;
  behavior: Behavior;
}

interface AllyProjectile extends Hitbox {
  color: string;
  damage : number;
  update: (context: UpdateContext) => void;
}

enum RoomType {
  GHOST,
  EMPTY,
  ENCOUNTER,
  BOSS,
}

type Room = {
  roomType: RoomType;
};

type GameState = {
  minimap: Room[][];
  currentRoomX: number;
  currentRoomY: number;
  walls : Wall[];
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
export { Vector, Position, Player, Enemy, Room, RoomType, GameState, Hitbox, Wall };
