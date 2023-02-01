import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

import "./Home.css";

import { CreateLobbyButton, JoinLobbyButton } from "../modules/MenuButton";

const GOOGLE_CLIENT_ID = "488291385403-8ociqks8epjcr7dlmb4t3447an4u148p.apps.googleusercontent.com";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};
const Home = (props: Props) => {
  const { handleLogin, handleLogout } = props;

  return (
    <div className="container">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {props.userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error Logging in")} />
        )}
      </GoogleOAuthProvider>
      <h1 className="u-textCenter">Labyrinth</h1>
      <div className="u-flexColumn u-flex-alignCenter">
        <div className="flexButton-container">
          <CreateLobbyButton />
        </div>
        <div className="flexButton-container">
          <JoinLobbyButton />
        </div>
      </div>
    </div>
  );
};

export default Home;
