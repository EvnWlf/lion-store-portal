'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Grid, Center } from '@react-three/drei';
import { Mesh, Material } from 'three';
import { FileRecord } from '@/types';
import {
  Box,
  Eye,
  RotateCcw,
  Layers,
  Grid as GridIcon,
  Download,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface CADViewerProps {
  file?: FileRecord;
}

function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);

  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (mesh.isMesh && mesh.material) {
      const material = mesh.material as Material & { wireframe?: boolean };
      material.wireframe = wireframe;
    }
  });

  return <primitive object={scene} />;
}

function Scene({
  modelUrl,
  wireframe,
  showGrid,
  autoRotate,
}: {
  modelUrl: string;
  wireframe: boolean;
  showGrid: boolean;
  autoRotate: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <Center top>
          <Stage environment="city" intensity={0.5}>
            <Model url={modelUrl} wireframe={wireframe} />
          </Stage>
        </Center>

        {showGrid && (
          <Grid
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.5}
            sectionSize={2}
            sectionThickness={1}
            fadeDistance={30}
            cellColor="#334155"
            sectionColor="rgba(96,165,250,0.85)"
          />
        )}
      </Suspense>

      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2} enablePan={true} enableZoom={true} />
    </>
  );
}

export const CADViewer: React.FC<CADViewerProps> = ({ file }) => {
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const modelUrl =
    file?.modelUrl ||
    file?.url ||
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

  return (
    <div className="w-full h-full flex flex-col min-h-0 font-sans p-1 sm:p-2">
      
      {/* CABECERA SUPERIOR: Se oculta automáticamente si está en móvil horizontal (landscape + poca altura) */}
      <div className="hidden portrait:flex landscape:max-h-[500px]:hidden flex-col sm:flex-row justify-between items-start sm:items-center gap-4 surface-card p-4 rounded-3xl shadow-lg shrink-0 mb-3">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-accent/10 text-accent rounded-2xl border border-accent/20">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text leading-tight">
              {file?.name || 'Inspección de Pieza 3D (CAD)'}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Visualización paramétrica optimizada para navegador • 60 FPS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-mono font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Solo Lectura (Cliente)
          </span>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row gap-4">
        
        {/* VISOR 3D: En móvil acostado toma el 100% de la pantalla sin bordes ni redondeos excesivos */}
        <div className="flex-1 min-h-0 h-full bg-surface-3 border border-border rounded-xl sm:rounded-3xl relative overflow-hidden shadow-2xl flex flex-col">
          
          {/* BOTONES FLOTANTES COMPACTOS (Visibles siempre) */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-surface-2/90 backdrop-blur-md border border-border p-1 rounded-full shadow-2xl flex items-center space-x-1 pointer-events-auto">
              <button
                onClick={() => setWireframe(!wireframe)}
                title="Wireframe"
                className={`p-1.5 sm:p-2 rounded-full transition-all text-xs font-medium flex items-center space-x-1 ${
                  wireframe ? 'bg-accent text-black font-bold' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wireframe</span>
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                title="Rejilla"
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  showGrid ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <GridIcon className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title="Rotación Automática"
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  autoRotate ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-surface-2/90 backdrop-blur-md border border-border p-1 rounded-full shadow-2xl pointer-events-auto">
              <button
                onClick={() => setResetKey((prev) => prev + 1)}
                title="Resetear Cámara"
                className="p-1.5 sm:p-2 text-text-secondary hover:text-text hover:bg-surface-hover rounded-full transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <Canvas key={resetKey} camera={{ position: [0, 2, 5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
            <Scene modelUrl={modelUrl} wireframe={wireframe} showGrid={showGrid} autoRotate={autoRotate} />
          </Canvas>

          {/* Ocultamos el texto descriptivo si la altura es reducida */}
          <div className="hidden sm:block absolute bottom-3 left-3 z-10 bg-surface-2/80 backdrop-blur-md border border-border px-3 py-1 rounded-full text-[10px] text-text-secondary">
            🖱️ Clic Izquierdo: Rotar | Clic Derecho: Desplazar | Rueda: Zoom
          </div>
        </div>

        {/* FICHA TÉCNICA: Se oculta en móvil horizontal (landscape + altura menor a 500px) */}
        <div className="hidden portrait:flex landscape:max-h-[500px]:hidden lg:flex lg:w-80 h-full bg-surface-1 border border-border rounded-3xl p-6 shadow-xl flex-col justify-between shrink-0">
          <div className="space-y-5">
            <div className="flex items-center space-x-2 text-text border-b border-border pb-3">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Ficha de Ingeniería</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-text-secondary text-[11px] block">Nombre del Modelo</span>
                <span className="font-semibold text-text truncate block">{file?.name || 'BOMBA_HIDRAULICA_V2.glb'}</span>
              </div>

              <div>
                <span className="text-text-secondary text-[11px] block">Formato Web / Render</span>
                <span className="font-mono text-accent font-semibold">GLTF Binary (.glb)</span>
              </div>

              <div>
                <span className="text-text-secondary text-[11px] block">Origen Paramétrico CAD</span>
                <span className="font-mono text-cyan-400 font-semibold">STEP AP242 (Converted)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div>
                  <span className="text-text-secondary text-[10px] block">Tolerancia</span>
                  <span className="text-text font-mono text-[11px]">± 0.05 mm</span>
                </div>
                <div>
                  <span className="text-text-secondary text-[10px] block">Material Est.</span>
                  <span className="text-text font-mono text-[11px]">Acero INOX 316</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border mt-auto">
            <button className="w-full btn-primary text-white font-semibold py-3 px-4 rounded-full text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[rgba(37,99,235,0.18)] active:scale-95">
              <Download className="w-4 h-4" />
              <span>Descargar Ficha (.PDF)</span>
            </button>
            <p className="text-[10px] text-center text-text-secondary">
              Para solicitar el CAD en `.step` original contacte a su Manager Lion Store.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};