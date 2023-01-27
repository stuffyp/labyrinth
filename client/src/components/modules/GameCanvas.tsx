import React, { useState, useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, movePlayer } from "../../../../server/game-logic";
import { get, post } from "../../utilities";
import { move } from "../../client-socket";

type GameCanvasProps = {
  roomCode?: string;
};

const GameCanvas = (props: GameCanvasProps) => {
  // add event listener on mount
  let keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) =>{
      keysPressed[e.key]=true;
    });
    window.addEventListener("keyup", (e) =>{
      keysPressed[e.key]=false;
    });

    // remove event listener on unmount
    /*return () => {
      window.removeEventListener("keydown", handleInput);
    };*/
  }, []);

  setInterval(()=>{
    if (keysPressed.ArrowUp && keysPressed.ArrowLeft) {
      move(props.roomCode, "NW");
    }
    else if (keysPressed.ArrowUp && keysPressed.ArrowRight) {
      move(props.roomCode, "NE");
    }
    else if (keysPressed.ArrowDown && keysPressed.ArrowLeft) {
      move(props.roomCode, "SW");
    }
    else if (keysPressed.ArrowDown && keysPressed.ArrowRight) {
      move(props.roomCode, "SE");
    }
    else if (keysPressed.ArrowUp){
      move(props.roomCode, "N");
    }
    else if (keysPressed.ArrowDown){
      move(props.roomCode, "S");
    }
    else if (keysPressed.ArrowLeft){
      move(props.roomCode, "W");
    }
    else if (keysPressed.ArrowRight){
      move(props.roomCode, "E");
    }
  },1000/60);

  return (
    <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> //ref={canvasRef} {...props} />
  );
};

export default GameCanvas;
