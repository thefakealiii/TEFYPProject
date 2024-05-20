import React from 'react'
import styles from './sel.module.css';

import { Link } from 'react-router-dom'

const selection = () => {
    return (
        <div>
           
            <div className={styles.container}>

                <div className={styles.heading}>
                    <h1 >Virtual Talk Universe</h1>
                    <div >
                        
                        <h1 className={styles.options}>
                            <Link to="/Mainpage" className={styles.btn}>Start</Link>
                        </h1>
                        {/* <h1 className={styles.options}>
                            <Link to="/" className={styles.btn}>Character</Link>
                        </h1> */}
                    </div>
                    <div >
                    </div>
                </div>
            </div>
        </div>
    )
}

export default selection
