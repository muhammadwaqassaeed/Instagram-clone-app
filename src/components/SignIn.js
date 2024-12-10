import React, { useState, useContext } from 'react'
import "../css/SignIn.css";
import instalogo from "../Image/instalogo.png";
import { Link, useNavigate } from 'react-router-dom';
import  { toast} from 'react-toastify';
import { LoginContext } from '../context/LoginContext';


export default function SignIn() {
  const {setUserLogin}=useContext(LoginContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
     // Toast function
  const notifyA = (msg)=> toast.error(msg)
  const notifyB = (msg)=> toast.success(msg)

  const emailRegax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  
  const postData = ()=>{
    // checkimg email
    if(!emailRegax.test(email)){
        notifyA("Please add email and password")
        return
    }
// sending data to server
fetch("http://localhost:5001/signin",{
    method:"post",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        email:email,
        password:password
    })
   
}).then(res=>res.json())
.then(data =>{
    if(data.error){
        notifyA(data.error)
    }
    else{
        notifyB("Signed in Successfully")
        console.log(data)
        localStorage.setItem("jwt", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setUserLogin(true)
        navigate("/")
    }
    console.log(data)
})
}

  return (
    <div className='signIn'>
      <div className='form-countainer-signIn'>
        <div className='loginForm'>
          <img className='signuplogo' src={instalogo} alt='' />
          <div>
            <input type='email' id='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter Your Email' />
          </div>
          <div>
            <input type='password' id='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Enter Your Password' />
          </div>
          <div>
            <input type='submit' id='login-btn' value="Sign In" onClick={() => {postData()}} />
          </div>
        </div>

        <div className='loginform2'>
          Don't have an account ?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}>SignUp</span>

          </Link>
        </div>
      </div>
    </div>
  )
}
