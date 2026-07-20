'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sidebar, NavSection } from '@/components/shared/Sidebar';
import { FileExplorer } from '@/components/files/FileExplorer';
import { UniversalFileViewer } from '@/components/viewer/UniversalFileViewer';
import { ClientManager } from '@/components/admin/ClientManager';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { mockCurrentUser, mockProjects, mockFiles, mockCompanies } from '@/lib/mockData';
import { UserRole, Project, FileRecord } from '@/types';
import {
  ChevronLeft,
  FolderGit2,
  Shield,
  Building2,
  User as UserIcon,
  Search,
  Plus,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { LoginCard } from '@/components/auth/LoginCard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('projects');

  const [currentUser, setCurrentUser] = useState({
    ...mockCurrentUser,
    role: 'super_admin' as UserRole,
  });

  // Estado mutable para la lista de proyectos y apertura del modal
  const [projectsList, setProjectsList] = useState<Project[]>(mockProjects);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0] || null);
  const [activeFile, setActiveFile] = useState<FileRecord | null>(null);
  const [projectSearch, setProjectSearch] = useState('');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveFile(null);
    setSelectedProject(null);
  };

  const handleCreateProject = (
    projectData: Omit<Project, 'id' | 'filesCount' | 'activeOrdersCount' | 'updatedAt'>
  ) => {
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now()}`,
      filesCount: 0,
      activeOrdersCount: 0,
      updatedAt: 'Hace un momento',
    };

    setProjectsList((prev) => [newProject, ...prev]);
  };

  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const canUpload = isAdmin || currentUser.role === 'client_manager';

  const projectFiles = mockFiles.filter((file) => file.projectId === selectedProject?.id);

  const filteredProjects = projectsList.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.code?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return <LoginCard onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-(--color-bg) text-text overflow-hidden font-sans">
      <Sidebar
        userRole={currentUser.role}
        activeSection={activeSection}
        onSelectSection={(section) => {
          setActiveSection(section);
          if (section !== 'projects') {
            setSelectedProject(null);
          }
        }}
        userName={currentUser.name}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-surface-1 border-b border-border px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-xs">
              L
            </div>
            <h2 className="text-sm font-bold text-text tracking-wide">
              Lion Store <span className="text-primary font-normal">Portal</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-surface-2 border border-border rounded-full px-3 py-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-text-secondary font-medium">Rol:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as UserRole })}
                className="bg-transparent text-xs text-text font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="super_admin" className="bg-surface-2 text-text">Super Admin</option>
                <option value="admin" className="bg-surface-2 text-text">Admin</option>
                <option value="client_manager" className="bg-surface-2 text-text">Client Manager</option>
                <option value="client_viewer" className="bg-surface-2 text-text">Client Viewer</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-surface-3 overflow-hidden border border-border flex items-center justify-center">
                {currentUser.avatar ? (
                  <Image src={currentUser.avatar} alt={currentUser.name} width={36} height={36} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <UserIcon className="w-4 h-4 text-text-secondary" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-text leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-text-secondary leading-tight">{currentUser.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 ml-1 hover:bg-red-500/10 text-text-secondary hover:text-red-400 rounded-full transition-all"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSection === 'clients' && <ClientManager />}

          {activeSection === 'settings' && (
            <div className="surface-card rounded-2xl p-8 max-w-4xl mx-auto text-center space-y-3">
              <SettingsIcon className="w-12 h-12 mx-auto text-text-secondary opacity-80" />
              <h2 className="text-base font-bold text-text">Configuración del Portal</h2>
              <p className="text-xs text-text-secondary">Ajustes generales del sistema y preferencias de la plataforma.</p>
            </div>
          )}

          {activeSection === 'projects' &&
            (selectedProject ? (
              <div className="space-y-6 max-w-7xl mx-auto">
                <div className="surface-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-lg">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 bg-surface-2 hover:bg-surface-hover text-text-secondary rounded-full transition-all border border-border"
                      title="Volver a lista de proyectos"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center space-x-3">
                        <h1 className="text-lg font-bold text-text tracking-tight">{selectedProject.name}</h1>
                        {selectedProject.code && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-2 text-primary border border-primary/20 rounded-md font-semibold">
                            {selectedProject.code}
                          </span>
                        )}
                      </div>
                      {selectedProject.description && (
                        <p className="text-xs text-text-secondary mt-1 max-w-2xl">{selectedProject.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-text-secondary bg-surface-2 px-3 py-1.5 rounded-full border border-border">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedProject.clientName || 'Cliente General'}</span>
                  </div>
                </div>

                <FileExplorer files={projectFiles} projectId={selectedProject.id} canUpload={canUpload} onOpen3DModel={(file) => setActiveFile(file)} />
              </div>
            ) : (
              <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-text">Proyectos Activos</h1>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Selecciona un proyecto para gestionar sus modelos 3D y documentación.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Buscar proyecto..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full bg-surface-2 border border-border rounded-full pl-10 pr-4 py-2 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-40"
                      />
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => setShowProjectModal(true)}
                        className="flex items-center space-x-2 btn-primary text-white font-semibold px-4 py-2 rounded-full text-xs transition-all shadow-lg shadow-[rgba(37,99,235,0.18)] shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Proyecto</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group surface-card hover:bg-surface-2 border border-border hover:border-primary/30 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary group-hover:scale-105 transition-transform">
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-2 text-text-secondary rounded-md">
                            {project.code || 'PRJ'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                            {project.description || 'Sin descripción disponible.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex justify-between items-center text-[11px] text-text-secondary">
                        <span>{project.clientName || 'Lion Store'}</span>
                        <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                          Abrir &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </main>
      </div>

      <UniversalFileViewer file={activeFile} onClose={() => setActiveFile(null)} />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        companies={mockCompanies}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}