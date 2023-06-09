const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const { Session } = require("inspector");
const session = require("express-session");


dotenv.config({path:'./.env'})

const app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    key: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("connexion établie avec succès!!!")
    }
})

//moteur de templete
app.set('view engine', 'hbs')
const public = path.join(__dirname, './public');
app.use(express.static(public));

//parse url-encode bodies(as sent by HTML forms)
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json());

app.use(session({
    secret  : 'masambukidi',
    resave  : false,
    saveUninitialized : true
}));


// les routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`serveur allumer au port ${PORT}`)
}) 