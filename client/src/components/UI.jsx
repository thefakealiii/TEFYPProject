import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { useChat } from "../hooks/useChat";
import { useParams } from "react-router-dom";
import style from './fetchdata.module.css';
import ModelContext from '../ModelContext';
import axios from 'axios';

export const UI = ({ hidden, selectedObject }) => {
  const { chat, loading, message, setMessage } = useChat();
  const { state } = useParams();
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState([]);
  const { selectedModel, setSelectedModel } = useContext(ModelContext);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagename , setImagename] = useState();
  const handleFileChange = (file) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
    uploadFile(file);
  };

  
  const uploadFile = async (selectedFile) => {
    if (!selectedFile) {
      console.error('No file selected.');
      return Promise.reject(new Error('No file selected')); // Reject with an error
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile.target.files[0]);
  
    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          // You can update a progress bar or UI element here
        },
      });
      console.log('File uploaded successfully:', response.data);
      setImagename(response.data.results[0].name)
      console.log('This image is for:', response.data.results[0].name);
      return response.data;
      // Return the server response data on success
    } catch (error) {
      console.error('There was a problem with the upload:', error);
      // Handle specific error types if needed
      return Promise.reject(error); // Reject the promise with the error object
    }
  };
  // const uploadFile = async (selectedFile) => {
  //   if (!selectedFile) {
  //     console.error('No file selected.');
  //     return;
  //   }
  //   console.log(selectedFile.target.files[0]);
  //   const formData = new FormData();
  //   formData.append('file', selectedFile.target.files[0]); // Assuming selectedFile is the file object itself
  //   console.log(formData);
  //   try {
  //     const response = await axios.post('http://localhost:3000/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // Important! Set the content type
  //       },
  //     });
  //     console.log(response.data); // Handle response from the server
  //   } catch (error) {
  //     console.error('There was a problem with the upload:', error);
  //   }
  // };
  
  


  useEffect(() => {
    fetchData();
  }, [message]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [message]);

  const sendMessage = async () => {
    const text = `${inputText} ${state}`;
    setInputText("");
    if (!loading && !message) {
      chat(text);
      setMessage(text);
      try {
        await fetch("/api/messages", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        console.log("Data inserted into database successfully");
      } catch (error) {
        console.error("Error inserting data into database:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const removeWord = useCallback((text) => {
    return text.replace(/\b( undefined give response in joke style|undefined give response in normal style|give response in normal style|give response in joke style |undefined)\b/g, '');
  }, []);

  const showboxRef = useRef();

  const scrollToBottom = () => {
    if (showboxRef.current) {
      showboxRef.current.scrollTop = showboxRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleModelChange = async (e) => {
    const model = e.target.value;
    setSelectedModel(model);

    const response = await axios.post('http://localhost:3000/voice', { model });
    console.log('Data sent successfully:', response.data);
  };

  return (
    <>
      <div className="d-flex">
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
          <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
            <h1 className="font-black text-xl">Virtual Universe</h1>
            <p>Talk to the Universe</p>
          </div>
          <div className="d-flex w-full flex flex-col items-end justify-center gap-4">
            <div className="d-flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
              <div ref={showboxRef} className={style.showbox}>
                <h1>Chat With Virtual Friend</h1>
                <ul>
                  {data.map(item => (
                    <li key={item.id}><br />
                      <div className={style.input}>{removeWord(item.input)}</div>  <br /> <br />
                      <div className={style.output_response}>{ removeWord(item.output_response)}</div><br /> <br />
                     
                    </li>
                  ))}
                </ul>
                <div className={style.output}>{ imagename}</div><br /> <br />
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  onChange={handleInputChange}
                  style={{ width: "80%", cursor: "normal" }}
                  className={`${style.textInput} placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md`}
                  placeholder="Type a message..."
                  value={inputText}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <button
                  disabled={loading || message}
                  onClick={sendMessage}
                  className={`bg-blue-500 bg-opacity-50 hover:bg-blue-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${loading || message ? "cursor-not-allowed opacity-30" : ""
                    }`}
                >
                  Send
                </button>
                <input type="file" onChange={handleFileChange} />
              </form>

              <div className={style.optionbox}>
                <h4>Response type</h4>
                <label htmlFor="normal">Normal  </label>
                <input type="radio" id="normal" value="give response in normal style" checked={selectedOption === "give response in normal style"} onChange={handleChange} />
                <br />
                <label htmlFor="joke">Humorous  &nbsp;&nbsp; &nbsp;</label>
                <input type="radio" id="joke" value="give response in funny style" checked={selectedOption === "give response in funny style"} onChange={handleChange} />
                <div >
                  <h4>Character</h4>
                  <label htmlFor="male">Male &nbsp;  &nbsp;&nbsp; </label>
                  <input type="radio" id="male" value="male" checked={selectedModel === "male"} onChange={handleModelChange} /> <br />
                  <label htmlFor="female">Female &nbsp;</label>
                  <input type="radio" id="female" value="female" checked={selectedModel === "female"} onChange={handleModelChange} />
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
};
