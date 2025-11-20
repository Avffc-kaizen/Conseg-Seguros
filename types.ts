
export interface PageData {
    id: string;
    title: string;
    description: string;
    videoId?: string;
}

export interface LeadData {
    nome?: string;
    email: string;
    telefone?: string;
    produto?: string;
    mensagem?: string;
    anexos?: string[];
    createdAt?: any;
    page_url: string;
    content_name: string;
}

export type RouteName = 'inicio' | 'legado' | 'mobilidade' | 'saude' | 'consorcio' | 'filosofia' | 'contato' | 'login' | 'dashboard';

export type UserRole = 'admin' | 'broker';
