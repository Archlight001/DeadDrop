import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";

const ChatContext = React.createContext();

export function useChat() {
  return useContext(ChatContext);
}
export default function ChatProvider({ children }) {
  const { socket } = useSocket();
  const [chatLog, addToChat] = useState([]);

  console.log(chatLog);
  useEffect(() => {
    if (socket !== undefined) {
      socket.on("new-user", (user) => {
        let newArray = [...chatLog, { type: "announcement", content: user }];
        addToChat(newArray);
      });

      socket.on("user-exit", (user) => {
        let newArray = [...chatLog, { type: "announcement", content: user }];
        addToChat(newArray);
      });
    }
  }, [socket, chatLog]);
  return (
    <ChatContext.Provider value={{ chatLog }}>{children}</ChatContext.Provider>
  );
}
