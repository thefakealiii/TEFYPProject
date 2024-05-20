import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';


const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    console.log('ProtectedRoute User:', user);
  
    useEffect(() => {

    }, [user]); 
  
    if (user === null) {

      return null; 
    }
  
    if (!user) {

      return <Navigate to="/login" />;
    }
  

    return children;
  };

export default ProtectedRoute;
