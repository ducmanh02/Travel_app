import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
const firebase = require('./firebase.js');

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = firebase.FIREBASE_AUTH;
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
    Login();

    localStorage.setItem("userId", auth.currentUser.uid);
    // Gọi hàm handleSetUserId với giá trị userId


    console.log('Đăng nhập với email:', email, 'và mật khẩu:', password);

  };
  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
    Signup();
    console.log('Đăng ký với email:', email, 'và mật khẩu:', password);
  };

  const Login = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

    }
    catch (error) {
      console.log("Sign in error " + error.message);
    }
    finally {

    }
  }
  const Signup = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("SIGNUP" + response)
    }
    catch (error) {
      console.log("Sign UP error " + error.message);
    }
    finally {

    }
  }

  return (
    <form className="form-container" >
      <h2>Đăng nhập</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button onClick={handleLoginSubmit} type="submit">Đăng nhập</button>
      <button onClick={handleSignUpSubmit} type="submit">Đăng ký</button>
      <Link to="/" className="nav-button">Home</Link>
    </form>
  );
};

export default LoginForm;