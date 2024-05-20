// import React, { useState } from 'react';

// const ImageInput = ({ onImageSelected }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     console.log(event.target.files[0]);
//   };

//   const handleImageSelection = () => {
//     if (selectedFile) {
//       onImageSelected(selectedFile);
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={(event) => handleChange(event)} />
//       <button onClick={handleImageSelection} className="bg-blue-500 bg-opacity-50 hover:bg-blue-600 text-white p-4 px-10 font-semibold uppercase rounded-md">Select Image</button>
//     </div>
//   );
// };

// export default ImageInput;
