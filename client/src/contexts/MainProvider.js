import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import { apiCall } from "../utils/connect";

const MainContext = React.createContext();

export function useMain() {
  return useContext(MainContext);
}

export function MainProvider({ children }) {
  let history = useHistory();

  const [data, setData] = useState(JSON.parse(localStorage.getItem("Data")));

  async function createSession(Email) {
    const Result = await apiCall("post", "/api/validatemail", { Email });

    if (Result.exists) {
      alert("A Session has already been created with this mail");
    } else {

      const SessionId = uuidv4();
      const UserId = uuidv4();

      var date = new Date();

      var Data = JSON.parse(localStorage.getItem("Data"));
      if (localStorage.getItem("Data") !== null) {
        if (date.getTime() > Data.date) {
          localStorage.removeItem("Data");
          date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
          localStorage.setItem(
            "Data",
            JSON.stringify({ SessionId, UserId, Email, date: date.getTime() })
          );
        }
      } else {
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        localStorage.setItem(
          "Data",
          JSON.stringify({ SessionId, UserId, Email, date: date.getTime() })
        );
      }

      setData(JSON.parse(localStorage.getItem("Data")));
    }

    // document.cookie = `sessionId=${SessionId};expires=${date.toUTCString()}`
    // document.cookie = `userId=${UserId};expires=${date.toUTCString()}`
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
    <MainContext.Provider value={{ createSession, data, setData }}>
      {children}
    </MainContext.Provider>
  );
}
