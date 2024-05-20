import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
//import img1 from '../components/assets/digitalearth.gif'

function Home() {

  return (
    <>
    
      <div className={styles.container}>

        <div className={styles.heading}>
          <h1 ><b><i>Virtual Talk Universe</i></b></h1>
          <p className={styles.typinganimation}>
           
<i>A virtual education assistant, or chatbot tutor, engages <br />in human-like conversations to aid learning. </i> </p>

        </div>
        <div className={styles.user}>
          <h1>
            <Link to="/login" className={styles.btn}>Login</Link>
          </h1>

          <br />
          <h1>
            <Link to="/signup" className={styles.btn}>Sign Up</Link>
          </h1>
        </div>
        {/* <div >
          <img src={img1} alt=""  className="earthimg"/>
        </div> */}

        <br />
        <br /><br /><br /><br />
      
      </div>
    </>
  )
}

export default Home