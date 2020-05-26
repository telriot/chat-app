import React, { useContext } from "react"
import { ChatContext } from "../contexts/chatContext"
import { OTPublisher } from "opentok-react"
import styles from "./Publisher.module.scss"
function Publisher() {
  const {
    chatState,
    onPublish,
    handleError,
    publisherEventHandlers,
  } = useContext(ChatContext)
  const { publishVideo } = chatState
  return (
    <div className={styles.publisher}>
      <OTPublisher
        className={styles.otPublisher}
        properties={{ publishVideo, height: 96, width: 128 }}
        onPublish={onPublish}
        onError={handleError}
        eventHandlers={publisherEventHandlers}
      />
    </div>
  )
}

export default Publisher
