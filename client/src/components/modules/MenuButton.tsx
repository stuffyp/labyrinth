import { get, post } from "../../utilities";
import React, { useState } from "react";

const CreateLobbyButton = (props) => {
  return (
    <button
      onClick={() => {
        post("api/create-lobby");
      }}
    >
      Create Lobby
    </button>
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
          post("api/join-lobby", { roomCode: roomCode });
        }}
      >
        Join Lobby
      </button>
    </div>
  );
};

export { CreateLobbyButton, JoinLobbyButton };
