"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const BoxWithDimensions = () => {
  const boxRef = useRef<any | null>(null);
  const textCanvasRef = useRef<any | null>(null);

  useEffect(() => {
    const width = 2;
    const height = 1;
    const depth = 1.5;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    boxRef.current.geometry = geometry;
    boxRef.current.material = material;

    const canvas = document.createElement("canvas");
    const context: any = canvas.getContext("2d");

    // Function to create dimension text
    const createText = (text: any) => {
      context.font = "bold 24px Arial";
      const metrics = context.measureText(text);
      const textWidth = metrics.width;
      canvas.width = textWidth;
      canvas.height = 30; // Adjust height as needed
      context.font = "bold 24px Arial";
      context.fillStyle = "black";
      context.fillText(text, 0, 24);
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const textGeometry = new THREE.PlaneGeometry(textWidth / 20, 1.5); // Adjust size as needed
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      return textMesh;
    };

    // Create dimension lines and text
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Width dimension
    const widthPoints = [
      new THREE.Vector3(-width / 2, -height / 2 - 0.2, depth / 2),
      new THREE.Vector3(width / 2, -height / 2 - 0.2, depth / 2),
    ];
    const widthGeometry = new THREE.BufferGeometry().setFromPoints(widthPoints);
    const widthLine = new THREE.LineSegments(widthGeometry, lineMaterial);
    const widthText = createText(width.toFixed(2));
    widthText.position.set(0, -height / 2 - 0.5, depth / 2);

    // Height dimension
    const heightPoints = [
      new THREE.Vector3(width / 2 + 0.2, -height / 2, depth / 2),
      new THREE.Vector3(width / 2 + 0.2, height / 2, depth / 2),
    ];
    const heightGeometry = new THREE.BufferGeometry().setFromPoints(
      heightPoints
    );
    const heightLine = new THREE.LineSegments(heightGeometry, lineMaterial);
    const heightText = createText(height.toFixed(2));
    heightText.position.set(width / 2 + 0.5, 0, depth / 2);

    // Depth dimension
    const depthPoints = [
      new THREE.Vector3(-width / 2 - 0.2, -height / 2, depth / 2),
      new THREE.Vector3(-width / 2 - 0.2, -height / 2, -depth / 2),
    ];
    const depthGeometry = new THREE.BufferGeometry().setFromPoints(depthPoints);
    const depthLine = new THREE.LineSegments(depthGeometry, lineMaterial);
    const depthText = createText(depth.toFixed(2));
    depthText.position.set(-width / 2 - 0.5, -height / 2, 0);
    depthText.rotation.y = Math.PI / 2; // Rotate text to face the correct direction

    // Add everything to the scene
    boxRef.current.add(widthLine);
    boxRef.current.add(widthText);
    boxRef.current.add(heightLine);
    boxRef.current.add(heightText);
    boxRef.current.add(depthLine);
    boxRef.current.add(depthText);
  }, []);

  useFrame(() => {
    boxRef.current.rotation.x += 0.01;
    boxRef.current.rotation.y += 0.01;
  });

  return <mesh ref={boxRef}></mesh>;
};

const Scene = () => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <BoxWithDimensions />
  </Canvas>
);

export default Scene;
