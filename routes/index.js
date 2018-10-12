const express = require("express");
const  router = express.Router();
const  passport = require("passport");
const  User = require("../models/user");
const  middleware = require("../middleware/index.js");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , "./uploads/");
    },
    filename : function(req , file , cb){
        cb(null , file.originalname);
    }
});

const upload = multer({storage : storage});

router.get("/main" , function(req , res){
    res.render("main" , { currentUser : req.user});
});

//authentication routes
//register

router.post("/register" , upload.single("avatar") , function( req , res){

        let newUser = new User({username: req.body.username , nativeLanguage : req.body.language , firstName : req.body.firstname , lastName : req.body.lastname , imageName : req.file.originalname});
        User.register(newUser , req.body.password , function( error , user){
            if(error){
                req.flash("error" , error.message);
                res.redirect("back");
            }
            passport.authenticate("local")( req , res , function(){
                req.flash("success" , "You have registered succesfully!");
                res.redirect("/main");
            })
        });
});

router.post("/login" , passport.authenticate("local" , {successRedirect : "/main" , failureRedirect : "/login" , failureFlash: true , successFlash: 'Welcome!'  }), function(req , res ){
    
});

router.get("/logout" , middleware.isLoggedIn , function(req , res){
    req.logout();
    req.flash("error" , "Logged you out!");
    res.redirect("/main");
});

module.exports = router;
