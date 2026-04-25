import React, { useEffect, useRef, type ReactElement } from 'react';
import * as THREE from 'three';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  // We offset the UV lookup based on the data texture (red/green channels)
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !imageSrc) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.innerHTML = ''; 
    container.appendChild(renderer.domElement);

    // 2. Camera Setup (Centered Orthographic)
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    // 3. Data Texture Setup + Initial Noise
    const size = grid;
    const data = new Float32Array(4 * size * size);
    
    // Fill with initial random noise to make it "alive" on load
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = (Math.random() - 0.5) * 50;     // Red channel (X shift)
      data[i * 4 + 1] = (Math.random() - 0.5) * 50; // Green channel (Y shift)
    }

    const dataTexture = new THREE.DataTexture(
      data, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType
    );
    dataTexture.magFilter = dataTexture.minFilter = THREE.NearestFilter;
    dataTexture.needsUpdate = true;

    // 4. Material Setup
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: new THREE.Texture() }, // Placeholder until loaded
        uDataTexture: { value: dataTexture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const imageDims = { width: 1, height: 1 };

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      renderer.setSize(w, h, false);
      
      const containerAspect = w / h;
      const imageAspect = imageDims.width / imageDims.height;

      let scaleX = 1;
      let scaleY = 1;
      if (containerAspect > imageAspect) {
        scaleX = containerAspect / imageAspect;
      } else {
        scaleY = imageAspect / containerAspect;
      }

      plane.scale.set(scaleX, scaleY, 1);
      camera.left = -scaleX / 2;
      camera.right = scaleX / 2;
      camera.top = scaleY / 2;
      camera.bottom = -scaleY / 2;
      camera.updateProjectionMatrix();
    };

    // 5. Load the Image - Ensures image appears correctly
    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (tex:any) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      imageDims.width = tex.image.width;
      imageDims.height = tex.image.height;
      material.uniforms.uTexture.value = tex;
      material.needsUpdate = true;
      handleResize();
    }, undefined, (err:ErrorOptions) => console.error("Error loading texture:", err));

    // 6. Interaction Logic
    const mouseState = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      mouseState.x = x; 
      mouseState.y = y;
      mouseState.prevX = x; 
      mouseState.prevY = y;
    };
    
    // Listen on window or container depending on preference
    container.addEventListener('mousemove', onMouseMove);

    // 7. Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const d = dataTexture.image.data as Float32Array;
      
      // Gradually relax the distortion back to 0
      for (let i = 0; i < size * size; i++) {
        d[i * 4] *= relaxation;
        d[i * 4 + 1] *= relaxation;
      }

      // Add mouse-based distortion
      const gx = size * mouseState.x;
      const gy = size * mouseState.y;
      const mD = size * mouse;

      // Only calculate if mouse is moving to save some cycles
      if (Math.abs(mouseState.vX) > 0.0001 || Math.abs(mouseState.vY) > 0.0001) {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const distSq = Math.pow(gx - i, 2) + Math.pow(gy - j, 2);
            if (distSq < mD * mD) {
              const index = 4 * (i + size * j);
              const p = Math.min(mD / Math.sqrt(distSq), 10);
              d[index] += strength * 100 * mouseState.vX * p;
              d[index + 1] -= strength * 100 * mouseState.vY * p;
            }
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
      
      // Reset velocity so it doesn't "leak" when mouse stops
      mouseState.vX *= 0.9;
      mouseState.vY *= 0.9;
    };
    
    animate();

    // 8. Resize Management
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);
    // Extra timeout ensures the container is properly sized in modals/dialogs
    const timeout = setTimeout(handleResize, 150);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      ro.disconnect();
      clearTimeout(timeout);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
    };
  }, [imageSrc, grid, mouse, strength, relaxation]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        display: 'block'
      }} 
    />
  );
};

export default GridDistortion;