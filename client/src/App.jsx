import React, { useEffect, useState } from 'react';
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { auth } from './firebase';
import ModelContext from './ModelContext';
function App() {
  const [userName, setUserName] = useState("");
  const [selectedModel, setSelectedModel] = useState('female');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserName(user ? user.displayName : "");
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  return (
    <>
     <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      <div>
        <Loader />
        <Leva hidden />
        <UI  />
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }} style={{ width: "100vw", height: "100vh" }}>
          <Experience />
        </Canvas>
      </div>
      </ModelContext.Provider>
    </>
  );
}

export default App;
