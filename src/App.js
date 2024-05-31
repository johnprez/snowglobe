import './App.css';

import * as THREE from 'three';
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useLoader, extend} from "@react-three/fiber";
import { Float, Lightformer, Text, Html, ContactShadows, Environment} from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, Bloom, Vignette} from "@react-three/postprocessing"
import { easing } from "maath"
import {TextureLoader} from 'three'
import { Suspense, useMemo, useRef } from 'react'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useControls } from 'leva'

import {BaseModel} from './BaseModel';
import {SnowEffect} from './SnowEffect';

extend({ MeshLineGeometry, MeshLineMaterial })



function App() {

  const colorMap = useLoader(TextureLoader, 'render.png')

  /*
  const { dash, count, radius, xpos } = useControls({
    dash: { value: 0.9, min: 0, max: 0.99, step: 0.01 },
    count: { value: 50, min: 0, max: 200, step: 1 },
    radius: { value: 50, min: 1, max: 100, step: 1 },
    xpos: {value: 0, min: -5,max:5, step: .5}
  })
  */

  const params = {
    color: 0xffffff,
    transmission: 1.04,
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

  const colors = {
    malevolentIllusion: [
      '#c06995',
      '#de77c7',
      '#df86df',
      '#d998ee',
      '#ceadf4',
      '#c6bff9',
    ],
    sunnyRainbow: [
      '#fbe555',
      '#fb9224',
      '#f45905',
      '#be8abf',
      '#ffeed0',
      '#feff89',
    ],
  };

  const Globe = (props) => (
    <mesh receiveShadow castShadow {...props}>
      <sphereGeometry args={[5.2, 20, 20]} />
      <meshPhysicalMaterial args={[params]}/>
    </mesh>
  )

  function Lines({ dash, count, colors, radius = 50, rand = THREE.MathUtils.randFloatSpread }) {
    const lines = useMemo(() => {
      return Array.from({ length: count }, () => {
        const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius))
        const points = Array.from({ length: 10 }, () => pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone())
        const curve = new THREE.CatmullRomCurve3(points).getPoints(300)
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(radius / 100, (radius / 50) * Math.random()),
          speed: Math.max(0.1, 1 * Math.random()),
          curve: curve.flatMap((point) => point.toArray())
        }
      })
    }, [ colors, count, radius])
    return lines.map((props, index) => <Fatline key={index} dash={dash} {...props} />)
  }
  
  function Fatline({ curve, width, color, speed, dash }) {
    const ref = useRef()
    useFrame((state, delta) => (ref.current.material.dashOffset -= (delta * speed) / 10))
    return (
      <mesh ref={ref}>
        <meshLineGeometry points={curve} />
        <meshLineMaterial transparent lineWidth={width} color={color} depthWrite={false} dashArray={0.25} dashRatio={dash} toneMapped={false} />
      </mesh>
    )
  }

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
            <meshStandardMaterial map={colorMap} alphaTest={0.2} receiveShadow={false} castShadow={false}/>
          </mesh>
          </Suspense>
          
          <Globe />

          <Suspense fallback={null}>
            <BaseModel />
          </Suspense>
          <SnowEffect count="100" />
       
         
        
        </Float>
        <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85} />
        <Environment preset="city">
          <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        </Environment>
        
        <EffectComposer disableNormalPass>
          <N8AO aoRadius={1} intensity={2} />
          <TiltShift2 blur={0.2} /> 
          <Bloom luminanceThreshold={.5} luminanceSmoothing={0.9} height={300} />
          
        </EffectComposer>

        <Rig />
      </Canvas>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)

export default App;
