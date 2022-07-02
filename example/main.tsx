import { useState, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import logo from "./logo.svg";
import "./index.css";

import { createSubscriptionStackHook } from "../src/subscription-stack-hook";

const useStack = createSubscriptionStackHook();

const App = () => {
  const [first, setFirst] = useState("1️⃣");
  const [second, setSecond] = useState("2️⃣");
  const [third, setThird] = useState("3️⃣");

  useStack(() => {
    const handler = () => setFirst("✅");
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });

  useStack(() => {
    const handler = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      setSecond("✅");
    };
    window.addEventListener("click", handler, { once: true });
    return () => window.removeEventListener("click", handler);
  });

  useStack(() => {
    const handler = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      setThird("✅");
    };
    window.addEventListener("click", handler, { once: true });
    return () => window.removeEventListener("click", handler);
  });

  return (
    <div>
      <img src={logo} className="logo" alt="logo" />
      <p>Click on screen</p>
      <h2>
        <code>{JSON.stringify([first, second, third])}</code>
      </h2>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
