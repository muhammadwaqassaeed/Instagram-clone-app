import React, {useEffect, useState } from 'react'
import instalogo from "../Image/instalogo.png";
import "../css/SignUp.css";
import { Link, useNavigate } from 'react-router-dom';
import  { toast} from 'react-toastify';


export default function SignUp() {
    const navigate = useNavigate()
   const [name, setName] =useState("");
   const [userName, setUserName] =useState("");
   const [email, setEmail] =useState("");
   const [password, setPassword] =useState("");
   // Toast function
   const notifyA = (msg)=> toast.error(msg)
   const notifyB = (msg)=> toast.success(msg)

        const emailRegax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const postData = ()=>{
        // checkimg email
        if(!emailRegax.test(email)){
            notifyA("Invalid email")
            return
        }
        else if(!passRegax.test(password)){
            notifyA("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and upercaseletters and special characters for example #,?,!")
            return
        }
    // sending data to server
    fetch("http://localhost:5001/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:name,
            userName:userName,
            email:email,
            password:password
        })
    }).then(res=>res.json())
    .then(data =>{
        if(data.error){
            notifyA(data.error)
        }
        else{
            notifyB(data.message)
            navigate("/signin")
        }
        console.log(data)
    })
    }

    return (
        <div className='signUp'>
            <div className='form-countainer'>
                <div className='form'>
                    <img className='signuplogo' src={instalogo} alt='' />
                    <p className='loginPara'>Sign up to see photos and videos <br /> from your friends</p>
                    <div>
                        <input type='email' id='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter Your Email' />
                    </div>
                    <div>
                        <input type='text' id='fullName' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Enter Your FullName' />
                    </div>
                    <div>
                        <input type='text' id='userName' value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder='Enter Your UserName' />
                    </div>
                    <div>
                        <input type='password' id='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Enter Your Password' />
                    </div>

                    <p className='loginPara' style={{ fontSize: "12px", margin: "3px 0px" }}>By Signing Up, you agree to out terms, <br /> privacy policy and cookies policy.</p>
                    <div>
                        <input type='submit' id='submit-btn' value="Sign Up" onClick={() => {postData()}} />
                    </div>

                </div>
                <div className='form2'>
                    already have an account ?
                    <Link to="/signin">
                        <span style={{ color: "blue", cursor: "pointer" }}>SignIn</span>

                    </Link>
                </div>
            </div>
        </div>
    )
}
