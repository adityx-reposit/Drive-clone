const express = require("express");
const router = express.Router();
const { body,validationResult } = require('express-validator');
const usermodel=require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", 
    body('username').trim().isLength({min:5}),
    body('email').trim().isEmail().isLength({min:1}),
    body('password').trim().isLength({min:5}),
    async(req, res) => {

        const errors = validationResult(req)
       if(!errors.isEmpty()){
        return res.status(400).json({
          errors:errors.array(),
          message:"invalid data"
        })
       }

     const {email,username,password}=req.body;
    
     const hashPassword=await bcrypt.hash(password,10)
     
     const newUser=await usermodel.create({
      username,
      email,
      password:hashPassword
     })

     res.json(newUser)
});

router.get("/login",(req,res)=>{
   res.render('login')
})

router.post("/login",
  body('username').trim().isLength({min:5}),
  body('password').trim().isLength({min:5}),
  async (req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({
        error:errors.array(),
        message:"invalid data"
      })
    }
    const {username,password}=req.body;
    const user=await usermodel.findOne({
      username:username
    })

    if(!user){
      return res.status(400).json({
        message:"username/password incorrect"
      })
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({
        message:"username/password is incorrect"
      })
    }
     const token = jwt.sign({
      userId:user._id
     },process.env.JWT_SECRET,
    )

    res.cookie('token',token)
    res.send("logged in")
  }

)

module.exports = router;
