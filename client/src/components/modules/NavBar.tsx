import React from "react";
import { Link } from "@reach/router";

const NavBar = (props) => {
  return (
    <div>
      <Link to="/" className="NavBar-link">
        Home
      </Link>
      <Link to="/game/" className="NavBar-link">
        Game
      </Link>
    </div>
  )
}

export default NavBar