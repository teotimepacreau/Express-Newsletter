const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const cron = require("node-cron")
const dotenv = require("dotenv");
dotenv.config();

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
    })
    const subscribers = await getSubscribers();
    console.log(subscribers);

    for (const subscriber of subscribers) {
      //remplace les variables de email.html
      let personalizedContent = emailTemplateCompiled({
        title: "The 35mm missive n°1",
        newsletter: newsletterTemplateCompiled({
          firstname: subscriber.firstname,
          lastname: subscriber.lastname,
        }),
      })
      // images en PJ car sinon ne s'affichent pas
      const attachments = [
        {
          filename: "building.png",
          path: path.join(__dirname, "..", "public/images/building.png"),
          cid: "image1", // Use the same 'cid' as in the src attribute
        },
        {
          filename: "building2.png",
          path: path.join(__dirname, "..", "public/images/building2.png"),
          cid: "image2", // Use the same 'cid' as in the src attribute
        },
      ];

      // créer le mail
      const options = {
        from: "teotimetest@outlook.fr",
        to: subscriber.email,
        subject: "Test newsletter",
        html: personalizedContent,
        attachments: attachments, // Attach images
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
    console.log("Emails sent successfully");
  }catch(err){
    console.error("Error fetching subscribers to populate variables in Newsletter", err)
  }
  
}

cron.schedule("0 19 * * 6", mailer)


router.get("/", async (req, res) => {
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
      let personalizedContent = emailTemplateCompiled({
        title: "The 35mm missive n°1",
        newsletter: newsletterTemplateCompiled({
          firstname: subscriber.firstname,
          lastname: subscriber.lastname,
        }),
      })

      // images en PJ car sinon ne s'affichent pas
      const attachments = [
        {
          filename: "building.png",
          path: path.join(__dirname, "..", "public/images/building.png"),
          cid: "image1", // Use the same 'cid' as in the src attribute
        },
        {
          filename: "building2.png",
          path: path.join(__dirname, "..", "public/images/building2.png"),
          cid: "image2", // Use the same 'cid' as in the src attribute
        },
      ];

      // créer le mail
      const options = {
        from: "teotimetest@outlook.fr",
        to: subscriber.email,
        subject: "Test newsletter",
        html: personalizedContent,
        attachments: attachments, // Attach images
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
    console.log("Emails sent successfully");

  } catch (err) {
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
