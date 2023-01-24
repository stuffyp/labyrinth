import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { get } from "../../utilities";
import { socket } from "../../client-socket";
import NotFound from "./NotFound";

type LobbyProps = {
  roomCode?: string;
};

const LobbyWrapper = (props: LobbyProps) => {
  const [roomExists, setRoomExists] = useState(false);
  const { roomCode } = useParams();

  const [users, setUsers] = useState(new Array<string>());
  const updateRoom = () => {
    get("/api/lobby", { roomCode: roomCode }).then((response) => {
      setRoomExists(response.roomExists);
      setUsers(response.users);
    });
  };

  useEffect(() => {
    updateRoom();
  }, []);
  socket.on("updateRoom", () => {
    updateRoom();
  });

  return (
    <>
      {roomExists ? (
        <>
          <Lobby roomCode={roomCode} />
          {users.map((user) => (
            <div>{user}</div>
          ))}
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default LobbyWrapper;
