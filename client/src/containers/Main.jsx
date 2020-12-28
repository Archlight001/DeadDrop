import React from "react";
import { Route } from "react-router-dom";
import Chat from "../components/Chat";
import Homepage from "../components/Homepage";

import { SocketProvider } from "../contexts/SocketProvider";

export default function Main() {
  return (
    <div>
      <Route exact path="/">
        <Homepage />
      </Route>

      <Route exact path="/chat">
        <SocketProvider>
          <Chat />
        </SocketProvider>
      </Route>
    </div>
  );
}
