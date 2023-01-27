import React, { useState, useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../../../server/game-logic";
import { get, post } from "../../utilities";
import { move } from "../../client-socket";

type GameCanvasProps = {
  roomCode?: string;
};

const GameCanvas = (props: GameCanvasProps) => {
  // add event listener on mount
  useEffect(() => {
    window.addEventListener("keydown", handleInput);

    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleInput);
    };
  }, []);

  const handleInput = (e) => {
    if (e.key === "ArrowUp") {
      move(props.roomCode, "up");
    } else if (e.key === "ArrowDown") {
      move(props.roomCode, "down");
    } else if (e.key === "ArrowLeft") {
      move(props.roomCode, "left");
    } else if (e.key === "ArrowRight") {
      move(props.roomCode, "right");
    }
  };

  return (
    <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> //ref={canvasRef} {...props} />
  );
};

export default GameCanvas;
