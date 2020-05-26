import React, { useContext } from "react"
import { ChatContext } from "../contexts/chatContext"
import { OTStreams, OTSubscriber } from "opentok-react"
import styles from "./Subscriber.module.scss"
import Publisher from "./Publisher"
function Subscriber() {
  const { onSubscribe, handleError, subscriberEventHandlers } = useContext(
    ChatContext
  )
  return (
    <div className={styles.subscriber}>
      <OTStreams>
        <OTSubscriber
          properties={{ height: "100%", width: "100%" }}
          onSubscribe={onSubscribe}
          onError={handleError}
          eventHandlers={subscriberEventHandlers}
          className={styles.otSubscriber}
        />
      </OTStreams>
    </div>
  )
}

export default Subscriber
