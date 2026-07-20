'use client';

import React, { useState } from 'react';
import { ClientCompany, User, UserRole } from '@/types';
import {
  Building2,
  Users,
  Plus,
  Search,
  ShieldCheck,
  Mail,
  MoreVertical,
  
} from 'lucide-react';

const initialCompanies: ClientCompany[] = [
  { id: 'comp-1', name: 'Empresa Alfa S.A.', taxId: 'ABC123456789', contactEmail: 'contacto@alfa.com', createdAt: '2024-01-15' },
  { id: 'comp-2', name: 'Constructora Beta', taxId: 'XYZ987654321', contactEmail: 'info@beta.com', createdAt: '2024-02-01' },
];

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Carlos Mendoza', email: 'carlos@alfa.com', role: 'client_manager', companyId: 'comp-1', companyName: 'Empresa Alfa S.A.', status: 'active' },
  { id: 'usr-2', name: 'Ana Gómez', email: 'ana@alfa.com', role: 'client_viewer', companyId: 'comp-1', companyName: 'Empresa Alfa S.A.', status: 'active' },
  { id: 'usr-3', name: 'Roberto Silva', email: 'roberto@beta.com', role: 'client_manager', companyId: 'comp-2', companyName: 'Constructora Beta', status: 'active' },
];

export const ClientManager: React.FC = () => {
  const [companies, setCompanies] = useState<ClientCompany[]>(initialCompanies);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompTaxId, setNewCompTaxId] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('client_viewer');
  const [newUserCompanyId, setNewUserCompanyId] = useState('');

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.taxId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompanyId ? u.companyId === selectedCompanyId : true;
    return matchesSearch && matchesCompany;
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName) return;

    const newCompany: ClientCompany = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      taxId: newCompTaxId,
      contactEmail: newCompEmail,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCompanies([...companies, newCompany]);
    setNewCompName('');
    setNewCompTaxId('');
    setNewCompEmail('');
    setShowCompanyModal(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserCompanyId) return;

    const companyObj = companies.find((c) => c.id === newUserCompanyId);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      companyId: newUserCompanyId,
      companyName: companyObj?.name || 'Cliente General',
      status: 'active',
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserCompanyId('');
    setShowUserModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 surface-card rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-text">Administración de Clientes</h1>
          <p className="text-xs text-text-secondary mt-1">Gestiona las empresas clientes y la asignación de sus usuarios.</p>
        </div>

        <div className="flex items-center space-x-2 bg-surface-2 p-1 rounded-xl border border-border">
          <button
            onClick={() => {
              setActiveTab('companies');
              setSelectedCompanyId(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'companies'
                ? 'bg-primary text-white shadow-lg shadow-[rgba(37,99,235,0.18)]'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Empresas ({companies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-lg shadow-[rgba(37,99,235,0.18)]'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuarios ({users.length})</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={activeTab === 'companies' ? 'Buscar empresa por nombre o RFC...' : 'Buscar usuario...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-full pl-10 pr-4 py-2 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-40"
          />
        </div>

        {selectedCompanyId && (
          <button onClick={() => setSelectedCompanyId(null)} className="text-xs text-primary hover:underline self-center">
            &larr; Ver todas las empresas
          </button>
        )}

        <div className="flex items-center space-x-3">
          {activeTab === 'companies' ? (
            <button
              onClick={() => setShowCompanyModal(true)}
              className="flex items-center space-x-2 btn-primary text-white px-4 py-2 rounded-full text-xs transition-all shadow-lg shadow-[rgba(37,99,235,0.18)]"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Empresa</span>
            </button>
          ) : (
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center space-x-2 btn-primary text-white px-4 py-2 rounded-full text-xs transition-all shadow-lg shadow-[rgba(37,99,235,0.18)]"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((comp) => {
            const userCount = users.filter((u) => u.companyId === comp.id).length;

            return (
              <div key={comp.id} className="surface-card rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
                      {comp.name.charAt(0)}
                    </div>
                    {comp.taxId && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-2 text-text-secondary rounded-md">
                        {comp.taxId}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-text">{comp.name}</h3>
                    {comp.contactEmail && (
                      <p className="text-xs text-text-secondary flex items-center space-x-1 mt-1">
                        <Mail className="w-3 h-3 text-text-secondary" />
                        <span>{comp.contactEmail}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                  <span className="text-text-secondary flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{userCount} {userCount === 1 ? 'usuario' : 'usuarios'}</span>
                  </span>

                  <button
                    onClick={() => {
                      setSelectedCompanyId(comp.id);
                      setActiveTab('users');
                    }}
                    className="text-primary hover:text-primary-strong font-semibold text-xs"
                  >
                    Ver Usuarios &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-surface-1 border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="bg-surface-2 text-text-secondary font-mono border-b border-border uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Rol asignado</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-surface-2 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text">{usr.name}</p>
                          <p className="text-[10px] text-text-secondary">{usr.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 font-medium text-text-secondary">
                        <Building2 className="w-3.5 h-3.5 text-text-secondary" />
                        <span>{usr.companyName || 'Sin Empresa'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-surface-2 border border-border rounded-full text-[10px] font-mono text-accent">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="capitalize">{usr.role.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {usr.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1 hover:bg-surface-2 rounded-lg text-text-secondary hover:text-text">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-3xl p-6 w-full max-w-md space-y-5">
            <h3 className="text-base font-bold text-text">Registrar Nueva Empresa</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secondary mb-1">Nombre de la Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Constructora Delta S.A."
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1">RFC / RUC / Identificación Fiscal</label>
                <input
                  type="text"
                  placeholder="Ej. DEL123456789"
                  value={newCompTaxId}
                  onChange={(e) => setNewCompTaxId(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Correo de Contacto</label>
                <input
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={newCompEmail}
                  onChange={(e) => setNewCompEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowCompanyModal(false)} className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-hover text-text-secondary font-semibold">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl btn-primary text-white shadow-lg shadow-[rgba(37,99,235,0.18)]">
                  Guardar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-3xl p-6 w-full max-w-md space-y-5">
            <h3 className="text-base font-bold text-text">Registrar Nuevo Usuario</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secondary mb-1">Empresa Perteneciente *</label>
                <select
                  required
                  value={newUserCompanyId}
                  onChange={(e) => setNewUserCompanyId(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                >
                  <option value="">-- Seleccionar Empresa --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="juan@empresa.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Rol en la plataforma</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-primary"
                >
                  <option value="client_manager">Client Manager (Puede subir archivos)</option>
                  <option value="client_viewer">Client Viewer (Solo lectura)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-hover text-text-secondary font-semibold">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl btn-primary text-white shadow-lg shadow-[rgba(37,99,235,0.18)]">
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
