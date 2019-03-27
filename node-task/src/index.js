require("dotenv").config({ path: "../.env" })
const express = require("express")
const bodyParser = require("body-parser")
const passport = require("./paspport")
const dbInstance = require("./dbDriver")
const personalCards = require("../routes/personalCards")
const personalDictionaries = require("../routes/personalDictionaries")
const login = require("../routes/login")

const app = express()

app.use(bodyParser.json())
app.use(
  "/personal_cards",
  passport.authenticate("jwt", { session: false }),
  personalCards(dbInstance)
)
app.use(
  "/personal_dictionaries",
  passport.authenticate("jwt", { session: false }),
  personalDictionaries(dbInstance)
)
app.use("/login", login)

app.listen(process.env.PORT)
