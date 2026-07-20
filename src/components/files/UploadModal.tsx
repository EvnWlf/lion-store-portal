'use client';

import React, { useState, useRef } from 'react';
import { FileRecord, FileType } from '@/types';
import { X, UploadCloud, File as FileIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // 👈 1. Importar Sonner

interface UploadModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onUploadSuccess: (newFile: FileRecord) => void;
}

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // Límite de 100 MB

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  projectId,
  onClose,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 👈 2. Validación centralizada de archivos con alertas Sonner
  const validateAndSetFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('El archivo excede el límite permitido de 100 MB');
      return;
    }
    setSelectedFile(file);
    toast.info(`Archivo "${file.name}" seleccionado`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const detectFileType = (fileName: string): FileType => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['glb', 'gltf', 'obj', 'fbx', 'stl'].includes(ext)) return 'MODEL_3D';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'IMAGE';
    return 'DOCUMENT';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 👈 3. Simulación de subida acompañada de Toasts
  const handleStartUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    const toastId = toast.loading(`Subiendo "${selectedFile.name}"...`);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);

          const newRecord: FileRecord = {
            id: `file_${Date.now()}`,
            projectId,
            name: selectedFile.name,
            type: detectFileType(selectedFile.name),
            size: formatFileSize(selectedFile.size),
            url: URL.createObjectURL(selectedFile),
            uploadedBy: 'Evan Alexander',
            uploadedAt: 'Hoy',
          };

          // Actualizar toast de cargando a éxito
          toast.success(`"${selectedFile.name}" subido con éxito`, {
            id: toastId,
          });

          onUploadSuccess(newRecord);
          onClose();
          setSelectedFile(null);
          return 100;
        }
        return prevProgress + 15;
      });
    }, 200);
  };

  const handleCloseAttempt = () => {
    if (uploading) {
      toast.warning('No puedes cerrar la ventana mientras se sube un archivo');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg surface-card rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-text">Subir Nuevo Archivo</h3>
            <p className="text-xs text-text-secondary">
              Modelos 3D, planos, documentos o imágenes
            </p>
          </div>
          <button
            onClick={handleCloseAttempt}
            disabled={uploading}
            className="p-1.5 bg-surface-2 hover:bg-surface-hover text-text-secondary hover:text-text rounded-full transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-border hover:border-primary/50 hover:bg-surface-hover'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text mb-1">
              Arrastra tu archivo aquí o{' '}
              <span className="text-primary hover:underline">examina</span>
            </p>
            <p className="text-[11px] text-text-secondary">
              Soporta GLB, PPTX, PDF, XLSX, PNG, JPG (Hasta 100 MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-surface-2 border border-border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl shrink-0">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              {!uploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-accent hover:underline shrink-0 ml-2"
                >
                  Cambiar
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-secondary flex items-center space-x-1">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span>Subiendo...</span>
                  </span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-primary to-primary-strong h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleCloseAttempt}
            disabled={uploading}
            className="px-4 py-2 bg-surface-2 hover:bg-surface-hover text-text-secondary rounded-full text-xs font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!selectedFile || uploading}
            onClick={handleStartUpload}
            className="px-5 py-2 btn-primary text-white font-semibold rounded-full text-xs transition-all shadow-lg shadow-[rgba(37,99,235,0.18)] flex items-center space-x-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Iniciar Subida</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};