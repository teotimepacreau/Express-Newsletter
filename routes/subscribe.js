const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

router.get('/', (req, res)=>{
    res.render('subscribe', {
        title: "Subscribe"
    })//render home.handlebars
})
// récupération du mail
router.post('/', async (req, res)=>{
    const email = req.body.email
    console.log('email received', email)

    let db = await open({
        filename: path.join(__dirname, "..", "database.db"),
        driver: sqlite3.Database
      })

    try{
        await db.run(`
            INSERT INTO subscribers (email) VALUES (?)
        `, email);
        res.status(201).json({message: "Subscribed successfully"})
        console.log("Record inserted:", email); // Debug line
    }catch(err){
        console.error("Error inserting record:", err); // Debug line
        res.status(400).json({error: 'Email already exists'})
    }
})


module.exports = router