import React, { useState, useEffect } from "react";
import { Redirect, Router } from "@reach/router";
import { Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";
import NavBar from "./modules/NavBar";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
import APITester from "./debugging/APITester";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // TRhey are registed in the database and currently logged in.
          setUserId(user._id);
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      );
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
  const homePage = <Home handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />;
  const gamePage = <Game />;
  const lobbyPage = <Lobby />;
  const notFound = <NotFound />;
  return (
    <>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={homePage} />
          <Route path="/game/" element={gamePage} />
          <Route path="/lobby/:roomCode" element={lobbyPage} />
          <Route path="*" element={notFound} />
        </Routes>
      </div>
      {/*uncomment for testing*/}
      {/*<APITester />*/}
    </>
  );
};

export default App;
