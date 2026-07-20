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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6">
      <div
        ref={containerRef}
        className={`relative w-full transition-all duration-300 bg-surface-1 border border-border overflow-hidden flex flex-col shadow-2xl ${
          isFullscreen ? 'h-screen max-w-none rounded-none p-0' : 'max-w-6xl h-[88vh] rounded-3xl'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-surface-2 border-b border-border shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-lg uppercase font-bold">
              {ext}
            </span>
            <h3 className="text-sm font-semibold text-text truncate max-w-xs sm:max-w-md">{file.name}</h3>
          </div>

          <div className="flex items-center space-x-2">
            {(isExcel || isOfficeDoc) && (
                <div className="flex items-center bg-surface-2 p-1 rounded-full border border-border mr-2">
                <button
                  onClick={() => setViewMode('native')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    viewMode === 'native' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'
                  }`}
                  title="Usar visor interno integrado"
                >
                  <Table className="w-3 h-3" />
                  <span className="hidden md:inline">Visor Nativo</span>
                </button>
                <button
                  onClick={() => setViewMode('microsoft')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
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
              className="flex items-center space-x-1 px-3 py-1.5 bg-surface-2 hover:bg-surface-hover text-text-secondary rounded-full text-xs font-medium transition-all"
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
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-surface-2 hover:bg-surface-hover text-text-secondary rounded-full text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-all ml-2"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface-3 relative overflow-hidden flex items-center justify-center">
          {viewMode === 'microsoft' && (isExcel || isOfficeDoc) ? (
            isRealPublicUrl ? (
              <iframe src={officeViewerUrl} className="w-full h-full border-none" title={file.name} />
            ) : (
              <div className="text-center p-8 max-w-md">
                <AlertCircle className="w-12 h-12 mx-auto text-accent mb-3 opacity-80" />
                <h4 className="text-base font-bold text-text mb-2">Dominio público requerido</h4>
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
                <div className="w-full h-full p-4">
                  <ExcelViewer fileUrl={file.url} />
                </div>
              )}

              {isOfficeDoc && (
                isRealPublicUrl ? (
                  <iframe src={officeViewerUrl} className="w-full h-full border-none" title={file.name} />
                ) : (
                  <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                      {ext.includes('ppt') ? (
                        <Presentation className="w-8 h-8 text-accent" />
                      ) : (
                        <FileText className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-text mb-2">Vista Previa de {ext.toUpperCase()}</h4>
                    <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                      Este archivo requiere un enlace público accesible para ser procesado online.
                    </p>
                  </div>
                )
              )}
            </>
          )}

          {ext === 'pdf' && <iframe src={file.url} className="w-full h-full border-none" title={file.name} />}

            {['png', 'jpg', 'jpeg', 'webp'].includes(ext) && (
            <div className="p-4 flex items-center justify-center h-full">
              <Image src={file.url || ''} alt={file.name} width={1200} height={800} className="max-h-full max-w-full object-contain rounded-lg shadow-lg" unoptimized />
            </div>
          )}

          {file.type === 'MODEL_3D' && (
            <div className="w-full h-full">
              <CADViewer file={file} />
            </div>
          )}

          {!isExcel && !isOfficeDoc && file.type !== 'MODEL_3D' && ext !== 'pdf' && !['png', 'jpg', 'jpeg', 'webp'].includes(ext) && (
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 mx-auto text-accent mb-3 opacity-80" />
              <p className="text-sm font-semibold text-text mb-1">Sin vista previa disponible</p>
              <p className="text-xs text-text-secondary mb-4">Descarga el archivo para abrirlo localmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
