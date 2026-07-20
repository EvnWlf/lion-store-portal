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
  const [collapsed, setCollapsed] = useState(true); // Inicialmente colapsado como en tu imagen
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

  const navItems: { id: NavSection; label: string; icon: React.ElementType }[] = [
    { id: 'projects', label: 'Proyectos', icon: FolderKanban },
    ...(isAdmin
      ? [
          { id: 'clients' as NavSection, label: 'Clientes y Usuarios', icon: Building2 },
          { id: 'settings' as NavSection, label: 'Configuración', icon: Settings },
        ]
      : []),
  ];

  return (
    <aside
      className={`relative bg-surface-1 border-r border-border transition-all duration-300 flex flex-col justify-between py-5 shrink-0 ${
        collapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      {/* Botón flotante para plegar/expandir */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 bg-surface-1 border border-border text-text-secondary hover:text-text p-1 rounded-full shadow-md transition-all z-10 hover:scale-105"
        title={collapsed ? 'Expandir menú' : 'Plegar menú'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div>
        {/* Cabecera / Logo */}
        <div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : 'space-x-3 px-2 py-1'}`}>
          {logoLoaded ? (
            <div className="shrink-0 flex items-center justify-center">
              <Image
                src={isDark ? '/assets/main_logo.webp' : '/assets/main_logo_colored.webp'}
                alt="Lion Store"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                priority
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoLoaded(false)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-primary-strong flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
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

        {/* Navegación Principal */}
        <nav className="space-y-2 flex flex-col items-center">
          {navItems.map((item) => {
            const Icon = item.icon as React.ComponentType<{ className: string }>;
            const isActive = activeSection === item.id;
            const sizeClasses: string = collapsed
              ? 'w-10 h-10 justify-center rounded-lg'
              : 'w-full space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium';
            const stateClasses: string = isActive
              ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
              : 'text-text-secondary hover:text-text hover:bg-surface-2';

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection?.(item.id)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center transition-all ${sizeClasses} ${stateClasses}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Perfil de Usuario en el pie */}
      <div className="pt-4 border-t border-border flex justify-center">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'w-full space-x-3 px-1'}`}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {userInitial}
          </div>

          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-semibold text-text truncate">{userName}</p>
              <div className="flex items-center space-x-1 text-[10px] text-text-secondary">
                <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                <span className="capitalize truncate">{userRole.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};