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

  const [isAdmin,setAdmin] = useState(false);

  async function createSession(Email) {
    const Result = await apiCall("post", "/api/validate", { Email });

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
            JSON.stringify({ SessionId, UserId, Email, date: date.getTime(),Codename:Result.Codename })
          );
        }
      } else {
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        localStorage.setItem(
          "Data",
          JSON.stringify({ SessionId, UserId, Email, date: date.getTime(),Codename:Result.Codename })
        );
      }

      setData(JSON.parse(localStorage.getItem("Data")));
    }

    // document.cookie = `sessionId=${SessionId};expires=${date.toUTCString()}`
    // document.cookie = `userId=${UserId};expires=${date.toUTCString()}`
  }

  async function joinSession(SessionId, UserId) {
    const Result = await apiCall("post", "/api/validate", { SessionId,UserId });

    if (!Result.exists && localStorage.getItem("Data") !== null) {
      localStorage.removeItem("Data");
      setData(null);
    } else if (Result.exists) {
      localStorage.setItem(
        "Data",
        JSON.stringify({ SessionId, UserId, date: Result.Date,Codename:Result.Codename })
      );
      setData(JSON.parse(localStorage.getItem("Data")));
    }
  }

  useEffect(() => {
    console.log(data);
    async function checkAdmin(){
      let checkUser = await apiCall("post","/api/isAdmin",{id:data.UserId})
      setAdmin(checkUser.isAdmin)
    }
    if (data !== null) {
      var date = new Date();

      if (date.getTime() > data.date) {
        localStorage.removeItem("Data");
        history.push("/");
      } else {
        checkAdmin()
        history.push("/chat");
      }
    }
  }, [data]);

  return (
    <MainContext.Provider value={{ createSession, joinSession, data, setData,isAdmin }}>
      {children}
    </MainContext.Provider>
  );
}
