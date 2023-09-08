const router = require("express").Router()
const path = require("path")
const fs = require('fs')
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const nodemailer = require("nodemailer")
const dotenv = require('dotenv')
dotenv.config()


const emailTemplatePath = path.join(__dirname,'..', 'views/email.html');

const newsletterContent = fs.readFileSync(emailTemplatePath, 'utf-8')

async function getSubscribers(){
    let db = await open({
        filename: path.join(__dirname, "..", "database.db"),
        driver: sqlite3.Database
      })
    const query = `SELECT * FROM subscribers`
    const subscribers = await db.all(query)
    return subscribers
}

(async ()=>{
    try{
        const subscribers = await getSubscribers()
        console.log(subscribers)

        // Create a nodemailer transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        for (const subscriber of subscribers){
            //remplace les variables de email.html
            let personalizedContent = newsletterContent
            .replace('{{lastname}}', subscriber.lastname)
            .replace('{{firstname}}', subscriber.firstname)
            
            // créer le mail
            const options = {
                from: process.env.EMAIL_SENDER,
                to: subscriber.email,
                subject: "Test newsletter",
                html: personalizedContent
            }

            // envoi du mail
            transporter.sendMail(options, (error, info) =>{
                if(error) console.log(error)
                else console.log(info.response)
            })
        }
    }catch(err){
        console.error('Error fetching subscribers to populate variables in Newsletter', err)    }
})()

router.get('/', (req, res)=>{
    // Send the HTML email template as a response
    res.sendFile(emailTemplatePath);
})

module.exports = router