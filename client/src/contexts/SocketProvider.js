import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useMain } from "./MainProvider";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { data } = useMain();
  console.log(data);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        SessionId: data.SessionId,
        UserId: data.UserId,
        email: data.email,
        date:data.date
      },
    });
  }, [data]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
}