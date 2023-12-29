const router = require("express").Router();
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const sgMail = require("@sendgrid/mail");
const handlebars = require("handlebars");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/", (req, res) => {
  res.render(
    "subscribe", //trouve directement dans views subscribe.handlebars grâce à notre config dans app.js
    { title: "Subscribe" }
  );
});
// récupération de la request POST du formulaire subscribe qui n'est plus en JSON grace au middleware dans app.js : app.use(express.json())
router.post("/", async (req, res, next) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  console.log("received data", typeof req.body, req.body);

  let db = await open({
    filename: path.join(__dirname, "..", "database.db"),
    driver: sqlite3.Database,
  });

  try {
    const sendWelcomeMailAndNewsletter = async () => {
      try {
        await db.run(
          `
            INSERT INTO subscribers (email, firstname, lastname) VALUES (?, ?, ?)
        `,
          email,
          firstname,
          lastname
        );
        res.status(201).json({ message: "Subscribed successfully" });
        console.log("Record inserted:", email, firstname, lastname); // Debug line

        // 1. Once the subscribed notif is sent, send a welcome email

        //
        let emailTemplateCompiled = handlebars.compile(
          fs.readFileSync(
            path.join(
              __dirname,
              "..",
              "views/layouts/emailtemplate.handlebars"
            ),
            "utf-8"
          )
        );

        let welcomeEmailCompiled = handlebars.compile(
          fs.readFileSync(
            path.join(__dirname, "..", "views/welcomeemail.handlebars"),
            "utf-8"
          )
        );

        let personalizedContent = welcomeEmailCompiled({
          firstname: firstname,
          lastname: lastname,
        });
        let emailContent = emailTemplateCompiled({
          title:
            "💻 ● Welcome to Feuillu, the newsletter decrypting website design trends",
          content: personalizedContent,
        });

        const msg = {
          to: email,
          from: {
            name: "Teotime Pacreau",
            email: process.env.FROM_EMAIL,
          },
          subject:
            "💻 ● Welcome to Feuillu, the newsletter decrypting website design trends",
          html: emailContent,
        };
        await sgMail.send(msg);
        console.log("Welcome email sent successfully");

        // ENVOI DE LA NEWSLETTER LORS DE L'INSCRIPTION UNIQUEMENT DANS UN BUT DE DEMONSTRATION IMMEDIATE DE LA FONCTIONNALITE
        const newsletter = async () => {
            try {
              const emailTemplateCompiled = handlebars.compile(
                fs.readFileSync(
                  path.join(
                    __dirname,
                    "..",
                    "views/layouts/emailtemplate.handlebars"
                  ),
                  "utf-8"
                )
              );
        
              const newsletterCompiled = handlebars.compile(
                fs.readFileSync(
                  path.join(__dirname, "..", "views/newsletter.handlebars"),
                  "utf-8"
                )
              );
        
              let db = await open({
                filename: path.join(__dirname, "..", "database.db"),
                driver: sqlite3.Database,
              });
              const subscribers = await db.all(`SELECT * FROM subscribers`);
        
              for (const subscriber of subscribers) {
                //remplace les variables de email.html
                const personalizedContent = newsletterCompiled({
                  firstname: subscriber.firstname,
                  lastname: subscriber.lastname,
                });
                const emailContent = emailTemplateCompiled({
                  title:
                    "Feuillu, the newsletter unveiling insights of inspirational website layouts",
                  content: personalizedContent,
                });
        
                const msg = {
                  to: subscriber.email,
                  from: {
                    name: "Teotime Pacreau",
                    email: process.env.FROM_EMAIL,
                  },
                  subject: "#1 ● 💻 Feuillu, the website layouts newsletter",
                  html: emailContent,
                };
        
                const sender = async () => {
                  try {
                    await sgMail.send(msg);
                    console.log("Newsletter sent successfully");
                  } catch (error) {
                    console.error(error);
                    if (error.response) {
                      console.error(error.response.body);
                    }
                  }
                };
                sender();
              }
            } catch (err) {
              console.error(
                "Error fetching subscribers to populate variables in Newsletter",
                err
              );
            }
          };
          newsletter();
      } catch (error) {
        console.error(error);
      }
    };
    sendWelcomeMailAndNewsletter();


  } catch (error) {
    console.error("Error inserting record:", error); // Debug line
    res.status(400).json({ error: "Email already exists" });
    next(error);
  }
  
});

module.exports = router;
