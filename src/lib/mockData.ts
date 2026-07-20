import { User, Project, FileRecord } from '@/types';

export const mockCurrentUser: User = {
  id: 'usr_001',
  name: 'Evan Alexander',
  email: 'evan@lionstore.com',
  role: 'super_admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const mockProjects: Project[] = [
  {
    id: 'proj_001',
    name: 'Portal Lion Store - Fase 1',
    code: 'PRJ-2026-001',
    description: 'Plataforma principal de gestión, visor 3D y documentos ejecutivos.',
    status: 'IN_PROGRESS',
    clientName: 'Lion Store Corporate',
    createdAt: '2026-02-10',
    updatedAt: '2026-07-15',
  },
  {
    id: 'proj_002',
    name: 'Remodelación Sucursal Centro',
    code: 'PRJ-2026-002',
    description: 'Levantamiento arquitectónico, catálogo de conceptos y planos.',
    status: 'IN_REVIEW',
    clientName: 'Comercializadora M&M',
    createdAt: '2026-04-01',
    updatedAt: '2026-07-18',
  },
];

export const mockFiles: FileRecord[] = [
  // --- ARCHIVOS PARA PROYECTO 1 (proj_001) ---
  {
    id: 'file_101',
    projectId: 'proj_001',
    name: 'Modelo_Estructural_3D.glb',
    type: 'MODEL_3D',
    size: '14.2 MB',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    uploadedBy: 'Ing. Carlos Mendoza',
    uploadedAt: '15 Jul 2026',
  },
  {
    id: 'file_102',
    projectId: 'proj_001',
    name: 'Presentacion_Ejecutiva.pptx',
    type: 'DOCUMENT',
    size: '8.5 MB',
    url: 'https://github.com/EvnWlf/ProcessInfoC/raw/refs/heads/master/Zoho%20Inventory%20Premium.pptx',
    uploadedBy: 'Ana Gómez (PM)',
    uploadedAt: '16 Jul 2026',
  },
  {
    id: 'file_103',
    projectId: 'proj_001',
    name: 'Presupuesto_y_Materiales.xlsx',
    type: 'DOCUMENT',
    size: '1.2 MB',
    url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
    uploadedBy: 'Evan Alexander',
    uploadedAt: '17 Jul 2026',
  },
  {
    id: 'file_104',
    projectId: 'proj_001',
    name: 'Especificaciones_Tecnicas.pdf',
    type: 'DOCUMENT',
    size: '3.4 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dra. Laura Torres',
    uploadedAt: '18 Jul 2026',
  },
  {
    id: 'file_105',
    projectId: 'proj_001',
    name: 'Contrato_Servicio_Firmado.docx',
    type: 'DOCUMENT',
    size: '850 KB',
    url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
    uploadedBy: 'Legal Team',
    uploadedAt: '19 Jul 2026',
  },
  {
    id: 'file_106',
    projectId: 'proj_001',
    name: 'Render_Fachada_Principal.png',
    type: 'IMAGE',
    size: '5.8 MB',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    uploadedBy: 'Arq. Carlos Mendoza',
    uploadedAt: '20 Jul 2026',
  },

  // --- ARCHIVOS PARA PROYECTO 2 (proj_002) ---
  {
    id: 'file_201',
    projectId: 'proj_002',
    name: 'Plano_Arquitectonico_Nivel1.pdf',
    type: 'DOCUMENT',
    size: '18.9 MB',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'Dra. Laura Torres',
    uploadedAt: '10 Jul 2026',
  },
  {
    id: 'file_202',
    projectId: 'proj_002',
    name: 'Catalogo_Conceptos_Materiales.xlsx',
    type: 'DOCUMENT',
    size: '920 KB',
    url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
    uploadedBy: 'Roberto Silva',
    uploadedAt: '12 Jul 2026',
  },
];