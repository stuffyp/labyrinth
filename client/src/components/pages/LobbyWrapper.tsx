import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NotFound from "./NotFound";
import AlternateRoute from "../debugging/AlternateRoute";
import GameCanvas from "../modules/GameCanvas";

type LobbyProps = {
  roomCode?: string;
};

const LobbyWrapper = (props: LobbyProps) => {
  const [roomExists, setRoomExists] = useState(false);
  const { roomCode } = useParams();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState(new Array<string>());
  const [hostIndex, setHostIndex] = useState(-1);
  const [isHost, setIsHost] = useState(false);

  const updateRoom = () => {
    get("/api/lobby", { roomCode: roomCode })
      .then((response) => {
        setRoomExists(response.roomExists);
        setUsers(response.userData.users);
        setHostIndex(response.userData.hostIndex);
        setIsHost(response.userData.isHost);
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (sessionStorage["last-room-joined"]) {
      post("/api/join-lobby", { roomCode: sessionStorage["last-room-joined"] });
    }
    updateRoom();
  }, []);
  socket.on("updateRoom", () => {
    updateRoom();
  });

  return (
    <>
      {roomExists ? (
        <>
          <Lobby roomCode={roomCode} users={users} hostIndex={hostIndex} />
          {isHost && <button>Start Game</button>}
          <br />
          <GameCanvas width="500px" height="500px" />
        </>
      ) : (
        <>{!loading && <NotFound />}</>
      )}
    </>
  );
};

export default LobbyWrapper;
