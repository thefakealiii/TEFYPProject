import React from 'react'
import styles from './inputController.module.css'



function InputController(props) {
  return (
    <>
    <div className={styles.container}>
       {props.label && <label> {props.label} </label>}
       <input type="text" {...props} />
   
    </div>
    </>
  )
}

export default InputController