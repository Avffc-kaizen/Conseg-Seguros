
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

export type RouteName = 'inicio' | 'vida' | 'auto' | 'saude' | 'consorcio' | 'sobre' | 'contato';

export type UserRole = 'admin' | 'broker';
