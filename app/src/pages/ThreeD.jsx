import React, { Component, useState, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import { useSpring, a } from "react-spring/three";
import "../css/ThreeD.css";

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
      // autoRotate={true}
      // autoRotateSpeed={1}
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

const Box = (args) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(Math.random() > 0.5);
  const props = useSpring({
    scale: active ? [1, 1, 1] : [0.6, 0.6, 0.6],
    color: hovered ? "#80ffcc" : "#00ff40",
  });

  useFrame(() => {
    meshRef.current.rotation.x = active
      ? 0
      : meshRef.current.rotation.x + 0.006;
    meshRef.current.rotation.y = active
      ? 0
      : meshRef.current.rotation.y + 0.002;
    meshRef.current.rotation.z += 0.004;
  });

  var AnimatedWobbleMaterial = a(MeshWobbleMaterial);

  return (
    <a.mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
      }}
      onPointerDown={() => setActive(!active)}
      scale={props.scale}
      {...args}
    >
      <a.sphereBufferGeometry attach="geometry" args={[0.5, 80, 80]} />
      <AnimatedWobbleMaterial
        color={props.color}
        attach="material"
        factor={100}
        speed={0.5}
      />
    </a.mesh>
  );
};

class ThreeDPage extends Component {
  state = {
    pathname: this.props.location.pathname,
  };

  generateBoxes() {
    var dimensions = [10, 10, 2];
    var boxes = [];
    for (var x = -(dimensions[0] - 1) / 2; x < dimensions[0] / 2; x++) {
      for (var y = -(dimensions[1] - 1) / 2; y < dimensions[1] / 2; y++) {
        for (var z = 1; z <= dimensions[2]; z++) {
          boxes.push([x, y, z]);
        }
      }
    }
    return boxes.map((pos, i) => <Box position={pos} key={i}></Box>);
  }

  render() {
    return (
      <div className="content">
        <Canvas style={{ height: "100vh" }} camera={{ position: [0, 8, 4] }}>
          {/* <spotLight position={[0, 0, 5]} /> */}
          <pointLight position={[0, 0, 5]} />
          <ambientLight intensity={0.2} />
          <Controls />
          <polarGridHelper
            position={[0, 0, 0.01]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[30, 16, 30]}
          />
          {/* <gridHelper rotation={[0, 0, Math.PI / 2]} args={[60, 60]} /> */}
          {/* <gridHelper args={[60, 60]} /> */}
          <Plane />

          {this.generateBoxes()}
          {/* <fog attach="fog" args={["blue", 5, 50]} /> */}
        </Canvas>
      </div>
    );
  }
}

export default ThreeDPage;
