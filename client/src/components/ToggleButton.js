import React, { useContext } from "react"
import { ChatContext } from "../contexts/chatContext"
import styles from "./ToggleButton.module.scss"

function ToggleButton() {
  const { chatState, toggleVideo } = useContext(ChatContext)
  const { publishVideo } = chatState
  return (
    <button className={styles.button} id="videoButton" onClick={toggleVideo}>
      {publishVideo ? "Disable" : "Enable"} Video
    </button>
  )
}

export default ToggleButton
