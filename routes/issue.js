const router = require("express").Router()
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars");

// Compiling emailtemplate and newsletter
const emailTemplateCompiled = handlebars.compile(fs.readFileSync((path.join(__dirname, "..", "views/layouts/emailtemplate.handlebars")), "utf-8"));

const newsletterCompiled = handlebars.compile(fs.readFileSync(path.join(__dirname, "..", "views/newsletter.handlebars"), "utf-8"));

router.get('/', (req, res)=>{
    const bodyContent = newsletterCompiled
    const html = emailTemplateCompiled({
        content: bodyContent,
        });
    res.send(html)
})

module.exports = router