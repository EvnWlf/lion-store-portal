'use client';

import React from 'react';
import { Project } from '@/types';
import { FolderGit2, ArrowRight, Clock, FileText, ShoppingBag, Plus } from 'lucide-react';
import { toast } from 'sonner'; // 👈 Importar toast

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  canCreateProject: boolean;
  onCreateProjectClick?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  canCreateProject,
  onCreateProjectClick,
}) => {
  const handleSelect = (project: Project) => {
    // 👈 Notificación informativa al entrar a un proyecto
    toast.info(`Cargando proyecto: ${project.name}`);
    onSelectProject(project);
  };

  const handleCreateClick = () => {
    if (!canCreateProject) {
      toast.error('No tienes permisos suficientes para crear proyectos');
      return;
    }
    onCreateProjectClick?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Proyectos / Repositorios</h1>
          <p className="text-xs text-text-secondary mt-1">
            Selecciona un proyecto para explorar su documentación, visor 3D y pedidos activos.
          </p>
        </div>

        {canCreateProject && (
          <button
            onClick={handleCreateClick}
            className="btn-primary text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center space-x-2 transition-all shadow-lg shadow-[rgba(37,99,235,0.2)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleSelect(project)}
            className="surface-card rounded-3xl p-6 hover:border-primary/50 hover:bg-surface-2 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-surface-2 text-text-secondary px-3 py-1 rounded-full border border-border">
                  {project.code}
                </span>
              </div>

              <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>{project.filesCount ?? 0} archivos</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                  <span>{project.activeOrdersCount ?? 0} pedidos</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-1 text-[11px] text-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>{project.updatedAt || 'Hace un momento'}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Abrir</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};