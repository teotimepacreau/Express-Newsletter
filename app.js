const fs = require("fs")
const express = require("express")
const app = express()
const port = 3000
const path = require('path')
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

// Middleware to parse JSON data from the request body
app.use(express.json());

// pour les views
const { engine } = require("express-handlebars")

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))

//css
app.use(express.static(path.join(__dirname, "public")))

//SERVEUR ET HOMEPAGE
app.get('/', (req, res)=>{
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

  // Check if the database file already exists
  if (!fs.existsSync(dbPath)) {
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email TEXT,
      )`);

    console.log('Database initialized.');
    // Close the database connection
    await db.close();
  } else {
    console.log('Database already exists.');
  }
  
};
createdb()