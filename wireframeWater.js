import * as THREE from "https://esm.sh/three@0.160.0";
import { EffectComposer } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js";



export function createWireframeWater({
  width = window.innerWidth,
  height = window.innerHeight,
  color = 0x0005050,
  waveAmplitude = 0.5,
  waveSpeed = 1,
  bloomStrength = 0,
  bloomRadius = 0,
  bloomThreshold = 0,
  cameraMove = 'static', // 'static' or 'orbit'
  centerShape = 'cube', // 'cube', 'sphere', 'cone', 'torus', 'torusKnot'
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
    bloomStrength,
    bloomRadius,
    bloomThreshold
  );
  composer.addPass(bloomPass);
  //ALL DOCUMENTS HAVE COPYRIGHT ALGOT.FUN 2025
  const geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
  const material = new THREE.MeshPhongMaterial({ color, wireframe: false, roughness: 1, metalness: 0 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 1.3;
  scene.add(mesh);
  scene.add (new THREE.AmbientLight(0xffffff, 0));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 0);
  scene.add(directionalLight);

  // Central shape selection
  let centerMesh = null;
  if (centerShape === 'cube') {
    centerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.5 })
    );
  } else if (centerShape === 'sphere') {
    centerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.5, wireframe: true })
    );
  } else if (centerShape === 'cone') {
    centerMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.5, 32),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.5 })
    );
  } else if (centerShape === 'torus') {
    centerMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.3, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.5 })
    );
  } else if (centerShape === 'torusKnot') {
    centerMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.5 })
    );
  }
  if (centerMesh) {
    centerMesh.position.set(0, 0.5, 0);
    scene.add(centerMesh);
  }

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

    if (centerMesh) centerMesh.rotation.y -= 0.002;
    if (centerMesh) centerMesh.rotation.x -= 0.002;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const offset = randomOffsets[i];
      const z = Math.sin(x + time * waveSpeed + offset) *
                Math.cos(y + time * waveSpeed + offset) * waveAmplitude;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals(); // <- recalc normals for proper shading


    if (cameraMove === 'orbit') {
      camera.position.x = Math.sin(time * 0.1) * 10;
      camera.position.z = Math.cos(time * 0.1) * 10;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      camera.position.set(0, 10, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    composer.render();
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, mesh, centerMesh, composer };
}
