const express = require('express');
const bcrypt = require('bcrypt');
const  {pool} = require('../db');
const passport = require('passport');



const router = express.Router();

router.get('/', (req, res)=>{
    res.render("index");
});

router.get('/users/register', checkAuthenticated,(req, res)=>{
    res.render("register");
});

router.get('/users/login', checkAuthenticated,(req, res)=>{
    res.render("login");
});

router.get('/users/dashboard', checkNotAuthenticated,(req, res)=>{
    res.render("dashboard", {user: req.user.name});
});

router.get('/users/logout', (req, res)=>{
    req.logout((err)=>{
        if(err){
            return err;
        }
    });
    // console.log();
    req.flash('success_msg', 'you have logged out');
    res.redirect("/users/login");
});

router.post('/users/login', passport.authenticate('local', {
    successRedirect : '/users/dashboard',
    failureRedirect : '/users/login',
    failureFlash : true
}));

router.post('/users/register', async (req, res)=>{

    let {username, email, password, password2}  = req.body;

    console.log({
        username,
        email,
        password,
        password2
    });

    let errors = [];

    if(!username || ! email || !password || !password2){
        errors.push({'message' : "please enter all fileds"});
    }

    if(password.length < 6){
        errors.push({'message' : "password should be at least 6 characters"});
    }

    if(password != password2){
        errors.push({'message' : "password donot match"});
    }

    if(errors.length > 0){
        res.render('register', {errors});
    }

    let hashPassword =  await bcrypt.hash(password, 10);
    console.log(hashPassword);
        

    pool.query(
        `SELECT * FROM users 
        WHERE email = $1
        `, 
        [email],
        (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result.rows);
            if(result.rows.length > 0){
                errors.push({message : 'Email already registred'});
                res.render('register', {errors});
            }else{
                pool.query(
                    `INSERT INTO users (name, email, password)
                    values ($1, $2, $3)
                    RETURNING id, password   
                    `, [username, email, hashPassword],
                    (err, results)=>{
                        if(err){
                            throw err;
                        }
                        console.log(results.rows);
                        req.flash('success_msg', "You are registred now please login");
                        res.redirect('/users/login');
                    }
                )
            }
        }
    );



    
    

    // pool.query('INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',
    // [req.body.name, req.body.email, req.body.password], (err, result)=>{
    //     if(err){
    //         res.send(err.detail);
    //         throw err;
    //     }

    //     res.status(200).send('success');
    // })
    
});



function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;