import React, { useContext } from "react"
import { OTSession } from "opentok-react"
import { ChatContext } from "../contexts/chatContext"
import Publisher from "./Publisher"
import Subscriber from "./Subscriber"
import ConnectionStatus from "./ConnectionStatus"
import ToggleButton from "./ToggleButton"
import SessionModal from "./SessionModal"
import SessionJoin from "./SessionJoin"
import styles from "./App.module.scss"

function AppFunctional() {
  const {
    sessionEventHandlers,
    handleError,
    chatState,
    chatDispatch,
  } = useContext(ChatContext)
  const { apiKey, sessionId, token } = chatState
  const handleModal = () => {
    chatDispatch({ type: "TOGGLE_MODAL" })
  }
  const handleDisconnect = () => {
    chatDispatch({ type: "HANDLE_DISCONNECT" })
  }
  return apiKey ? (
    <div className={styles.containerChat}>
      <ConnectionStatus />
      <OTSession
        apiKey={apiKey}
        sessionId={sessionId}
        token={token}
        onError={handleError}
        eventHandlers={sessionEventHandlers}
      >
        <Subscriber />
        <Publisher />
        <div className={styles.toggleBtn}>
          <ToggleButton />
        </div>
      </OTSession>

      <button className={styles.btnChat} onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  ) : (
    <div className={styles.container}>
      <h1 className={styles.header}>Super Secret Video Chat</h1>
      <button className={styles.btn} onClick={handleModal}>
        Join a Session
      </button>
      {chatState.modal ? (
        <SessionModal>
          <SessionJoin />
        </SessionModal>
      ) : null}
    </div>
  )
}
export default AppFunctional
