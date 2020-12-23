import "../css/App.css";
import { BrowserRouter } from "react-router-dom";

import Main from "../containers/Main";
import { MainProvider } from "../contexts/MainProvider";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MainProvider>
          <Main />
        </MainProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
