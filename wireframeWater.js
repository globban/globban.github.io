import * as THREE from "https://esm.sh/three@0.160.0";
import { EffectComposer } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js";



export function createWireframeWater({
  width = window.innerWidth,
  height = window.innerHeight,
  color = 0x00ccff,
  waveAmplitude = 0.1,
  waveFrequency = 1,
  waveSpeed = 1,
  container = document.body
} = {}) {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
  camera.position.set(0, 10, 0);

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Set up postprocessing composer with bloom
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1, // strength
    0.1, // radius
    0.1 // threshold
  );
  composer.addPass(bloomPass);

  const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  // Create central cube
  const cubeGeometry = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16);
  const cubeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff4444, 
  emissive: 0xffffff, 
  emissiveIntensity: 0.5,
  roughness: 0.5,
  metalness: 0.5
});
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0.5, 0); // Slightly above the plane
  scene.add(cube);

  const positions = geometry.attributes.position;
  const randomOffsets = new Float32Array(positions.count);
  for (let i = 0; i < positions.count; i++) {
    randomOffsets[i] = Math.random() * Math.PI * 2;
  }
  geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1));

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    cube.rotation.y -= 0.002; // Rotate the cube

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const offset = randomOffsets[i];
      const z = Math.sin(x * waveFrequency + time * waveSpeed + offset) *
                Math.cos(y * waveFrequency + time * waveSpeed + offset) * waveAmplitude;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;

    camera.position.x = Math.sin(time * 0.1) * 10;
    camera.position.z = Math.cos(time * 0.1) * 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    composer.render();  // Use composer instead of renderer for bloom effect
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Update composer size too
  });

  return { scene, camera, renderer, mesh, cube, composer };
}
