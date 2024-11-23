import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = async (e)=>{
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const uid = auth?.currentUser?.uid
      console.log();
      
      navigate(`/dashboard/${uid}`)
    } catch (error) {
      alert("Invalid Email/Password")
      console.error("Login failed:", error.message);
    }
  }

  return (
    <>
      <div className="">
        <input type="email" placeholder='Email address' onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={signIn}>Login</button>
        <Link to={'/signup'}>Create Account</Link>
      </div>
    </>
  )
}

export default Login