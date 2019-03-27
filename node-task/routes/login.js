const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.post("/:id", (req, res) => {
  jwt.sign({id: req.params.id}, "secretkey", { expiresIn: "2h" }, (err, token) => {
    res.json({
      token
    })
  })
})

module.exports = router
