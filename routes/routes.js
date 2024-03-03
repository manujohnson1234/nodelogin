const  pool = require('../db');
const express = require('express');

const router = express.Router();


router.get('/users/index', (req, res)=>{
    res.render("index");
});

router.get('/users/register', (req, res)=>{
    res.render("register");
});

router.get('/users/login', (req, res)=>{
    res.render("login");
});

router.get('/users/dashboard', (req, res)=>{
    res.render("dashboard", {user: "manu"});
});



router.post('/login', (req, res)=>{
    pool.query('')
});

router.post('/users/register', (req, res)=>{

    let {name, email, password, password2}  = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    // pool.query('INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',
    // [req.body.name, req.body.email, req.body.password], (err, result)=>{
    //     if(err){
    //         res.send(err.detail);
    //         throw err;
    //     }

    //     res.status(200).send('success');
    // })
    // res.send('hello');
});

module.exports = router;