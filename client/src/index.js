import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"
import "@opentok/client"
import AppFunctional from "./components/AppFunctional"
import ChatContextProvider from "./contexts/chatContext"

ReactDOM.render(
  <React.StrictMode>
    <ChatContextProvider>
      <AppFunctional />
    </ChatContextProvider>
  </React.StrictMode>,

  document.getElementById("root")
)
