import React, { useReducer, createContext, useEffect } from "react"
import { TYPES } from "./types"
import axios from "axios"

const initialState = {
  room: "",
  apiKey: null,
  sessionId: null,
  token: null,
  error: null,
  modaleError: null,
  connecting: false,
  connection: "Connecting",
  publishVideo: true,
  modal: false,
  input: "",
}
export const ChatContext = createContext(initialState)

const ChatContextProvider = ({ children }) => {
  const appReducer = (state, action) => {
    switch (action.type) {
      case TYPES.HANDLE_CONNECTION:
        return {
          ...state,
          connection: action.connection,
        }
      case TYPES.HANDLE_ERROR:
        return {
          ...state,
          error: action.error,
          room: "",
        }
      case TYPES.SET_MODAL_ERROR:
        return {
          ...state,
          input: "",
          modalError: action.error,
        }
      case TYPES.SET_CONNECTING:
        return {
          ...state,
          connecting: state.connecting ? false : true,
        }

      case TYPES.HANDLE_PUBLISH_VIDEO:
        console.log(action)
        return {
          ...state,
          publishVideo: action.publishVideo,
        }
      case TYPES.SET_CONNECTION_DATA:
        return {
          ...state,
          apiKey: action.apiKey,
          sessionId: action.sessionId,
          token: action.token,
          connecting: false,
        }
      case TYPES.TOGGLE_MODAL:
        return {
          ...state,
          modal: state.modal ? false : true,
          input: null,
        }
      case TYPES.HANDLE_INPUT:
        return {
          ...state,
          input: action.text,
        }
      case TYPES.SET_ROOM:
        return {
          ...state,
          room: action.input,
        }
      case TYPES.HANDLE_DISCONNECT:
        return {
          initialState,
        }
      default:
        return state
    }
  }

  const [chatState, chatDispatch] = useReducer(appReducer, initialState)
  const cleanup = async () => {
    console.log("cleanup")
    try {
      await axios.post(`/api/logout`, { room: chatState.room })
    } catch (error) {
      console.log(error)
    }
  }
  const sessionEventHandlers = {
    sessionConnected: () => {
      chatDispatch({ type: "HANDLE_CONNECTION", connection: "Connected" })
    },
    sessionDisconnected: () => {
      chatDispatch({ type: "HANDLE_CONNECTION", connection: "Disconnected" })
      cleanup()
    },
    sessionReconnected: () => {
      chatDispatch({ type: "HANDLE_CONNECTION", connection: "Reconnected" })
    },
    sessionReconnecting: () => {
      chatDispatch({ type: "HANDLE_CONNECTION", connection: "Reconnecting" })
    },
  }

  const publisherEventHandlers = {
    accessDenied: () => {
      console.log("User denied access to media source")
    },
    streamCreated: () => {
      console.log("Publisher stream created")
    },
    streamDestroyed: ({ reason }) => {
      console.log(`Publisher stream destroyed because: ${reason}`)
    },
  }

  const subscriberEventHandlers = {
    videoEnabled: () => {
      console.log("Subscriber video enabled")
    },
    videoDisabled: () => {
      console.log("Subscriber video disabled")
    },
  }

  const handleError = (error) => {
    chatDispatch({ type: "HANDLE_ERROR", error })
  }

  const onPublish = () => {
    console.log("Publish Success")
  }

  const onSubscribe = () => {
    console.log("Subscribe Success")
  }

  const toggleVideo = () => {
    chatDispatch({
      type: "HANDLE_PUBLISH_VIDEO",
      publishVideo: chatState.publishVideo ? false : true,
    })
  }

  const apiRequest = async () => {
    try {
      chatDispatch({ type: "SET_CONNECTING" })
      const response = await axios.get(`/api/room/${chatState.room}`)
      if (response.data.error) {
        chatDispatch({ type: "SET_MODAL_ERROR", error: response.data.error })
        chatDispatch({ type: "SET_CONNECTING" })
      } else {
        const { apiKey, sessionId, token } = response.data
        chatDispatch({ type: "TOGGLE_MODAL" })
        chatDispatch({ type: "SET_CONNECTION_DATA", apiKey, sessionId, token })
      }
    } catch (error) {
      chatDispatch({ type: "SET_CONNECTING" })
      console.log(error)
      alert(
        "Failed to get opentok sessionId and token. Make sure you have updated the config.js file."
      )
    }
  }

  useEffect(() => {
    chatState.room && apiRequest()
    /*fetch(SAMPLE_SERVER_BASE_URL + "/room/test")
    .then((data) => data.json())
    .then(renderApp)
    .catch((err) => {
      console.error("Failed to get session credentials", err)
      alert(
        "Failed to get opentok sessionId and token. Make sure you have updated the config.js file."
      )
    })*/
    //return chatState.room ? cleanup() : null
  }, [chatState.room])
  return (
    <ChatContext.Provider
      value={{
        chatState,
        chatDispatch,
        sessionEventHandlers,
        publisherEventHandlers,
        subscriberEventHandlers,
        handleError,
        onPublish,
        onSubscribe,
        toggleVideo,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContextProvider
