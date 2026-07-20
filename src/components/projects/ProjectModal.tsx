'use client';

import React, { useState, useEffect } from 'react';
import { Project, ClientCompany, ProjectStatus } from '@/types';
import { FolderPlus, X, Building2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: ClientCompany[];
  defaultClientId?: string;
  onCreateProject: (
    projectData: Omit<Project, 'id' | 'filesCount' | 'activeOrdersCount' | 'updatedAt'>
  ) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  companies,
  defaultClientId,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    if (defaultClientId) {
      setSelectedClientId(defaultClientId);
    } else if (companies.length > 0) {
      setSelectedClientId(companies[0].id);
    }
  }, [defaultClientId, companies, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedClientId) return;

    const company = companies.find((c) => c.id === selectedClientId);

    onCreateProject({
      name: name.trim(),
      code: code.trim().toUpperCase() || 'PRJ',
      description: description.trim(),
      companyId: selectedClientId,
      clientName: company ? company.name : 'Cliente General',
      status: 'PLANNING',
    });

    setName('');
    setCode('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-1 border border-border rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center space-x-2 text-primary">
            <FolderPlus className="w-5 h-5" />
            <h3 className="text-base font-bold text-text">Nuevo Proyecto</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text rounded-lg hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-text-secondary font-semibold mb-1">
              Empresa / Cliente *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                disabled={Boolean(defaultClientId)}
                className="w-full bg-surface-2 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-text focus:outline-none focus:border-primary transition-colors disabled:opacity-60 cursor-pointer"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id} className="bg-surface-2 text-text">
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Remodelación Planta Norte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1">
              Código / SKU
            </label>
            <input
              type="text"
              placeholder="Ej. PRJ-004"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-text uppercase focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Escribe el alcance o notas generales del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-text focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-hover text-text-secondary font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl btn-primary text-white font-semibold shadow-lg shadow-[rgba(37,99,235,0.18)]"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};