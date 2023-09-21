const router = require("express").Router()
const path = require("path")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

router.get('/', (req, res)=>{
    res.render ('unsubscribe',{//trouve directement dans views le unsubscribe.handlebars grâce à notre config dans app.js 
      title: "Unsubscribe"
    })   
})//render unsubscribe.handlebars

// récupération de la request DELETE du formulaire unsubscribe qui n'est plus en JSON grace au middleware dans app.js : app.use(express.json())
router.delete('/', async(req,res,next)=>{
  const email = req.body.email
  console.log('reveived data from unsub', email)

  let db = await open({
    filename: path.join(__dirname, '..', "database.db"),
    driver: sqlite3.Database
  })
  try{
    // check if email exists in the DB
    const existingSubscriber = await db.get(`SELECT * FROM subscribers WHERE email = ?`, [email])//WHERE email = ? est une SQL condition, ça filtre les lignes et retourne seulement la row qui correspond au paramètre entre []. Entre [] même s'il y a qu'une seule valeur car c'est une convention.

    if(!existingSubscriber){
      res.status(400).json({error: "Email don't exists in database"})//on récupère le status 400 dans le js front et on affiche la notif
      console.log("tried unsubscribing server side but email don't exists")
    }else{
      await db.run(`DELETE FROM subscribers WHERE email='${email}'`)
      res.status(201).json({message: "Unsubscribed successfully"})
      console.log('Record deleted: ',email)
    }
  }catch(err){
    console.error("Error deleting record", err);
    res.status(500).json({error: "Internal server error"})
    next(err)
  }
})
module.exports = router