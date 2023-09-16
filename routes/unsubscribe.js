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
    await db.run(`DELETE FROM subscribers WHERE email='${email}'`)
    res.status(201).json({message: "Unsubscribed successfully"})
    console.log('Record deleted: ',email)
  }catch(err){
    console.error("Error deleting record:", err); // Debug line
    res.status(400).json({error: "Email don't exists in database"})
    next(err)
  }
})
module.exports = router