import React, { useContext } from "react"
import ReactDOM from "react-dom"
import { ChatContext } from "../contexts/chatContext"
import styles from "./SessionModal.module.scss"

function SessionModal({ children }) {
  const { chatState, chatDispatch } = useContext(ChatContext)
  const handleBtnClick = () => {
    chatDispatch({ type: "TOGGLE_MODAL" })
  }

  return chatState.modal
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className={styles.overlay} onClick={handleBtnClick} />
          <div className={styles.modal}>{children}</div>
        </React.Fragment>,
        document.body
      )
    : null
}

export default SessionModal
