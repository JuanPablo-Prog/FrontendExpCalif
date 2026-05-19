import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global reset
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #08101e; }
  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }
  a { text-decoration: none; color: inherit; }
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .page-anim { animation: fadeIn 0.25s ease; }
  .modal-anim { animation: scaleIn 0.2s ease; }
  .toast-anim { animation: slideIn 0.2s ease; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  input:focus, select:focus, textarea:focus { outline: 2px solid #2563eb; outline-offset: -1px; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);