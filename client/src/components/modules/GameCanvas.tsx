import React, { useState, useEffect, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../../../server/game-logic";

const GameCanvas = (props) => {
  return (
    <canvas id="game-canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> //ref={canvasRef} {...props} />
  );
};

export default GameCanvas;
