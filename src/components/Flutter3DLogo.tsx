import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

// Helper function to create extruded geometry for the wings
function FlutterWing({
  shape,
  color,
  position,
  rotation = [0, 0, 0],
  extrudeSettings,
  castShadow = true,
  receiveShadow = false,
}) {
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, extrudeSettings), [shape, extrudeSettings]);
  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={new THREE.Euler(...rotation)}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FlutterLogo3D() {
  const group = useRef();

  // Official Flutter colors based on the image
  const colors = {
    bgColor: '#303030',    // Dark background
    lightBlue: '#54C5F8',  // Light blue top piece
    darkBlue: '#01579B',   // Dark blue bottom piece
  };

  const baseWidth = 2.2;
  const baseHeight = 2.2;
  const baseDepth = 0.2;
  const wingDepth = 0.08;
  
  const extrudeSettings = {
    steps: 1,
    depth: wingDepth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 3,
  };

  // Precisely match the Flutter logo shapes
  // Top light blue shape
  const topShapePoints = [
    [-0.45, 0],    // Bottom left
    [0, 0.45],     // Top left
    [0.65, -0.2],  // Top right
    [0.2, -0.65],  // Bottom right
  ];
  
  const topWingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(topShapePoints[0][0], topShapePoints[0][1]);
    for (let i = 1; i < topShapePoints.length; i++) {
      s.lineTo(topShapePoints[i][0], topShapePoints[i][1]);
    }
    s.closePath();
    return s;
  }, []);

  // Bottom dark blue shape
  const bottomShapePoints = [
    [-0.45, 0],    // Top left 
    [0, -0.45],    // Bottom left
    [0.65, 0.2],   // Bottom right
    [0.2, 0.65],   // Top right
  ];
  
  const bottomWingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(bottomShapePoints[0][0], bottomShapePoints[0][1]);
    for (let i = 1; i < bottomShapePoints.length; i++) {
      s.lineTo(bottomShapePoints[i][0], bottomShapePoints[i][1]);
    }
    s.closePath();
    return s;
  }, []);

  // Z-positions to prevent z-fighting
  const zBase = 0;
  const zTop = wingDepth + 0.001;

  return (
    <group ref={group} rotation={[0, 0, 0]} scale={1.3}>
      {/* Rounded square background */}
      <RoundedBox
        args={[baseWidth, baseHeight, baseDepth]}
        radius={0.25} // Rounded corners
        smoothness={4}
        position={[0, 0, -wingDepth/2 - 0.001]}
      >
        <meshStandardMaterial color={colors.bgColor} metalness={0.1} roughness={0.3} />
      </RoundedBox>
      
      {/* Light blue top wing */}
      <FlutterWing
        shape={topWingShape}
        color={colors.lightBlue}
        position={[0, 0, zBase]}
        extrudeSettings={extrudeSettings}
      />
      
      {/* Dark blue bottom wing */}
      <FlutterWing
        shape={bottomWingShape}
        color={colors.darkBlue}
        position={[0, 0, zTop]}
        extrudeSettings={extrudeSettings}
      />
    </group>
  );
}

function Scene() {
  const { camera } = useThree();

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[3, 3, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, -3, 3]} intensity={0.4} />
      
      <FlutterLogo3D />
      
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

export default function Flutter3DLogoApp() {
  return (
    <div className="w-full h-96 relative">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading Flutter Logo...</div>}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 8], fov: 40 }}

          className="rounded-2xl overflow-hidden" 
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}