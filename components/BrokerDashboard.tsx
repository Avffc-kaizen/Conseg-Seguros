
import React, { useState, useEffect, useRef } from 'react';
import { auth, signOut, db, collection, query, orderBy, onSnapshot } from '../services/firebaseService';
import { UserRole } from '../types';
import { 
    LayoutDashboard, Users, DollarSign, LogOut, 
    TrendingUp, AlertCircle, Search, Filter, MoreVertical, MessageCircle, Plus, HardDrive,
    Folder, File, FileText as FilePdf, Image as FileImage, Download, Share2, Shield, Settings,
    ArrowUpRight, ArrowDownRight, Cloud, RefreshCw, Activity,
    Database, UploadCloud, Bell, Zap, CheckCircle, Menu, XCircle, ChevronRight, 
    Clock, Eye, Grid, List, FolderPlus, Newspaper, ArrowRight, Calendar, BarChart3, PieChart,
    TrendingDown, ExternalLink, Lock, FileSpreadsheet, PlayCircle, BrainCircuit
} from 'lucide-react';

interface BrokerDashboardProps {
    onLogout: () => void;
    userRole: UserRole;
}

type Tab = 'overview' | 'crm' | 'clients' | 'finance';
type ViewMode = 'grid' | 'list';

// --- INTERFACES ---

interface FileSystemItem {
    id: string;
    name: string;
    type: 'folder' | 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'video';
    parentId: string; // 'root' is the top level
    size?: string;
    modifiedAt: string;
    starred?: boolean;
    previewUrl?: string;
}

interface Lead {
    id: string;
    name: string;
    product: string;
    value: string;
    status: string;
    date: string;
    email?: string;
    phone?: string;
    message?: string;
    origin?: 'site' | 'manual' | 'consorcio_system';
}

interface MarketNews {
    id: string;
    title: string;
    source: string;
    time: string;
    tag: 'Alta' | 'Baixa' | 'Neutro' | 'Alerta';
    sentiment: 'positive' | 'negative' | 'neutral';
}

interface EconomicEvent {
    id: string;
    date: string;
    event: string;
    impact: 'High' | 'Medium' | 'Low';
}

// --- MOCK DATA INITIALIZATION (Drive Link Content Simulation) ---

const INITIAL_FILES: FileSystemItem[] = [
    // Folders Root
    { id: 'root_1', name: '01. Marketing & Branding', type: 'folder', parentId: 'root', modifiedAt: '2024-01-15' },
    { id: 'root_2', name: '02. Tabelas Vigentes 2025', type: 'folder', parentId: 'root', modifiedAt: '2025-02-10' },
    { id: 'root_3', name: '03. Documentos Clientes', type: 'folder', parentId: 'root', modifiedAt: '2025-02-18' },
    { id: 'root_4', name: '04. Treinamentos & Scripts', type: 'folder', parentId: 'root', modifiedAt: '2025-02-20' },
    
    // 01. Marketing (Based on Drive Link context)
    { id: 'mkt_1', name: 'Logo_Conseg_Private_Gold.png', type: 'image', parentId: 'root_1', size: '2.4 MB', modifiedAt: '2024-11-20' },
    { id: 'mkt_2', name: 'Apresentacao_Institucional_V4.pdf', type: 'pdf', parentId: 'root_1', size: '12.0 MB', modifiedAt: '2025-01-05', starred: true },
    { id: 'mkt_3', name: 'Video_Institucional_Teaser.mp4', type: 'video', parentId: 'root_1', size: '150 MB', modifiedAt: '2024-12-01' },
    { id: 'mkt_4', name: 'Post_Instagram_Blindagem.psd', type: 'image', parentId: 'root_1', size: '45 MB', modifiedAt: '2025-02-15' },

    // 02. Tabelas 2025
    { id: 'tab_1', name: 'Porto_Seguro_Auto_Fev25.xlsx', type: 'spreadsheet', parentId: 'root_2', size: '45 KB', modifiedAt: '2025-02-01', starred: true },
    { id: 'tab_2', name: 'Bradesco_Saude_PME_Rede.pdf', type: 'pdf', parentId: 'root_2', size: '2.1 MB', modifiedAt: '2025-02-01' },
    { id: 'tab_3', name: 'Simulador_Consorcio_Imovel.xlsx', type: 'spreadsheet', parentId: 'root_2', size: '1.5 MB', modifiedAt: '2025-02-15', starred: true },
    { id: 'tab_4', name: 'SulAmerica_Vida_Fator.pdf', type: 'pdf', parentId: 'root_2', size: '1.8 MB', modifiedAt: '2025-01-15' },

    // 03. Clientes Docs (Sample)
    { id: 'cli_1', name: 'Pasta_Roberto_Alves_Legado', type: 'folder', parentId: 'root_3', modifiedAt: '2025-02-18' },
    { id: 'cli_doc_1', name: 'CNH_Roberto.pdf', type: 'pdf', parentId: 'cli_1', size: '500 KB', modifiedAt: '2025-02-18' },
    { id: 'cli_doc_2', name: 'IR_2024_Completo.pdf', type: 'pdf', parentId: 'cli_1', size: '4.2 MB', modifiedAt: '2025-02-18' },

     // 04. Treinamentos
    { id: 'tr_1', name: 'Script_Venda_Consultiva.pdf', type: 'pdf', parentId: 'root_4', size: '1.1 MB', modifiedAt: '2024-10-10' },
    { id: 'tr_2', name: 'Masterclass_Sucessao.mp4', type: 'video', parentId: 'root_4', size: '450 MB', modifiedAt: '2024-11-15' },
];

const DEMO_LEADS: Lead[] = [
    { id: 'demo1', name: 'Roberto Alves', product: 'LEGADO', value: 'R$ 2.5M', status: 'Novo', date: 'Agora', email: 'roberto@email.com', phone: '(11) 99999-9999', message: 'Interesse em sucessão patrimonial.', origin: 'site' },
    { id: 'demo2', name: 'Transportadora Solar', product: 'MOBILIDADE', value: 'Frota (12)', status: 'Em Análise', date: 'Há 2h', email: 'contato@solar.com', phone: '(11) 3333-3333', message: 'Cotação para frota.', origin: 'manual' },
    { id: 'demo3', name: 'Julia Silva', product: 'HUMANA', value: 'Saúde Top', status: 'Fechado', date: 'Ontem', email: 'julia@email.com', phone: '(11) 98888-8888', message: 'Reembolso alto.', origin: 'site' },
    { id: 'demo4', name: 'Construtora Vix', product: 'EXPANSÃO', value: 'R$ 10M', status: 'Cotação', date: '2 dias', email: 'dir@vix.com', phone: '(27) 99999-0000', message: 'Investimento imobiliário via consórcio.', origin: 'consorcio_system' },
];

const MOCK_NEWS: MarketNews[] = [
    { id: '1', title: 'BC indica manutenção da Selic em próxima reunião devido à inflação.', source: 'Valor Econômico', time: '15 min', tag: 'Neutro', sentiment: 'neutral' },
    { id: '2', title: 'Dólar recua 1% com dados de emprego nos EUA abaixo do esperado.', source: 'Bloomberg', time: '42 min', tag: 'Baixa', sentiment: 'positive' }, 
    { id: '3', title: 'Setor de Seguros cresce 12% em 2024 puxado por Vida e Previdência.', source: 'Susep', time: '1h', tag: 'Alta', sentiment: 'positive' },
    { id: '4', title: 'Consórcio de imóveis bate recorde de vendas no trimestre.', source: 'ABAC', time: '2h', tag: 'Alta', sentiment: 'positive' },
];

const ECONOMIC_EVENTS: EconomicEvent[] = [
    { id: '1', date: 'Hoje', event: 'Decisão Taxa de Juros (EUA)', impact: 'High' },
    { id: '2', date: 'Amanhã', event: 'Divulgação IPCA-15', impact: 'Medium' },
    { id: '3', date: '25/05', event: 'Reunião COPOM (Brasil)', impact: 'High' },
];

export const BrokerDashboard: React.FC<BrokerDashboardProps> = ({ onLogout, userRole }) => {
    // UI State
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(false); 
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    
    // Drive / Files State
    const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([{id: 'root', name: 'Drive Conseg'}]);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [previewFile, setPreviewFile] = useState<FileSystemItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CRM State
    const [leads, setLeads] = useState<Lead[]>([]);
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // System State
    const [isScanning, setIsScanning] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Market Data Simulation (Scalpe System)
    const [marketData, setMarketData] = useState([
        { id: 1, pair: 'SELIC', val: '10.75%', change: '-0.50%', up: false, chartData: [11.75, 11.25, 11.25, 10.75, 10.75, 10.75] },
        { id: 2, pair: 'IPCA (12m)', val: '4.12%', change: '+0.10%', up: true, chartData: [3.8, 3.9, 4.0, 4.2, 4.12, 4.12] },
        { id: 3, pair: 'USD/BRL', val: '5.14', change: '-0.25%', up: false, good: true, chartData: [5.20, 5.18, 5.15, 5.12, 5.16, 5.14] },
        { id: 4, pair: 'IGPM', val: '0.50%', change: '-0.10%', up: false, chartData: [0.8, 0.6, 0.5, 0.5, 0.4, 0.5] },
    ]);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (desktop) setSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); 
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Leads from Firestore
    useEffect(() => {
        let unsubscribe: () => void;
        const fetchLeads = async () => {
            if (!auth.currentUser || !db) {
                setLeads(DEMO_LEADS);
                return;
            }
            try {
                const q = query(collection(db, "leads-contato"), orderBy("createdAt", "desc"));
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const fetchedLeads: Lead[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        let displayProduct = data.produto || "Geral";
                        if (displayProduct === 'vida') displayProduct = 'Legado';
                        if (displayProduct === 'auto') displayProduct = 'Mobilidade';
                        fetchedLeads.push({
                            id: doc.id,
                            name: data.nome || "Lead",
                            product: displayProduct.toUpperCase(),
                            value: data.value || "A calcular", 
                            status: data.status || "Novo",
                            date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "--",
                            email: data.email,
                            phone: data.telefone
                        });
                    });
                    setLeads(fetchedLeads.length > 0 ? fetchedLeads : DEMO_LEADS);
                });
            } catch (e) {
                setLeads(DEMO_LEADS);
            }
        };
        fetchLeads();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    // --- SVG SPARKLINE COMPONENT ---
    const Sparkline = ({ data, color }: { data: number[], color: string }) => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((val - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width="100%" height="40" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx={(data.length-1)/(data.length-1)*100} cy={100 - ((data[data.length-1] - min) / range) * 100} r="6" fill={color} />
            </svg>
        );
    };

    // --- DRIVE FUNCTIONS ---

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'folder': return <Folder className="text-trust-blue fill-blue-50" size={40} strokeWidth={1.5} />;
            case 'pdf': return <FilePdf className="text-red-500" size={40} strokeWidth={1.5} />;
            case 'image': return <FileImage className="text-purple-500" size={40} strokeWidth={1.5} />;
            case 'spreadsheet': return <FileSpreadsheet className="text-emerald-600" size={40} strokeWidth={1.5} />;
            case 'video': return <PlayCircle className="text-pink-500" size={40} strokeWidth={1.5} />;
            default: return <File className="text-slate-400" size={40} strokeWidth={1.5} />;
        }
    };

    const handleFolderClick = (folderId: string, folderName: string) => {
        setCurrentFolderId(folderId);
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
    };

    const handleBreadcrumbClick = (id: string, index: number) => {
        setCurrentFolderId(id);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    const handleFileClick = (file: FileSystemItem) => {
        if (file.type === 'folder') {
            handleFolderClick(file.id, file.name);
        } else {
            setPreviewFile(file);
        }
    };

    const handleSyncDrive = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            // In a real app, this would fetch from the actual Drive API
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 15;
            });
        }, 150);

        setTimeout(() => {
            const newFile: FileSystemItem = {
                id: `new_${Date.now()}`,
                name: file.name,
                type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : file.type.includes('sheet') ? 'spreadsheet' : 'doc',
                parentId: currentFolderId,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                modifiedAt: new Date().toLocaleDateString('pt-BR')
            };
            setFileSystem([newFile, ...fileSystem]);
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }, 1800);
    };

    const createFolder = () => {
        const name = prompt("Nome da nova pasta:");
        if (name) {
            const newFolder: FileSystemItem = {
                id: `folder_${Date.now()}`,
                name,
                type: 'folder',
                parentId: currentFolderId,
                modifiedAt: new Date().toLocaleDateString('pt-BR')
            };
            setFileSystem([newFolder, ...fileSystem]);
        }
    };

    // --- CRM FUNCTIONS ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        setDraggedLeadId(leadId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        const leadId = e.dataTransfer.getData('leadId');
        setDraggedLeadId(null);
        if (!leadId) return;
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    };

    // --- RENDERERS ---

    const renderFilePreview = () => {
        if (!previewFile) return null;
        return (
            <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-white/20">
                    <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
                        <div className="flex items-center gap-3">
                            {getFileIcon(previewFile.type)}
                            <div>
                                <h3 className="font-bold text-slate-800">{previewFile.name}</h3>
                                <p className="text-xs text-slate-500">{previewFile.size} • {previewFile.modifiedAt}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-trust-blue text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-trust-light transition-colors">
                                <Download size={16} /> Baixar
                            </button>
                            <button 
                                onClick={() => setPreviewFile(null)}
                                className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-8">
                        <div className="bg-white shadow-premium w-full max-w-3xl min-h-[80%] rounded-2xl flex flex-col items-center justify-center text-slate-300 relative">
                             {/* Simulated Content */}
                             {previewFile.type === 'image' || previewFile.type === 'video' ? (
                                <div className="flex flex-col items-center gap-4">
                                    <FileImage size={80} className="text-slate-200" />
                                    <p>Pré-visualização de Mídia</p>
                                </div>
                            ) : (
                                <div className="w-full h-full p-12 space-y-6">
                                    <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-4">
                                         <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                                         <div className="space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-48"></div>
                                            <div className="h-3 bg-slate-100 rounded w-32"></div>
                                         </div>
                                    </div>
                                    {[1,2,3,4,5,6].map(i => (
                                        <div key={i} className="h-3 bg-slate-100 rounded w-full opacity-60"></div>
                                    ))}
                                    <div className="h-40 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-xs text-slate-400">
                                        [Conteúdo do Documento Encriptado]
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFiles = () => {
        const currentFiles = fileSystem.filter(f => f.parentId === currentFolderId);
        const starredFiles = fileSystem.filter(f => f.starred);
        
        return (
            <div className="h-full flex flex-col animate-fade-in pb-20">
                {/* Drive Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                     <div>
                        <h2 className="text-2xl font-serif font-bold text-trust-blue flex items-center gap-2">
                            <Cloud size={24} className="text-trust-blue" />
                            Drive Corporativo
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                             Conectado: Private_Vault_v2.4
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none md:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar documentos..." 
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-trust-blue/10" 
                            />
                        </div>
                        <label className="cursor-pointer bg-trust-blue text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-trust-light transition-all flex items-center gap-2 shadow-lg shadow-trust-blue/20 whitespace-nowrap">
                            <UploadCloud size={18} />
                            <span className="hidden sm:inline">Upload</span>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                {/* Quick Access Section (Only at root) */}
                {currentFolderId === 'root' && starredFiles.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Acesso Rápido</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {starredFiles.map(file => (
                                <div key={file.id} onClick={() => handleFileClick(file)} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md cursor-pointer flex items-center gap-3 transition-all">
                                    {getFileIcon(file.type)}
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-400">Editado {file.modifiedAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toolbar & Breadcrumbs */}
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100 mb-6">
                    <div className="flex items-center gap-1 px-2 overflow-x-auto no-scrollbar">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.id} className="flex items-center whitespace-nowrap">
                                {index > 0 && <ChevronRight size={16} className="text-slate-400 mx-1" />}
                                <button 
                                    onClick={() => handleBreadcrumbClick(crumb.id, index)}
                                    className={`text-sm font-medium px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors ${index === breadcrumbs.length - 1 ? 'text-trust-blue font-bold bg-blue-50' : 'text-slate-500'}`}
                                >
                                    {crumb.name}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-2">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-trust-blue' : 'text-slate-400'}`}>
                            <Grid size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-trust-blue' : 'text-slate-400'}`}>
                            <List size={18} />
                        </button>
                        <button onClick={handleSyncDrive} className="p-2 text-slate-400 hover:text-trust-blue hover:bg-slate-50 rounded-lg transition-all" title="Sincronizar">
                            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                        </button>
                        <button onClick={createFolder} className="p-2 text-slate-400 hover:text-trust-blue hover:bg-slate-50 rounded-lg transition-all" title="Nova Pasta">
                            <FolderPlus size={18} />
                        </button>
                    </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-lg animate-fade-in">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                            <span className="flex items-center gap-2"><UploadCloud size={14} className="animate-bounce"/> Enviando arquivo para nuvem segura...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-trust-blue h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Files View */}
                {currentFiles.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl m-1 min-h-[300px]">
                        <Folder size={64} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">Pasta vazia</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {currentFiles.map(file => (
                            <div 
                                key={file.id}
                                onDoubleClick={() => handleFileClick(file)}
                                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-trust-blue/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <button onClick={(e) => {e.stopPropagation(); setPreviewFile(file)}} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                                        <Eye size={16} />
                                    </button>
                                </div>
                                <h4 className="text-sm font-bold text-slate-700 truncate w-full mb-1 group-hover:text-trust-blue transition-colors" title={file.name}>{file.name}</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{file.modifiedAt}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left w-12"></th>
                                    <th className="px-6 py-4 text-left">Nome</th>
                                    <th className="px-6 py-4 text-left">Modificado</th>
                                    <th className="px-6 py-4 text-right">Tamanho</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentFiles.map(file => (
                                    <tr 
                                        key={file.id} 
                                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                        onDoubleClick={() => handleFileClick(file)}
                                    >
                                        <td className="px-6 py-4 w-12">
                                            <div className="transform scale-75">{getFileIcon(file.type)}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 group-hover:text-trust-blue">{file.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{file.modifiedAt}</td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-400 font-mono">{file.size || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in pb-24">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-trust-blue">Comando Central</h2>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                         <Activity size={14} className="text-emerald-500" />
                         Sistema Operacional • <span className="text-emerald-600 font-bold">Online</span>
                    </p>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={() => setIsScanning(true)}
                        className="bg-white text-trust-blue px-4 py-3 rounded-xl text-xs font-bold border border-slate-200 hover:border-trust-blue hover:shadow-md transition-all flex items-center gap-2"
                     >
                        {isScanning ? <RefreshCw className="animate-spin" size={16}/> : <BrainCircuit size={16}/>}
                        Scan Patrimonial IA
                     </button>
                     <button 
                        onClick={() => setActiveTab('crm')}
                        className="bg-trust-blue text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-trust-light transition-all shadow-lg shadow-trust-blue/20 flex items-center gap-2"
                     >
                        <Plus size={16} /> Novo Negócio
                    </button>
                </div>
            </div>

            {/* SCALPE SYSTEM: MARKET INTELLIGENCE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Market Pulse Tickers with Charts */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                            <Zap className="text-warm-gold fill-warm-gold" size={20} />
                            <h3 className="font-serif font-bold text-trust-blue">Scalpe: Inteligência de Mercado</h3>
                         </div>
                         <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">DELAY 15min</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {marketData.map((data) => (
                            <div key={data.id} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{data.pair}</p>
                                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                        (data.up && !data.good) || (!data.up && data.good) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {data.up ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                                        {data.change}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-mono font-bold text-slate-800 tracking-tight">{data.val}</p>
                                    <div className="w-20 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <Sparkline 
                                            data={data.chartData} 
                                            color={(data.up && !data.good) || (!data.up && data.good) ? '#10b981' : '#f43f5e'} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Economic Calendar & Sentiment */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Market Sentiment Widget */}
                    <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h4 className="font-bold text-sm mb-6 text-blue-200 flex items-center gap-2">
                            <Activity size={16} /> Termômetro de Mercado
                        </h4>
                        <div className="relative h-32 flex items-end justify-center mb-2">
                             <div className="absolute bottom-0 w-48 h-24 rounded-t-full border-[12px] border-slate-700 border-l-emerald-500 border-r-rose-500 border-t-transparent z-0"></div>
                             <div className="absolute bottom-0 w-48 h-24 rounded-t-full border-[12px] border-transparent border-t-slate-800/50 z-10"></div>
                             {/* Needle Simulation */}
                             <div className="w-1 h-24 bg-white origin-bottom transform -rotate-45 rounded-full shadow-lg z-20 mb-[-4px]"></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                            <span>Oportunidade</span>
                            <span>Cautela</span>
                        </div>
                        <div className="text-center mt-4">
                            <span className="text-emerald-400 font-bold text-lg">Modo Comprador</span>
                            <p className="text-[10px] text-slate-400">Alta demanda por Consórcio</p>
                        </div>
                    </div>

                    {/* Economic Calendar */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                        <h4 className="font-bold text-trust-blue text-sm mb-4 flex items-center gap-2">
                            <Calendar size={16} /> Agenda Econômica
                        </h4>
                        <div className="space-y-4">
                            {ECONOMIC_EVENTS.map((evt) => (
                                <div key={evt.id} className="flex items-center gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-lg min-w-[50px]">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">{evt.date}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 leading-tight">{evt.event}</p>
                                        <span className={`text-[9px] px-1.5 rounded uppercase font-bold mt-1 inline-block ${
                                            evt.impact === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                        }`}>Impacto {evt.impact === 'High' ? 'Alto' : 'Médio'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. News Feed */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif font-bold text-trust-blue flex items-center gap-2">
                            <Newspaper size={18} /> Notícias Relevantes
                        </h3>
                        <div className="flex gap-2">
                            <button className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded hover:bg-trust-blue hover:text-white transition-colors">MACRO</button>
                            <button className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded hover:border-trust-blue transition-colors">SEGUROS</button>
                        </div>
                    </div>
                    <div className="space-y-1 flex-1">
                        {MOCK_NEWS.map(news => (
                            <div key={news.id} className="group p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer flex gap-4 items-start">
                                <div className={`w-1 h-10 rounded-full mt-1 ${
                                    news.sentiment === 'positive' ? 'bg-emerald-400' : news.sentiment === 'negative' ? 'bg-red-400' : 'bg-slate-300'
                                }`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                            news.tag === 'Alta' ? 'bg-emerald-50 text-emerald-600' :
                                            news.tag === 'Baixa' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {news.tag}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {news.time}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-trust-blue transition-colors">{news.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Fonte: {news.source}</p>
                                </div>
                                <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Leads Pipeline Snapshot */}
             <div className="bg-white rounded-[32px] shadow-premium border border-slate-100 overflow-hidden mt-8">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-trust-blue"><Users size={20}/></div>
                        <h3 className="font-serif font-bold text-trust-blue text-xl">Oportunidades em Aberto</h3>
                    </div>
                    <button onClick={() => setActiveTab('crm')} className="text-xs font-bold text-trust-blue hover:underline flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        Ver Pipeline Completo <ArrowRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-4 text-left">Cliente</th>
                                <th className="px-8 py-4 text-left">Produto</th>
                                <th className="px-8 py-4 text-left">Status</th>
                                <th className="px-8 py-4 text-right">Valor Estimado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leads.slice(0,5).map((lead) => (
                                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-700 text-sm">{lead.name}</div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10}/> {lead.date}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] font-bold text-trust-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{lead.product}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${lead.status === 'Novo' ? 'bg-blue-500 animate-pulse' : lead.status === 'Fechado' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{lead.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-mono text-sm text-slate-500 group-hover:text-trust-blue font-medium">
                                        {lead.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCRM = () => (
        <div className="h-full flex flex-col animate-fade-in pb-4">
             <div className="flex justify-between items-center mb-8 px-2">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-trust-blue">Pipeline de Negócios</h2>
                    <p className="text-sm text-slate-500 mt-1">Gestão visual de oportunidades.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Filter size={14} /> Filtrar
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Settings size={14} /> Configurar
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex h-full gap-6 min-w-[1200px] px-2">
                    {['Novo', 'Em Análise', 'Cotação', 'Fechado'].map((status) => (
                        <div 
                            key={status} 
                            onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status); }}
                            onDrop={(e) => handleDrop(e, status)}
                            className={`flex-1 flex flex-col rounded-[32px] border transition-all duration-300 ${
                                dragOverColumn === status ? 'bg-blue-50 border-trust-blue/30 ring-2 ring-trust-blue/10' : 'bg-slate-50/50 border-transparent'
                            }`}
                        >
                            <div className="p-6 flex justify-between items-center sticky top-0 bg-inherit rounded-t-[32px] z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${status === 'Novo' ? 'bg-blue-500' : status === 'Fechado' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    <span className="font-bold text-trust-blue text-sm uppercase tracking-widest">{status}</span>
                                </div>
                                <span className="bg-white px-2.5 py-0.5 rounded-lg text-slate-400 text-xs font-bold shadow-sm border border-slate-100">
                                    {leads.filter(l => l.status === status).length}
                                </span>
                            </div>
                            <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto custom-scrollbar">
                                {leads.filter(l => l.status === status).map(lead => (
                                    <div 
                                        key={lead.id} 
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, lead.id)}
                                        className={`bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden ${draggedLeadId === lead.id ? 'opacity-50' : ''}`}
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-trust-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-wider">{lead.product}</span>
                                            <button className="text-slate-300 hover:text-trust-blue transition-colors"><MoreVertical size={14}/></button>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
                                        <p className="text-xs text-slate-400 mb-4 truncate">{lead.email || "Sem contato"}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <span className="font-mono text-xs font-bold text-trust-blue bg-blue-50 px-2 py-1 rounded">{lead.value}</span>
                                            <span className="text-[10px] text-slate-400">{lead.date}</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-bold hover:border-trust-blue hover:text-trust-blue transition-colors flex items-center justify-center gap-2">
                                    <Plus size={14} /> Adicionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden relative font-inter text-slate-800">
            {/* Modal Preview */}
            {previewFile && renderFilePreview()}

            {/* Mobile Menu Toggle */}
             {!isDesktop && (
                <button onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 z-30 p-3 bg-trust-blue text-white rounded-xl shadow-xl">
                    <Menu size={24} />
                </button>
            )}
             {!isDesktop && isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0B1727] text-white shadow-2xl transition-transform duration-500 w-[280px] ${isDesktop ? 'relative translate-x-0' : ''} ${!isDesktop && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                
                <div className="h-28 flex items-center pl-8 relative z-10">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="w-10 h-10 bg-gradient-to-br from-trust-blue to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg border border-white/10">
                            <Shield size={20} fill="white" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-wide">Conseg<span className="text-warm-gold">.</span></span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
                        { id: 'crm', label: 'Pipeline CRM', icon: Users },
                        { id: 'clients', label: 'Drive Corporativo', icon: HardDrive },
                        { id: 'finance', label: 'Financeiro', icon: DollarSign }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as Tab); if(!isDesktop) setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                activeTab === item.id 
                                ? 'bg-white text-trust-blue shadow-xl font-bold transform scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-trust-blue' : 'text-slate-500 group-hover:text-white transition-colors'} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                            {item.id === 'crm' && leads.some(l => l.status === 'Novo') && (
                                <span className="w-2 h-2 bg-red-500 rounded-full ml-auto animate-pulse"></span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-6 relative z-10">
                    <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warm-gold to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/10">
                                {userRole === 'admin' ? 'AD' : 'BR'}
                             </div>
                             <div className="overflow-hidden">
                                 <p className="text-sm font-bold text-white truncate">Área do Corretor</p>
                                 <p className="text-[10px] text-emerald-400 truncate flex items-center gap-1 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE</p>
                             </div>
                        </div>
                    </div>

                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-200 transition-all border border-transparent hover:border-red-500/20 group text-xs font-bold uppercase tracking-widest">
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full w-full overflow-hidden relative bg-[#F8FAFC]">
                 {!isDesktop && <div className="h-16 flex-shrink-0"></div>}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth relative z-10">
                    <div className="max-w-[1600px] mx-auto h-full">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'crm' && renderCRM()}
                        {activeTab === 'clients' && renderFiles()}
                        {activeTab === 'finance' && <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center"><DollarSign size={40}/></div>
                            <p className="font-mono text-sm">Módulo Financeiro em desenvolvimento...</p>
                        </div>}
                    </div>
                </div>
            </main>
        </div>
    );
}
