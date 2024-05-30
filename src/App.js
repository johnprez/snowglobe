import './App.css';

import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { Float, Lightformer, Text, Html, ContactShadows, Environment} from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2} from "@react-three/postprocessing"
import { easing } from "maath"
import {TextureLoader} from 'three'
import { Suspense } from 'react'

import {BaseModel} from './BaseModel';



function App() {

  const colorMap = useLoader(TextureLoader, 'render.png')

  const params = {
    color: 0xffffff,
    transmission: 1.05,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.8,
    thickness: 0.7,
    specularIntensity: 1,
    specularColor: 0xffffff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
		transparent: true,
  };

  const Globe = (props) => (
    <mesh receiveShadow castShadow {...props}>
      <sphereGeometry args={[5.2, 20, 20]} />
      <meshPhysicalMaterial args={[params]}/>
    </mesh>
  )

  function Rig() {
    useFrame((state, delta) => {
      easing.damp3(
        state.camera.position,
        [Math.sin(-state.pointer.x) * 5, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
        0.2,
        delta,
      )
      state.camera.lookAt(0, 0, 0)
    })

    return null;
  }


  return (
    <div id="canvas-container">
      <Canvas  eventPrefix="client" shadows camera={{ position: [0, 0, 20], fov: 40 }}>
        <color attach="background" args={["#e0e0e0"]} />
        <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />
        
        <Float floatIntensity={2}>
      
          <Suspense fallback={null}>
          <mesh position={[.2, -.2, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial map={colorMap} alphaTest={0.2}/>
          </mesh>
          </Suspense>
          
          <Globe />

          <Suspense fallback={null}>
            <BaseModel />
          </Suspense>
          
        
        </Float>
        <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85} />
        <Environment preset="city">
          <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        </Environment>
        
        <EffectComposer enableNormalPass>
          <N8AO aoRadius={1} intensity={2} />
          <TiltShift2 blur={0.2} /> 
        </EffectComposer>
        
        <Rig />
      </Canvas>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)

export default App;
