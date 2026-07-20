"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserRole } from '@/types';
import {
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export type NavSection = 'projects' | 'clients' | 'settings';

interface SidebarProps {
  userRole?: UserRole;
  activeSection?: NavSection;
  onSelectSection?: (section: NavSection) => void;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole = 'client_viewer',
  activeSection = 'projects',
  onSelectSection,
  userName = 'Evan Alexander',
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(Boolean(mq && mq.matches));
    update();
    if (mq && typeof mq.addEventListener === 'function') mq.addEventListener('change', update);
    else {
      const legacy = mq as unknown as { addListener?: (cb: () => void) => void };
      if (typeof legacy.addListener === 'function') legacy.addListener(update);
    }
    return () => {
      if (mq && typeof mq.removeEventListener === 'function') mq.removeEventListener('change', update);
      else {
        const legacy = mq as unknown as { removeListener?: (cb: () => void) => void };
        if (typeof legacy.removeListener === 'function') legacy.removeListener(update);
      }
    };
  }, []);
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <aside
      className={`relative bg-surface-1 border-r border-border transition-all duration-300 flex flex-col justify-between p-4 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-surface-2 border border-border text-text-secondary hover:text-text p-1 rounded-full shadow-lg transition-all z-10"
        title={collapsed ? 'Expandir menú' : 'Plegar menú'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div>
        <div className="flex items-center space-x-3 px-2 py-3 mb-6">
          {logoLoaded ? (
            <div className="shrink-0">
              <Image
                src={isDark ? '/assets/main_logo.webp' : '/assets/main_logo_colored.webp'}
                alt="Lion Store"
                width={36}
                height={36}
                className="rounded-xl"
                priority
                onError={() => setLogoLoaded(false)}
              />
            </div>
            ) : (
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-primary-strong flex items-center justify-center font-bold text-white shadow-lg shadow-[rgba(37,99,235,0.2)] shrink-0">
              LS
            </div>
          )}
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-text tracking-wide truncate">LION STORE</h1>
              <p className="text-[10px] text-text-secondary font-mono uppercase truncate">Portal Clientes</p>
            </div>
          )}
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => onSelectSection?.('projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeSection === 'projects'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-text-secondary hover:text-text hover:bg-surface-2'
            }`}
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Proyectos</span>}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onSelectSection?.('clients')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  activeSection === 'clients'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text hover:bg-surface-2'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Clientes y Usuarios</span>}
              </button>

              <button
                onClick={() => onSelectSection?.('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  activeSection === 'settings'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text hover:bg-surface-2'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">Configuración</span>}
              </button>
            </>
          )}
        </nav>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {userInitial}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-text truncate">{userName}</p>
                <div className="flex items-center space-x-1 text-[10px] text-text-secondary">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span className="capitalize truncate">{userRole.replace('_', ' ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
