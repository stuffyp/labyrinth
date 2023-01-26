import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket";
import { get, post } from "../../utilities";
import { drawCanvas } from "../../canvasManager";

//utils copy and pasted
type StateData = {
  food: Food[];
}

type Position = {
x: number;
y: number;
};

type Food = {
position: Position;
radius: number;
color: string;
};

type Player = {
  position: Position;
  radius: number;
  color: string;
}

type Coord = {
drawX: number;
drawY: number;
};

const GameCanvas = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      //Our first draw
      context.fillStyle = "#000000";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }, []);
  const gameState: {food: Food[], players: Player[]} = {
    food: [],
    players: [],
  }
  gameState.players.push({
    position: {x: 400, y: 400,},
    radius: 10,
    color: "red",
  });
  useEffect(() => {
    drawCanvas(gameState);
  }
  )
  return (
    <canvas id="game-canvas" width="500" height="500"/>//ref={canvasRef} {...props} />
  );
};

export default GameCanvas;
