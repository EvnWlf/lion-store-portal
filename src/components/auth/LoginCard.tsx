'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('e.alexander@clientdomain.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  const [isDark, setIsDark] = useState<boolean>(false);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(Boolean(mq && mq.matches));
    update();
    if (mq && typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
    } else {
      const legacy = mq as unknown as { addListener?: (cb: () => void) => void };
      if (typeof legacy.addListener === 'function') legacy.addListener(update);
    }

    return () => {
      if (mq && typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', update);
      } else {
        const legacy = mq as unknown as { removeListener?: (cb: () => void) => void };
        if (typeof legacy.removeListener === 'function') legacy.removeListener(update);
      }
    };
  }, []);

  const logoSrc = isDark ? '/assets/main_logo.webp' : '/assets/main_logo_colored.webp';

  return (
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-strong/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md surface-card rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          {logoLoaded ? (
            <div className="mb-4">
              <Image
                src={logoSrc}
                alt="Lion Store"
                width={76}
                height={76}
                priority={true}
                onError={() => setLogoLoaded(false)}
                className="rounded-2xl"
              />
            </div>
          ) : (
            <div className="w-14 h-14 bg-linear-to-tr from-primary to-primary-strong text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-[rgba(37,99,235,0.2)] mb-4">
              LS
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-text tracking-tight">Lion Store</h1>
          <p className="text-xs text-primary font-semibold tracking-wider uppercase mt-1">
            Client Portal Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text mb-2 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full bg-surface-2 border border-border text-sm text-text pl-11 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-semibold text-text">Contraseña</label>
              <a href="#" className="text-[11px] text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-2 border border-border text-sm text-text pl-11 pr-11 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-[rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="text-sm">Iniciando sesión...</span>
            ) : (
              <>
                <span className="text-sm">Ingresar al Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center space-x-2 text-text-secondary text-xs">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Made with ❤️ by Lion Store</span>
        </div>
      </div>
    </div>
  );
};
