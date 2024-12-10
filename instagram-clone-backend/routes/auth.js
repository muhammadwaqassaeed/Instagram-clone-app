const express = require("express");
const router = express.Router();
const mongoose= require("mongoose")
const USER = mongoose.model("USER")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {Jwt_secret}= require("../keys");
const requirelogin = require("../middlewares/requirelogin");

router.get("/",(req,res)=>{
    res.send("Hello")
})


router.post("/signup", (req,res)=>{
    const {name, userName, email, password } = req.body;
    if(!name || !email || !userName || !password) {
        return res.status(422).json({error: "Please all add fields"})
    }
    USER.findOne({$or:[{email:email},{userName:userName}]}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exist with that email or userName"})
        }
        bcrypt.hash(password,12).then((hashPassword)=> {
            const user = new USER({
                name,
                email,
                userName,
                password:hashPassword
        
            })
            user.save()
            .then(user=>{res.json({message: "Register successfully"})})
            .catch(err => console.log(err))
        })
       
    
    })

   

})

router.post("/signin",(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(422).json({error:"Please add email and password"})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email"})
        }
        bcrypt.compare(password, savedUser.password)
        .then((match)=>{
            if(match){
                // return res.status(200).json({message:"Signed in Successfully"})
                const token = jwt.sign({_id:savedUser.id},Jwt_secret)

                const {_id, name, email, userName} = savedUser
                res.json({ token, user: { _id, name, email, userName}})
                console.log({ token, user: { _id, name, email, userName}})
                // console.log(token);
            }
            else{
                return res.status(422).json({error:"Invalid password"})

            }
        })
        .catch(err => console.log(err))
    })
})
module.exports = router;
