import { useState, StrictMode } from "react";
import logo from "./logo.svg";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createStackEventsHook } from "./stack-events-hook";

const useStackEvents = createStackEventsHook();

const App = () => {
  const [first, setFirst] = useState("1️⃣");
  const [second, setSecond] = useState("2️⃣");
  const [third, setThird] = useState("3️⃣");

  useStackEvents(() => {
    const handler = () => setFirst("");
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  useStackEvents(() => {
    const handler = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      setSecond("");
    };
    window.addEventListener("click", handler, { once: true });
    return () => window.removeEventListener("click", handler);
  });

  useStackEvents(() => {
    const handler = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      setThird("");
    };
    window.addEventListener("click", handler, { once: true });
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div>
      <img src={logo} className="logo" alt="logo" />
      <p>Click on screen</p>
      <h2>{JSON.stringify([first, second, third].filter(Boolean))}</h2>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
