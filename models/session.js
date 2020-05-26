const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.promise = Promise

const SessionSchema = new Schema({
  name: String,
  users: Number,
  apiKey: String,
  sessionId: String,
  token: String,
})

const Session = mongoose.model("Session", SessionSchema)
module.exports = Session
