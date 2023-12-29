const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const handlebars = require("handlebars");
const sgMail = require('@sendgrid/mail');
const cron = require("node-cron")
const dotenv = require("dotenv");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Compiling emailtemplate and newsletter
const emailTemplateCompiled = handlebars.compile(fs.readFileSync((path.join(__dirname, "..", "views/layouts/emailtemplate.handlebars")), "utf-8"));

const newsletterCompiled = handlebars.compile(fs.readFileSync(path.join(__dirname, "..", "views/newsletter.handlebars"), "utf-8"));

async function getSubscribers() {
  try{
    let db = await open({
      filename: path.join(__dirname, "..", "database.db"),
      driver: sqlite3.Database,
    });
    const subscribers = await db.all(`SELECT * FROM subscribers`);
    return subscribers;
  }catch(err){
    console.error(err)  } 
}


const mailer = async ()=>{
  try{
    const subscribers = await getSubscribers();
    console.log(subscribers);

    for (const subscriber of subscribers) {
      //remplace les variables de email.html
      const personalizedContent = newsletterCompiled({
        firstname: subscriber.firstname,
        lastname: subscriber.lastname,
      });
      const emailContent = emailTemplateCompiled({
        title: "Feuillu, the newsletter unveiling insights of inspirational website layouts",
        content: personalizedContent,
      });

      const msg = {
        to: subscriber.email,
        from: {
          name: 'Teotime Pacreau',
          email: process.env.FROM_EMAIL
        },
        subject: '#1 ● 💻 Feuillu, the website layouts newsletter',
        html: emailContent
        };

        const sendMail = async () => {
          try {
            await sgMail.send(msg);
            console.log("Email sent successfully");
          } catch (error) {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
          }
        };  
        sendMail()
      }
      
      }catch(err){
        console.error("Error fetching subscribers to populate variables in Newsletter", err)
      }
}

// NOT ACTIVATING THE CRONJOB TO NOT POLLUTE EMAIL BOXES, but if activated it would send the mail At 19:00 every Saturday
// cron.schedule("0 19 * * 6", mailer)


router.get("/", async (req, res) => {
  try {
    await mailer()
    res.status(200).send("Email sent successfully")
  }catch(err) {
    console.error("Error fetching subscribers to populate variables in Newsletter", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
