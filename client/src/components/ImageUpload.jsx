// import React, { useState } from 'react';
// import axios from 'axios'; // Assuming you're using Axios

// const ImageUpload = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [response, setResponse] = useState(null);

//   const handleImageUpload = async (selectedFile) => {
//     setIsLoading(true);
//     setErrorMessage(null);
//     setResponse(null);

//     try {
//       const formData = new FormData();
//       formData.append('image', selectedFile);

//       const backendUrl = 'http://localhost:3000/upload'; // Replace with your backend URL

//       const response = await axios.post(backendUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setResponse(response.data);
//     } catch (error) {
//       setErrorMessage('Error uploading image: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <ImageInput onImageSelected={handleImageUpload} />
//       {isLoading && <p>Uploading image...</p>}
//       {errorMessage && <p className="error">{errorMessage}</p>}
//       {response && <p>Response from backend: {response}</p>}
//     </div>
//   );
// };

// export default ImageUpload;