const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
dotenv.config ({path:'./.env'});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const publicDirectory = path.join(__dirname, './public');


app.set('view engine', 'hbs');
app.use(express.static(publicDirectory));
db.connect((err)=>{
    if(err){
        console.log('error', err);
    }else{
        console.log('database connected');
    }
});

app.get('/', (req, res) =>{
    res.render('index');
});
app.listen(5001, () =>{
    console.log('port number 5001 working properly');
})