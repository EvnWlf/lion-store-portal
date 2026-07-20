'use client';

import React, { useState } from 'react';
import { FileRecord } from '@/types';
import { UploadModal } from './UploadModal';
import { File as FileIcon, FileText, FolderOpen, Download, Plus, ArrowUpRight } from 'lucide-react';

interface FileExplorerProps {
  files: FileRecord[];
  projectId: string;
  canUpload: boolean;
  onOpen3DModel: (file: FileRecord) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, projectId, canUpload, onOpen3DModel }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const localFiles = [...uploadedFiles, ...files];

  const handleUploadSuccess = (newFile: FileRecord) => {
    setUploadedFiles((current) => [newFile, ...current]);
  };

  const getFileIcon = (type: FileRecord['type']) => {
    switch (type) {
      case 'MODEL_3D':
        return <FolderOpen className="w-4 h-4 text-primary" />;
      case 'IMAGE':
        return <FileIcon className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary mb-2">Explorador de archivos</p>
          <h2 className="text-2xl font-bold text-text">Archivos del proyecto</h2>
          <p className="text-xs text-text-secondary max-w-2xl mt-2">
            Gestiona planos, modelos 3D y documentos desde un solo lugar. Haz click en cualquier archivo para abrirlo.
          </p>
        </div>

        {canUpload && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 btn-primary text-white px-4 py-2 text-xs font-semibold transition-all shadow-lg shadow-[rgba(37,99,235,0.2)]"
          >
            <Plus className="w-4 h-4" /> Subir Archivo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {localFiles.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface-2 p-10 text-center text-text-secondary">
            No hay archivos cargados para este proyecto.
          </div>
        ) : (
          localFiles.map((file) => (
            <div key={file.id} className="rounded-3xl border border-border bg-surface-1 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-surface-2 text-text">
                  {getFileIcon(file.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{file.name}</p>
                  <p className="text-[11px] text-text-secondary mt-1">
                    {file.size} · {file.uploadedBy} · {file.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="button"
                  onClick={() => onOpen3DModel(file)}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-2-xs text-text hover:bg-surface-hover transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" /> Abrir archivo
                </button>
                <a
                  href={file.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-3 px-4 py-2 text-xs text-text-secondary hover:bg-surface-hover transition-all"
                >
                  <Download className="w-4 h-4" /> Descargar
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <UploadModal isOpen={showUploadModal} projectId={projectId} onClose={() => setShowUploadModal(false)} onUploadSuccess={handleUploadSuccess} />
    </section>
  );
};
