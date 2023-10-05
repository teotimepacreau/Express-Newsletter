const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars')
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', (req, res)=>{
    res.render('subscribe',//trouve directement dans views subscribe.handlebars grâce à notre config dans app.js 
    {title: "Subscribe"})
})
// récupération de la request POST du formulaire subscribe qui n'est plus en JSON grace au middleware dans app.js : app.use(express.json())
router.post('/', async (req, res, next)=>{
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    console.log('received data', typeof req.body, req.body)

    let db = await open({
        filename: path.join(__dirname, "..", "database.db"),
        driver: sqlite3.Database
      })

    try{
        await db.run(`
            INSERT INTO subscribers (email, firstname, lastname) VALUES (?, ?, ?)
        `, email, firstname, lastname);
        res.status(201).json({message: "Subscribed successfully"})
        console.log("Record inserted:", email, firstname, lastname); // Debug line

        // 1. Once the subscribed notif is sent, send a welcome email

        // 
        let emailTemplateCompiled = handlebars.compile(fs.readFileSync((path.join(__dirname, "..", "views/layouts/emailtemplate.handlebars")),"utf-8"));

        let welcomeEmailCompiled = handlebars.compile(fs.readFileSync((path.join(__dirname,"..", "views/welcomeemail.handlebars")), "utf-8"))


        let personalizedContent = welcomeEmailCompiled({
            firstname: firstname,
            lastname: lastname,
        })
        let emailContent = emailTemplateCompiled({
            title: "Welcome to the fictive brands newsletter",
            content: personalizedContent
        })

        const msg = {
            to: email,
            from: {
                name: "Teotime Pacreau",
                email: process.env.FROM_EMAIL
            },
            subject: "💻 • Welcome to Feuillu, the website layouts newsletter",
            html: emailContent
        }

        const sendMail = async()=>{
            try{
                await sgMail.send(msg)
                console.log("Welcome email sent successfully")
            }catch(error){
                console.error(error)
            }
        }
        sendMail()
    }catch(error){
        console.error("Error inserting record:", error); // Debug line
        res.status(400).json({error: 'Email already exists'})
        next(error)
    }
})

module.exports = router