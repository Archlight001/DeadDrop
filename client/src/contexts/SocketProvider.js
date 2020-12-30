import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useMain } from "./MainProvider";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { data } = useMain();
  const [socket,setSocket] = useState()
  console.log(data);

 


  useEffect(() => {
    // const socket = io("http://localhost:5000", {
    //   query: {
    //     SessionId: data.SessionId,
    //     UserId: data.UserId,
    //     email: data.email,
    //     date:data.date
    //   },
    // });
    const socket = io("http://localhost:5000");
    setSocket(socket)

    socket.emit("enter-chat",data)

    socket.on("new-user",(user)=>{
      console.log(user);
    })

    return ()=> socket.close()
  }, [data]);

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>;
}
