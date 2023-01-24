import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

import "./Home.css";
import { RouteComponentProps } from "@reach/router";

import { CreateLobbyButton, JoinLobbyButton } from "../modules/MenuButton";

const GOOGLE_CLIENT_ID = "488291385403-8ociqks8epjcr7dlmb4t3447an4u148p.apps.googleusercontent.com";

type Props = RouteComponentProps & {
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
      <CreateLobbyButton />
      <JoinLobbyButton />
    </div>
  );
};

export default Home;
