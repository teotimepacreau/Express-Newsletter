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

(async () => {
  try {
    const subscribers = await getSubscribers();
    console.log(subscribers);

    // Create a nodemailer transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com", //marche que avec outlook
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: "teotimetest@outlook.fr",
        pass: "test_111",
      },
    });

    for (const subscriber of subscribers) {
      //remplace les variables de email.html
      let personalizedContent = newsletterContent
        .replace("{{lastname}}", subscriber.lastname)
        .replace("{{firstname}}", subscriber.firstname);

      // images en PJ car sinon ne s'affichent pas
      const attachments = [
        {
          filename: 'building.png',
          path: path.join(__dirname,'..', 'public/images/building.png'),
          cid: 'image1', // Use the same 'cid' as in the src attribute
        },
        {
          filename: 'building2.png',
          path: path.join(__dirname,'..', 'public/images/building2.png'),
          cid: 'image2', // Use the same 'cid' as in the src attribute
        },
      ];

      // créer le mail
      const options = {
        from: "teotimetest@outlook.fr",
        to: subscriber.email,
        subject: "Test newsletter",
        html: personalizedContent,
        attachments: attachments // Attach images
      };

      // envoi du mail
      transporter.sendMail(options, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("email envoyé" + info.response);
        }
      });
    }
  } catch (err) {
    console.error(
      "Error fetching subscribers to populate variables in Newsletter",
      err
    );
  }; // Add random delay between 1-2 seconds
})();

router.get('/', (req, res)=>{
    // Send the HTML email template as a response
    res.sendFile(emailTemplatePath);
})

module.exports = router