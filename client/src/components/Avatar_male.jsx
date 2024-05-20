import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    viseme_sil: 0.43999999999999967,
    viseme_SS: 0.49,
    viseme_O: 0.02,
    viseme_U: 0.09,
    browInnerUp: 0.48,
    jawLeft: 0.6299999999999992,
    jawRight: 0.52,
    mouthFrownLeft: 0.24,
    mouthFrownRight: 0.1,
    mouthPucker: 0.5299999999999998,
    noseSneerLeft: 0.9999999999999994,
    jawOpen: 0.13,
    mouthClose: 0.13,
    mouthFunnel: 0.13,
    mouthDimpleLeft: 0.41474388868265194,
    mouthDimpleRight: 0.09,
    mouthRollLower: 0.3199999999999996,
    mouthPressLeft: 0.43,
    mouthPressRight: 0.42,
    mouthUpperUpLeft: 0.24,
    mouthUpperUpRight: 0.29,
    mouthSmileLeft: 0.44499733688813026,
    mouthSmileRight: 0.35499733688813023

  },
  laugh:{
      viseme_sil: 0.44,
      viseme_PP: 0.9500000000000001,
      viseme_TH: 0.3,
      viseme_nn: 0.21,
      viseme_RR: 0.16,
      viseme_aa: 0.61,
      viseme_I: 0.56,
      jawOpen: 0.16,
      mouthClose: 0.1,
      mouthFunnel: 0.22,
      mouthRollLower: 0.03,
      mouthPressLeft: 0.2,
      mouthSmileLeft: 0.25,
      mouthSmileRight: 0.25
    
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};


let setupMode = false;

export function Avatar_male(props) {
  
  
  const { nodes, materials, scene } = useGLTF(
    "/models/646d9dcdc8a5f5bddbfac913.glb"
  );

  const { message, onMessagePlayed, chat } = useChat();

  const [lipsync, setLipsync] = useState();

  useEffect(() => {
    console.log( message);

    if (!message) {
      setAnimation("Idle");
      return;
    }
   
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message]);

  const { animations } = useGLTF("/models/male_animation.glb");
  console.log(" animations ",animations);
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Idle");  

useEffect(() => {
    const currentAnimation = animations.find(a => a.name === animation);
    if (!currentAnimation) {
      setAnimation(animations[0].name);
      return;
    }
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5).play();
      return () => action.fadeOut(0.5);
    }
  }, [animation, actions, mixer.stats.actions.inUse, animations]);

  
  const resetFacialExpression = (setExpression, delay = 3000) => {
    setTimeout(() => {
      setExpression('default'); // Reset the facial expression to default after the delay
    }, delay);
  };
  
  useEffect(() => {
    if (!message) return; // Add a null check
  
    // Set facial expression based on the message
    setFacialExpression(message.facialExpression);
    // Reset facial expression to default after a delay
    resetFacialExpression(setFacialExpression);
    // Other message handling logic...
  }, [message]);
  
  


  
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) {}
        }
      }
      // console.log(`Target: ${target}, Value: ${value}`);
    });
  };

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();

  useFrame(() => {
    !setupMode &&
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return; // eyes wink/blink are handled separately
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    // LIPSYNC
    if (setupMode) {
      return;
    }

    const appliedMorphTargets = [];
    if (message && lipsync) {
      const currentAudioTime = audio.currentTime;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(corresponding).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {};
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return; // eyes wink/blink are handled separately
        }
        const value =
          nodes.EyeLeft.morphTargetInfluences[
            nodes.EyeLeft.morphTargetDictionary[key]
          ];
        if (value > 0.01) {
          emotionValues[key] = value;
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  const [, set] = useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
        return {
          [key]: {
            label: key,
            value: 0,
            min: nodes.EyeLeft.morphTargetInfluences[
              nodes.EyeLeft.morphTargetDictionary[key]
            ],
            max: 1,
            onChange: (val) => {
              if (setupMode) {
                lerpMorphTarget(key, val, 1);
              }
            },
          },
        };
      })
    )
  );

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null}  ref={group}>
   <primitive object={nodes.Hips}/>     

<skinnedMesh
  name="EyeLeft"
  geometry={nodes.EyeLeft.geometry}
  material={materials.Wolf3D_Eye}
  skeleton={nodes.EyeLeft.skeleton}
  morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
  morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
/>
<skinnedMesh
  name="EyeRight"
  geometry={nodes.EyeRight.geometry}
  material={materials.Wolf3D_Eye}
  skeleton={nodes.EyeRight.skeleton}
  morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
  morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
/>
<skinnedMesh
  name="Wolf3D_Head"
  geometry={nodes.Wolf3D_Head.geometry}
  material={materials.Wolf3D_Skin}
  skeleton={nodes.Wolf3D_Head.skeleton}
  morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
  morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
/>
<skinnedMesh
  name="Wolf3D_Teeth"
  geometry={nodes.Wolf3D_Teeth.geometry}
  material={materials.Wolf3D_Teeth}
  skeleton={nodes.Wolf3D_Teeth.skeleton}
  morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
  morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Body.geometry}
  material={materials.Wolf3D_Body}
  skeleton={nodes.Wolf3D_Body.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
  material={materials.Wolf3D_Outfit_Bottom}
  skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
  material={materials.Wolf3D_Outfit_Footwear}
  skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Top.geometry}
  material={materials.Wolf3D_Outfit_Top}
  skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Hair.geometry}
  material={materials.Wolf3D_Hair}
  skeleton={nodes.Wolf3D_Hair.skeleton}
/>

    <primitive object={nodes.Hips} />
  </group>
   
  );
}

useGLTF.preload("/models/646d9dcdc8a5f5bddbfac913.glb");
useGLTF.preload("/models/male_animation.glb");













// <group {...props} dispose={null}>
// <primitive object={nodes.Hips} />
{/* <skinnedMesh
  name="EyeLeft"
  geometry={nodes.EyeLeft.geometry}
  material={materials.Wolf3D_Eye}
  skeleton={nodes.EyeLeft.skeleton}
  morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
  morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
/>
<skinnedMesh
  name="EyeRight"
  geometry={nodes.EyeRight.geometry}
  material={materials.Wolf3D_Eye}
  skeleton={nodes.EyeRight.skeleton}
  morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
  morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
/>
<skinnedMesh
  name="Wolf3D_Head"
  geometry={nodes.Wolf3D_Head.geometry}
  material={materials.Wolf3D_Skin}
  skeleton={nodes.Wolf3D_Head.skeleton}
  morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
  morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
/>
<skinnedMesh
  name="Wolf3D_Teeth"
  geometry={nodes.Wolf3D_Teeth.geometry}
  material={materials.Wolf3D_Teeth}
  skeleton={nodes.Wolf3D_Teeth.skeleton}
  morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
  morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Body.geometry}
  material={materials.Wolf3D_Body}
  skeleton={nodes.Wolf3D_Body.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
  material={materials.Wolf3D_Outfit_Bottom}
  skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
  material={materials.Wolf3D_Outfit_Footwear}
  skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Outfit_Top.geometry}
  material={materials.Wolf3D_Outfit_Top}
  skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
/>
<skinnedMesh
  geometry={nodes.Wolf3D_Hair.geometry}
  material={materials.Wolf3D_Hair}
  skeleton={nodes.Wolf3D_Hair.skeleton}
/>
</group> */}