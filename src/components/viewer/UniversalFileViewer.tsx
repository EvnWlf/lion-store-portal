'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FileRecord } from '@/types';
import { CADViewer } from './CADViewer';
import { ExcelViewer } from './ExcelViewer';
import {
  X,
  Download,
  Presentation,
  FileText,
  AlertCircle,
  Maximize2,
  Minimize2,
  Globe,
  Table,
} from 'lucide-react';

interface UniversalFileViewerProps {
  file: FileRecord | null;
  onClose: () => void;
}

export const UniversalFileViewer: React.FC<UniversalFileViewerProps> = ({ file, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'native' | 'microsoft'>('native');
  const containerRef = useRef<HTMLDivElement>(null);

  if (!file) return null;

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isExcel = ['xlsx', 'xls'].includes(ext);
  const isOfficeDoc = ['pptx', 'ppt', 'docx', 'doc'].includes(ext);
  const isRealPublicUrl = file.url?.startsWith('http') && !file.url.includes('calibre-ebook.com') && file.url !== '#';
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url || '')}`;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => console.error('Error al activar pantalla completa:', err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    // 1. PADDING CERO EN MÓVIL (p-0) PARA APROVECHAR TODO EL BORDES DE PANTALLA
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 md:p-6">
      <div
        ref={containerRef}
        // 2. TAMAÑO FLEXIBLE: w-full h-full EN MÓVIL Y max-w-7xl h-[94vh] EN ESCRITORIO
        className={`relative w-full transition-all duration-300 bg-surface-1 border border-border/50 overflow-hidden flex flex-col shadow-2xl ${
          isFullscreen
            ? 'h-screen max-w-none rounded-none p-0'
            : 'h-full sm:h-[94vh] sm:max-w-7xl sm:rounded-3xl'
        }`}
      >
        {/* CABECERA ULTRA COMPACTA PARA MÓVIL / HORIZONTAL */}
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5 bg-surface-2 border-b border-border shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-md uppercase font-bold shrink-0">
              {ext}
            </span>
            <h3 className="text-xs sm:text-sm font-semibold text-text truncate max-w-35 xs:max-w-xs sm:max-w-md">
              {file.name}
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {(isExcel || isOfficeDoc) && (
              <div className="flex items-center bg-surface-1 p-0.5 rounded-full border border-border mr-1">
                <button
                  onClick={() => setViewMode('native')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all ${
                    viewMode === 'native' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
                  }`}
                  title="Usar visor interno integrado"
                >
                  <Table className="w-3 h-3" />
                  <span className="hidden md:inline">Visor Nativo</span>
                </button>
                <button
                  onClick={() => setViewMode('microsoft')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all ${
                    viewMode === 'microsoft' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
                  }`}
                  title="Usar visor de Microsoft 365 Online"
                >
                  <Globe className="w-3 h-3" />
                  <span className="hidden md:inline">Microsoft Online</span>
                </button>
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-1 p-1.5 sm:px-3 sm:py-1.5 bg-surface-1 hover:bg-surface-hover text-text-secondary rounded-full text-xs font-medium transition-all"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restaurar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pantalla Completa</span>
                </>
              )}
            </button>

            {file.url && file.url !== '#' && (
              <a
                href={file.url}
                download
                className="flex items-center space-x-1 p-1.5 sm:px-3 sm:py-1.5 bg-surface-1 hover:bg-surface-hover text-text-secondary rounded-full text-xs font-medium transition-all"
                title="Descargar archivo"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-all ml-1"
              title="Cerrar visor"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* LIENZO DE VISUALIZACIÓN QUE TOMA TODO EL ESPACIO RESTANTE */}
        <div className="flex-1 bg-surface-3 relative overflow-hidden flex items-center justify-center w-full h-full">
          {viewMode === 'microsoft' && (isExcel || isOfficeDoc) ? (
            isRealPublicUrl ? (
              <iframe src={officeViewerUrl} className="w-full h-full border-none" title={file.name} />
            ) : (
              <div className="text-center p-6 max-w-md">
                <AlertCircle className="w-10 h-10 mx-auto text-accent mb-3 opacity-80" />
                <h4 className="text-sm font-bold text-text mb-2">Dominio público requerido</h4>
                <p className="text-xs text-text-secondary mb-4">
                  El visor de Microsoft requiere que el archivo esté subido en un servidor público o nube con URL HTTPS válida.
                </p>
                <button
                  onClick={() => setViewMode('native')}
                  className="px-4 py-2 btn-primary text-white rounded-full text-xs font-semibold hover:bg-primary-strong"
                >
                  Cambiar a Visor Nativo
                </button>
              </div>
            )
          ) : (
            <>
              {isExcel && file.url && (
                <div className="w-full h-full p-2 sm:p-4">
                  <ExcelViewer fileUrl={file.url} />
                </div>
              )}

              {isOfficeDoc && (
                isRealPublicUrl ? (
                  <iframe src={officeViewerUrl} className="w-full h-full border-none" title={file.name} />
                ) : (
                  <div className="text-center p-6 max-w-md">
                    <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                      {ext.includes('ppt') ? (
                        <Presentation className="w-6 h-6 text-accent" />
                      ) : (
                        <FileText className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-text mb-1">Vista Previa de {ext.toUpperCase()}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Este archivo requiere un enlace público accesible para ser procesado online.
                    </p>
                  </div>
                )
              )}
            </>
          )}

          {ext === 'pdf' && <iframe src={file.url} className="w-full h-full border-none" title={file.name} />}

          {['png', 'jpg', 'jpeg', 'webp'].includes(ext) && (
            <div className="p-2 sm:p-4 flex items-center justify-center h-full w-full">
              <Image src={file.url || ''} alt={file.name} width={1200} height={800} className="max-h-full max-w-full object-contain rounded-lg shadow-lg" unoptimized />
            </div>
          )}

          {file.type === 'MODEL_3D' && (
            <div className="w-full h-full relative">
              <CADViewer file={file} />
            </div>
          )}

          {!isExcel && !isOfficeDoc && file.type !== 'MODEL_3D' && ext !== 'pdf' && !['png', 'jpg', 'jpeg', 'webp'].includes(ext) && (
            <div className="text-center p-6">
              <AlertCircle className="w-10 h-10 mx-auto text-accent mb-3 opacity-80" />
              <p className="text-sm font-semibold text-text mb-1">Sin vista previa disponible</p>
              <p className="text-xs text-text-secondary">Descarga el archivo para abrirlo localmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};