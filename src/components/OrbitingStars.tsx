import React, { useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const EARTH_RADIUS = 5;

// --- Earth Component (Unchanged) ---
function Earth() {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [earthMap, earthNormalMap, earthCloudsMap, earthNightMap] = useLoader(TextureLoader, [
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
    'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
  ]);
  useFrame(({ clock }) => {
    if (!earthGroupRef.current || !cloudsRef.current) return;
    earthGroupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.035;
  });
  return (
    <group name="earth-system">
      <group ref={earthGroupRef}>
        <mesh name="earthSurface" receiveShadow>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial map={earthMap} normalMap={earthNormalMap} metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh name="earthNightLights">
          <sphereGeometry args={[EARTH_RADIUS + 0.005, 64, 64]} />
          <meshBasicMaterial map={earthNightMap} blending={THREE.AdditiveBlending} transparent opacity={0.7} depthWrite={false} />
        </mesh>
      </group>
      <mesh name="earthClouds" ref={cloudsRef} receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS + 0.08, 64, 64]} />
        <meshStandardMaterial map={earthCloudsMap} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh name="atmosphereGlowInner">
        <sphereGeometry args={[EARTH_RADIUS + 0.25, 64, 64]} />
        <meshStandardMaterial color="#8bbdff" transparent opacity={0.25} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh name="atmosphereGlowOuter">
        <sphereGeometry args={[EARTH_RADIUS + 0.4, 64, 64]} />
        <meshStandardMaterial color="#add8e6" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// --- Explosion Effect (Unchanged) ---
interface ExplosionEffectProps {
  position: THREE.Vector3;
  scale?: number;
  onComplete: () => void;
}
function ExplosionEffect({ position, scale = 1, onComplete }: ExplosionEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(performance.now());
  const duration = 1200 + (scale > 3 ? 800 : 0); 

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsedTime = performance.now() - startTime.current;
    const progress = Math.min(elapsedTime / duration, 1);
    const scaleProgress = scale > 3 ? Math.sin(progress * Math.PI * 0.5) * Math.sin(progress * Math.PI * 0.5) : Math.sin(progress * Math.PI * 0.5);
    const currentScale = THREE.MathUtils.lerp(0.1, 2.5 * scale, scaleProgress);
    const opacity = 1 - progress * progress; 

    groupRef.current.scale.set(currentScale, currentScale, currentScale);
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.opacity = opacity;
        child.material.emissiveIntensity = opacity * (2 + scale); 
      }
    });
    if (progress >= 1) onComplete();
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={2 + scale} transparent opacity={1} depthWrite={false}/>
      </mesh>
      <Sparkles count={Math.min(150, 30 * scale * scale)} scale={1.5 * scale} size={Math.min(20, 8 * scale)} speed={0.5} noise={0.3 + Math.random()*0.2} color="yellow" />
      <pointLight color="orangered" intensity={5 * scale * scale} distance={10 * scale} decay={2} />
    </group>
  );
}


// --- Alien Ship (UFO Model - Phased Destruction) (Unchanged logic, added castShadow/receiveShadow) ---
const ALIEN_SHIP_HEALTH_INIT = 250;
const UFO_MAX_RADIUS = 3.0;
const UFO_TOTAL_THICKNESS = 0.8;
const UFO_UPPER_TAPER_RADIUS = 0.5;
const UFO_LOWER_TAPER_RADIUS = 0.7;
const UFO_DOME_BASE_RADIUS = 1.4;
const UFO_DOME_HEIGHT_FACTOR = 0.65;
const UFO_UNDERSIDE_ENGINE_RADIUS = 0.8; 
const UFO_UNDERSIDE_ENGINE_HEIGHT = 0.3;
const UFO_FLAME_RADIUS = UFO_UNDERSIDE_ENGINE_RADIUS * 0.9;
const UFO_FLAME_HEIGHT = 1.5;
const ALIEN_PILOT_SIZE = 0.35;
const UFO_DYING_DURATION = 2.5; 

type AlienShipStatus = "operational" | "dying" | "destroyed_visuals_done";

interface AlienShipProps {
  orbitalParams: { radius: number; yOffset: number; speed: number; initialAngleRad: number };
  onShipHealthDepleted: (position: THREE.Vector3) => void; 
  onShipVanished: () => void; 
}
export interface AlienShipRefType { 
  status: AlienShipStatus;
  takeDamage: (amount: number, hitPoint: THREE.Vector3) => "hit" | "destroyed" | "immune";
  isTrulyDestroyed: () => boolean;
  position: THREE.Vector3; 
}

const AlienShip = forwardRef<AlienShipRefType, AlienShipProps>(
  ({ orbitalParams, onShipHealthDepleted, onShipVanished }, ref) => {
    const shipInternalRef = useRef<THREE.Group>(null);
    const upperSaucerMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const lowerSaucerMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const domeMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const undersideEngineMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
    const rimLightMaterialsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
    const flameMeshRef = useRef<THREE.Mesh>(null); 
    const flameLightRef = useRef<THREE.PointLight>(null); 
    const alienPilotRef = useRef<THREE.Mesh>(null); 
    
    const [health, setHealth] = useState(ALIEN_SHIP_HEALTH_INIT);
    const [currentStatus, setCurrentStatus] = useState<AlienShipStatus>("operational");
    const [lastHitTime, setLastHitTime] = useState(0);
    const [currentScale, setCurrentScale] = useState(0.01);
    const [isReady, setIsReady] = useState(false);
    const entryAnimDuration = 2.8;
    const orbitalReferenceTime = useRef(0);
    const elapsedTimeRef = useRef(0);
    const dyingStartTime = useRef(0);

    const originalEmissives = useRef<{ 
        upperSaucer: { color: THREE.Color, intensity: number }, 
        lowerSaucer: { color: THREE.Color, intensity: number }, 
        dome: { color: THREE.Color, intensity: number },
        engine: { color: THREE.Color, intensity: number }
    } | null>(null);

    useEffect(() => {
        rimLightMaterialsRef.current = Array(36).fill(null);
        if (upperSaucerMaterialRef.current && lowerSaucerMaterialRef.current && domeMaterialRef.current && undersideEngineMaterialRef.current && !originalEmissives.current) {
            originalEmissives.current = {
                upperSaucer: { color: upperSaucerMaterialRef.current.emissive.clone(), intensity: upperSaucerMaterialRef.current.emissiveIntensity },
                lowerSaucer: { color: lowerSaucerMaterialRef.current.emissive.clone(), intensity: lowerSaucerMaterialRef.current.emissiveIntensity },
                dome: { color: domeMaterialRef.current.emissive.clone(), intensity: domeMaterialRef.current.emissiveIntensity },
                engine: { color: undersideEngineMaterialRef.current.emissive.clone(), intensity: undersideEngineMaterialRef.current.emissiveIntensity }
            };
        }
    }, []);

    useEffect(() => { 
      let animStartTime = 0; let frameId: number;
      const animateScale = (timestamp: number) => {
        if (!animStartTime) animStartTime = timestamp;
        const elapsed = (timestamp - animStartTime) / 1000;
        const progress = Math.min(elapsed / entryAnimDuration, 1);
        setCurrentScale(THREE.MathUtils.lerp(0.01, 1, THREE.MathUtils.smootherstep(progress, 0, 1))); 
        if (progress < 1) frameId = requestAnimationFrame(animateScale);
        else { setIsReady(true); orbitalReferenceTime.current = performance.now() / 1000; }
      };
      frameId = requestAnimationFrame(animateScale);
      return () => cancelAnimationFrame(frameId);
    }, []);

    useImperativeHandle(ref, () => {
      const group = shipInternalRef.current;
      if (!group) {
        const dummyGroup = new THREE.Group();
        // Ensure dummyGroup has a position property for safety, though it won't be updated.
        dummyGroup.position.set(0,0,0);
        return Object.assign(dummyGroup, {
          status: "operational" as AlienShipStatus, 
          takeDamage: () => "immune" as "immune",
          isTrulyDestroyed: () => false, 
        }) as AlienShipRefType;
      }
      
      return Object.assign(group, {
        status: currentStatus,
        takeDamage: (damageAmount: number, hitPoint: THREE.Vector3) => {
          if (currentStatus !== "operational" || !isReady) return "immune";
          setLastHitTime(performance.now() / 1000); 
          const newHealth = Math.max(0, health - damageAmount); setHealth(newHealth);
          if (newHealth <= 0) { 
            setCurrentStatus("dying"); 
            dyingStartTime.current = performance.now() / 1000;
            if(shipInternalRef.current) onShipHealthDepleted(shipInternalRef.current.position.clone()); 
            return "destroyed"; 
          }
          return "hit";
        },
        isTrulyDestroyed: () => {
          return currentStatus === "destroyed_visuals_done";
        },
      }) as AlienShipRefType;
    }, [health, currentStatus, isReady, onShipHealthDepleted, onShipVanished]);

    useFrame(({ clock }) => {
      elapsedTimeRef.current = clock.getElapsedTime(); 
      if (!shipInternalRef.current) return;

      if (!isReady) { 
        shipInternalRef.current.scale.set(currentScale, currentScale, currentScale);
        const angle = orbitalParams.initialAngleRad;
        shipInternalRef.current.position.set( Math.cos(angle) * orbitalParams.radius, orbitalParams.yOffset, Math.sin(angle) * orbitalParams.radius );
        shipInternalRef.current.lookAt(0,0,0); 
        shipInternalRef.current.rotation.y += Math.PI; 
        return; 
      } 
      
      if (currentStatus === "dying") {
        const timeSinceDyingStarted = (performance.now() / 1000) - dyingStartTime.current;
        const dyingProgress = Math.min(timeSinceDyingStarted / UFO_DYING_DURATION, 1);

        shipInternalRef.current.position.x += (Math.random() - 0.5) * 0.2 * dyingProgress;
        shipInternalRef.current.position.y += (Math.random() - 0.5) * 0.1 * dyingProgress;
        shipInternalRef.current.position.z += (Math.random() - 0.5) * 0.2 * dyingProgress;
        shipInternalRef.current.rotation.x += (Math.random() - 0.5) * 0.1 * dyingProgress;
        shipInternalRef.current.rotation.y += (Math.random() - 0.5) * 0.1 * dyingProgress;
        shipInternalRef.current.rotation.z += (Math.random() - 0.5) * 0.1 * dyingProgress;

        const remainingIntensity = 1 - dyingProgress;
        if (undersideEngineMaterialRef.current && originalEmissives.current?.engine) {
            undersideEngineMaterialRef.current.emissiveIntensity = originalEmissives.current.engine.intensity * remainingIntensity * (0.5 + Math.random() * 0.5);
        }
        rimLightMaterialsRef.current.forEach(mat => {
            if (mat) mat.emissiveIntensity = (3.5 + Math.random() * 2) * remainingIntensity;
        });
        if (flameMeshRef.current && flameLightRef.current) {
            const flameMat = flameMeshRef.current.material as THREE.MeshStandardMaterial;
            flameMat.opacity = Math.max(0, (0.8 * remainingIntensity) * (0.5 + Math.random()*0.5));
            flameMat.emissiveIntensity = Math.max(0, (2.5 * remainingIntensity) * (0.5 + Math.random()*0.5) );
            flameLightRef.current.intensity = Math.max(0, (2.0 * remainingIntensity) * (0.5 + Math.random()*0.5) );
             if (flameMat.opacity <= 0.01) {
                flameMeshRef.current.visible = false;
                flameLightRef.current.visible = false;
            }
        }
        if (alienPilotRef.current) alienPilotRef.current.visible = (remainingIntensity > 0.1); 

        if (dyingProgress >= 1) {
            setCurrentStatus("destroyed_visuals_done");
            if (flameMeshRef.current) flameMeshRef.current.visible = false;
            if (flameLightRef.current) flameLightRef.current.visible = false;
            if (alienPilotRef.current) alienPilotRef.current.visible = false;
            onShipVanished(); 
        }
        return; 
      }

      if (currentStatus === "operational") {
        const timeSinceReady = (performance.now() / 1000) - orbitalReferenceTime.current;
        const orbitAngle = orbitalParams.initialAngleRad + timeSinceReady * orbitalParams.speed;
        shipInternalRef.current.position.x = Math.cos(orbitAngle) * orbitalParams.radius;
        shipInternalRef.current.position.z = Math.sin(orbitAngle) * orbitalParams.radius;
        shipInternalRef.current.position.y = orbitalParams.yOffset + Math.sin(elapsedTimeRef.current * 0.6) * 0.5; 
        
        shipInternalRef.current.lookAt(0, 0, 0); 
        shipInternalRef.current.rotation.y += Math.PI; 
        const shipRotationX = Math.sin(elapsedTimeRef.current * 0.25) * 0.03;
        const shipRotationZ = Math.cos(elapsedTimeRef.current * 0.35) * 0.025;
        shipInternalRef.current.rotation.x += shipRotationX; 
        shipInternalRef.current.rotation.z += shipRotationZ;

        if (undersideEngineMaterialRef.current && originalEmissives.current?.engine) {
            undersideEngineMaterialRef.current.emissiveIntensity = originalEmissives.current.engine.intensity + Math.sin(elapsedTimeRef.current * 2.5) * (originalEmissives.current.engine.intensity * 0.6);
        }
        rimLightMaterialsRef.current.forEach((mat, i) => {
            if (mat) { 
                mat.emissiveIntensity = 3.5 + Math.sin(elapsedTimeRef.current * (3.0 + Math.sin(i * 0.1))) * 2.0;
            }
        });

        if (flameMeshRef.current && flameLightRef.current) {
            const flameMat = flameMeshRef.current.material as THREE.MeshStandardMaterial;
            const baseFlameIntensity = 2.5;
            const pulse = Math.sin(elapsedTimeRef.current * 5) * 0.8 + 0.8; 
            flameMat.emissiveIntensity = baseFlameIntensity * pulse;
            flameMat.opacity = 0.6 + pulse * 0.2; 
            flameMeshRef.current.scale.y = 0.8 + pulse * 0.25; 
            flameMeshRef.current.scale.x = flameMeshRef.current.scale.z = 0.7 + pulse * 0.15;
            flameLightRef.current.intensity = (baseFlameIntensity * pulse) * 0.8; 
            flameMeshRef.current.visible = true;
            flameLightRef.current.visible = true;
        }
        
        if (alienPilotRef.current) {
            alienPilotRef.current.position.y = (UFO_TOTAL_THICKNESS * 0.5) + (UFO_DOME_BASE_RADIUS * UFO_DOME_HEIGHT_FACTOR * 0.3) + Math.sin(elapsedTimeRef.current * 1.2) * 0.05;
            alienPilotRef.current.rotation.y = elapsedTimeRef.current * 0.2; 
        }

        const hitFlickerEndTime = lastHitTime + 0.4; 
        const nowForHitCheck = performance.now() / 1000;
        if (upperSaucerMaterialRef.current && lowerSaucerMaterialRef.current && domeMaterialRef.current && originalEmissives.current) {
            const upperMat = upperSaucerMaterialRef.current; 
            const lowerMat = lowerSaucerMaterialRef.current;
            const domeMat = domeMaterialRef.current;
            if (nowForHitCheck < hitFlickerEndTime) { 
                const flickerIntensity = 6 + Math.random() * 4;
                upperMat.emissiveIntensity = flickerIntensity; upperMat.emissive.setRGB(1, 0.1, 0.05); 
                lowerMat.emissiveIntensity = flickerIntensity; lowerMat.emissive.setRGB(1, 0.1, 0.05);
                domeMat.emissiveIntensity = flickerIntensity * 0.6; domeMat.emissive.setRGB(0.9, 0.2, 0.1);
            } else {
                upperMat.emissiveIntensity = originalEmissives.current.upperSaucer.intensity; upperMat.emissive.copy(originalEmissives.current.upperSaucer.color);
                lowerMat.emissiveIntensity = originalEmissives.current.lowerSaucer.intensity; lowerMat.emissive.copy(originalEmissives.current.lowerSaucer.color);
                domeMat.emissiveIntensity = originalEmissives.current.dome.intensity; domeMat.emissive.copy(originalEmissives.current.dome.color);
            }
        }
      }
    });
    
    if (currentStatus === "destroyed_visuals_done") {
        return null;
    }

    const numRimLights = 36; 
    const rimLightColors = ["#9400D3", "#BA55D3", "#483D8B", "#DDA0DD"]; 
    const saucerUpperHalfHeight = UFO_TOTAL_THICKNESS * 0.5;
    const saucerLowerHalfHeight = UFO_TOTAL_THICKNESS * 0.5;
    const flameBaseY = -saucerLowerHalfHeight - UFO_UNDERSIDE_ENGINE_HEIGHT; 
    const pilotYPosition = saucerUpperHalfHeight + (UFO_DOME_BASE_RADIUS * UFO_DOME_HEIGHT_FACTOR * 0.25); 

    return (
      <group ref={shipInternalRef} scale={[1,1,1]} visible={currentStatus !== "destroyed_visuals_done"} castShadow receiveShadow>
        <mesh castShadow receiveShadow position={[0, saucerUpperHalfHeight / 2, 0]} rotation={[Math.PI, 0, 0]} >
          <cylinderGeometry args={[UFO_UPPER_TAPER_RADIUS, UFO_MAX_RADIUS, saucerUpperHalfHeight, 64, 4]} />
          <meshPhysicalMaterial ref={upperSaucerMaterialRef} color="#4B0082" metalness={0.9} roughness={0.15} envMapIntensity={1.2} emissive="#6A0DAD" emissiveIntensity={0.35} clearcoat={0.3} clearcoatRoughness={0.1}/>
        </mesh>
        <mesh castShadow receiveShadow position={[0, -saucerLowerHalfHeight / 2, 0]}>
          <cylinderGeometry args={[UFO_MAX_RADIUS, UFO_LOWER_TAPER_RADIUS, saucerLowerHalfHeight, 64, 4]} />
          <meshPhysicalMaterial ref={lowerSaucerMaterialRef} color="#4B0082" metalness={0.9} roughness={0.15} envMapIntensity={1.2} emissive="#6A0DAD" emissiveIntensity={0.35} clearcoat={0.3} clearcoatRoughness={0.1}/>
        </mesh>
        <mesh castShadow position={[0, saucerUpperHalfHeight -0.02, 0]} >
          <sphereGeometry args={[UFO_DOME_BASE_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI * UFO_DOME_HEIGHT_FACTOR]} />
          <meshPhysicalMaterial ref={domeMaterialRef} color="#8A2BE2" metalness={0.0} roughness={0.0} transmission={0.95} thickness={0.4} ior={1.4} transparent opacity={0.2} emissive="#9370DB" emissiveIntensity={0.5}/>
          <pointLight color="#ADFF2F" intensity={currentStatus === "operational" ? 0.7 : 0.2} distance={UFO_DOME_BASE_RADIUS * 1.2} decay={2} position={[0, UFO_DOME_BASE_RADIUS * 0.3, 0]} />
        </mesh>
        <mesh ref={alienPilotRef} position={[0, pilotYPosition, 0]} castShadow>
            <sphereGeometry args={[ALIEN_PILOT_SIZE, 16, 12]} />
            <meshStandardMaterial color="#003300" emissive="#00FF00" emissiveIntensity={1.5} roughness={0.6}/>
        </mesh>
        <mesh castShadow receiveShadow position={[0, -saucerLowerHalfHeight - (UFO_UNDERSIDE_ENGINE_HEIGHT / 2) + 0.1, 0]}>
            <cylinderGeometry args={[UFO_UNDERSIDE_ENGINE_RADIUS * 0.8, UFO_UNDERSIDE_ENGINE_RADIUS, UFO_UNDERSIDE_ENGINE_HEIGHT, 32]} />
            <meshStandardMaterial ref={undersideEngineMaterialRef} color="#200030" metalness={0.7} roughness={0.3} emissive="#DDA0DD" emissiveIntensity={2.5} />
        </mesh>
        <mesh ref={flameMeshRef} position={[0, flameBaseY - (UFO_FLAME_HEIGHT / 2), 0]} rotation={[Math.PI, 0, 0]} >
            <coneGeometry args={[UFO_FLAME_RADIUS, UFO_FLAME_HEIGHT, 24, 1, true]} />
            <meshStandardMaterial color="#FFA07A" emissive="#FF4500" emissiveIntensity={2.5} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <pointLight ref={flameLightRef} color="#FF6347" intensity={2.0} distance={UFO_FLAME_HEIGHT * 2} decay={2} position={[0, flameBaseY - UFO_FLAME_HEIGHT * 0.3 ,0]} />
        {Array.from({ length: numRimLights }).map((_, i) => {
          const angle = (i / numRimLights) * Math.PI * 2;
          const lightRadius = UFO_MAX_RADIUS * 0.98; 
          return (
            <mesh key={`rim-light-${i}`} position={[ Math.cos(angle) * lightRadius, 0, Math.sin(angle) * lightRadius ]}>
              <sphereGeometry args={[0.09, 8, 6]} /> 
              <meshStandardMaterial ref={el => { rimLightMaterialsRef.current[i] = el; }} emissive={rimLightColors[i % rimLightColors.length]} emissiveIntensity={3.5} color="#180028" />
            </mesh>
          );
        })}
        <pointLight color="#C8A2C8" intensity={currentStatus === "operational" ? 1.0 : 0.3} distance={UFO_MAX_RADIUS * 3} decay={2.0} position={[0,UFO_TOTAL_THICKNESS,0]}/>
      </group>
    );
  }
);

// --- Missile (Unchanged) ---
interface MissileProps { id: string; startPosition: THREE.Vector3; targetPosition: THREE.Vector3; speed?: number; onHit: (id: string, hitPoint: THREE.Vector3) => void; onMiss?: (id: string) => void; }

function Missile({ id, startPosition, targetPosition, speed = 0.8, onHit, onMiss }: MissileProps) {
  const missileRef = useRef<THREE.Mesh>(null); 
  const totalDistance = useRef(startPosition.distanceTo(targetPosition)); 
  const distanceTraveled = useRef(0);
  const initializedRef = useRef(false);
  
  // Set up the missile position and orientation when it's first created
  useEffect(() => { 
    if (missileRef.current && !initializedRef.current) { 
      // Validate positions before using them
      if (isNaN(startPosition.x) || isNaN(startPosition.y) || isNaN(startPosition.z) ||
          isNaN(targetPosition.x) || isNaN(targetPosition.y) || isNaN(targetPosition.z)) {
        console.error(`Missile ${id} has invalid position data:`, 
                     'start:', startPosition.toArray(), 
                     'target:', targetPosition.toArray());
        return;
      }
      
      console.log(`Missile ${id} initialized at`, startPosition.toArray().map(v => v.toFixed(2)));
      missileRef.current.position.copy(startPosition); 
      missileRef.current.lookAt(targetPosition);
      initializedRef.current = true;
    } 
  }, [id, startPosition, targetPosition]);
  
  // Update the missile position each frame
  useFrame(({ clock }, delta) => {
    if (!missileRef.current || !initializedRef.current) return;
    
    // Calculate travel distance for this frame
    const travelDelta = speed * delta * 30; 
    distanceTraveled.current += travelDelta;
    
    // Check if we've reached the target
    if (distanceTraveled.current >= totalDistance.current) { 
      // Ensure we don't copy invalid positions
      if (isNaN(targetPosition.x) || isNaN(targetPosition.y) || isNaN(targetPosition.z)) {
        console.error(`Missile ${id} has invalid target position:`, targetPosition.toArray());
        onMiss(id);
        return;
      }
      
      missileRef.current.position.copy(targetPosition); 
      console.log(`Missile ${id} reached target at`, targetPosition.toArray().map(v => v.toFixed(2)));
      onHit(id, targetPosition.clone()); 
      return; 
    }
    
    // Move the missile toward the target
    const direction = new THREE.Vector3().subVectors(targetPosition, startPosition).normalize(); 
    if (isNaN(direction.x) || isNaN(direction.y) || isNaN(direction.z) || direction.length() === 0) {
      console.error(`Missile ${id} has invalid direction vector:`, direction.toArray());
      onMiss(id);
      return;
    }
    
    missileRef.current.position.addScaledVector(direction, travelDelta);
    
    // Check if we've gone too far (miss condition)
    if (distanceTraveled.current > totalDistance.current + 10 && onMiss) {
      console.log(`Missile ${id} missed target`);
      onMiss(id); 
    }
  });
  return ( 
    <mesh ref={missileRef}> 
      <Trail width={0.3} length={5} color={new THREE.Color("#FFD700")} attenuation={(w) => w * 0.8}> 
        <group>
          {/* Missile body */}
          <mesh rotation-x={Math.PI / 2}> 
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} /> 
            <meshStandardMaterial emissive="yellow" emissiveIntensity={2} color="gold" /> 
          </mesh>
          {/* Missile tip */}
          <mesh position={[0, 0, 0.15]} rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial emissive="orange" emissiveIntensity={1.5} color="#FFA500" />
          </mesh>
          {/* Missile fins */}
          {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => (
            <mesh 
              key={`fin-${i}`}
              position={[0, 0, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.15, 0.02, 0.08]} />
              <meshStandardMaterial emissive="#FFA500" emissiveIntensity={1} color="#FFA500" />
            </mesh>
          ))}
        </group>
      </Trail> 
    </mesh> 
  );
}



// --- Realistic Rocket Configuration (Updated Structure) ---
const ROCKET_MAIN_RADIUS = 0.3; 
const NOZZLE_BELL_HEIGHT = 0.6; 
const NOZZLE_BELL_RADIUS_EXIT = ROCKET_MAIN_RADIUS * 0.75; 
const NOZZLE_BELL_RADIUS_THROAT = ROCKET_MAIN_RADIUS * 0.35; 

const LOWER_STAGE_HEIGHT = 2.0; 
const LOWER_STAGE_RADIUS = ROCKET_MAIN_RADIUS;

const INTERSTAGE_HEIGHT = 0.15; 
const INTERSTAGE_RADIUS = LOWER_STAGE_RADIUS * 0.98; 

const UPPER_STAGE_HEIGHT = 1.5; 
const UPPER_STAGE_RADIUS_BASE = INTERSTAGE_RADIUS; 
const UPPER_STAGE_RADIUS_TOP = ROCKET_MAIN_RADIUS * 0.7; 

const PAYLOAD_FAIRING_HEIGHT = 0.85; 
const PAYLOAD_FAIRING_RADIUS_BASE = UPPER_STAGE_RADIUS_TOP; 

const FIN_SPAN = 0.7; 
const FIN_CHORD_ROOT = 0.8; // Length of the fin along the rocket body
const FIN_THICKNESS = 0.05; 
const FIN_ATTACH_Z_OFFSET = 0.1; // Offset from the very bottom of the lower stage body for fin attachment

// Total length of the rocket from nozzle exit (z=0) to payload fairing tip
const ROCKET_TOTAL_LENGTH = NOZZLE_BELL_HEIGHT + LOWER_STAGE_HEIGHT + INTERSTAGE_HEIGHT + UPPER_STAGE_HEIGHT + PAYLOAD_FAIRING_HEIGHT;

const RealisticRocket = () => {
  const materials = useMemo(() => ({
    bodyWhite: new THREE.MeshStandardMaterial({ color: '#f0f0f0', metalness: 0.5, roughness: 0.6 }),
    bodyGray: new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.6, roughness: 0.5 }),
    bodyRed: new THREE.MeshStandardMaterial({ color: '#ff3333', metalness: 0.6, roughness: 0.5 }),
    interstageDark: new THREE.MeshStandardMaterial({ color: '#555555', metalness: 0.7, roughness: 0.4 }),
    nozzleGraphite: new THREE.MeshStandardMaterial({ color: '#333333', metalness: 0.8, roughness: 0.3 }),
    finMaterial: new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 0.5, roughness: 0.6 }),
    windowMaterial: new THREE.MeshStandardMaterial({ color: '#88ccff', metalness: 0.9, roughness: 0.2, emissive: '#66aaff', emissiveIntensity: 0.5 }),
    detailMaterial: new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.7, roughness: 0.3 }),
  }), []);

  // Calculate Z positions for each component, base of nozzle at z=0
  const nozzleCenterZ = NOZZLE_BELL_HEIGHT / 2;
  const lowerStageBaseZ = NOZZLE_BELL_HEIGHT;
  const lowerStageCenterZ = lowerStageBaseZ + LOWER_STAGE_HEIGHT / 2;
  const interstageBaseZ = lowerStageBaseZ + LOWER_STAGE_HEIGHT;
  const interstageCenterZ = interstageBaseZ + INTERSTAGE_HEIGHT / 2;
  const upperStageBaseZ = interstageBaseZ + INTERSTAGE_HEIGHT;
  const upperStageCenterZ = upperStageBaseZ + UPPER_STAGE_HEIGHT / 2;
  const payloadFairingBaseZ = upperStageBaseZ + UPPER_STAGE_HEIGHT;
  const payloadFairingCenterZ = payloadFairingBaseZ + PAYLOAD_FAIRING_HEIGHT / 2;
  
  // Fin Z position: Center of the fin chord, attached to lower stage
  const finCenterZ = lowerStageBaseZ + FIN_ATTACH_Z_OFFSET + FIN_CHORD_ROOT / 2;

  return (
    <group name="realistic-rocket">
      {/* Enhanced Nozzle with inner glow */}
      <mesh position={[0, 0, nozzleCenterZ]} material={materials.nozzleGraphite} castShadow receiveShadow > 
        <cylinderGeometry args={[NOZZLE_BELL_RADIUS_THROAT, NOZZLE_BELL_RADIUS_EXIT, NOZZLE_BELL_HEIGHT, 32, 1, true]} /> 
      </mesh>
      <mesh position={[0, 0, nozzleCenterZ - 0.05]} scale={0.95}>
        <cylinderGeometry args={[NOZZLE_BELL_RADIUS_THROAT * 0.9, NOZZLE_BELL_RADIUS_EXIT * 0.9, NOZZLE_BELL_HEIGHT, 32, 1, true]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.8} transparent opacity={0.7} side={THREE.BackSide} />
      </mesh>
      
      {/* Lower Stage with details */}
      <mesh position={[0, 0, lowerStageCenterZ]} material={materials.bodyRed} castShadow receiveShadow > 
        <cylinderGeometry args={[LOWER_STAGE_RADIUS, LOWER_STAGE_RADIUS, LOWER_STAGE_HEIGHT, 32]} /> 
      </mesh>
      
      {/* Detail rings on lower stage */}
      <mesh position={[0, 0, lowerStageBaseZ + LOWER_STAGE_HEIGHT * 0.25]} material={materials.detailMaterial} castShadow receiveShadow>
        <torusGeometry args={[LOWER_STAGE_RADIUS + 0.02, 0.05, 16, 32]} />
      </mesh>
      <mesh position={[0, 0, lowerStageBaseZ + LOWER_STAGE_HEIGHT * 0.75]} material={materials.detailMaterial} castShadow receiveShadow>
        <torusGeometry args={[LOWER_STAGE_RADIUS + 0.02, 0.05, 16, 32]} />
      </mesh>
      
      {/* Interstage with details */}
      <mesh position={[0, 0, interstageCenterZ]} material={materials.interstageDark} castShadow receiveShadow > 
        <cylinderGeometry args={[INTERSTAGE_RADIUS, INTERSTAGE_RADIUS, INTERSTAGE_HEIGHT, 32]} /> 
      </mesh>
      
      {/* Upper Stage with improved shape */}
      <mesh position={[0, 0, upperStageCenterZ]} material={materials.bodyWhite} castShadow receiveShadow > 
        <cylinderGeometry args={[UPPER_STAGE_RADIUS_TOP, UPPER_STAGE_RADIUS_BASE, UPPER_STAGE_HEIGHT, 32]} /> 
      </mesh>
      
      {/* Windows/portholes on upper stage */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => (
        <mesh 
          key={`window-${i}`}
          position={[
            Math.cos(angle) * (UPPER_STAGE_RADIUS_BASE - 0.01),
            Math.sin(angle) * (UPPER_STAGE_RADIUS_BASE - 0.01),
            upperStageBaseZ + UPPER_STAGE_HEIGHT * 0.3
          ]}
          rotation={[0, 0, angle + Math.PI/2]}
          material={materials.windowMaterial}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        </mesh>
      ))}
      
      {/* Improved Payload Fairing with more aerodynamic shape */}
      <mesh position={[0, 0, payloadFairingCenterZ]} material={materials.bodyWhite} castShadow receiveShadow > 
        <coneGeometry args={[PAYLOAD_FAIRING_RADIUS_BASE, PAYLOAD_FAIRING_HEIGHT, 32]} /> 
      </mesh>
      
      {/* Nose cone tip with different material */}
      <mesh position={[0, 0, payloadFairingBaseZ + PAYLOAD_FAIRING_HEIGHT * 0.85]} material={materials.bodyGray} castShadow receiveShadow>
        <sphereGeometry args={[PAYLOAD_FAIRING_RADIUS_BASE * 0.3, 16, 16]} />
      </mesh>
      
      {/* Improved aerodynamic fins (4x) with curved shape */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => {
        const x = Math.cos(angle) * (LOWER_STAGE_RADIUS - 0.02);
        const y = Math.sin(angle) * (LOWER_STAGE_RADIUS - 0.02);
        return (
          <group key={`fin-${i}`} position={[x, y, finCenterZ]} rotation={[0, 0, angle]}>
            {/* Main fin body with curved shape */}
            <mesh material={materials.finMaterial} castShadow receiveShadow>
              <extrudeGeometry 
                args={[
                  new THREE.Shape()
                    .moveTo(0, 0)
                    .lineTo(FIN_SPAN, -FIN_CHORD_ROOT/4)
                    .lineTo(FIN_SPAN, FIN_CHORD_ROOT/4)
                    .lineTo(0, FIN_CHORD_ROOT/2)
                    .lineTo(0, 0),
                  { depth: FIN_THICKNESS, bevelEnabled: false }
                ]}
              />
            </mesh>
            {/* Fin edge detail */}
            <mesh position={[FIN_SPAN/2, 0, FIN_THICKNESS/2]} material={materials.detailMaterial}>
              <boxGeometry args={[FIN_SPAN*0.8, FIN_THICKNESS*0.5, FIN_THICKNESS*1.1]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// RocketWrapper: No changes needed, it correctly wraps the Z-forward rocket model.
const RocketWrapper = () => ( 
    <group name="rocket-model-z-forward-wrapper"> 
        <RealisticRocket /> 
    </group> 
);


// --- Helper Functions (Unchanged) ---
const randomPointOnSphereSurface = (radius: number): THREE.Vector3 => {
  const u = Math.random(); const v = Math.random();
  const theta = 2 * Math.PI * u; const phi = Math.acos(2 * v - 1);
  return new THREE.Vector3( Math.sin(phi) * Math.cos(theta) * radius, Math.sin(phi) * Math.sin(theta) * radius, Math.cos(phi) * radius );
};

// --- Rocket Vehicle (for Alien Attack) ---
const ROCKET_SCALE = 0.35; 
const ATTACK_PRELAUNCH_DUR = 2.0;
const ATTACK_VERTICAL_ASCENT_DUR = 4.0;
const ATTACK_APPROACH_TARGET_DUR = 4.0;
const ATTACK_FIRING_DURATION = 12.0;
const ATTACK_MISSION_COMPLETE_DUR = 2;

type AttackRocketPhase = 'pre-launch' | 'vertical-ascent' | 'approaching-target' | 'firing-missiles' | 'mission-complete' | 'disappeared';
interface RocketVehicleProps { targetShipRef: React.RefObject<AlienShipRefType | null>; onFireMissile: (startPos: THREE.Vector3, targetPos: THREE.Vector3) => void; onMissionComplete: () => void; }

const RocketVehicle = ({ targetShipRef, onFireMissile, onMissionComplete }: RocketVehicleProps) => {
  const vehicleRef = useRef<THREE.Group>(null); const flameRef = useRef<THREE.Mesh>(null);
  const [currentPhase, setCurrentPhase] = useState<AttackRocketPhase>('pre-launch');
  const phaseStartTime = useRef(0); const lastMissileFireTime = useRef(0); const missileInterval = 0.8;
  const { launchPos, launchUp } = useMemo(() => { const pos = randomPointOnSphereSurface(EARTH_RADIUS); const up = pos.clone().normalize(); return { launchPos: pos.clone().addScaledVector(up, 0.02), launchUp: up }; }, []);
  
  useEffect(() => { 
    if (vehicleRef.current) { 
      vehicleRef.current.position.copy(launchPos); 
      vehicleRef.current.lookAt(launchPos.clone().add(launchUp)); 
    } 
    phaseStartTime.current = performance.now() / 1000; 
  }, [launchPos, launchUp]);
  
  useFrame(({ clock }) => {
    if (!vehicleRef.current || !flameRef.current) return;
    const currentTime = clock.getElapsedTime();
    const timeInPhase = currentTime - phaseStartTime.current;
    let phaseForThisFrameLogic: AttackRocketPhase = currentPhase;
    let nextPhaseTransition: AttackRocketPhase = currentPhase; 
    
    if (currentPhase === 'pre-launch' && timeInPhase > ATTACK_PRELAUNCH_DUR) nextPhaseTransition = 'vertical-ascent';
    else if (currentPhase === 'vertical-ascent' && timeInPhase > ATTACK_VERTICAL_ASCENT_DUR) nextPhaseTransition = 'approaching-target';
    else if (currentPhase === 'approaching-target' && timeInPhase > ATTACK_APPROACH_TARGET_DUR) { 
      const targetShip = targetShipRef.current; 
      const isTargetValid = targetShip && targetShip.status === "operational";
      nextPhaseTransition = isTargetValid ? 'firing-missiles' : 'mission-complete'; 
    }
    else if (currentPhase === 'firing-missiles') { 
      const targetShip = targetShipRef.current; 
      const isTargetValid = targetShip && targetShip.status === "operational"; 
      if(timeInPhase > ATTACK_FIRING_DURATION || !isTargetValid) nextPhaseTransition = 'mission-complete'; 
    }
    else if (currentPhase === 'mission-complete' && timeInPhase > ATTACK_MISSION_COMPLETE_DUR) nextPhaseTransition = 'disappeared';
    
    if (nextPhaseTransition !== currentPhase) { 
      setCurrentPhase(nextPhaseTransition); 
      phaseStartTime.current = currentTime; 
      phaseForThisFrameLogic = nextPhaseTransition; 
      if (nextPhaseTransition === 'disappeared') onMissionComplete(); 
    }
    
    if (phaseForThisFrameLogic === 'disappeared') { 
      vehicleRef.current.visible = false; 
      if(flameRef.current) flameRef.current.visible = false; 
      return; 
    }
    
    let targetPositionVec = vehicleRef.current.position.clone();
    let lookAtTargetVec = vehicleRef.current.position.clone().add(vehicleRef.current.getWorldDirection(new THREE.Vector3()));
    let flameScale = 0; 
    let flameIntensity = 0;
    
    switch (phaseForThisFrameLogic) {
      case 'pre-launch': 
        flameScale = 0.3 + Math.random() * 0.1; 
        flameIntensity = 0.5 + Math.random() * 0.2; 
        lookAtTargetVec.copy(launchPos).add(launchUp); 
        break;
      case 'vertical-ascent': 
        const ascSpd = 2.0; 
        const ascDst = timeInPhase * ascSpd; 
        targetPositionVec.copy(launchPos).addScaledVector(launchUp, ascDst); 
        lookAtTargetVec.copy(targetPositionVec).add(launchUp); 
        flameScale = 0.8; 
        flameIntensity = 1.8; 
        break;
      case 'approaching-target': 
      case 'firing-missiles':
        const targetShipInstance = targetShipRef.current;
        const isTargetCurrentlyValid = targetShipInstance && targetShipInstance.status === "operational" && targetShipInstance.position; // Added targetShipInstance.position check
        if (isTargetCurrentlyValid) { 
          const tgtPos = targetShipInstance.position.clone(); 
          const approachT = Math.min(timeInPhase / ATTACK_APPROACH_TARGET_DUR, 1.0);
          const verticalEndPos = launchPos.clone().addScaledVector(launchUp, ATTACK_VERTICAL_ASCENT_DUR * 2.0); 
          
          const lerpStartPos = (currentPhase === 'approaching-target' && phaseForThisFrameLogic === 'approaching-target' && approachT < 0.01) 
                               ? verticalEndPos 
                               : vehicleRef.current.position;
          
          targetPositionVec.lerpVectors(lerpStartPos, tgtPos, Math.pow(approachT,2)); 
          lookAtTargetVec.copy(tgtPos); 
          flameScale = 0.7; 
          flameIntensity = 1.5;
          if (phaseForThisFrameLogic === 'firing-missiles') {
            if (currentTime - lastMissileFireTime.current > missileInterval) {
                // Missile fires from the tip of the rocket (local Z = ROCKET_TOTAL_LENGTH)
                const missileLocalStartOffset = new THREE.Vector3(0, 0, ROCKET_TOTAL_LENGTH * ROCKET_SCALE); 
                const missileStart = new THREE.Vector3();
                // Use the rocket's world matrix to properly transform the local offset to world coordinates
                missileStart.copy(missileLocalStartOffset).applyMatrix4(vehicleRef.current.matrixWorld);
                
                // Generate a random offset for targeting variation that's not too large
                const randomOffset = new THREE.Vector3(
                  (Math.random() - 0.5) * 0.3, 
                  (Math.random() - 0.5) * 0.3, 
                  (Math.random() - 0.5) * 0.3
                );
                
                // Create a new vector for the missile target instead of modifying the original tgtPos
                const missileTarget = tgtPos.clone().add(randomOffset); 
                
                // Fire the missile with proper start and target positions
                onFireMissile(missileStart, missileTarget); 
                
                // Update the last missile fire time
                lastMissileFireTime.current = currentTime;
                
                // Add debug logging
                console.log('Firing missile from', missileStart.toArray().map(v => v.toFixed(2)), 'to', missileTarget.toArray().map(v => v.toFixed(2)));
            } 
          } 
        } else if (!isTargetCurrentlyValid && (phaseForThisFrameLogic === 'firing-missiles' || phaseForThisFrameLogic === 'approaching-target')) {
            console.log("Attack Rocket target no longer valid/operational. Transitioning to mission-complete.");
            setCurrentPhase('mission-complete'); 
            phaseStartTime.current = currentTime; 
            const flyDirImmediate = vehicleRef.current.getWorldDirection(new THREE.Vector3()); 
            targetPositionVec.addScaledVector(flyDirImmediate, 0.3); 
            lookAtTargetVec.copy(targetPositionVec).add(flyDirImmediate); 
            flameScale = 0.4; 
            flameIntensity = 1.0; 
        }
        break;
      case 'mission-complete': 
        const flyDir = vehicleRef.current.getWorldDirection(new THREE.Vector3()); 
        targetPositionVec.addScaledVector(flyDir, 0.3); 
        lookAtTargetVec.copy(targetPositionVec).add(flyDir); 
        flameScale = 0.4; 
        flameIntensity = 1.0; 
        break;
    }
    
    vehicleRef.current.position.lerp(targetPositionVec, 0.1);
    if (lookAtTargetVec.lengthSq() > 0.001 && !lookAtTargetVec.equals(vehicleRef.current.position)) {
      vehicleRef.current.lookAt(lookAtTargetVec);
    }
    
    const flameLF = 1.3 + Math.random() * 0.3; 
    flameRef.current.scale.set(flameScale, flameScale * flameLF, flameScale);
    if (flameRef.current.material instanceof THREE.MeshStandardMaterial) {
      flameRef.current.material.emissiveIntensity = flameIntensity;
    }
    flameRef.current.visible = flameIntensity > 0.01 && phaseForThisFrameLogic !== 'disappeared';
  });
  
  if (currentPhase === 'disappeared') return null;
  
  const flameConeHeight = 1.8; 
  const flameConeRadius = 0.4;
  
  return (
    <group ref={vehicleRef} scale={[ROCKET_SCALE, ROCKET_SCALE, ROCKET_SCALE]}> 
      <RocketWrapper /> 
      <group> 
        {/* Flame positioned at rocket's base (z=0 local), pointing backwards (-Z local) */}
        <mesh ref={flameRef} position={[0, 0, -flameConeHeight / 2 ]} rotation={[-Math.PI / 2, 0, 0]} > 
          <coneGeometry args={[flameConeRadius, flameConeHeight, 16, 1, true]} /> 
          <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={2} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /> 
        </mesh> 
        <pointLight 
          color="orangered" 
          intensity={flameRef.current && flameRef.current.visible ? (flameRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity * 2 : 0} 
          distance={flameConeHeight * 1.5 * ROCKET_SCALE} 
          decay={2} 
          position={[0,0, -flameConeHeight ]} // Position light near flame tip
        /> 
      </group> 
    </group>
  );
};


// --- Satellite Component (Unchanged) ---
const SATELLITE_ORIGINAL_COLOR = "#c0c0c0"; const SATELLITE_HIGHLIGHT_COLOR = "gold";
interface SatelliteProps { id: string; orbitRadius: number; orbitSpeed: number; orbitInitialAngle: number; orbitAxis?: THREE.Vector3; }
function Satellite({ id, orbitRadius, orbitSpeed, orbitInitialAngle, orbitAxis = new THREE.Vector3(0, 1, 0) }: SatelliteProps) {
  const satRef = useRef<THREE.Group>(null); const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const { u: basisU, v: basisV } = useMemo(() => { const normalizedOrbitAxis = orbitAxis.clone().normalize(); let u = new THREE.Vector3(); if (Math.abs(normalizedOrbitAxis.dot(new THREE.Vector3(0,1,0))) > 0.99) { u.set(1,0,0).cross(normalizedOrbitAxis).normalize(); if (u.lengthSq() < 0.1) u.set(0,0,1).cross(normalizedOrbitAxis).normalize(); } else { u.set(0,1,0).cross(normalizedOrbitAxis).normalize(); } const v = normalizedOrbitAxis.clone().cross(u).normalize(); return { u, v }; }, [orbitAxis]);
  useEffect(() => { if (satRef.current) { const xInPlane = orbitRadius * Math.cos(orbitInitialAngle); const yInPlane = orbitRadius * Math.sin(orbitInitialAngle); satRef.current.position.copy(basisU).multiplyScalar(xInPlane).addScaledVector(basisV, yInPlane); } }, [orbitRadius, orbitInitialAngle, basisU, basisV]);
  useFrame(({ clock }) => { if (!satRef.current) return; const elapsedTime = clock.getElapsedTime(); const currentAngle = orbitInitialAngle + elapsedTime * orbitSpeed; const xInPlane = orbitRadius * Math.cos(currentAngle); const yInPlane = orbitRadius * Math.sin(currentAngle); satRef.current.position.copy(basisU).multiplyScalar(xInPlane).addScaledVector(basisV, yInPlane); satRef.current.lookAt(0,0,0); });
  const handleClick = () => { console.log(`Satellite ${id} clicked!`); setIsHighlighted(true); if (bodyMaterialRef.current) { bodyMaterialRef.current.color.set(SATELLITE_HIGHLIGHT_COLOR); bodyMaterialRef.current.emissive.set(SATELLITE_HIGHLIGHT_COLOR); bodyMaterialRef.current.emissiveIntensity = 0.5; } setTimeout(() => { setIsHighlighted(false); if (bodyMaterialRef.current) { bodyMaterialRef.current.color.set(SATELLITE_ORIGINAL_COLOR); bodyMaterialRef.current.emissive.set("#000000"); bodyMaterialRef.current.emissiveIntensity = 0; } }, 1500); };
  return (
    <group ref={satRef} scale={[0.3, 0.3, 0.3]} onClick={handleClick} castShadow> <mesh position={[0, 0, 0]} castShadow> <boxGeometry args={[1.5, 0.8, 0.8]} /> <meshStandardMaterial ref={bodyMaterialRef} color={SATELLITE_ORIGINAL_COLOR} metalness={0.9} roughness={0.2} /> </mesh> <mesh position={[0, 1.65, 0]} rotation={[0,0,Math.PI/2]} castShadow> <boxGeometry args={[0.1, 2.5, 1.5]} /> <meshStandardMaterial color="#102A43" emissive="#334E68" emissiveIntensity={0.2} /> </mesh> <mesh position={[0, -1.65, 0]} rotation={[0,0,Math.PI/2]} castShadow> <boxGeometry args={[0.1, 2.5, 1.5]} /> <meshStandardMaterial color="#102A43" emissive="#334E68" emissiveIntensity={0.2} /> </mesh> <mesh position={[-0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow> <cylinderGeometry args={[0.15, 0.5, 0.2, 16]} /> <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.4} /> </mesh> </group>
  );
}

// --- Satellite Launcher Rocket (with Return to Earth behavior) ---
const SAT_ROCKET_SCALE = 0.3; 
const SAT_PRELAUNCH_DUR = 2.0;
const SAT_VERTICAL_ASCENT_DUR = 5.0;
const SAT_GRAVITY_TURN_DUR = 6.0;
const SAT_DEPLOY_DUR = 3.0;
const SAT_DEORBIT_BURN_DUR = 3.0;
const SAT_RETURN_FLIGHT_DUR = 8.0;
const SAT_MISSION_COMPLETE_DELAY = 2.0; 

type SatelliteRocketPhase = 
  | 'pre-launch' 
  | 'vertical-ascent' 
  | 'gravity-turn-and-circularize' 
  | 'deploying-satellite' 
  | 'deorbit-burn' 
  | 'returning-to-earth' 
  | 'mission-complete' 
  | 'disappeared';

interface SatelliteLauncherProps { onDeploySatellite: (satelliteData: Omit<SatelliteProps, 'id'>) => void; onLauncherMissionComplete: () => void; }

function SatelliteLauncherRocket({ onDeploySatellite, onLauncherMissionComplete }: SatelliteLauncherProps) {
  const vehicleRef = useRef<THREE.Group>(null); 
  const flameRef = useRef<THREE.Mesh>(null);
  const [currentPhase, setCurrentPhase] = useState<SatelliteRocketPhase>('pre-launch'); 
  const phaseStartTime = useRef(0);
  const { launchPos, launchUp } = useMemo(() => { const pos = randomPointOnSphereSurface(EARTH_RADIUS); const up = pos.clone().normalize(); return { launchPos: pos.clone().addScaledVector(up, 0.02), launchUp: up }; }, []);
  const targetOrbitRadius = useMemo(() => EARTH_RADIUS + 2.0 + Math.random() * 1.5, []); 
  const returnTargetPoint = useRef<THREE.Vector3 | null>(null); 
  const deorbitStartPosition = useRef<THREE.Vector3 | null>(null);


  useEffect(() => { 
    if (vehicleRef.current) { 
      vehicleRef.current.position.copy(launchPos); 
      vehicleRef.current.lookAt(launchPos.clone().add(launchUp)); 
    } 
    phaseStartTime.current = performance.now() / 1000; 
  }, [launchPos, launchUp]);

  useFrame(({ clock }) => {
    if (!vehicleRef.current || !flameRef.current) return;
    const currentTime = clock.getElapsedTime(); 
    const timeInPhase = currentTime - phaseStartTime.current;
    let phaseForThisFrameLogic: SatelliteRocketPhase = currentPhase; 
    let nextPhaseTransition = currentPhase;

    if (currentPhase === 'pre-launch' && timeInPhase > SAT_PRELAUNCH_DUR) nextPhaseTransition = 'vertical-ascent';
    else if (currentPhase === 'vertical-ascent' && timeInPhase > SAT_VERTICAL_ASCENT_DUR) nextPhaseTransition = 'gravity-turn-and-circularize';
    else if (currentPhase === 'gravity-turn-and-circularize' && timeInPhase > SAT_GRAVITY_TURN_DUR) nextPhaseTransition = 'deploying-satellite';
    else if (currentPhase === 'deploying-satellite' && timeInPhase > SAT_DEPLOY_DUR) {
      nextPhaseTransition = 'deorbit-burn';
      returnTargetPoint.current = randomPointOnSphereSurface(EARTH_RADIUS * 0.98); 
      if(vehicleRef.current) deorbitStartPosition.current = vehicleRef.current.position.clone();
    }
    else if (currentPhase === 'deorbit-burn' && timeInPhase > SAT_DEORBIT_BURN_DUR) nextPhaseTransition = 'returning-to-earth';
    else if (currentPhase === 'returning-to-earth' && timeInPhase > SAT_RETURN_FLIGHT_DUR) nextPhaseTransition = 'mission-complete';
    else if (currentPhase === 'mission-complete' && timeInPhase > SAT_MISSION_COMPLETE_DELAY) {
      nextPhaseTransition = 'disappeared';
    }

    if (nextPhaseTransition !== currentPhase) {
      setCurrentPhase(nextPhaseTransition); 
      phaseStartTime.current = currentTime; 
      phaseForThisFrameLogic = nextPhaseTransition; 
      if (nextPhaseTransition === 'deploying-satellite' && vehicleRef.current) {
        // Satellite deploys from the tip of the rocket (local Z = ROCKET_TOTAL_LENGTH)
        const deployLocalOffset = new THREE.Vector3(0,0, ROCKET_TOTAL_LENGTH * 0.98 ); // Slightly behind tip
        const deployPosWorld = vehicleRef.current.localToWorld(deployLocalOffset.clone()); 
        const rocketForwardWorld = vehicleRef.current.getWorldDirection(new THREE.Vector3()); 
        let velocityGuess = rocketForwardWorld.clone().multiplyScalar(targetOrbitRadius * (0.1 + Math.random() * 0.05));
        
        if (deployPosWorld.lengthSq() > 0.01) { 
          const radialVec = deployPosWorld.clone().normalize(); 
          velocityGuess.projectOnPlane(radialVec).normalize(); 
          if(velocityGuess.lengthSq() < 0.01) velocityGuess.copy(rocketForwardWorld.applyAxisAngle(radialVec,Math.PI/2)).normalize();
        } else { 
            velocityGuess.set(1,0,0);
        }
        velocityGuess.multiplyScalar(targetOrbitRadius * (0.1 + Math.random() * 0.05));


        let orbitAxis = deployPosWorld.clone().cross(velocityGuess).normalize(); 
        if(orbitAxis.lengthSq() < 0.5) orbitAxis.set(0,1,0);
        
        let basisU = new THREE.Vector3(); 
        if (Math.abs(orbitAxis.dot(new THREE.Vector3(0,1,0))) > 0.99) { 
          basisU.set(1,0,0).cross(orbitAxis).normalize(); 
          if (basisU.lengthSq() < 0.1) basisU.set(0,0,1).cross(orbitAxis).normalize(); 
        } else { 
          basisU.set(0,1,0).cross(orbitAxis).normalize(); 
        } 
        const basisV = orbitAxis.clone().cross(basisU).normalize(); 
        const projectedX = deployPosWorld.dot(basisU); 
        const projectedY = deployPosWorld.dot(basisV); 
        const orbitInitialAngle = Math.atan2(projectedY, projectedX);
        onDeploySatellite({ 
            orbitRadius: deployPosWorld.length(), 
            orbitSpeed: (0.1 + Math.random() * 0.05) * (Math.random() > 0.5 ? 1 : -1), 
            orbitInitialAngle: orbitInitialAngle, 
            orbitAxis: orbitAxis 
        });
      } 
      if (nextPhaseTransition === 'disappeared') onLauncherMissionComplete(); 
    }
    
    if (phaseForThisFrameLogic === 'disappeared') { 
      if (vehicleRef.current) vehicleRef.current.visible = false; 
      if (flameRef.current) flameRef.current.visible = false; 
      return; 
    }
    
    let targetPosition = vehicleRef.current.position.clone(); 
    let lookAtTarget = vehicleRef.current.position.clone().add(vehicleRef.current.getWorldDirection(new THREE.Vector3())); 
    let flameScale = 0, flameIntensity = 0;

    switch (phaseForThisFrameLogic) {
      case 'pre-launch': flameScale = 0.2; flameIntensity = 0.4; lookAtTarget.copy(launchPos).add(launchUp); break;
      case 'vertical-ascent': 
        const ascSpd = 1.5; targetPosition.copy(launchPos).addScaledVector(launchUp, timeInPhase * ascSpd); 
        lookAtTarget.copy(targetPosition).add(launchUp); flameScale = 0.7; flameIntensity = 1.6; break;
      case 'gravity-turn-and-circularize':
        const vertEndPos = launchPos.clone().addScaledVector(launchUp, SAT_VERTICAL_ASCENT_DUR * 1.5); 
        const progToOrb = Math.min(timeInPhase / SAT_GRAVITY_TURN_DUR, 1);
        
        const targetOrbitalPlaneNormal = launchUp.clone().applyAxisAngle(new THREE.Vector3(1,0,0).cross(launchUp).normalize(), Math.PI * 0.15).normalize();
        const targetOrbitalUp = targetOrbitalPlaneNormal.clone();

        const launchAzimuth = new THREE.Vector3().crossVectors(launchUp, new THREE.Vector3(0,1,0)).normalize(); 
        if (launchAzimuth.lengthSq() < 0.1) launchAzimuth.set(1,0,0); 

        const targetOrbitalDirection = launchAzimuth.clone().applyAxisAngle(targetOrbitalUp, progToOrb * Math.PI * 0.45).normalize();
        const targetOrbPos = targetOrbitalDirection.multiplyScalar(targetOrbitRadius);
        
        targetPosition.lerpVectors(vertEndPos, targetOrbPos, progToOrb*progToOrb); 
        
        const lookAheadOrbitalDirection = launchAzimuth.clone().applyAxisAngle(targetOrbitalUp, (progToOrb + 0.1) * Math.PI * 0.45).normalize();
        const lookAheadPos = lookAheadOrbitalDirection.multiplyScalar(targetOrbitRadius);
        lookAtTarget.copy(lookAheadPos); 
        flameScale = 0.6; flameIntensity = 1.4; 
        break;
      case 'deploying-satellite': 
        const depDir = vehicleRef.current.getWorldDirection(new THREE.Vector3()); 
        targetPosition.addScaledVector(depDir, 0.05); 
        lookAtTarget.copy(targetPosition).add(depDir); flameScale = 0; flameIntensity = 0; break;
      case 'deorbit-burn':
        const currentVelDir = vehicleRef.current.getWorldDirection(new THREE.Vector3()).negate(); 
        lookAtTarget.copy(vehicleRef.current.position).add(currentVelDir); 
        targetPosition.addScaledVector(currentVelDir.normalize(), -0.02 * timeInPhase); 
        flameScale = 0.4; flameIntensity = 1.0;
        break;
      case 'returning-to-earth':
        if (returnTargetPoint.current && deorbitStartPosition.current) {
            const returnProgress = Math.min(timeInPhase / SAT_RETURN_FLIGHT_DUR, 1);
            targetPosition.lerpVectors(deorbitStartPosition.current, returnTargetPoint.current, returnProgress * returnProgress);
            lookAtTarget.copy(returnTargetPoint.current);
        }
        flameScale = 0.1 + 0.2 * (1- (timeInPhase/SAT_RETURN_FLIGHT_DUR)); 
        flameIntensity = 0.3 + 0.5 * (1- (timeInPhase/SAT_RETURN_FLIGHT_DUR));
        if (vehicleRef.current.position.length() < EARTH_RADIUS + 0.1 && vehicleRef.current.visible){
            vehicleRef.current.visible = false; 
            if (flameRef.current) flameRef.current.visible = false;
        }
        break;
      case 'mission-complete': 
        if (vehicleRef.current) vehicleRef.current.visible = false; 
        flameScale = 0; flameIntensity = 0; break;
    }

    if(vehicleRef.current && vehicleRef.current.visible) vehicleRef.current.position.lerp(targetPosition, 0.15); 
    if (vehicleRef.current && vehicleRef.current.visible && lookAtTarget.lengthSq() > 0.001 && !lookAtTarget.equals(vehicleRef.current.position)) {
      vehicleRef.current.lookAt(lookAtTarget);
    }

    if(flameRef.current){
        const flameLF = 1.3 + Math.random() * 0.3; 
        flameRef.current.scale.set(flameScale, flameScale * flameLF, flameScale); 
        if (flameRef.current.material instanceof THREE.MeshStandardMaterial) {
            flameRef.current.material.emissiveIntensity = flameIntensity;
        } 
        flameRef.current.visible = flameIntensity > 0.01 && phaseForThisFrameLogic !== 'disappeared';
    }
  });
  

  if (currentPhase === 'disappeared') return null;
    // Scale flame relative to attack rocket's flame, based on rocket scales
  const flameConeHeight = 1.6 * (SAT_ROCKET_SCALE / ROCKET_SCALE); 
  const flameConeRadius = 0.35 * (SAT_ROCKET_SCALE / ROCKET_SCALE);
  
  return (
    <group ref={vehicleRef} scale={[SAT_ROCKET_SCALE, SAT_ROCKET_SCALE, SAT_ROCKET_SCALE]}> 
      <RocketWrapper /> 
      <group> 
        {/* Flame positioned at rocket's base (z=0 local), pointing backwards (-Z local) */}
        <mesh ref={flameRef} position={[0, 0, -flameConeHeight / 2]} rotation={[-Math.PI / 2, 0, 0]} > 
          <coneGeometry args={[flameConeRadius, flameConeHeight, 12, 1, true]} /> 
          <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={1} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /> 
        </mesh> 
        <pointLight 
          color="orange" 
          intensity={flameRef.current && flameRef.current.visible ? (flameRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity * 1.5 : 0} 
          distance={flameConeHeight * 1.2 * SAT_ROCKET_SCALE} 

          decay={2} 
          position={[0,0, -flameConeHeight ]} // Position light near flame tip
        /> 
      </group> 
    </group>
  );
}


// --- Main Scene Environment & Controller ---
function Environment() {
  const [explosions, setExplosions] = useState<Array<{ id: string; position: THREE.Vector3; scale?: number }>>([]);
  const [missiles, setMissiles] = useState<Array<MissileProps & { key: string }>>([]);
  const alienShipRef = useRef<AlienShipRefType | null>(null);
  const [showAlienShip, setShowAlienShip] = useState(true); 
  const [attackRocketMissionDone, setAttackRocketMissionDone] = useState(false);
  const [gamePhase, setGamePhase] = useState<'alien_attack' | 'satellite_deployment'>('alien_attack');
  const [satellites, setSatellites] = useState<SatelliteProps[]>([]);
  const [isSatelliteLauncherActive, setIsSatelliteLauncherActive] = useState(false);
  const launchQueueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const alienOrbitalParams = useMemo(() => ({ radius: EARTH_RADIUS + 5.5, yOffset: 1.2, speed: 0.065, initialAngleRad: Math.random() * Math.PI * 2 }), []);
  const MAX_SATELLITES = 5; 

  const alienShipCurrentStatus = alienShipRef.current?.status;
  const isAlienShipDestroyedForLogic = alienShipRef.current?.isTrulyDestroyed?.() ?? (alienShipRef.current === null && !showAlienShip);


  useEffect(() => {
    if (gamePhase === 'alien_attack' && 
        (alienShipCurrentStatus === "destroyed_visuals_done" || isAlienShipDestroyedForLogic) &&
        attackRocketMissionDone &&                                    
        missiles.length === 0 &&                                      
        explosions.length === 0) {                                    
      console.log("ALIEN ATTACK PHASE COMPLETE. Transitioning to SATELLITE DEPLOYMENT."); 
      setGamePhase('satellite_deployment'); 
      setIsSatelliteLauncherActive(true); // Start the first satellite launch immediately
    } 
  }, [
      gamePhase, 
      alienShipCurrentStatus, isAlienShipDestroyedForLogic,
      attackRocketMissionDone, 
      missiles.length, 
      explosions.length
    ]);
  
  useEffect(() => { 
    if (gamePhase === 'satellite_deployment' && !isSatelliteLauncherActive && satellites.length < MAX_SATELLITES) { 
      if (launchQueueTimeoutRef.current) clearTimeout(launchQueueTimeoutRef.current); 
      launchQueueTimeoutRef.current = setTimeout(() => { 
        console.log(`Queueing satellite launch ${satellites.length + 1} of ${MAX_SATELLITES}.`); 
        setIsSatelliteLauncherActive(true); 
      }, 2000 + Math.random() * 1500);
    } else if (gamePhase === 'satellite_deployment' && satellites.length >= MAX_SATELLITES && !isSatelliteLauncherActive) {
        console.log("All satellites deployed. Mission successful!");
    }
    return () => { if (launchQueueTimeoutRef.current) clearTimeout(launchQueueTimeoutRef.current); }; 
  }, [gamePhase, isSatelliteLauncherActive, satellites.length]); 
  
  const handleFireMissile = useCallback((startPos: THREE.Vector3, targetPos: THREE.Vector3) => { 
    // Always create the missile regardless of alien ship status
    // This ensures missiles are fired even if the ship status changes between frames
    const id = `m-${performance.now()}`; 
    console.log('Creating missile:', id, 'from', startPos.toArray().map(v => v.toFixed(2)), 'to', targetPos.toArray().map(v => v.toFixed(2)));
    
    // Validate the positions to ensure they are valid vectors
    if (isNaN(startPos.x) || isNaN(startPos.y) || isNaN(startPos.z) ||
        isNaN(targetPos.x) || isNaN(targetPos.y) || isNaN(targetPos.z)) {
      console.error('Invalid missile position detected:', 
                   'start:', startPos.toArray(), 
                   'target:', targetPos.toArray());
      return; // Don't create missiles with invalid positions
    }
    
    // Add the missile to the missiles state array
    setMissiles(prev => {
      const newMissiles = [...prev, { 
        key: id, 
        id, 
        startPosition: startPos.clone(), // Clone to ensure we don't modify the original
        targetPosition: targetPos.clone(), // Clone to ensure we don't modify the original
        onHit: handleMissileHit, 
        onMiss: (mId) => setMissiles(ms => ms.filter(m => m.id !== mId)),
        speed: 1.2 // Increased speed for better gameplay
      }];
      console.log('Total missiles:', newMissiles.length);
      return newMissiles;
    }); 
  }, []); 
  
  const handleMissileHit = useCallback((missileId: string, hitPoint: THREE.Vector3) => { 
    console.log('Missile hit:', missileId, 'at position', hitPoint.toArray().map(v => v.toFixed(2)));
    
    // Remove the missile from the missiles array
    setMissiles(ms => ms.filter(m => m.id !== missileId)); 
    
    // Check if the alien ship is valid and operational
    if (!alienShipRef.current || alienShipRef.current.status !== "operational") { 
        console.log('Missile hit but alien ship is not operational, creating miss explosion');
        setExplosions(ex => [...ex, { id: `ex-miss-${missileId}`, position: hitPoint, scale: 0.8 }]);
        return;
    }
    
    // Calculate random damage amount
    const damage = 18 + Math.random() * 7; 
    console.log('Applying damage to alien ship:', damage.toFixed(2));
    
    // Apply damage to the alien ship
    const statusFromTakeDamage = alienShipRef.current.takeDamage(damage, hitPoint); 
    console.log('Damage result status:', statusFromTakeDamage);
    
    // Create appropriate explosion based on the damage result
    if (statusFromTakeDamage === "hit") {
        console.log('Hit confirmed, creating hit explosion');
        setExplosions(ex => [...ex, { id: `ex-${missileId}`, position: hitPoint, scale: 1.3 }]); 
    } else if (statusFromTakeDamage === "destroyed") { 
        console.log('Destroyed confirmed, creating destruction explosion');
        // This explosion is handled by onShipHealthDepleted for the larger one
        // but we can add a smaller impact explosion here
        setExplosions(ex => [...ex, { id: `ex-dmg-${missileId}`, position: hitPoint, scale: 2.2 }]); 
    } 
  }, []); 
  
  const handleAlienShipHealthDepleted = useCallback((finalPosition: THREE.Vector3) => { 
    console.log("UFO health depleted (onShipHealthDepleted). Triggering final explosion at:", finalPosition.toArray().map(c=>c.toFixed(1))); 
    setExplosions(ex => [...ex, { id: `as-final-destroy-${performance.now()}`, position: finalPosition, scale: 7.0 }]); 
  }, []);

  const handleAlienShipVanished = useCallback(() => {
    console.log("UFO visuals and dying animation complete (onShipVanished). Ship component will unmount.");
    // setShowAlienShip(false); // The AlienShip component already returns null when destroyed_visuals_done
  }, []);
  
  const handleDeploySatellite = useCallback((satelliteData: Omit<SatelliteProps, 'id'>) => { 
    const newId = `sat-${performance.now()}`; 
    setSatellites(prev => { 
        const newSatellites = [...prev, { ...satelliteData, id: newId }]; 
        console.log(`Satellite ${newId} deployed. Total: ${newSatellites.length}/${MAX_SATELLITES}.`); 
        return newSatellites; 
    }); 
  }, []); 
  
  const handleLauncherMissionComplete = useCallback(() => { 
    console.log("Satellite launcher mission complete and returned."); 
    setIsSatelliteLauncherActive(false); 
  }, []);

  const shouldRenderAttackRocket = 
    gamePhase === 'alien_attack' && 
    // showAlienShip && // Not strictly needed if alienShipRef.current.status is the main driver
    alienShipRef.current &&                         
    alienShipRef.current.status === "operational" &&  
    !attackRocketMissionDone;                       

  return (
    <>      <ambientLight intensity={0.4} /> 
      <directionalLight 
        position={[80, 60, 80]} intensity={2.5} color="#FFF5E1" castShadow 
        shadow-mapSize-width={4096} shadow-mapSize-height={4096}
        shadow-camera-far={200} shadow-camera-left={-60} shadow-camera-right={60}
        shadow-camera-top={60} shadow-camera-bottom={-60} shadow-bias={-0.0005} 
      />
      <Earth />
      
      {gamePhase === 'alien_attack' && showAlienShip && (alienShipCurrentStatus !== "destroyed_visuals_done" || !alienShipRef.current?.isTrulyDestroyed()) && ( 
          <AlienShip 
              ref={alienShipRef} 
              orbitalParams={alienOrbitalParams} 
              onShipHealthDepleted={handleAlienShipHealthDepleted} 
              onShipVanished={handleAlienShipVanished}
          /> 
      )}
      
      {shouldRenderAttackRocket && ( 
        <RocketVehicle 
            targetShipRef={alienShipRef} 
            onFireMissile={handleFireMissile} 
            onMissionComplete={() => { 
                console.log("Attack rocket mission complete - setting attackRocketMissionDone = true"); 
                setAttackRocketMissionDone(true); 
            }} 
        /> 
      )}

      {gamePhase === 'satellite_deployment' && isSatelliteLauncherActive && ( 
          <SatelliteLauncherRocket 
              onDeploySatellite={handleDeploySatellite} 
              onLauncherMissionComplete={handleLauncherMissionComplete} 
          /> 
      )}
      
      {satellites.map(sat => <Satellite key={sat.id} {...sat} />)}
      {missiles.map(m => { const { key, ...props } = m; return <Missile key={key} {...props} />; })}
      {explosions.map(ex => ( 
          <ExplosionEffect 
              key={ex.id} 
              position={ex.position} 
              scale={ex.scale} 
              onComplete={() => setExplosions(prev => prev.filter(e => e.id !== ex.id))} 
          /> 
      ))}
      <Stars radius={350} depth={150} count={12000} factor={7} saturation={0} fade speed={0.025} />
    </>
  );
}

function AlienAttackScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000005' }}>
      <Canvas shadows camera={{ position: [20, 12, 28], fov: 48, near: 0.1, far: 1200 }}>
        <React.Suspense fallback={null}>
          <Environment />
        </React.Suspense>
        <OrbitControls minDistance={6} maxDistance={90} enableZoom={false} enablePan={true} panSpeed={0.7} />

      </Canvas>
    </div>
  );
}

export { AlienAttackScene };
export default AlienAttackScene;
      