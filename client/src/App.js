import './App.css';
import {io} from "socket.io-client";
import Chat from "./components/Chat";
import { useEffect } from 'react';

function App() {
  // const socket = io('http://localhost:5000')

  useEffect(()=>{
 

    // socket.emit("join",name)

  },[])

  

  

  return (
    <div className="App">
      <Chat />
    </div>
  );
}

export default App;
