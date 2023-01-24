import React from "react";

import { RouteComponentProps } from "@reach/router";

type LobbyProps = RouteComponentProps & {
  roomCode?: string;
};

const Lobby = (props: LobbyProps) => {
  return (
    <div>
      <h1>Welcome to the Lobby!</h1>
      <p>Room Code: {props.roomCode}</p>
    </div>
  );
};

export default Lobby;
