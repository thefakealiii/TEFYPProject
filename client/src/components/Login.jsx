import React, { useState } from 'react';
import styles from './Login.module.css';
import InputController from './inputcontrollers/InputController';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// import { auth } from '../firebase';
// import GoogleLogin from 'react-google-login';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const span = {
        color:"black"
    }
    const [errorMsg, setErrorMsg] = useState('');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const responseGoogle = async (response) => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        if (response.error) {
            console.error('Google Sign-In failed:', response.error);
        } else {
            console.log('Google Sign-In success:', response);
            try {
                setSubmitButtonDisabled(true);
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                if (user) {
                    navigate('/selection');
                }
            } catch (error) {
                setSubmitButtonDisabled(false);
                console.error('Error signing in with Google:', error);
            }
        }
    };


 const handleSignIn = () => {
        const { email, password } = values;

        if (!email || !password) {
            setErrorMsg('Please fill in both email and password');
        } else {
            setErrorMsg('');
            setSubmitButtonDisabled(true);
            signInWithEmailAndPassword(auth, email, password)
                .then((res) => {
                    setSubmitButtonDisabled(false);

                    // Store the user token in local storage
                    const user = res.user;
                    user.getIdToken().then((token) => {
                        localStorage.setItem('userToken', token);
                        localStorage.getItem('user');
                    });

                    console.log('Sign-in successful! Navigating to /mainpage');
                    navigate('/mainpage');
                })
                .catch((error) => {
                    setSubmitButtonDisabled(false);
                    setErrorMsg('Invalid email or password');
                    console.error('Error signing in:', error);
                });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerBox}>
                <h1 className={styles.heading}><b>LOGIN</b> </h1>
                <InputController
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={(event) => setValues({ ...values, email: event.target.value })}
                />
                <InputController
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={(event) => setValues({ ...values, password: event.target.value })}
                />
              <Link to="/forgetPassword"> <span style={span}> Forgot Password</span></Link>
                <span className={styles.error}>{errorMsg}</span>
                <div className={styles.footer}>
                    <button onClick={handleSignIn} disabled={submitButtonDisabled}>
                        Login
                    </button>
                    <p>
                        Don't have an account? <span><Link to="/signup">Sign up</Link></span>
                    </p>
                    <button onClick={responseGoogle} disabled={submitButtonDisabled}>
                        Sign In with Google
                    </button>
                </div>
                
            </div>
        </div>
    );
}

export default Login;