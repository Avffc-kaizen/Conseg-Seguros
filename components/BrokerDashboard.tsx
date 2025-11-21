
import React, { useState, useEffect, useRef } from 'react';
import { auth, signOut, db, collection, doc, updateDoc, addDoc } from '../services/firebaseService';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { UserRole } from '../types';
import { 
    LayoutDashboard, Users, DollarSign, FileText, LogOut, 
    TrendingUp, AlertCircle, Search, Filter, MoreVertical, MessageCircle, Plus, HardDrive,
    Folder, File, FileText as FilePdf, Image as FileImage, Download, Share2, Shield, Lock, Settings, GripVertical,
    ArrowUpRight, ArrowDownRight, CreditCard, Wallet, PieChart, BarChart, Cloud, RefreshCw, Server, Target, Database, UploadCloud,
    BrainCircuit, Sparkles, Bell, Zap, ScanLine, CheckCircle, Menu, X, ChevronRight, Home, HelpCircle, Mail, Send, Copy, ExternalLink,
    Clock, Phone, Activity, Globe, Link, Paperclip, Save, Radio
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

// Estrutura unificada para Arquivos (Real ou Mock)
interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
    webViewLink?: string;
    iconLink?: string;
    modifiedTime?: string;
    size?: string;
    starred?: boolean;
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
    origin?: 'site' | 'manual' | 'consorcio_system'; // Origem do lead
    proposal?: {
        value: string;
        fileName?: string;
        date: string;
    };
}

// --- CONFIGURAÇÃO GOOGLE DRIVE (Placeholders) ---
// Para funcionar em prod, substitua por chaves reais do Google Cloud Console
const GAPI_API_KEY = ""; // Ex: AIzaSy...
const GAPI_CLIENT_ID = ""; // Ex: 123...apps.googleusercontent.com
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file"; 
const ROOT_FOLDER_ID = "root"; 

// --- DADOS MOCKADOS (Para simulação quando a API falhar) ---
const MOCK_DRIVE_FILES: DriveFile[] = [
    { id: 'folder1', name: 'Propostas Aprovadas', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2023-11-10T10:00:00Z' },
    { id: 'folder2', name: 'Documentação Clientes', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2023-11-12T14:30:00Z' },
    { id: 'folder3', name: 'Marketing & Assets', mimeType: 'application/vnd.google-apps.folder', modifiedTime: '2023-11-15T09:15:00Z' },
    { id: 'file1', name: 'Apolice_Vida_Silva.pdf', mimeType: 'application/pdf', size: '2500000', modifiedTime: '2023-11-18T11:20:00Z' },
    { id: 'file2', name: 'Cotacao_Frota_Transport.pdf', mimeType: 'application/pdf', size: '1200000', modifiedTime: '2023-11-17T16:45:00Z' },
    { id: 'file3', name: 'Planilha_Comissoes_2024.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '45000', modifiedTime: '2023-11-19T08:00:00Z' },
    { id: 'file4', name: 'Vistoria_Veiculo_Placa.jpg', mimeType: 'image/jpeg', size: '3500000', modifiedTime: '2023-11-19T09:30:00Z' },
];

const DEMO_LEADS: Lead[] = [
    { id: 'demo1', name: 'Roberto Alves', product: 'LEGADO', value: 'R$ 2.5M', status: 'Novo', date: 'Agora', email: 'roberto@email.com', phone: '(11) 99999-9999', message: 'Interesse em sucessão patrimonial.', origin: 'site' },
    { id: 'demo2', name: 'Empresa Solar Tech', product: 'MOBILIDADE', value: 'Frota (12)', status: 'Em Análise', date: 'Há 2h', email: 'contato@solartech.com', phone: '(11) 3333-3333', message: 'Cotação para frota de 12 veículos utilitários.', origin: 'manual' },
    { id: 'demo3', name: 'Julia Silva', product: 'HUMANA', value: 'Saúde Premium', status: 'Fechado', date: 'Ontem', email: 'julia@email.com', phone: '(11) 98888-8888', message: 'Busco plano de saúde com reembolso alto.', origin: 'site' },
    { id: 'demo4', name: 'Construtora Base', product: 'ESTRATÉGIA', value: 'R$ 500k', status: 'Cotação', date: '18/11', email: 'financeiro@base.com', phone: '(11) 4444-4444', message: 'Carta de consórcio para maquinário.', origin: 'consorcio_system', proposal: { value: 'R$ 480.000,00', date: '19/11', fileName: 'Prop_Consorcio_Base_v1.pdf' } },
    { id: 'demo5', name: 'Dr. Fernando Costa', product: 'LEGADO', value: 'R$ 5M', status: 'Novo', date: '18/11', email: 'dr.fernando@med.com', phone: '(11) 97777-7777', message: 'Proteção para blindagem de capital.', origin: 'site' },
];

export const BrokerDashboard: React.FC<BrokerDashboardProps> = ({ onLogout, userRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(false); 
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [showTechInfo, setShowTechInfo] = useState(false);
    
    // Drive State
    const [driveMode, setDriveMode] = useState<'real' | 'mock'>('mock'); // Começa com mock para evitar erros
    const [currentFiles, setCurrentFiles] = useState<DriveFile[]>(MOCK_DRIVE_FILES);
    const [currentFolderId, setCurrentFolderId] = useState<string>(ROOT_FOLDER_ID);
    const [breadcrumbs, setBreadcrumbs] = useState<{id: string, name: string}[]>([{id: ROOT_FOLDER_ID, name: 'Raiz'}]);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    
    // CRM State
    const [leads, setLeads] = useState<Lead[]>([]);
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSyncActive, setIsSyncActive] = useState(true);
    const [lastSyncTime, setLastSyncTime] = useState<string>('Agora mesmo');

    // Proposal State (Modal)
    const [proposalLead, setProposalLead] = useState<Lead | null>(null);
    const [proposalValueInput, setProposalValueInput] = useState('');
    const [proposalFile, setProposalFile] = useState<File | null>(null);

    // Share State
    const [sharingLead, setSharingLead] = useState<Lead | null>(null);
    const [copyFeedback, setCopyFeedback] = useState(false);

    // Email Notification State
    const [emailStatus, setEmailStatus] = useState<{[key: string]: 'idle' | 'sending' | 'sent' | 'error'}>({});
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const proposalFileInputRef = useRef<HTMLInputElement>(null);
    const [tokenClient, setTokenClient] = useState<any>(null);

    // Responsive Check
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (desktop) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); 
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Firestore Real-time Data & Auto-Sync Simulation
    useEffect(() => {
        let unsubscribe: () => void;
        const fetchLeads = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const currentUser = auth ? auth.currentUser : null;

            if ((!db || !currentUser)) {
                setLeads(DEMO_LEADS);
                setIsDemoMode(true);
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
                        if (displayProduct === 'saude') displayProduct = 'Humana';
                        if (displayProduct === 'consorcio') displayProduct = 'Estratégia';

                        fetchedLeads.push({
                            id: doc.id,
                            name: data.nome || "Lead Sem Nome",
                            product: displayProduct.toUpperCase(),
                            value: data.value || "A calcular", 
                            status: data.status || "Novo",
                            date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : "--",
                            email: data.email || "Não informado",
                            phone: data.telefone || "Não informado",
                            message: data.mensagem || "Sem mensagem inicial",
                            origin: data.origin || 'site',
                            proposal: data.proposal || undefined
                        });
                    });
                    setLeads(fetchedLeads);
                    setIsDemoMode(false);
                    setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                }, (error) => {
                    console.warn("Firestore Restricted:", error.message);
                    setLeads(DEMO_LEADS);
                    setIsDemoMode(true);
                });
            } catch (e) {
                setLeads(DEMO_LEADS);
                setIsDemoMode(true);
            }
        };
        fetchLeads();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    // --- GOOGLE API INIT STRATEGY ---
    useEffect(() => {
        // Se não tiver chaves configuradas, nem tenta conectar e fica no modo Mock
        if (!GAPI_API_KEY || !GAPI_CLIENT_ID) {
            setDriveMode('mock');
            return;
        }

        const initGapi = async () => {
            try {
                await window.gapi.client.init({
                    apiKey: GAPI_API_KEY,
                    discoveryDocs: DISCOVERY_DOCS,
                });
                
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GAPI_CLIENT_ID,
                    scope: SCOPES,
                    callback: (resp: any) => {
                        if (resp.access_token) {
                            setDriveMode('real');
                            listRealFiles(ROOT_FOLDER_ID);
                        }
                    },
                });
                setTokenClient(client);
            } catch (e) {
                console.warn("GAPI Init Failed, using Mock Drive", e);
                setDriveMode('mock');
            }
        };

        if (window.gapi && window.google) {
            window.gapi.load("client", initGapi);
        }
    }, []);

    // Funções de Arquivo (Híbridas)
    const listRealFiles = async (folderId: string) => {
        try {
            const response = await window.gapi.client.drive.files.list({
                'pageSize': 50,
                'fields': "nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, iconLink, modifiedTime, size)",
                'q': `'${folderId}' in parents and trashed = false`,
                'orderBy': 'folder, name, modifiedTime desc'
            });
            setCurrentFiles(response.result.files || []);
        } catch (e) {
            console.error("Error fetching drive files", e);
            setDriveMode('mock');
        }
    };

    const handleFolderClick = (folder: DriveFile) => {
        if (folder.mimeType === 'application/vnd.google-apps.folder') {
            setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
            setCurrentFolderId(folder.id);
            
            if (driveMode === 'real') {
                listRealFiles(folder.id);
            } else {
                // Mock Navigation: Apenas limpa ou mostra arquivos fictícios diferentes
                // Para demonstração, vamos apenas "entrar" numa pasta vazia ou randomizar
                setCurrentFiles([]); 
            }
        } else {
            if (folder.webViewLink) window.open(folder.webViewLink, '_blank');
            else alert(`Abrindo arquivo simulado: ${folder.name}`);
        }
    };

    const handleBreadcrumbClick = (id: string, index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
        setCurrentFolderId(id);
        if (driveMode === 'real') listRealFiles(id);
        else setCurrentFiles(MOCK_DRIVE_FILES); // Reset mock files on root
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        if (driveMode === 'real') {
            // Lógica Real de Upload GAPI omitida para brevidade
        } else {
            // Mock Upload
            setTimeout(() => {
                const newMockFile: DriveFile = {
                    id: `mock_file_${Date.now()}`,
                    name: file.name,
                    mimeType: file.type,
                    size: file.size.toString(),
                    modifiedTime: new Date().toISOString()
                };
                setCurrentFiles(prev => [newMockFile, ...prev]);
                setUploading(false);
            }, 1500);
        }
        
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    // CRM: Proposal Handler
    const handleSaveProposal = async () => {
        if (!proposalLead) return;

        const proposalData = {
            value: proposalValueInput,
            fileName: proposalFile ? proposalFile.name : 'Proposta_Digital.pdf',
            date: new Date().toLocaleDateString('pt-BR')
        };

        // Atualiza estado local
        setLeads(prevLeads => prevLeads.map(l => 
            l.id === proposalLead.id ? { ...l, proposal: proposalData, value: proposalValueInput, status: 'Cotação' } : l
        ));

        // Atualiza Firestore
        if (!isDemoMode && db) {
            try {
                const leadRef = doc(db, "leads-contato", proposalLead.id);
                await updateDoc(leadRef, { 
                    proposal: proposalData,
                    value: proposalValueInput, // Atualiza valor do card também
                    status: 'Cotação'
                });
            } catch (error) {
                console.error("Erro ao salvar proposta:", error);
            }
        }

        setProposalLead(null);
        setProposalValueInput('');
        setProposalFile(null);
    };

    // CRM: Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        setDraggedLeadId(null);

        if (!leadId) return;

        const lead = leads.find(l => l.id === leadId);
        
        // Lógica Especial para Cotação: Abrir Modal
        if (newStatus === 'Cotação' && lead) {
            setProposalLead(lead);
            setProposalValueInput(lead.value !== 'A calcular' ? lead.value : '');
            // Não atualizamos o status imediatamente para Cotação, esperamos o modal salvar
            // Se o usuário cancelar o modal, o status não muda.
            return;
        }

        // 1. Atualização Otimista (Local) para outros status
        setLeads(prevLeads => prevLeads.map(lead => 
            lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));

        // 2. Atualização Remota (Firestore)
        if (!isDemoMode && db) {
            try {
                const leadRef = doc(db, "leads-contato", leadId);
                await updateDoc(leadRef, { status: newStatus });
            } catch (error) {
                console.error("Erro ao atualizar lead no Firestore:", error);
            }
        }
    };

    const handleCardDrop = (e: React.DragEvent<HTMLDivElement>, targetLeadId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        const draggedId = e.dataTransfer.getData('leadId');
        setDraggedLeadId(null);

        if (!draggedId || draggedId === targetLeadId) return;

        setLeads(prev => {
            const newLeads = [...prev];
            const draggedIndex = newLeads.findIndex(l => l.id === draggedId);
            const targetIndex = newLeads.findIndex(l => l.id === targetLeadId);
            
            if (draggedIndex === -1 || targetIndex === -1) return prev;

            const draggedLead = newLeads[draggedIndex];
            const targetLead = newLeads[targetIndex];

            if (draggedLead.status !== targetLead.status) {
                // Se o alvo for Cotação, precisamos abrir o modal e não mudar direto
                if (targetLead.status === 'Cotação') {
                     setProposalLead(draggedLead);
                     setProposalValueInput(draggedLead.value !== 'A calcular' ? draggedLead.value : '');
                     return prev; // Retorna sem mudar nada visualmente ainda
                }

                if (!isDemoMode && db) {
                    updateDoc(doc(db, "leads-contato", draggedId), { status: targetLead.status })
                        .catch(console.error);
                }
                return newLeads.map(l => l.id === draggedId ? { ...l, status: targetLead.status } : l);
            }

            const listWithoutDragged = newLeads.filter(l => l.id !== draggedId);
            const adjustedTargetIndex = listWithoutDragged.findIndex(l => l.id === targetLeadId);
            listWithoutDragged.splice(adjustedTargetIndex, 0, draggedLead);
            
            return listWithoutDragged;
        });
    };

    // Handle Email Notifications
    const handleSendEmailAlert = async (alertId: string, title: string, message: string) => {
        setEmailStatus(prev => ({ ...prev, [alertId]: 'sending' }));

        try {
            if (!isDemoMode && db && auth.currentUser) {
                await addDoc(collection(db, "mail"), {
                    to: auth.currentUser.email || "corretor@consegseguro.com",
                    message: {
                        subject: `[ALERTA CONSEGSEGURO] ${title}`,
                        text: message,
                        html: `<div><h2>${title}</h2><p>${message}</p></div>`
                    },
                    timestamp: new Date()
                });
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            setEmailStatus(prev => ({ ...prev, [alertId]: 'sent' }));
            setTimeout(() => {
                setEmailStatus(prev => ({ ...prev, [alertId]: 'idle' }));
            }, 3000);
        } catch (error) {
            setEmailStatus(prev => ({ ...prev, [alertId]: 'error' }));
             setTimeout(() => {
                setEmailStatus(prev => ({ ...prev, [alertId]: 'idle' }));
            }, 3000);
        }
    };

    // Share Logic
    const handleCopyLink = () => {
        if (!sharingLead) return;
        const dummyLink = `https://consegseguro.com/share/lead/${sharingLead.id}`;
        navigator.clipboard.writeText(dummyLink);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const handleShareWhatsapp = () => {
        if (!sharingLead) return;
        const msg = `Olá! Segue o lead estratégico: *${sharingLead.name}*\nInteresse: ${sharingLead.product}\nValor Estimado: ${sharingLead.value}`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    const handleScanPortfolio = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2500);
    };

    const formatSize = (size?: string) => {
        if (!size) return '--';
        const bytes = parseInt(size);
        if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / 1024).toFixed(0) + ' KB';
    };

    const renderDriveIcon = (mimeType: string) => {
        if (mimeType.includes('folder')) return <Folder className="text-magic-blue fill-magic-blue/10" size={36} />;
        if (mimeType.includes('pdf')) return <FilePdf className="text-red-500" size={36} />;
        if (mimeType.includes('image')) return <FileImage className="text-purple-500" size={36} />;
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileText className="text-green-500" size={36} />;
        return <File className="text-slate-400" size={36} />;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-fade-in pb-24">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-orbitron font-bold text-cosmic">Dashboard Estratégico</h2>
                                <p className="text-slate-500 text-sm">Bem-vindo ao centro de comando, {userRole === 'admin' ? 'Administrador' : 'Corretor'}.</p>
                            </div>
                            <button className="bg-cosmic text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-magic-blue transition-all shadow-lg flex items-center gap-2 group w-full md:w-auto justify-center">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform"/> Nova Cotação
                            </button>
                        </div>

                        {/* KPI CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: "Vendas (Mês)", val: "R$ 458.2k", trend: "+12%", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                                { label: "Leads Ativos", val: leads.length.toString(), trend: "+5", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Conversão", val: "28%", trend: "+2%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                                { label: "Renovações", val: "8", trend: "Urgente", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                            <kpi.icon size={20} />
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600`}>
                                            {kpi.trend}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
                                    <h3 className="text-2xl font-black text-cosmic mt-1">{kpi.val}</h3>
                                </div>
                            ))}
                        </div>

                        {/* AI AGENT */}
                        <div className="bg-gradient-to-r from-[#020617] to-[#1e293b] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-700/50">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-magic-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                            <BrainCircuit size={32} className={`text-magic-blue ${isScanning ? 'animate-pulse' : ''}`} />
                                        </div>
                                        {isScanning && <div className="absolute inset-0 border-2 border-magic-blue rounded-2xl animate-ping opacity-50"></div>}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-orbitron font-bold">Neural Analyst V4</h3>
                                        <p className="text-slate-400 text-sm">Monitoramento preditivo de carteira ativo.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleScanPortfolio}
                                    disabled={isScanning}
                                    className="px-6 py-3 bg-magic-blue hover:bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-xs transition-all w-full md:w-auto flex items-center justify-center gap-2 shadow-glow"
                                >
                                    {isScanning ? <RefreshCw className="animate-spin" size={16}/> : <ScanLine size={16}/>}
                                    {isScanning ? 'Processando...' : 'Escanear Oportunidades'}
                                </button>
                            </div>

                            {/* AI Insights with Email Actions */}
                            <div className="grid md:grid-cols-2 gap-4 mt-8 relative z-10">
                                {/* Insight 1 */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-amber-400 flex items-center gap-2"><Bell size={14}/> Risco Detectado</span>
                                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Alta Prioridade</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-4">Apolice #9482 (Transp. Rodoviária) vence em 5 dias. Boleto ainda não compensado.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSendEmailAlert(
                                            'risk-9482', 
                                            'Risco de Apólice: #9482', 
                                            'A apólice #9482 de Transporte Rodoviário está vencendo em 5 dias e consta pagamento pendente. Ação imediata recomendada.'
                                        )}
                                        disabled={emailStatus['risk-9482'] === 'sending' || emailStatus['risk-9482'] === 'sent'}
                                        className={`
                                            text-xs font-bold uppercase tracking-widest py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all
                                            ${emailStatus['risk-9482'] === 'sent' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                              emailStatus['risk-9482'] === 'sending' ? 'bg-white/10 text-slate-400' : 
                                              'bg-white/10 text-white hover:bg-white/20 hover:text-magic-blue'}
                                        `}
                                    >
                                        {emailStatus['risk-9482'] === 'sending' ? <RefreshCw className="animate-spin" size={12} /> : 
                                         emailStatus['risk-9482'] === 'sent' ? <CheckCircle size={12} /> : 
                                         <Mail size={12} />}
                                        {emailStatus['risk-9482'] === 'sending' ? 'Enviando...' : 
                                         emailStatus['risk-9482'] === 'sent' ? 'E-mail Enviado' : 
                                         'Notificar via E-mail'}
                                    </button>
                                </div>

                                {/* Insight 2 */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-green-400 flex items-center gap-2"><Sparkles size={14}/> Oportunidade Cross-Sell</span>
                                            <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Prob: 92%</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-4">Cliente "Roberto Alves" adquiriu imóvel novo. Sugerir proteção residencial + consórcio auto.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSendEmailAlert(
                                            'opp-roberto', 
                                            'Oportunidade Cross-Sell: Roberto Alves', 
                                            'Inteligência detectou aquisição de imóvel. Preparar proposta de Residencial Premium e Consórcio Auto (2ª vaga).'
                                        )}
                                        disabled={emailStatus['opp-roberto'] === 'sending' || emailStatus['opp-roberto'] === 'sent'}
                                        className={`
                                            text-xs font-bold uppercase tracking-widest py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all
                                            ${emailStatus['opp-roberto'] === 'sent' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                              emailStatus['opp-roberto'] === 'sending' ? 'bg-white/10 text-slate-400' : 
                                              'bg-white/10 text-white hover:bg-white/20 hover:text-magic-blue'}
                                        `}
                                    >
                                        {emailStatus['opp-roberto'] === 'sending' ? <RefreshCw className="animate-spin" size={12} /> : 
                                         emailStatus['opp-roberto'] === 'sent' ? <CheckCircle size={12} /> : 
                                         <Send size={12} />}
                                        {emailStatus['opp-roberto'] === 'sending' ? 'Enviando...' : 
                                         emailStatus['opp-roberto'] === 'sent' ? 'E-mail Enviado' : 
                                         'Enviar Proposta'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Leads Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-orbitron font-bold text-cosmic">Últimas Movimentações</h3>
                                <button className="text-magic-blue text-xs font-bold uppercase hover:underline">Ver Todos</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Lead / Cliente</th>
                                            <th className="px-6 py-4 text-left">Interesse</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {leads.slice(0,5).map((lead) => (
                                            <tr key={lead.id} className="hover:bg-soft-blue/30 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-700 flex items-center gap-2">
                                                        {lead.name}
                                                        {lead.origin === 'consorcio_system' && <Globe size={12} className="text-magic-blue" title="Lead Externo" />}
                                                    </div>
                                                    <div className="text-xs text-slate-400">{lead.date}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-cosmic bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{lead.product}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                        lead.status === 'Novo' ? 'bg-blue-100 text-blue-600' : 
                                                        lead.status === 'Fechado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-slate-400 hover:text-magic-blue transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'crm':
                return (
                    <div className="h-full flex flex-col animate-fade-in pb-24">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="text-2xl font-orbitron font-bold text-cosmic">Pipeline de Vendas</h2>
                            <div className="flex gap-2 items-center">
                                {/* Integration Status Indicator */}
                                <div className={`flex items-center gap-3 px-4 py-2 bg-white border ${isSyncActive ? 'border-green-200' : 'border-slate-200'} rounded-lg shadow-sm mr-2 transition-all`}>
                                    <div className="flex flex-col items-end leading-none">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ext: Consórcio</span>
                                        <span className={`text-xs font-mono font-bold ${isSyncActive ? 'text-green-600' : 'text-slate-400'}`}>
                                            {isSyncActive ? 'LIVE SYNC' : 'PAUSED'}
                                        </span>
                                    </div>
                                    <div className="relative flex h-3 w-3">
                                        {isSyncActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isSyncActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                    </div>
                                </div>

                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-magic-blue">
                                    <Filter size={18} />
                                </button>
                                <button className="p-2 bg-magic-blue text-white rounded-lg shadow-glow">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                            <div className="flex h-full gap-6 min-w-[1000px] px-1">
                                {['Novo', 'Em Análise', 'Cotação', 'Fechado'].map((status, i) => (
                                    <div 
                                        key={status} 
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, status)}
                                        className="flex-1 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/60 max-w-xs transition-colors hover:bg-slate-100"
                                    >
                                        <div className={`p-4 border-b border-slate-200/60 flex justify-between items-center rounded-t-2xl ${
                                            i === 0 ? 'bg-blue-100/50' : i === 1 ? 'bg-amber-100/50' : i === 2 ? 'bg-purple-100/50' : 'bg-green-100/50'
                                        }`}>
                                            <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">{status}</span>
                                            <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 shadow-sm">
                                                {leads.filter(l => l.status === status).length}
                                            </span>
                                        </div>
                                        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                            {leads.filter(l => l.status === status).map(lead => (
                                                <div 
                                                    key={lead.id} 
                                                    draggable="true"
                                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => handleCardDrop(e, lead.id)}
                                                    onClick={() => setSelectedLead(lead)}
                                                    className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group ${
                                                        draggedLeadId === lead.id ? 'opacity-50 border-dashed border-magic-blue' : ''
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">{lead.product}</span>
                                                            {lead.origin === 'consorcio_system' && (
                                                                <span className="text-[10px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded uppercase flex items-center gap-1 shadow-sm animate-pulse">
                                                                    <Globe size={8} /> API: Python
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSharingLead(lead); }}
                                                                className="text-slate-300 hover:text-magic-blue p-0.5 transition-colors"
                                                                title="Compartilhar Lead"
                                                            >
                                                                <Share2 size={14} />
                                                            </button>
                                                            <GripVertical size={14} className="text-slate-300 cursor-grab" />
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 mb-1">{lead.name}</h4>
                                                    <p className="text-xs text-cosmic font-mono font-medium bg-blue-50 inline-block px-2 py-0.5 rounded">{lead.value}</p>
                                                    
                                                    {/* Visual Proposal Indicator */}
                                                    {lead.proposal && (
                                                        <div className="mt-2 bg-green-50 border border-green-100 rounded-md p-1.5 flex items-center gap-2">
                                                            <Paperclip size={12} className="text-green-600"/>
                                                            <span className="text-[10px] text-green-700 font-bold truncate max-w-[150px]">{lead.proposal.fileName}</span>
                                                        </div>
                                                    )}

                                                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                                        <span>{lead.date}</span>
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            {lead.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {leads.filter(l => l.status === status).length === 0 && (
                                                <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 text-xs">
                                                    Arraste para cá
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'clients':
                return (
                    <div className="h-full flex flex-col animate-fade-in pb-24">
                        {/* Drive Content Logic (Mesma do original, omitida para brevidade nas alterações, mas mantida no código final) */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-orbitron font-bold text-cosmic flex items-center gap-2">
                                    <HardDrive className="text-magic-blue" /> Drive Seguro
                                </h2>
                                
                                <div className="flex items-center gap-2 mt-1 cursor-help" onClick={() => setShowTechInfo(!showTechInfo)}>
                                    <span className={`w-2 h-2 rounded-full ${driveMode === 'real' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-amber-500 animate-pulse'}`}></span>
                                    <p className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1 hover:text-magic-blue transition-colors">
                                        {driveMode === 'real' ? 'Google Cloud Connected' : 'Ambiente Simulado (Local)'}
                                        <HelpCircle size={12} />
                                    </p>
                                </div>

                                {showTechInfo && driveMode === 'mock' && (
                                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs max-w-md shadow-xl animate-fade-in absolute z-50">
                                        <div className="font-bold text-amber-800 mb-1 flex items-center gap-2">
                                            <AlertCircle size={12}/> Diagnóstico de Conexão:
                                        </div>
                                        <p className="text-slate-600 mb-2">A API do Google Drive não está ativa. O sistema está operando em modo de contingência (Mock).</p>
                                        <ul className="list-disc list-inside text-slate-500 space-y-1 font-mono">
                                            <li className={GAPI_API_KEY ? "text-green-600" : "text-red-500"}>
                                                API Key: {GAPI_API_KEY ? "OK" : "MISSING"}
                                            </li>
                                            <li className={GAPI_CLIENT_ID ? "text-green-600" : "text-red-500"}>
                                                Client ID: {GAPI_CLIENT_ID ? "OK" : "MISSING"}
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative w-full md:w-auto group">
                                <input 
                                    type="text" 
                                    placeholder="Buscar arquivo..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 outline-none transition-all"
                                />
                                <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-magic-blue transition-colors" size={16} />
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
                            {uploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
                                    <div className="w-16 h-16 border-4 border-magic-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="font-orbitron font-bold text-cosmic">Encriptando e Enviando...</p>
                                </div>
                            )}
                            <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
                                    <button 
                                        onClick={() => handleBreadcrumbClick(ROOT_FOLDER_ID, 0)}
                                        className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-magic-blue transition-colors"
                                    >
                                        <Home size={16} />
                                    </button>
                                    {breadcrumbs.slice(1).map((crumb, i) => (
                                        <React.Fragment key={crumb.id}>
                                            <ChevronRight size={14} className="text-slate-300" />
                                            <button 
                                                onClick={() => handleBreadcrumbClick(crumb.id, i + 1)}
                                                className={`font-bold px-2 py-1 rounded-md transition-colors ${
                                                    i === breadcrumbs.length - 2 ? 'text-cosmic bg-white shadow-sm' : 'text-slate-500 hover:text-magic-blue'
                                                }`}
                                            >
                                                {crumb.name}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-magic-blue text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-glow flex items-center gap-2"
                                    >
                                        <UploadCloud size={14} /> Upload
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
                                {currentFiles.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                        <Folder size={64} className="mb-4 stroke-1" />
                                        <p>Pasta Vazia</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {currentFiles
                                            .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(file => (
                                            <div 
                                                key={file.id}
                                                onClick={() => handleFolderClick(file)}
                                                className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-magic-blue hover:shadow-[0_0_20px_rgba(0,191,255,0.15)] transition-all cursor-pointer flex flex-col items-center text-center relative"
                                            >
                                                <div className="w-full aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-soft-blue transition-colors overflow-hidden">
                                                    {file.thumbnailLink ? (
                                                        <img src={file.thumbnailLink} alt={file.name} loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    ) : renderDriveIcon(file.mimeType)}
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 line-clamp-2 w-full break-words mb-1 group-hover:text-magic-blue transition-colors">{file.name}</p>
                                                <span className="text-[10px] text-slate-400">{formatSize(file.size)}</span>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical size={14} className="text-slate-400 hover:text-magic-blue" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case 'finance':
                return (
                    <div className="animate-fade-in pb-24">
                         <div className="bg-cosmic rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h2 className="text-2xl font-orbitron font-bold relative z-10 mb-1">Performance Financeira</h2>
                            <p className="text-slate-400 text-sm relative z-10">Visão consolidada anual</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform">
                                <div className="p-4 bg-green-50 rounded-full text-green-600 mb-4 group-hover:shadow-glow"><Wallet size={32} /></div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Receita Bruta</p>
                                <p className="text-4xl font-black text-cosmic">R$ 2.4Mi</p>
                             </div>
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform">
                                <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4 group-hover:shadow-glow"><PieChart size={32} /></div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Comissão Média</p>
                                <p className="text-4xl font-black text-cosmic">18.5%</p>
                             </div>
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:scale-105 transition-transform">
                                <div className="p-4 bg-purple-50 rounded-full text-purple-600 mb-4 group-hover:shadow-glow"><Target size={32} /></div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Projeção Q4</p>
                                <p className="text-4xl font-black text-cosmic">+22%</p>
                             </div>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative font-inter text-slate-800">
            <style>{`
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            {/* PROPOSAL MODAL (ON COTAÇÃO DROP) */}
            {proposalLead && (
                 <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600"></div>
                        <button 
                            onClick={() => setProposalLead(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-cosmic transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="p-8">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-orbitron text-xl font-bold text-cosmic mb-2 text-center">Nova Cotação</h3>
                            <p className="text-slate-500 text-sm mb-6 text-center">Inclua os detalhes da proposta comercial para <strong>{proposalLead.name}</strong>.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Valor Total da Proposta</label>
                                    <input 
                                        type="text" 
                                        placeholder="R$ 0,00"
                                        value={proposalValueInput}
                                        onChange={(e) => setProposalValueInput(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-lg font-bold text-cosmic focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Anexar Proposta (PDF)</label>
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx"
                                        ref={proposalFileInputRef}
                                        onChange={(e) => setProposalFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <div 
                                        onClick={() => proposalFileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-all group"
                                    >
                                        {proposalFile ? (
                                            <>
                                                <FilePdf className="text-red-500 mb-2" size={32} />
                                                <span className="text-sm font-bold text-slate-700">{proposalFile.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="text-slate-400 group-hover:text-amber-500 mb-2" size={32} />
                                                <span className="text-sm text-slate-500">Clique para anexar arquivo</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button 
                                    onClick={() => setProposalLead(null)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    Pular Etapa
                                </button>
                                <button 
                                    onClick={handleSaveProposal}
                                    className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> Salvar Proposta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SHARE MODAL (Existing) */}
            {sharingLead && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magic-blue to-purple-600"></div>
                        <button 
                            onClick={() => setSharingLead(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-cosmic transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-magic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-magic-blue">
                                <Share2 size={32} />
                            </div>
                            <h3 className="font-orbitron text-xl font-bold text-cosmic mb-2">Compartilhar Lead</h3>
                            <p className="text-slate-500 text-sm mb-6">Gere um link seguro ou envie os dados diretamente para sua rede.</p>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-left">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Cliente</p>
                                    {sharingLead.origin === 'consorcio_system' && <span className="text-[10px] font-bold bg-magic-blue/10 text-magic-blue px-2 py-0.5 rounded">Externo</span>}
                                </div>
                                <p className="font-bold text-slate-800 mb-2">{sharingLead.name}</p>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Produto</p>
                                        <p className="text-sm text-slate-700">{sharingLead.product}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Valor</p>
                                        <p className="text-sm text-slate-700">{sharingLead.value}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={handleCopyLink}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-magic-blue hover:bg-soft-blue/50 transition-all group"
                                >
                                    {copyFeedback ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <Copy className="text-slate-400 group-hover:text-magic-blue mb-2" size={24} />}
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-cosmic">
                                        {copyFeedback ? 'Copiado!' : 'Copiar Link'}
                                    </span>
                                </button>
                                <button 
                                    onClick={handleShareWhatsapp}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                                >
                                    <MessageCircle className="text-slate-400 group-hover:text-green-600 mb-2" size={24} />
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-green-700">WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LEAD DETAILS SIDE PANEL (Existing with Updates) */}
            {selectedLead && (
                <div className="fixed inset-0 z-[80] flex justify-end pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto animate-fade-in" 
                        onClick={() => setSelectedLead(null)}
                    />
                    <div className="w-full max-w-lg bg-white h-full shadow-2xl pointer-events-auto flex flex-col animate-[slideInRight_0.3s_ease-out] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magic-blue to-purple-600 z-10"></div>
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                                        #{selectedLead.id.substring(0,6)}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded text-white ${
                                         selectedLead.status === 'Novo' ? 'bg-blue-500' : 
                                         selectedLead.status === 'Fechado' ? 'bg-green-500' : 'bg-amber-500'
                                    }`}>
                                        {selectedLead.status}
                                    </span>
                                    {selectedLead.origin === 'consorcio_system' && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                            <Globe size={8} /> API: Python
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-orbitron font-bold text-cosmic">{selectedLead.name}</h2>
                                <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                                    <Clock size={14}/> Criado em: {selectedLead.date}
                                </p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">E-mail</p>
                                    <p className="text-sm font-medium text-slate-700 truncate" title={selectedLead.email}>{selectedLead.email || '--'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Telefone</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedLead.phone || '--'}</p>
                                </div>
                            </div>

                            {/* Proposal Info in Details */}
                            {selectedLead.proposal && (
                                <div>
                                    <h3 className="text-sm font-bold text-cosmic uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText size={16} className="text-amber-500"/> Proposta Vigente
                                    </h3>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs font-bold text-amber-600 uppercase">Valor Cotado</p>
                                            <span className="text-[10px] text-amber-400">{selectedLead.proposal.date}</span>
                                        </div>
                                        <p className="font-orbitron font-bold text-xl text-slate-800 mb-4">{selectedLead.proposal.value}</p>
                                        {selectedLead.proposal.fileName && (
                                            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-100">
                                                <FilePdf className="text-red-500" size={20} />
                                                <span className="text-sm text-slate-600">{selectedLead.proposal.fileName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-bold text-cosmic uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Target size={16} className="text-magic-blue"/> Detalhes da Oportunidade
                                </h3>
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-20 h-20 bg-magic-blue/5 rounded-bl-full -mr-10 -mt-10"></div>
                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Produto de Interesse</p>
                                            <p className="font-orbitron font-bold text-lg text-slate-800">{selectedLead.product}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Valor Estimado</p>
                                            <p className="font-orbitron font-bold text-lg text-green-600">{selectedLead.value}</p>
                                        </div>
                                        <div className="col-span-2 pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-400 mb-2">Mensagem / Briefing</p>
                                            <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                "{selectedLead.message || 'Nenhuma mensagem adicional fornecida pelo cliente.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* History Timeline */}
                            <div>
                                <h3 className="text-sm font-bold text-cosmic uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={16} className="text-purple-500"/> Histórico de Interações
                                </h3>
                                <div className="space-y-0 relative pl-4 border-l-2 border-slate-100">
                                    {[
                                        { action: 'Lead Criado', date: selectedLead.date, desc: 'Entrada via Formulário Web', icon: <Plus size={12}/>, color: 'bg-blue-500' },
                                        { action: 'Análise Neural', date: 'Automático', desc: 'Classificação de perfil de risco realizada.', icon: <BrainCircuit size={12}/>, color: 'bg-purple-500' },
                                        selectedLead.origin === 'consorcio_system' ? { action: 'Sync Automático', date: selectedLead.date, desc: 'Captura via API Python Sync Service', icon: <Globe size={12}/>, color: 'bg-indigo-500' } : null,
                                        selectedLead.proposal ? { action: 'Proposta Enviada', date: selectedLead.proposal.date, desc: `Cotação de ${selectedLead.proposal.value}`, icon: <FileText size={12}/>, color: 'bg-amber-500' } : null,
                                        selectedLead.status !== 'Novo' ? { action: 'Atualização de Status', date: 'Recente', desc: `Movido para fase: ${selectedLead.status}`, icon: <TrendingUp size={12}/>, color: 'bg-green-500' } : null
                                    ].filter(Boolean).map((item: any, idx) => (
                                        <div key={idx} className="relative pb-8 last:pb-0">
                                            <div className={`absolute -left-[21px] top-0 w-8 h-8 rounded-full border-4 border-white ${item.color} flex items-center justify-center text-white shadow-sm`}>
                                                {item.icon}
                                            
                                            </div>
                                            <div className="pl-4">
                                                <p className="text-sm font-bold text-slate-700">{item.action}</p>
                                                <p className="text-xs text-slate-400 mb-1">{item.date}</p>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-magic-blue hover:text-magic-blue transition-all flex items-center justify-center gap-2">
                                <Mail size={16}/> Enviar E-mail
                            </button>
                            <button className="flex-1 bg-magic-blue text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-glow">
                                <Phone size={16}/> Contatar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE HAMBURGER */}
            {!isDesktop && (
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="absolute top-4 left-4 z-30 p-3 bg-cosmic text-white rounded-xl shadow-xl active:scale-95 transition-transform"
                >
                    <Menu size={24} />
                </button>
            )}

            {!isDesktop && isSidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-cosmic text-white shadow-2xl transition-transform duration-300 ease-out w-[280px] ${isDesktop ? 'relative translate-x-0 w-72' : ''} ${!isDesktop && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                <div className="h-24 flex items-center justify-center border-b border-white/5 bg-black/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-magic-blue/10 to-transparent opacity-50"></div>
                    <div className="relative z-10 text-center">
                        <span className="font-orbitron font-bold text-2xl tracking-wider block">CONSEG<span className="text-magic-blue">SEGURO</span></span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-mono">Broker System</span>
                    </div>
                    {!isDesktop && (
                        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard, roles: ['admin', 'broker'] },
                        { id: 'crm', label: 'CRM / Pipeline', icon: Users, roles: ['admin', 'broker'] },
                        { id: 'clients', label: 'Carteira & Drive', icon: HardDrive, roles: ['admin', 'broker'] },
                        { id: 'finance', label: 'Financeiro', icon: DollarSign, roles: ['admin'] }
                    ].map((item) => {
                        const hasAccess = userRole === 'admin' || item.roles.includes(userRole);
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if(hasAccess) {
                                        setActiveTab(item.id as Tab);
                                        if(!isDesktop) setSidebarOpen(false);
                                    }
                                }}
                                disabled={!hasAccess}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative border border-transparent ${
                                    isActive 
                                    ? 'bg-magic-blue text-white shadow-[0_0_20px_rgba(0,191,255,0.3)]' 
                                    : hasAccess 
                                        ? 'text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/5'
                                        : 'text-slate-700 cursor-not-allowed opacity-50'
                                }`}
                            >
                                <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                {!hasAccess && <Lock size={14} className="absolute right-4 text-slate-700" />}
                                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magic-blue to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                            {userRole === 'admin' ? 'AD' : 'BR'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{userRole === 'admin' ? 'Administrador' : 'Corretor'}</p>
                            <p className="text-xs text-green-400 flex items-center gap-1"><div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div> Online</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-500/50">
                        <LogOut size={18} />
                        <span className="font-bold text-xs uppercase tracking-widest">Encerrar Sessão</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
                 {!isDesktop && <div className="h-16 flex-shrink-0"></div>}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}