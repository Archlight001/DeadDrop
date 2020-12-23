import React from "react";
import { Route } from "react-router-dom";
import Chat from "../components/Chat";
import Homepage from "../components/Homepage";

export default function Main() {
  return (
    <div>
      <Route exact path="/">
        <Homepage />
      </Route>

      <Route exact path="/chat">
          <Chat />
      </Route>
    </div>
  );
}
