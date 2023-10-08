const router = require("express").Router();
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const welcomeEmailCompiled = handlebars.compile(
  fs.readFileSync(
    path.join(__dirname, "..", "views/welcomeemail.handlebars"),
    "utf-8"
  )
);

const newsletterCompiled = handlebars.compile(
  fs.readFileSync(
    path.join(__dirname, "..", "views/newsletter.handlebars"),
    "utf-8"
  )
);

const emailTemplateCompiled = handlebars.compile(
  fs.readFileSync(
    path.join(__dirname, "..", "views/layouts/emailtemplate.handlebars"),
    "utf-8"
  )
);
router.get("/", (req, res) => {
    const type = req.query.type;
    if (type === "welcomeemail") {
    bodyContent = welcomeEmailCompiled;
    } else if (type === "newsletter") {
    bodyContent = newsletterCompiled
    } else {
    res.status(400).send("Invalid Url");
    }

    const html = emailTemplateCompiled({
    content: bodyContent,
    });

    res.send(html)
});
module.exports = router;
