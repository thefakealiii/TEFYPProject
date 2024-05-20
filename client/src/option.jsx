// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './option.module.css';
// import { UI } from './components/UI'; // Assuming UI component is located in the same directory

// const Option = () => {
//   const [selectedOption, setSelectedOption] = useState("give response in normal style");

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//   };

//   return (
//     <div className="option-page">
//       <div>
//         <div className={styles.centerdiv}>
//           <div className={styles.heading}>
//             <h1>Virtual Talk Universe</h1>
//             <h2>You selected {selectedOption} style</h2>

//             <div className={styles.btncenter}>
//               <h1 className={styles.options}>
//                 <div
//                   className={`${styles.btn} ${selectedOption === 'give response in normal style' ? styles.selected : ''}`}
//                   onClick={() => handleOptionClick('give response in normal style')}
//                 >
//                   <Link to={{
//                     pathname: `/Mainpage/${selectedOption}`,
//                     state: { selectedOption } // Pass selectedOption as state
//                   }}>
//                     Normal style
//                   </Link>
//                 </div>
//               </h1>

//               <h1 className={styles.options}>
//                 <div
//                   className={`${styles.btn} ${selectedOption === 'give response in funny style' ? styles.selected : ''}`}
//                   onClick={() => handleOptionClick('give response in funny style')}
//                 >
//                   <Link to={{
//                     pathname: `/Mainpage/${selectedOption}`,
//                     state: { selectedOption } // Pass selectedOption as state
//                   }}>
//                     Joke style
//                   </Link>
//                 </div>
//               </h1>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div style={{display: "none"}}>
//         <UI selectedObject={selectedOption} />
//       </div>
//     </div>
//   );
// };

// export default Option;
