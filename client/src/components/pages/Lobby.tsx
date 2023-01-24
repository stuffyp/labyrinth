import React from "react";
import { useParams } from "react-router-dom";

type LobbyProps = {
  roomCode?: string;
};

const Lobby = (props: LobbyProps) => {
  const { roomCode } = useParams();
  return (
    <div>
      <h1>Welcome to the Lobby!</h1>
      <p>Room Code: {roomCode}</p>
    </div>
  );
};

export default Lobby;
