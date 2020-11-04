import React, { Component, Suspense, useState, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree, useLoader } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";
import "../css/ThreeD.css";
import diamond_holder from "../models/diamond_holder.gltf";

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

extend({ OrbitControls });

const Controls = () => {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  useFrame(() => {
    orbitRef.current.update();
  });

  return (
    <orbitControls
      screenSpacePanning={false}
      autoRotate={true}
      autoRotateSpeed={1}
      enableDamping={true}
      dampingFactor={0.01}
      maxPolarAngle={Math.PI * 0.5}
      minPolarAngle={Math.PI * 0.25}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};

const Plane = () => (
  <mesh rotation={[0, 0, 0]}>
    <planeBufferGeometry attach="geometry" args={[100, 100]} />
    <meshBasicMaterial attach="material" color="#000000" />
  </mesh>
);

const Box = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const props = useSpring({
    scale: active ? [1, 1, 0.2] : [1, 1, 1],
    color: hovered ? "#00ff40" : "#00a030",
    pos: active ? [0, 0, 0.2] : [0, 0, Math.sqrt(3)],
  });
  useFrame(() => {
    meshRef.current.rotation.x = active
      ? 0
      : meshRef.current.rotation.x + 0.006;
    meshRef.current.rotation.y = active ? 0 : meshRef.current.rotation.y + 0.002;
    meshRef.current.rotation.z += 0.004;
  });

  return (
    <a.mesh
      position={props.pos}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
      }}
      onPointerDown={() => setActive(!active)}
      scale={props.scale}
    >
      <a.boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <a.meshBasicMaterial wireframe attach="material" color={props.color} />
    </a.mesh>
  );
};

function Model() {
  const { nodes } = useLoader(GLTFLoader, diamond_holder);
  return (
      <mesh visible scale={[50,50,50]} geometry={nodes.scene}>
      </mesh>
  );
}

class ThreeDPage extends Component {
  state = {
    pathname: this.props.location.pathname,
  };

  render() {
    return (
      <div className="content">
        <Canvas style={{ height: "100vh" }} camera={{ position: [0, 0, 6] }}>
          <spotLight />
          <Controls />
          <polarGridHelper
            position={[0, 0, 0.01]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[30, 16, 30]}
          />
          {/* <gridHelper rotation={[0, 0, Math.PI / 2]} args={[60, 60]} /> */}
          {/* <gridHelper args={[60, 60]} /> */}
          <Plane />
          <Box />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          {/* <fog attach="fog" args={["blue", 5, 50]} /> */}
        </Canvas>
      </div>
    );
  }
}

export default ThreeDPage;
