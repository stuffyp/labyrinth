import { redirect } from "react-router";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WALL_TOP,
  WALL_SIDE,
  DOOR_WIDTH,
  DOOR_DEPTH,
} from "../../shared/canvas-constants";
import { Position, Player, Enemy, GameState, EnemyProjectile, RoomType } from "../../shared/GameTypes";
let canvas;

type Coord = {
  drawX: number;
  drawY: number;
};

const WALL_COLOR = "#692525";
const DOOR_THICKNESS = 10;

// load sprites!
/*let sprites = {
  red: null,
  blue: null,
  green: null,
  yellow: null,
  purple: null,
  orange: null,
  silver: null,
};
Object.keys(sprites).forEach((key) => {
  sprites[key] = new Image(400, 400);
  sprites[key].src = `../player-icons/${key}.png`; // Load sprites from dist folder
});*/

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoord = (position: Position): Coord => {
  //if (!canvas) return;
  return {
    drawX: WALL_SIDE + position.x,
    drawY: -WALL_TOP + canvas.height - position.y,
  };
};


// fills a circle at a given x, y canvas coord with radius and color
const fillCircle = (context, x, y, radius, color) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
};

// draws a sprite instead of a colored circle
/*const drawSprite = (context, x, y, radius, color) => {
  context.save();
  // Saves current context so we can restore to here once we are done drawing
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.closePath();
  context.clip(); // Sets circular clipping region for sprite image
  context.drawImage(sprites[color], x - radius, y - radius, radius * 2, radius * 2);
  context.restore();
  // Restores context to last save (before clipping was applied), so we can draw normally again
};*/

/** drawing functions */

const drawPlayer = (context, position, radius, color) => {
  const { drawX, drawY } = convertCoord(position);
  //drawSprite(context, drawX, drawY, radius, color);
  fillCircle(context, drawX, drawY, radius, color);
};

const drawCircle = (context, position, radius, color) => {
  const { drawX, drawY } = convertCoord(position);
  fillCircle(context, drawX, drawY, radius, color);
};

const drawWalls = (context, color) => {
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, WALL_TOP);
  context.fillRect(0, canvas.height - WALL_TOP, canvas.width, WALL_TOP);
  context.fillRect(0, 0, WALL_SIDE, canvas.height);
  context.fillRect(canvas.width - WALL_SIDE, 0, WALL_SIDE, canvas.height);
};

const drawWall = (context, color, center, width, height) => {
  context.fillStyle = color;
  const {drawX, drawY} = convertCoord(center);
  context.fillRect(drawX-width/2, drawY-height/2, width, height);
}

const closeDoors = (context) => {
  context.fillStyle = WALL_COLOR;
  context.fillRect(DOOR_DEPTH-DOOR_THICKNESS, DOOR_DEPTH-DOOR_THICKNESS, CANVAS_WIDTH+2*DOOR_THICKNESS, DOOR_THICKNESS);
  context.fillRect(DOOR_DEPTH-DOOR_THICKNESS, DOOR_DEPTH-DOOR_THICKNESS, DOOR_THICKNESS, CANVAS_HEIGHT+2*DOOR_THICKNESS);
  context.fillRect(DOOR_DEPTH-DOOR_THICKNESS, canvas.height-DOOR_DEPTH, CANVAS_WIDTH+2*DOOR_THICKNESS, DOOR_THICKNESS);
  context.fillRect(canvas.width-DOOR_DEPTH, DOOR_DEPTH-DOOR_THICKNESS, DOOR_THICKNESS, CANVAS_HEIGHT+2*DOOR_THICKNESS);  
}

const drawDoor = (context, side, color, isOpen) => {
  context.fillStyle = "black";
  if (side == "up") {
    if (!isOpen) {
      context.fillRect((canvas.width - DOOR_WIDTH) / 2, 0, DOOR_WIDTH, WALL_TOP - 10);
    } else {
      context.fillRect((canvas.width - DOOR_WIDTH) / 2, 0, DOOR_WIDTH, WALL_TOP);
    }
  } else if (side == "down") {
    if (!isOpen) {
      context.fillRect((canvas.width - DOOR_WIDTH) / 2, canvas.height - (WALL_TOP - 10), DOOR_WIDTH, WALL_TOP - 10);
    } else {
      context.fillRect((canvas.width - DOOR_WIDTH) / 2, canvas.height - WALL_TOP, DOOR_WIDTH, WALL_TOP);
    }
  } else if (side == "left") {
    if (!isOpen) {
      context.fillRect(0, (canvas.height - DOOR_WIDTH) / 2, WALL_SIDE - 10, DOOR_WIDTH);
    } else {
      context.fillRect(0, (canvas.height - DOOR_WIDTH) / 2, WALL_SIDE, DOOR_WIDTH);
    }
  } else if (side == "right") {
    if (!isOpen) {
      context.fillRect( canvas.width - (WALL_SIDE - 10), (canvas.height - DOOR_WIDTH) / 2, WALL_SIDE - 10, DOOR_WIDTH);
    } else {
      context.fillRect(canvas.width - WALL_SIDE, (canvas.height - DOOR_WIDTH) / 2, WALL_SIDE, DOOR_WIDTH);
    }
  }
};

/** main draw */
export const drawCanvas = (drawState: GameState) => {
  const getRoom = (dx : number, dy : number) => {
    return drawState.minimap[drawState.currentRoomX+dx][drawState.currentRoomY+dy];
  }

  // use id of canvas element in HTML DOM to get reference to canvas object
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  //console.log( drawState.currentRoomX, drawState.currentRoomY );
  // clear the canvas to black
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  /*drawWalls(context, "#692525");
  if (getRoom(0, 1).roomType !== RoomType.GHOST) {
    drawDoor(context, "up", "#692525", drawState.enemies.length == 0);
  }
  if (getRoom(0, -1).roomType !== RoomType.GHOST) {
    drawDoor(context, "down", "#692525", drawState.enemies.length == 0);
  }
  if (getRoom(-1, 0).roomType !== RoomType.GHOST) {
    drawDoor(context, "left", "#692525", drawState.enemies.length == 0);
  }
  if (getRoom(1, 0).roomType !== RoomType.GHOST) {
    drawDoor(context, "right", "#692525", drawState.enemies.length == 0);
  }*/
  for (const wall of drawState.walls) {
    drawWall(context, WALL_COLOR, wall.center, wall.width, wall.height);
  }
  if (drawState.enemies.length > 0) closeDoors(context);

  // draw all the players
  for (const key in drawState.players) {
    const player = drawState.players[key];
    drawPlayer(context, player.position, player.radius, player.color);
  }

  for (const enemy of drawState.enemies) {
    drawPlayer(context, enemy.position, enemy.radius, enemy.color);
  }

  for (const projectile of drawState.enemyProjectiles) {
    drawPlayer(context, projectile.position, projectile.radius, projectile.color);
  }

  for (const projectile of drawState.allyProjectiles) {
    drawPlayer(context, projectile.position, projectile.radius, projectile.color);
  }

  /*Object.values(drawState.players).forEach((p: Player) => {
    drawPlayer(context, p.position, p.radius, p.color);
  });*/
};
