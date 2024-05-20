import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { CameraControls, Environment, Text } from "@react-three/drei";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import { Avatar_male } from "./Avatar_male";
import * as THREE from 'three';
import ModelContext from "../ModelContext";

// Create the material outside the component
const dotsMaterial = new THREE.MeshBasicMaterial({ color: "black" });

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <primitive attach="material" object={dotsMaterial} />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();
  // const savedModel = localStorage.getItem('selectedModel');

  const { selectedModel } = useContext(ModelContext);

  useEffect(() => {
    cameraControls.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraControls.current) {
      if (cameraZoomed) {
        cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
      } else {
        cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
      }
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      
      {selectedModel === "female" ? <Avatar /> : <Avatar_male />}
      
    </>
  );
};
