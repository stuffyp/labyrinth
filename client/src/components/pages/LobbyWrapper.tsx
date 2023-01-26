import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NotFound from "./NotFound";
import AlternateRoute from "../debugging/AlternateRoute";
import GameCanvas from "../modules/GameCanvas";
import { StartGameButton } from "../modules/MenuButton";
import APITester from "../debugging/APITester";

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
          {isHost && <StartGameButton roomCode={roomCode as string} />}
          <br />
          <GameCanvas />
        </>
      ) : (
        <>{!loading && <NotFound />}</>
      )}
      {/*<APITester />*/}
    </>
  );
};

export default LobbyWrapper;
