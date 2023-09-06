const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

router.get('/', (req, res)=>{
    res.render('subscribe', {
        title: "Subscribe"
    })//render subscribe.handlebars
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
    }catch(err){
        console.error("Error inserting record:", err); // Debug line
        res.status(400).json({error: 'Email already exists'})
        next(err)
    }
})

module.exports = router