const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {

    try{


        const{email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please provide email and password'
            })
        }


        db.query('SELECT * FROM users WHERE email = ?',[email], async(error, results) =>{

            console.log(results);

            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message:'Email or Password is incorrect'
                })
            }else{
                const id = results[0].id;
                const token = jwt.sign({id: id}, process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                });

                console.log('the token is:' + token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt',token, cookieOptions);
                res.status(200).redirect('/');
            }
        })


    }
    catch(error){

        console.log(error);
    }
}



exports.register = (req, res) =>{
    console.log(req.body);
    // res.send('form submitted');
    

const {name, email, password, passwordConfirm} = req.body;

db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) =>
{
    if(error){
        console.log(error);
    }if(result.length > 0){
        return res.status(400).render('register', {
            message:'This email already in use'
        });
    }else if(password != passwordConfirm){

        return res.status(400).render('register', {
            message: ' Password not matching'
        });

    }

  let hashedPassword = await bcrypt.hash(password, 8);
  console.log(hashedPassword);

   
  db.query('INSERT INTO users SET ?', {name:name, email:email, password:hashedPassword}, (error, result) =>{
    if (error){
        console.log(error)
    }else{
        res.render('register',{
            message:'user registered'
        });
    }
})


});




//
}
