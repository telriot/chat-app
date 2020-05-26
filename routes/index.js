const express = require("express")
const router = express.Router()
const _ = require("lodash")
const mongoose = require("mongoose")
const Session = require("../models/session")

const apiKey = process.env.TOKBOX_API_KEY
const secret = process.env.TOKBOX_SECRET

if (!apiKey || !secret) {
  console.error("Missing TOKBOX_API_KEY or TOKBOX_SECRET")
  process.exit()
}
const OpenTok = require("opentok")
const opentok = new OpenTok(apiKey, secret)

let roomToSessionIdDictionary = {}

const findRoomFromSessionId = (sessionId) => {
  return _.findKey(roomToSessionIdDictionary, (value) => {
    return value === sessionId
  })
}

/* GET /room/:name */

router.get("/room/:name", async (req, res) => {
  const roomName = req.params.name
  let sessionId
  let token
  console.log(
    "attempting to create a session associated with the room: " + roomName
  )

  // if the room name is associated with a session ID, fetch that
  //if (roomToSessionIdDictionary[roomName]) {
  //sessionId = roomToSessionIdDictionary[roomName]
  let room
  try {
    room = await Session.findOne({ name: roomName })
  } catch (error) {
    console.log(error)
  }
  if (room) {
    if (room.users > 1) {
      console.log("FULL")
      res.send({ error: "The session is full" })
    } else {
      // generate token
      sessionId = room.sessionId
      token = opentok.generateToken(sessionId)
      const newUsers = room.users + 1
      console.log(room, newUsers, "ADDING 1 USER")
      await Session.updateOne({ name: room.name }, { users: newUsers })
      res.setHeader("Content-Type", "application/json")
      res.send({
        apiKey: apiKey,
        sessionId: sessionId,
        token: token,
      })
    }
  }
  // if this is the first time the room is being accessed, create a new session ID
  else {
    opentok.createSession({ mediaMode: "relayed" }, (err, session) => {
      if (err) {
        console.log(err)
        res.status(500).send({ error: "createSession error:" + err })
        return
      }

      // now that the room name has a session associated wit it, store it in memory
      // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
      // if you want to store a room-to-session association in your production application
      // you should use a more persistent storage for them
      //roomToSessionIdDictionary[roomName] = session.sessionId

      // generate token
      token = opentok.generateToken(session.sessionId)
      Session.create({
        name: roomName,
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token,
        users: 1,
      })
      res.setHeader("Content-Type", "application/json")
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token,
      })
    })
  }
})

/*POST /logout */

router.post("/logout", async (req, res) => {
  try {
    const session = await Session.findOne({ name: req.body.room })
    if (session) {
      console.log(session, "DELETING")
      if (session.users <= 1) {
        await session.delete()
      } else {
        console.log(session, "REMOVING 1 USER")

        const newUsers = session.users - 1
        await Session.updateOne({ name: session.name }, { users: newUsers })
      }
      res.send("Session logged out")
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
