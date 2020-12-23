import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {useHistory} from "react-router-dom";
const MainContext = React.createContext();

export function useMain() {
  return useContext(MainContext);
}

export function MainProvider({ children }) {
    let history = useHistory();

    const [data,setData] = useState(JSON.parse(localStorage.getItem("Data")))

    

  function createSession() {
    const newSessionId = uuidv4();
    const newUserId = uuidv4();
    const codeName = "John Wick";

    var date = new Date();

    var Data = JSON.parse(localStorage.getItem("Data"));
    if (localStorage.getItem("Data") !== null) {
      if (date.getTime() > Data.date ) {
        localStorage.removeItem("Data");
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        localStorage.setItem(
          "Data",
          JSON.stringify({ newSessionId, newUserId, date: date.getTime() })
        );
      }

    } else {
      date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
      localStorage.setItem(
        "Data",
        JSON.stringify({ newSessionId, newUserId, date: date.getTime() })
      );
    }

    setData(JSON.parse(localStorage.getItem("Data")))

    // document.cookie = `sessionId=${newSessionId};expires=${date.toUTCString()}`
    // document.cookie = `userId=${newUserId};expires=${date.toUTCString()}`
  }

  useEffect(()=>{
    console.log(data);
    if (data !== null) {
        var date = new Date();
        
        if (date.getTime() > data.date ) {
            localStorage.removeItem("Data");
            history.push("/")
        }else{
            history.push("/chat")
        }

    }
  },[data])

  return (
    <MainContext.Provider value={{ createSession,data,setData }}>
      {children}
    </MainContext.Provider>
  );
}
