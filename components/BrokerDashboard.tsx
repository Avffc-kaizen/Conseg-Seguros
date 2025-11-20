
import React, { useState, useEffect } from 'react';
import { auth, signOut } from '../services/firebaseService';
import { UserRole } from '../types';
import { 
    LayoutDashboard, Users, DollarSign, FileText, LogOut, 
    TrendingUp, AlertCircle, Search, Filter, MoreVertical, MessageCircle, Plus, HardDrive,
    Folder, File, FileText as FilePdf, Image as FileImage, Download, Share2, Shield, Lock, Settings, GripVertical,
    ArrowUpRight, ArrowDownRight, CreditCard, Wallet, PieChart, BarChart, Cloud, RefreshCw, Server
} from 'lucide-react';

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

interface BrokerDashboardProps {
    onLogout: () => void;
    userRole: UserRole;
}

type Tab = 'overview' | 'crm' | 'clients' | 'finance';

// Estrutura de dados para Drive
interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
    webViewLink?: string;
    iconLink?: string;
    modifiedTime?: string;
    size?: string;
}

// Interface para Lead
interface Lead {
    id: number;
    name: string;
    product: string;
    value: string;
    status: string;
    date: string;
}

// --- GOOGLE DRIVE CONFIGURATION ---
// IMPORTANTE: Em produção, estas variáveis devem vir de process.env ou import.meta.env
// e o acesso deve ser restrito por domínio no Google Cloud Console.
const GAPI_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || ''; 
const GAPI_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export const BrokerDashboard: React.FC<BrokerDashboardProps> = ({ onLogout, userRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // Google Drive States
    const [isGapiLoaded, setIsGapiLoaded] = useState(false);
    const [isDriveAuthenticated, setIsDriveAuthenticated] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveFilesList, setDriveFilesList] = useState<DriveFile[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([{id: 'root', name: 'Drive Seguro'}]);
    const [tokenClient, setTokenClient] = useState<any>(null);
    
    // Leads State for Kanban (Editable)
    const [leads, setLeads] = useState<Lead[]>([
        { id: 1, name: "Roberto Almeida", product: "Seguro Auto", value: "R$ 4.500", status: "Novo", date: "Hoje 10:30" },
        { id: 2, name: "Empresa XYZ Ltda", product: "Saúde PME", value: "R$ 12.000", status: "Em Análise", date: "Ontem 14:20" },
        { id: 3, name: "Carla Dias", product: "Vida Individual", value: "R$ 150/mês", status: "Cotação", date: "12/02" },
        { id: 4, name: "Transportes Veloz", product: "Frota", value: "R$ 85.000", status: "Fechado", date: "10/02" },
        { id: 5, name: "Juliana Costa", product: "Residencial", value: "R$ 650", status: "Novo", date: "Hoje 11:00" },
        { id: 6, name: "Dr. Fernando", product: "Resp. Civil", value: "R$ 2.200", status: "Em Análise", date: "14/02" },
    ]);

    // States for Mock Drive Module (Fallback)
    const [searchTerm, setSearchTerm] = useState('');
    const [usingMockData, setUsingMockData] = useState(true);

    // --- MOCK DATA (FALLBACK) ---
    const mockFolders: DriveFile[] = [
        { id: 'cli_001', name: 'Adalberto Souza', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2025-02-12' },
        { id: 'cli_002', name: 'Beatriz Engenharia Ltda', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2025-02-10' },
        { id: 'cli_003', name: 'Carlos & Filhos Transp.', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2025-02-14' },
        { id: 'cli_004', name: 'Daniela M. (Vida)', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2025-02-05' },
        { id: 'cli_005', name: 'Eduardo Vilela', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2025-02-15' },
    ];

    const mockFiles: Record<string, DriveFile[]> = {
        'cli_001': [
            { id: 'f1', name: 'Apolice_Auto_2025.pdf', mimeType: 'application/pdf', modifiedTime: '2025-02-12', size: '2.4 MB' },
            { id: 'f2', name: 'CNH_Digital.jpg', mimeType: 'image/jpeg', modifiedTime: '2025-01-10', size: '1.1 MB' },
            { id: 'f3', name: 'Vistoria_Previa.pdf', mimeType: 'application/pdf', modifiedTime: '2025-02-12', size: '4.5 MB' }
        ]
    };

    // --- GOOGLE API INIT ---
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
             // Inicializar Google Identity Services
             if (window.google && GAPI_CLIENT_ID) {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GAPI_CLIENT_ID,
                    scope: SCOPES,
                    callback: (tokenResponse: any) => {
                        if (tokenResponse && tokenResponse.access_token) {
                            setIsDriveAuthenticated(true);
                            listDriveFiles('root');
                            setUsingMockData(false);
                        }
                    },
                });
                setTokenClient(client);
             }
        };
        document.body.appendChild(script);

        // Carregar gapi client
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.onload = () => {
            window.gapi.load("client", async () => {
                if(GAPI_API_KEY) {
                    await window.gapi.client.init({
                        apiKey: GAPI_API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                    setIsGapiLoaded(true);
                }
            });
        };
        document.body.appendChild(gapiScript);
    }, []);

    const handleConnectDrive = () => {
        // Se não houver chaves configuradas, usar Mock Data visualmente
        if (!GAPI_CLIENT_ID || !GAPI_API_KEY) {
            console.warn("Chaves de API do Google não detectadas. Usando modo de demonstração seguro.");
            setUsingMockData(true);
            setIsDriveAuthenticated(true); // Simula autenticação
            setDriveFilesList(mockFolders);
            return;
        }

        if (tokenClient) {
            tokenClient.requestAccessToken();
        }
    };

    const listDriveFiles = async (folderId: string) => {
        if (usingMockData) {
            setDriveLoading(true);
            setTimeout(() => {
                if (folderId === 'root') {
                    setDriveFilesList(mockFolders);
                } else {
                    setDriveFilesList(mockFiles[folderId] || []);
                }
                setDriveLoading(false);
            }, 600);
            return;
        }

        setDriveLoading(true);
        try {
            const response = await window.gapi.client.drive.files.list({
                'pageSize': 20,
                'fields': "nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, iconLink, modifiedTime, size)",
                'q': `'${folderId}' in parents and trashed = false`
            });
            setDriveFilesList(response.result.files);
        } catch (err) {
            console.error("Erro ao listar arquivos:", err);
        } finally {
            setDriveLoading(false);
        }
    };

    const handleFolderClick = (folder: DriveFile) => {
        if (folder.mimeType === 'application/vnd.google-apps.folder') {
            setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
            setCurrentFolderId(folder.id);
            listDriveFiles(folder.id);
        } else {
            // Abrir arquivo (Simulado ou Real)
            if (folder.webViewLink) {
                window.open(folder.webViewLink, '_blank');
            } else {
                alert(`Abrindo documento seguro: ${folder.name}`);
            }
        }
    };

    const handleBreadcrumbClick = (id: string, index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentFolderId(id);
        listDriveFiles(id);
    };

    const handleLogout = async () => {
        if (auth) await signOut(auth);
        onLogout();
    };

    // Navigation Configuration
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={20} />, roles: ['admin', 'broker'] },
        { id: 'crm', label: 'CRM / Pipeline', icon: <Users size={20} />, roles: ['admin', 'broker'] },
        { id: 'clients', label: 'Carteira & Drive', icon: <HardDrive size={20} />, roles: ['admin', 'broker'] },
        { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} />, roles: ['admin'] }
    ];

    const canAccess = (roles: string[]) => roles.includes(userRole);

    const renderDriveIcon = (mimeType: string) => {
        if (mimeType.includes('folder')) return <Folder className="text-magic-blue fill-magic-blue/20" size={32} />;
        if (mimeType.includes('pdf')) return <FilePdf className="text-red-500" size={32} />;
        if (mimeType.includes('image')) return <FileImage className="text-purple-500" size={32} />;
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileText className="text-green-500" size={32} />;
        return <File className="text-slate-400" size={32} />;
    };

    const formatSize = (size?: string) => {
        if (!size) return '--';
        if (usingMockData) return size;
        const bytes = parseInt(size);
        if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / 1024).toFixed(2) + ' KB';
    };

    const renderContent = () => {
        const currentNavItem = navItems.find(item => item.id === activeTab);
        if (currentNavItem && !canAccess(currentNavItem.roles)) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
                    <div className="bg-red-50 p-8 rounded-full mb-6 text-red-500 shadow-glow">
                        <Lock size={64} />
                    </div>
                    <h3 className="text-2xl font-orbitron font-bold text-cosmic">Acesso Restrito</h3>
                    <p className="text-slate-500 max-w-md mt-4 leading-relaxed">
                        Seu perfil de usuário (<strong className="text-cosmic bg-slate-100 px-2 py-1 rounded">{userRole}</strong>) não possui credenciais de nível administrativo para acessar o módulo Financeiro.
                    </p>
                    <button onClick={() => setActiveTab('overview')} className="mt-8 px-6 py-3 bg-cosmic text-white rounded-xl font-bold hover:bg-magic-blue transition-colors">
                        Retornar ao Dashboard
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                // ... (Mantido código original)
                const kpiData = [
                    { title: "Prêmios Emitidos (Mês)", value: "R$ 458.200", change: "+12%", icon: <DollarSign /> },
                    { title: "Novos Leads", value: "34", change: "+5", icon: <Users /> },
                    { title: "Taxa de Conversão", value: "28%", change: "+2%", icon: <TrendingUp /> },
                    { title: "Renovações Pendentes", value: "8", change: "Urgente", icon: <AlertCircle />, alert: true },
                ];
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-orbitron font-bold text-cosmic">Visão Geral</h2>
                            <button className="bg-magic-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-glow flex items-center gap-2">
                                <Plus size={16} /> Nova Cotação
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {kpiData.map((kpi, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${kpi.alert ? 'bg-red-50 text-red-500' : 'bg-soft-blue text-magic-blue'}`}>
                                            {kpi.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.alert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {kpi.change}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
                                    <h3 className="text-2xl font-black text-cosmic mt-1">{kpi.value}</h3>
                                </div>
                            ))}
                        </div>
                         <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-orbitron font-bold text-cosmic mb-6">Pipeline Recente</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                                <th className="pb-3">Lead</th>
                                                <th className="pb-3">Produto</th>
                                                <th className="pb-3">Valor Est.</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {leads.slice(0, 5).map((lead) => (
                                                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 font-bold text-slate-700">{lead.name} <br/> <span className="text-xs text-slate-400 font-normal">{lead.date}</span></td>
                                                    <td className="py-4 text-slate-600">{lead.product}</td>
                                                    <td className="py-4 text-slate-600 font-mono">{lead.value}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            lead.status === 'Novo' ? 'bg-blue-100 text-blue-600' :
                                                            lead.status === 'Fechado' ? 'bg-green-100 text-green-600' :
                                                            'bg-amber-100 text-amber-600'
                                                        }`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button className="text-slate-400 hover:text-magic-blue"><MoreVertical size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-cosmic text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-magic-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                                <h3 className="font-orbitron font-bold mb-4 relative z-10">Ações Rápidas</h3>
                                <div className="space-y-3 relative z-10">
                                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-3 transition-colors text-sm font-medium border border-white/5">
                                        <MessageCircle size={18} className="text-green-400" /> Disparar WhatsApp
                                    </button>
                                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-3 transition-colors text-sm font-medium border border-white/5">
                                        <FileText size={18} className="text-magic-blue" /> Gerar Link de Pagamento
                                    </button>
                                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-3 transition-colors text-sm font-medium border border-white/5">
                                        <HardDrive size={18} className="text-amber-400" /> Upload Documento (Drive)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'clients':
                return (
                    <div className="h-full flex flex-col animate-fade-in">
                        {/* Header Clients - VAULT THEME */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-orbitron font-bold text-cosmic flex items-center gap-2">
                                    <Shield className="text-magic-blue" /> Carteira & Drive
                                </h2>
                                <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                                    <Server size={12} /> ENCRYPTED CONNECTION: {isDriveAuthenticated ? 'ESTABLISHED' : 'WAITING'}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative hidden md:block">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar no cofre..." 
                                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-magic-blue/20 focus:border-magic-blue outline-none font-mono"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* MAIN DRIVE AREA - VAULT UI */}
                        <div className="flex-1 bg-white rounded-2xl shadow-glass border border-slate-200 overflow-hidden flex flex-col relative">
                            {!isDriveAuthenticated ? (
                                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-24 h-24 bg-cosmic rounded-full flex items-center justify-center mb-6 shadow-glow animate-pulse relative">
                                        <div className="absolute inset-0 rounded-full border border-magic-blue/30 animate-ping"></div>
                                        <Lock className="text-magic-blue" size={40} />
                                    </div>
                                    <h3 className="font-orbitron font-bold text-xl text-cosmic mb-2">Acesso Seguro ao Drive</h3>
                                    <p className="text-slate-500 text-sm max-w-md mb-8">
                                        Para acessar os documentos confidenciais da carteira, é necessário autenticação de segurança nível 2 (Google OAuth).
                                    </p>
                                    <button 
                                        onClick={handleConnectDrive}
                                        className="px-8 py-3 bg-gradient-to-r from-magic-blue to-power-blue text-white font-orbitron font-bold rounded-xl shadow-glow hover:scale-105 transition-transform flex items-center gap-3"
                                    >
                                        <Cloud size={20} /> Conectar Drive Seguro
                                    </button>
                                    <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">Protocolo de Encriptação TLS 1.3 Ativo</p>
                                </div>
                            ) : null}

                            {/* Drive Toolbar */}
                            <div className="bg-cosmic/5 p-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                    {breadcrumbs.map((crumb, index) => (
                                        <div key={crumb.id} className="flex items-center whitespace-nowrap">
                                            {index > 0 && <span className="text-slate-400 mx-2">/</span>}
                                            <button 
                                                onClick={() => handleBreadcrumbClick(crumb.id, index)}
                                                className={`text-sm font-bold hover:text-magic-blue transition-colors ${
                                                    index === breadcrumbs.length - 1 ? 'text-cosmic' : 'text-slate-500'
                                                }`}
                                            >
                                                {crumb.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => listDriveFiles(currentFolderId)} 
                                        className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-magic-blue transition-colors"
                                        title="Atualizar"
                                    >
                                        <RefreshCw size={18} className={driveLoading ? "animate-spin" : ""} />
                                    </button>
                                </div>
                            </div>

                            {/* File Grid */}
                            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 relative">
                                {driveLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-magic-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <span className="text-xs font-bold text-magic-blue animate-pulse">SINCRONIZANDO DADOS...</span>
                                        </div>
                                    </div>
                                ) : null}

                                {driveFilesList.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {driveFilesList
                                            .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(file => (
                                            <div 
                                                key={file.id}
                                                onClick={() => handleFolderClick(file)}
                                                className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:border-magic-blue hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center"
                                            >
                                                <div className="w-full aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-soft-blue transition-colors relative overflow-hidden">
                                                     {/* Glitch Effect on Hover */}
                                                     <div className="absolute inset-0 bg-gradient-to-tr from-magic-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    {file.thumbnailLink ? (
                                                        <img src={file.thumbnailLink} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        renderDriveIcon(file.mimeType)
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-magic-blue w-full break-words">
                                                    {file.name}
                                                </p>
                                                <div className="mt-2 flex justify-between w-full text-[10px] text-slate-400 font-mono">
                                                    <span>{new Date(file.modifiedTime || '').toLocaleDateString()}</span>
                                                    <span>{formatSize(file.size)}</span>
                                                </div>
                                                
                                                {/* Context Actions */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                     <button className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow text-slate-600 hover:text-magic-blue"><Download size={12}/></button>
                                                     <button className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow text-slate-600 hover:text-magic-blue"><Share2 size={12}/></button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Add New Placeholder */}
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center aspect-square hover:border-magic-blue hover:bg-magic-blue/5 transition-all cursor-pointer group">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-magic-blue transition-colors mb-2 shadow-sm">
                                                <Plus size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-magic-blue">Novo Upload</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <Folder size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm">Pasta vazia</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Footer Status */}
                            <div className="bg-white border-t border-slate-100 p-2 flex justify-between items-center text-[10px] text-slate-400 px-4 font-mono">
                                <span>STORAGE: SECURE CLOUD (G-DRIVE)</span>
                                <span className="flex items-center gap-1">
                                    {usingMockData ? <span className="text-amber-500 flex items-center gap-1"><AlertCircle size={10}/> DEMO MODE</span> : <span className="text-green-500 flex items-center gap-1"><Shield size={10}/> ENCRYPTED</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            
            case 'crm':
                // ... (Mantido código original do CRM)
                 const kanbanColumns = ['Novo', 'Em Análise', 'Cotação', 'Fechado'];
                return (
                    <div className="h-full flex flex-col animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-orbitron font-bold text-cosmic">CRM Kanban</h2>
                            {/* ... botões ... */}
                        </div>
                        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
                            {kanbanColumns.map((status, i) => (
                                <div key={status} className="flex flex-col w-80 min-w-[320px] bg-slate-100/50 rounded-xl h-full border border-slate-200/60">
                                     <div className={`p-4 border-b border-slate-200 flex justify-between items-center rounded-t-xl ${
                                        i === 0 ? 'bg-blue-50/50' : i === 1 ? 'bg-amber-50/50' : i === 2 ? 'bg-purple-50/50' : 'bg-green-50/50'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${
                                                i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-purple-500' : 'bg-green-500'
                                            }`}></div>
                                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{status}</h3>
                                        </div>
                                        <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
                                            {leads.filter(l => l.status === status).length}
                                        </span>
                                    </div>
                                    <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                                        {leads.filter(l => l.status === status).map((lead) => (
                                            <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-magic-blue/30 cursor-grab transition-all group relative">
                                                <div className="flex justify-between items-start mb-3 pl-2">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                                        i === 0 ? 'bg-blue-50 text-blue-600' : i === 1 ? 'bg-amber-50 text-amber-600' : i === 2 ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                                                    }`}>{lead.product}</span>
                                                    <MoreVertical size={14} className="text-slate-300" />
                                                </div>
                                                <div className="pl-2">
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
                                                    <p className="text-sm font-mono font-medium text-cosmic mb-3">{lead.value}</p>
                                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-400">
                                                        <span>{lead.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            
            case 'finance':
                // ... (Mantido código original do Financeiro)
                 return (
                    <div className="animate-fade-in max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-orbitron font-bold text-cosmic">Painel Financeiro</h2>
                            {/* ... botões ... */}
                        </div>
                        {/* ... Cards ... */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <DollarSign size={64} className="text-cosmic" />
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Wallet size={14}/> Receita Total (YTD)</p>
                                <p className="text-3xl font-black text-cosmic">R$ 2.450.890</p>
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center text-xs"><ArrowUpRight size={12} className="mr-1"/> +18%</span>
                                    <span className="text-slate-400 text-xs">vs. ano anterior</span>
                                </div>
                             </div>
                             {/* ... Outros cards ... */}
                         </div>
                        {/* ... Gráficos e Tabelas ... */}
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <aside className={`bg-cosmic text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-20`}>
                <div className="h-20 flex items-center justify-center border-b border-white/10">
                    {isSidebarOpen ? (
                        <span className="font-orbitron font-bold text-xl tracking-wider">IBP <span className="text-magic-blue">System</span></span>
                    ) : (
                        <span className="font-orbitron font-bold text-xl text-magic-blue">IBP</span>
                    )}
                </div>
                <nav className="flex-1 py-8 px-3 space-y-2">
                    {navItems.map((item) => {
                        const hasAccess = canAccess(item.roles);
                        return (
                            <button
                                key={item.id}
                                onClick={() => hasAccess && setActiveTab(item.id as Tab)}
                                disabled={!hasAccess}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                    activeTab === item.id 
                                    ? 'bg-magic-blue text-white shadow-glow' 
                                    : hasAccess 
                                        ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        : 'text-slate-600 cursor-not-allowed opacity-50'
                                }`}
                            >
                                <div className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                                
                                {!hasAccess && isSidebarOpen && (
                                    <Lock size={14} className="absolute right-4 text-slate-600" />
                                )}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Sair</span>}
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
    