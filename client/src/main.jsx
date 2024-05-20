import React from "react";
import ReactDOM from "react-dom/client";

import { ChatProvider } from "./hooks/useChat";
import "./index.css";
import Homepages from "./Homepages";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <ChatProvider>
        <Homepages />
    </ChatProvider>

 
   
  </React.StrictMode>
);
