import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Create a document with the uid using setDoc
      await setDoc(doc(db, 'users', uid), {
        email: email,
        shopName: shopName,
        createdAt: serverTimestamp(),
        allPendingWorks:[],
        allAttendedWorks: [],
        allCompletedWorks: [],
      });

      alert("Signup successful!");
      await signInWithEmailAndPassword(auth,email,password)
      navigate(`/dashboard/${uid}`)

      // Reset form
      setEmail('');
      setShopName('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error("Error signing up: ", error);
      alert(error.message);
    }
  };
  return (
    <>
     <div>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          placeholder='Email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder='Shop Name' 
          value={shopName}
          onChange={(e) => setShopName(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder='Create Password' 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder='Confirm Password' 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit">Signup</button>
      </form>
    </div>
    </>
  )
}

export default Signup