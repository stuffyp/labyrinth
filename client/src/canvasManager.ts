import { redirect } from "react-router";
import { CANVAS_WIDTH, CANVAS_HEIGHT, WALL_TOP, WALL_SIDE } from "../../shared/canvas-constants";
import { Position, Player, Enemy, GameState, EnemyProjectile} from "../../shared/GameTypes";
let canvas;

type Coord = {
  drawX: number;
  drawY: number;
};

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
const convertCoord = (position: Position) : Coord => {
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

const drawClosedDoor = (context, side, color, isOpen) => {
  const WALL_WIDTH = 50;
  if (side=="up"){
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, WALL_WIDTH);
    context.fillStyle = "black";
    if (!isOpen){
      context.fillRect((canvas.width-WALL_WIDTH)/2, 0, WALL_WIDTH, WALL_WIDTH-10);
    } else {
      context.fillRect((canvas.width-WALL_WIDTH)/2, 0, WALL_WIDTH, WALL_WIDTH);
    }
  }
}

/** main draw */
export const drawCanvas = (drawState: GameState) => {
  // use id of canvas element in HTML DOM to get reference to canvas object
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  // clear the canvas to black
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawClosedDoor(context, "up", "#692525", drawState.enemies.length==0);

  // draw all the players
  for (const key in drawState.players){
    const player = drawState.players[key];
    drawPlayer(context, player.position, player.radius, player.color);
  }

  for (const enemy of drawState.enemies){
    drawPlayer(context, enemy.position, enemy.radius, enemy.color);
  }

  for (const projectile of drawState.enemyProjectiles){
    drawPlayer(context, projectile.position, projectile.radius, projectile.color);
  }

  for (const projectile of drawState.allyProjectiles){
    drawPlayer(context, projectile.position, projectile.radius, projectile.color);
  }
  
  /*Object.values(drawState.players).forEach((p: Player) => {
    drawPlayer(context, p.position, p.radius, p.color);
  });*/

};