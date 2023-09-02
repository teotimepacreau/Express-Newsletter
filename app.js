const fs = require("fs")
const express = require("express")
const app = express()
const port = 3000
const path = require('path')
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

// Middleware to parse JSON data received in the form
app.use(express.json());//If the Content-Type header is indeed application/json, the express.json() middleware kicks in. It reads the JSON data from the request body and parses it into a JavaScript object.

// pour les views : HANDLEBARS
const { engine } = require("express-handlebars")

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))

//css
app.use(express.static(path.join(__dirname, "public")))

//SERVEUR ET HOMEPAGE
app.get('/', (req, res)=>{//page d'accueil renvoie par défaut vers /subscribe
  res.redirect("/subscribe");
})

app.listen(port, ()=>{
  console.log(`serveur à l'écoute sur le port${port}`)
})

// SUBSCRIBE ROUTE
const subscribeRouter = require('./routes/subscribe.js');
app.use("/subscribe", subscribeRouter);

//CREATION DE LA DB
const createdb = async () => {
  const dbPath = path.join(__dirname, 'database.db');
try{
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email NVARCHAR(255) NOT NULL UNIQUE,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
      )`);
      return db//permet d'y accéder dans la fonction d'en dessous
    }catch(err){
      console.error(err)
    }
};
createdb()

// ACCEDER A LA BDD après ouverture
/*
async function main() {
  const db = await createdb();

  try {
    const result = await db.get(`SELECT * FROM subscribers`);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

// Call the main function to start the process
main();
*/