import React from "react";

import { RouteComponentProps } from "@reach/router";

type GameComponentProps = RouteComponentProps;

const Game = (props: GameComponentProps) => {
  return (
    <div>
      <h1>The page you are looking for is in another castle!</h1>
    </div>
  );
};

export default Game;
