const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

router.get('/', (req, res)=>{
    res.render ('unsubscribe',{
      title: "Unsubscribe"
    })   
})//render unsubscribe.handlebars

// récupération de la request POST depuis le formulaire unsubscribe qui n'est plus en JSON grace au middleware dans app.js : app.use(express.json())

module.exports = router