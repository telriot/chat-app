import React, { useContext } from "react"
import { ChatContext } from "../contexts/chatContext"
import styles from "./SessionJoin.module.scss"

function SessionJoin() {
  const { chatState, chatDispatch } = useContext(ChatContext)
  const handleChange = (e) => {
    chatDispatch({ type: "HANDLE_INPUT", text: e.target.value })
    if (chatState.modalError) {
      chatDispatch({ type: "SET_MODAL_ERROR", error: null })
    }
  }
  const handleCancel = () => {
    if (chatState.modalError) {
      chatDispatch({ type: "SET_MODAL_ERROR", error: null })
    }
    chatDispatch({ type: "TOGGLE_MODAL" })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!chatState.input) {
      chatDispatch({ type: "SET_MODAL_ERROR", error: "Please enter a name" })
    } else {
      chatDispatch({ type: "SET_ROOM", input: chatState.input })
    }
  }
  return (
    <div className={styles.container}>
      <p className={styles.text}>Pick a session</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={chatState.input}
          name="sessionInput"
          onChange={handleChange}
          placeholder="Type here"
        />{" "}
        <div className={styles.errorDiv}>
          {chatState.modalError ? (
            <span className={styles.error}>{chatState.modalError}</span>
          ) : (
            <span className={styles.error}></span>
          )}
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btnCancel} onClick={handleCancel}>
            Cancel
          </button>
          <button
            disabled={chatState.connecting}
            className={styles.btnEnter}
            type="submit"
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  )
}

export default SessionJoin
