import React, { useState, useEffect, useRef } from "react";
import { movePlayer } from "../../../../server/game-logic";
import { get, post } from "../../utilities";
import { move } from "../../client-socket";
import input from "../../input";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../../../shared/canvas-constants";

type GameCanvasProps = {
  roomCode?: string;
};

const GameCanvas = (props: GameCanvasProps) => {
  useEffect(() => {
    const clear = input.init(props.roomCode as string);
    window.addEventListener("keydown", input.handleKeydown);
    window.addEventListener("keyup", input.handleKeyup);

    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", input.handleKeydown);
      window.removeEventListener("keyup", input.handleKeyup);
      clear();
    };
  }, []);

  return (
    <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> //ref={canvasRef} {...props} />
  );
};

export default GameCanvas;
