export type UserRole = 'super_admin' | 'admin' | 'client_manager' | 'client_viewer';

// Nueva interfaz para las Empresas / Clientes
export interface ClientCompany {
  id: string;
  name: string;
  taxId?: string; // RFC, RUC, CIF o identificación fiscal
  logo?: string;
  contactEmail?: string;
  createdAt: string;
}

// Interfaz User actualizada con relación a la Empresa
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;   // ID de la empresa a la que pertenece
  companyName?: string; // Nombre comercial para rápida visualización
  avatar?: string;
  status?: 'active' | 'inactive';
}

export type ProjectStatus = 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'PLANNING';

export interface Project {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status: ProjectStatus;
  clientName?: string;
  companyId?: string; // Opcional: enlace directo a la empresa cliente
  createdAt?: string;
  updatedAt?: string;
  filesCount?: number;
  activeOrdersCount?: number;
}

export type FileType = 'MODEL_3D' | 'DOCUMENT' | 'IMAGE';

export interface FileRecord {
  id: string;
  projectId: string;
  name: string;
  type: FileType;
  size: string;
  url?: string;
  modelUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
}