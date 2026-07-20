import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lion Store - Clients Portal',
  description: 'Plataforma B2B de Gestión Comercial y Modelado 3D',
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-accent selection:text-(--color-bg)">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}