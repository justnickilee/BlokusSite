import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import GameController from "./GameState/GameState.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameController />
    </React.StrictMode>,
);
