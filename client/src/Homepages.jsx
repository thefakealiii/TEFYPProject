 import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Selection from './selection'
// import Option from './option'
import { useAuth } from './components/useAuth';
import App from './App';
import Joke from './components/Joke/Joke';


const Homepages = () => {
  const { user } = useAuth();
  console.log('User:', user);
if (user === null) {
    // Authentication state is still loading
    // return null; // or loading spinner, etc.
  }

  return (
    <div className="">
      <Router>
        <Routes>
          <Route path='/' element={<Home  />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/selection' element={<Selection />} />
          {/* <Route path='/option' element={<Option />} /> */}
          <Route path='/joke' element={<Joke />} />
          
        
          <Route
        path="/Mainpage"
        element={<App />}
      />
          <Route path='/forgetPassword' element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}
export default Homepages;
