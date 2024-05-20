import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import InputController from './inputcontrollers/InputController';
function ForgotPassword(){
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(auth,emalVal).then(data=>{
            alert("Check your gmail")
            navigate("/login")
        }).catch(err=>{
            alert(err.code)
        })
    }
    return(
        <div className={styles.containers}>
               <div className={styles.innerBox}>
            <h1 className={styles.heading}>Forgot Password</h1>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <InputController name="email" placeholder="Enter email"/><br/><br/>
                <div className={styles.footer}>
                <button className={styles.btn}>Reset</button>
                </div>
              
            </form>
            </div>
        </div>
    )
}
export default ForgotPassword;