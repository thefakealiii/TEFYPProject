// firebase.js

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser({
       user:  user,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user };
};

export { useAuth };
