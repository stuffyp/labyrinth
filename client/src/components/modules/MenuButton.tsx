import { get, post } from "../../utilities";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigate } from "@reach/router";

const CreateLobbyButton = (props) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          post("api/create-lobby").then((response) => {
            setRoomCode(response.code);
            sessionStorage["last-room-joined"] = response.code;
            navigate(`/lobby/${response.code}`);
          });
        }}
      >
        Create Lobby
      </button>
    </div>
  );
};

const JoinLobbyButton = (props) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

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
            sessionStorage["last-room-joined"] = response.code;
            navigate(`/lobby/${response.code}`);
          });
        }}
      >
        Join Lobby
      </button>
    </div>
  );
};

type StartGameProps = {
  roomCode: string;
};
const StartGameButton = (props: StartGameProps) => {
  //const [active, setActive] = useState(true);
  return (
    <>
      {
        /*active && */ <button
          onClick={() => {
            post("/api/start-game", { roomCode: props.roomCode }).then(() => {
              //setActive(false);
            });
          }}
        >
          New Game
        </button>
      }
    </>
  );
};

const LeaveGameButton = (props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        console.log("hi");
        post("/api/leave-game").then(() => {
          console.log("bye");
          navigate("/");
        });
      }}
    >
      Leave Game
    </button>
  );
};

export { CreateLobbyButton, JoinLobbyButton, StartGameButton, LeaveGameButton };
