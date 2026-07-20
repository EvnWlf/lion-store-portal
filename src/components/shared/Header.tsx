'use client';

import React from 'react';
import Image from 'next/image';
import { User, UserRole } from '@/types';
import { LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  user?: User | null;
  onRoleChange?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onRoleChange, onLogout }) => {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'Usuario';
  const userEmail = user?.email || 'usuario@lionstore.com';

  return (
    <header className="bg-surface-1 border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-primary to-primary-strong flex items-center justify-center font-bold text-white shadow-lg shadow-[rgba(37,99,235,0.2)]">
          L
        </div>
        <span className="font-bold text-base tracking-wide text-text">
          Lion Store <span className="text-primary font-normal">Portal</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {onRoleChange && user?.role && (
          <div className="flex items-center space-x-2 bg-surface-2 px-3 py-1.5 rounded-full border border-border text-xs">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span className="text-text-secondary font-medium">Rol:</span>
            <select
              value={user.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-text font-semibold focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-surface-2 text-text">Super Admin</option>
              <option value="admin" className="bg-surface-2 text-text">Admin</option>
              <option value="client_manager" className="bg-surface-2 text-text">Client Manager</option>
              <option value="client_viewer" className="bg-surface-2 text-text">Client Viewer</option>
            </select>
          </div>
        )}

        <div className="flex items-center space-x-3 pl-2 border-l border-border">
          {user?.avatar ? (
            <Image src={user.avatar} alt={userName} width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-primary/30" unoptimized />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs">
              {userInitial}
            </div>
          )}

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-text leading-tight">{userName}</p>
            <p className="text-[10px] text-text-secondary">{userEmail}</p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 ml-2 hover:bg-red-500/10 text-text-secondary hover:text-red-400 rounded-full transition-all"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
