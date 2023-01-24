import React from "react";
import { useParams } from "react-router-dom";
import Game from "./Game";

type LobbyProps = {
  roomCode?: string;
  users: string[];
};

const Lobby = (props: LobbyProps) => {
  const { roomCode } = useParams();
  return (
    <div>
      <h1>Welcome to the Lobby!</h1>
      <p>Room Code: {roomCode}</p>
      {props.users.map((user) => (
        <div>{user}</div>
      ))}
    </div>
  );
};

export default Lobby;
