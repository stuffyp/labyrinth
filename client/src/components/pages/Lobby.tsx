import React from "react";
import { useParams } from "react-router-dom";
import Game from "./Game";

type LobbyProps = {
  roomCode?: string;
  users: string[];
  hostIndex: number;
};

const Lobby = (props: LobbyProps) => {
  const { roomCode } = useParams();
  return (
    <div>
      <h1>Welcome to the Lobby!</h1>
      <p>Room Code: {roomCode}</p>
      {props.users.map((user, idx) => (
        <div key={idx}>{`${user}${idx === props.hostIndex ? " (host)" : ""}`}</div>
      ))}
    </div>
  );
};

export default Lobby;
