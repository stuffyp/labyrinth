import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { get } from "../../utilities";

type LobbyProps = {
  roomCode?: string;
};

const LobbyWrapper = (props: LobbyProps) => {
  const { roomCode } = useParams();

  const [users, setUsers] = useState(new Array<string>());
  useEffect(() => {
    get("/api/lobby", { roomCode: roomCode }).then((response) => {
      setUsers(response.users);
    });
  }, []);

  return (
    <>
      <Lobby roomCode={roomCode} />
      {users.map((user) => (
        <div>{user}</div>
      ))}
    </>
  );
};

export default LobbyWrapper;
