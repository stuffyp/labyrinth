import { get, post } from "../../utilities";
import React, { useState } from "react";
import { navigate } from "@reach/router";

const CreateLobbyButton = (props) => {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div>
      <button
        onClick={() => {
          post("api/create-lobby").then((response) => {
            setRoomCode(response.code);
            navigate(`/lobby/${response.code}`);
          });
        }}
      >
        Create Lobby
      </button>
      <p>Room Code: {roomCode}</p>
    </div>
  );
};

const JoinLobbyButton = (props) => {
  const [roomCode, setRoomCode] = useState("");

  const handleValueChange = (event) => {
    setRoomCode(event.target.value);
  };
  return (
    <div>
      <input type="text" placeholder="" value={roomCode} onChange={handleValueChange} />
      <button
        onClick={() => {
          post("api/join-lobby", { roomCode: roomCode }).then((response) => {
            setRoomCode(response.code);
            navigate(`/lobby/${response.code}`);
          });
        }}
      >
        Join Lobby
      </button>
    </div>
  );
};

export { CreateLobbyButton, JoinLobbyButton };
