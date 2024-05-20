import React, { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "https://asdafafwa-adpsnetj5-ali-afzals-projects.vercel.app";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.messages[0].text);
      const resp = data.messages;

      setMessages((messages) => [...messages, ...resp]);

    

      setLoading(false);
    } catch (error) {
      console.error("Error in chat function:", error);
      alert("Network issue. Please check your connection");
      setLoading(false);
    }
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <>
      <ChatContext.Provider
        value={{
          chat,
          message,
          onMessagePlayed,
          loading,
          cameraZoomed,
          setCameraZoomed,
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
