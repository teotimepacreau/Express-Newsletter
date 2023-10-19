const fs = require("fs")
const express = require("express")
const app = express()
const port = 8080
const path = require('path')
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const handlebars = require("handlebars")
const handlebarsHelper = require('./handlebarsHelper');

//LE MIDDLEWARE APP.USE DANS APP.JS S'APPLIQUE A TOUTES LES ROUTES, INDEPENDAMMENT DE LURL ET DU TYPE DE REQUETE,  permet de parser le JSON data received in the form
app.use(express.json());//If the Content-Type header is indeed application/json, the express.json() middleware kicks in. It reads the JSON data from the request body and parses it into a JavaScript object.

// pour les views : HANDLEBARS
const { engine } = require("express-handlebars")

app.engine('handlebars', engine())
app.set('views', path.join(__dirname, 'views'));//quand j'utilise res.render('templatename) ça regardera directement dans le /views
app.set('view engine', 'handlebars');


//css
app.use(express.static(path.join(__dirname, "public")))

//SERVEUR ET HOMEPAGE
app.get('/', (req, res)=>{//page d'accueil renvoie par défaut vers /subscribe
  res.redirect("/subscribe");
})

app.listen(port, ()=>{
  console.info(`serveur à l'écoute sur le port ${port}`)
})

// SUBSCRIBE ROUTE
const subscribeRouter = require('./routes/subscribe.js');
app.use("/subscribe", subscribeRouter);

// UNSUBSCRIBE ROUTE
const unsubscribeRouter = require('./routes/unsubscribe.js')
app.use("/unsubscribe", unsubscribeRouter)

//EMAIL ROUTE 
const emailRouter = require('./routes/sendemail.js')
app.use("/sendemail", emailRouter)

//RENDER EMAIL CLIENT IN NEW TAB ROUTE
const renderRouter = require('./routes/render.js')
app.use("/render", renderRouter)

// RENDER ISSUE
const issueRouter = require('./routes/issue.js')
app.use('/issue', issueRouter)


//DB INIT
const openDBandCreateTable = async () => {
  // open DB : if there is no database.db it creates it
  const dbPath = path.join(__dirname, 'database.db');
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    // create table if not exists already
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email NVARCHAR(255) NOT NULL UNIQUE,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
      )`);
      return db
    }

openDBandCreateTable()
