import React, { useContext } from "react"
import { ChatContext } from "../contexts/chatContext"
import styles from "./ConnectionStatus.module.scss"

function ConnectionStatus() {
  const { chatState } = useContext(ChatContext)
  const { connection, error } = chatState
  return (
    <>
      <div className={styles.text}>{chatState.room}</div>
      <div
        className={
          connection === "Connected" || connection === "Reconnected"
            ? styles.connectionUp
            : connection === "Reconnecting"
            ? styles.connectionReconnecting
            : styles.connectionDown
        }
        id="sessionStatus"
      ></div>
      {error ? (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      ) : null}
    </>
  )
}

export default ConnectionStatus
