const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

router.get('/', (req, res)=>{
    const emailTemplatePath = path.join(__dirname,'..', 'views/email.html');
  
    // Send the HTML email template as a response
    res.sendFile(emailTemplatePath);
})

module.exports = router