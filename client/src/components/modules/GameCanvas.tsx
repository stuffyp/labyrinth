import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket";
import { get, post } from "../../utilities";
import { drawCanvas } from "../../canvasManager";

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

  return <canvas ref={canvasRef} {...props} />;
};

export default GameCanvas;
