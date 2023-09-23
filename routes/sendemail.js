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

// TOUS LES PATHS

// Read the file synchronously (or asynchronously, as needed)
// Read the file synchronously
const binaryImg1 = fs.readFileSync(path.join(__dirname, '..', 'public/images/building1.png'), 'base64');
const binaryImg2 = fs.readFileSync(path.join(__dirname, '..', 'public/images/building2.png'), 'base64');

const emailTemplatePath = path.join(__dirname, "..", "views/layouts/emailtemplate.handlebars");
const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

const newsletterPath = path.join(__dirname,"..", "views/newsletter.handlebars");
const newsletterContent = fs.readFileSync(newsletterPath, "utf-8");

// Register the "newsletter" partial
handlebars.registerPartial('newsletter', newsletterContent);

// Compile the Handlebars templates
const emailTemplateCompiled = handlebars.compile(emailTemplate);
const newsletterTemplateCompiled = handlebars.compile(newsletterContent);

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
      let personalizedContent = emailTemplateCompiled({
        title: "The fictive brands newsletter",
        firstname: subscriber.firstname, // Provide firstname and lastname directly
        lastname: subscriber.lastname,
      });
      // let personalizedContent = newsletterContent
      // .replace('{{lastname}}', subscriber.lastname)
      // .replace('{{firstname}}', subscriber.firstname)
      // // images en PJ car sinon ne s'affichent pas
      
      const attachments = [
        {
          content: binaryImg1, // const à du fichier à joindre
          cid: 'building1', // required to cid HTML
          filename: 'building1',//je nomme comme je veux
          type: 'image/jpeg',
          disposition: 'inline',
          content_id: 'building1',//obligé de mettre pour que la disposition foncttionne
        },
        {
          content: binaryImg2, // const à du fichier à joindre
          cid: 'building2', // required to cid HTML
          filename: 'building2',//je nomme comme je veux
          type: 'image/jpeg',
          disposition: 'inline',
          content_id: 'building2',//obligé de mettre pour que la disposition foncttionne
        },
      ];

      const msg = {
        to: subscriber.email,
        from: {
          name: 'Teotime Pacreau',
          email: process.env.FROM_EMAIL
        },
        subject: 'The fictive brands newsletter',
        html: personalizedContent,
        attachments: attachments
        };

        const sendMail = async () => {
          try {
            await sgMail.send(msg);
          } catch (error) {
            console.error(error);
        
            if (error.response) {
              console.error(error.response.body)
            }
          }
        };
        
        sendMail()
        console.log("Emails sent successfully");
      }
      
      }catch(err){
        console.error("Error fetching subscribers to populate variables in Newsletter", err)
      }
}

cron.schedule("0 19 * * 6", mailer)


router.get("/", async (req, res) => {
  try {
    await mailer()
  }catch(err) {
    console.error("Error fetching subscribers to populate variables in Newsletter", err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/showhtml", (req, res) => {
  res.render("newsletter", {


    title: "The 35mm missive n°1",
    layout: "emailtemplate",
  });
});

module.exports = router;
