'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileRecord } from '@/types';
import { UploadModal } from './UploadModal';
import {
  File as FileIcon,
  FileText,
  Download,
  Plus,
  Eye,
  MoreVertical,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Box,
  Search,
  Check,
  X,
  FileSpreadsheet,
  Archive,
  Ruler,
} from 'lucide-react';

interface FileExplorerProps {
  files: FileRecord[];
  projectId: string;
  canUpload: boolean;
  onOpen3DModel: (file: FileRecord) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  projectId,
  canUpload,
  onOpen3DModel,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  
  // Estado para buscador y menú desplegable de acciones
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Estado para la edición inline de nombres de archivo
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú de acciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadSuccess = (newFile: FileRecord) => {
    setUploadedFiles((current) => [newFile, ...current]);
  };

  // Combinación y filtrado de archivos
  const allFiles = [...uploadedFiles, ...files]
    .filter((file) => !deletedFileIds.includes(file.id))
    .map((file) => ({
      ...file,
      name: customNames[file.id] || file.name,
    }));

  const filteredFiles = allFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selector dinámico de icono por tipo y extensión de archivo
  const getFileIcon = (file: FileRecord) => {
    const fileName = file.name.toLowerCase();
    
    if (file.type === 'MODEL_3D' || fileName.endsWith('.gltf') || fileName.endsWith('.glb') || fileName.endsWith('.obj') || fileName.endsWith('.fbx')) {
      return <Box className="w-4 h-4 text-primary" />;
    }
    if (file.type === 'IMAGE' || fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.webp') || fileName.endsWith('.svg')) {
      return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
    if (fileName.endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-400" />;
    }
    if (fileName.endsWith('.dwg') || fileName.endsWith('.dxf')) {
      return <Ruler className="w-4 h-4 text-cyan-400" />;
    }
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    }
    if (fileName.endsWith('.zip') || fileName.endsWith('.rar')) {
      return <Archive className="w-4 h-4 text-purple-400" />;
    }
    return <FileIcon className="w-4 h-4 text-text-secondary" />;
  };

  // Manejadores de acciones
  const handleDeleteFile = (fileId: string) => {
    setDeletedFileIds((prev) => [...prev, fileId]);
    setActiveMenuId(null);
  };

  const startRenaming = (file: FileRecord) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
    setActiveMenuId(null);
  };

  const saveRenaming = (fileId: string) => {
    if (editingName.trim()) {
      setCustomNames((prev) => ({ ...prev, [fileId]: editingName.trim() }));
    }
    setEditingFileId(null);
  };

  return (
    <section className="space-y-6">
      {/* Encabezado y Acciones Principales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary mb-1">
            Explorador de archivos
          </p>
          <h2 className="text-xl font-bold text-text">Archivos del proyecto</h2>
          <p className="text-xs text-text-secondary max-w-2xl mt-1">
            Gestiona planos, modelos 3D y documentos desde un solo lugar.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar archivo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-full pl-9 pr-4 py-2 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          {canUpload && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 btn-primary text-white px-4 py-2 text-xs font-semibold rounded-full transition-all shadow-lg shadow-[rgba(37,99,235,0.2)] shrink-0"
            >
              <Plus className="w-4 h-4" /> Subir Archivo
            </button>
          )}
        </div>
      </div>

      {/* Vista Estilo Explorador / Tabla */}
      <div className="surface-card rounded-2xl border border-border overflow-hidden shadow-md">
        {filteredFiles.length === 0 ? (
          <div className="p-10 text-center text-xs text-text-secondary">
            {searchQuery
              ? 'No se encontraron archivos que coincidan con la búsqueda.'
              : 'No hay archivos cargados para este proyecto.'}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4 hidden md:table-cell">Tamaño</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Subido por</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs text-text">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-surface-2/40 transition-colors group"
                  >
                    {/* Nombre del Archivo e Icono */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
                          {getFileIcon(file)}
                        </div>

                        {editingFileId === file.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveRenaming(file.id);
                                if (e.key === 'Escape') setEditingFileId(null);
                              }}
                              className="bg-surface-2 border border-primary rounded px-2 py-1 text-xs text-text focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => saveRenaming(file.id)}
                              className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors"
                              title="Guardar nombre"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFileId(null)}
                              className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => onOpen3DModel(file)}
                            className="font-medium text-text hover:text-primary cursor-pointer truncate max-w-xs transition-colors"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tamaño */}
                    <td className="py-3 px-4 hidden md:table-cell text-text-secondary text-[11px] font-mono">
                      {file.size}
                    </td>

                    {/* Subido por */}
                    <td className="py-3 px-4 hidden sm:table-cell text-text-secondary text-xs">
                      {file.uploadedBy}
                    </td>

                    {/* Fecha */}
                    <td className="py-3 px-4 hidden lg:table-cell text-text-secondary text-[11px]">
                      {file.uploadedAt}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right relative">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Botón rápido ver */}
                        <button
                          type="button"
                          onClick={() => onOpen3DModel(file)}
                          className="p-1.5 hover:bg-surface-3 text-text-secondary hover:text-primary rounded-lg transition-colors"
                          title="Abrir vista previa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Botón rápido descargar */}
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-surface-3 text-text-secondary hover:text-text rounded-lg transition-colors"
                          title="Descargar archivo"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {/* Menú de Opciones (Tres Puntos) */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === file.id ? null : file.id);
                            }}
                            className="p-1.5 hover:bg-surface-3 text-text-secondary hover:text-text rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === file.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-40 bg-surface-1 border border-border rounded-xl shadow-xl z-30 py-1 text-left"
                            >
                              <button
                                type="button"
                                onClick={() => onOpen3DModel(file)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-text hover:bg-surface-2 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                <span>Abrir / Ver</span>
                              </button>

                              <a
                                href={file.url}
                                download
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setActiveMenuId(null)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-text hover:bg-surface-2 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 text-text-secondary" />
                                <span>Descargar</span>
                              </a>

                              {canUpload && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startRenaming(file)}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-text hover:bg-surface-2 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-text-secondary" />
                                    <span>Renombrar</span>
                                  </button>

                                  <div className="my-1 border-t border-border" />

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Eliminar</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de subida */}
      <UploadModal
        isOpen={showUploadModal}
        projectId={projectId}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </section>
  );
};