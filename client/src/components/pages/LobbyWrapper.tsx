import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lobby from "./Lobby";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import NotFound from "./NotFound";
import AlternateRoute from "../debugging/AlternateRoute";
import GameCanvas from "../modules/GameCanvas";
import { LeaveGameButton, StartGameButton } from "../modules/MenuButton";
import APITester from "../debugging/APITester";
import "./Lobby.css";

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
    const lastJoined = sessionStorage["last-room-joined"];
    if (lastJoined && typeof lastJoined === "string")
      post("/api/rejoin-lobby", { roomCode: lastJoined });
    updateRoom();
  }, []);
  socket.on("updateRoom", () => {
    updateRoom();
  });

  return (
    <>
      {roomExists ? (
        <div className="u-flex">
          <div className="u-flexColumn u-flex-alignCenter">
            <div className="text-container">
              <Lobby roomCode={roomCode} users={users} hostIndex={hostIndex} />
            </div>
            {isHost && (
              <div className="button-container">
                <StartGameButton roomCode={roomCode as string} />
              </div>
            )}
            <div className="button-container">
              <LeaveGameButton />
            </div>
          </div>
          <div className="vertical-line"></div>
          <GameCanvas roomCode={roomCode} />
        </div>
      ) : (
        <>{!loading && <NotFound />}</>
      )}
      {/*<APITester />*/}
    </>
  );
};

export default LobbyWrapper;
