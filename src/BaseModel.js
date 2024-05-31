import {React } from 'react'
import { useGLTF } from '@react-three/drei'

export function BaseModel(props) {
  const { nodes, materials } = useGLTF('./sgbase.glb')


  const baseParams = {
    color: 0xAFE1AF,
    transmission: 1.1,
    opacity: 1,
    metalness: 0,
    roughness: 0.01,
    ior: 1.5,
    thickness: 0.7,
    specularIntensity: 1,
    specularColor: 0xffffff,
    envMapIntensity: 1,
		transparent: true,
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder.geometry}
        scale="3"
        position={[0,-7,0]}
      >
      <meshPhysicalMaterial args={[baseParams]}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.snowbase.geometry}
        scale="3"
        position={[0,-4,0]}
        
      >
         <meshStandardMaterial color="#ffffff"/>
      </mesh>
      
    </group>
    
  )
}

useGLTF.preload('/sgbase.glb')