import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { VideoPlayer } from './components/VideoPlayer';
import { Button } from './components/Button';
import { SectionWrapper } from './pages/SectionWrapper';
import { Login } from './components/Login';
import { BrokerDashboard } from './components/BrokerDashboard';
import { RouteName, UserRole } from './types';
import { Shield, TrendingUp, Lock, Zap, ArrowRight, Mail, Heart, Crown, BarChart3, Target, ShieldCheck, Database, Network, BrainCircuit, Layers, Fingerprint, RefreshCw, MessageCircle, ExternalLink, ChevronRight, Terminal, Cpu, CheckCircle, Wallet, Activity } from 'lucide-react';
import { auth, onAuthStateChanged } from './services/firebaseService';

const NeuralDiagnostic = ({ onComplete }: { onComplete?: (system: string) => void }) => {
    const [input, setInput] = useState('');
    const [stage, setStage] = useState<'idle' | 'analyzing' | 'result'>('idle');
    const [suggestion, setSuggestion] = useState<{ name: string, id: string, reason: string, active: boolean } | null>(null);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    const addLine = (text: string) => {
        setTerminalLines(prev => [...prev.slice(-6), text]);
    };

    const analyzeContext = () => {
        if (!input.trim()) return;
        setStage('analyzing');
        setTerminalLines([]);

        // Terminal simulation effect
        let step = 0;
        const steps = [
            "> INICIANDO PROTOCOLO DE ANÁLISE NEURAL...",
            "> CARREGANDO VETORES DE RISCO [##########] 100%",
            "> PROCESSANDO LINGUAGEM NATURAL (NLP)...",
            "> IDENTIFICANDO INTENÇÃO DE AQUISIÇÃO...",
            "> CRUZANDO DADOS COM MATRIZ ESTRATÉGICA...",
            "> DEFININDO ROTA DO USUÁRIO..."
        ];

        const interval = setInterval(() => {
            if (step < steps.length) {
                addLine(steps[step]);
                step++;
            }
        }, 600);

        // Deep AI processing simulation
        setTimeout(() => {
            clearInterval(interval);
            const text = input.toLowerCase();
            
            // Expanded Keyword Logic
            const keywords = {
                legado: ['filho', 'família', 'futuro', 'medo', 'falta', 'ausência', 'morte', 'inventário', 'herança', 'sucessão', 'esposa', 'marido', 'segurança', 'vida'],
                mobilidade: ['carro', 'batida', 'roubo', 'viagem', 'estrada', 'veículo', 'caminhão', 'frota', 'motorista', 'colisão', 'terceiros', 'seguro auto'],
                expansao: ['investir', 'dinheiro', 'comprar', 'casa', 'aumentar', 'patrimônio', 'lucro', 'renda', 'imóvel', 'aluguel', 'construir', 'empresa', 'consorcio', 'consórcio', 'aquisição', 'apartamento', 'terreno'],
                saude: ['saúde', 'hospital', 'doença', 'médico', 'cirurgia', 'internação', 'bem-estar', 'check-up', 'exame', 'família', 'convênio']
            };

            let scores = { legado: 0, mobilidade: 0, expansao: 0, saude: 0 };

            // Scoring System
            keywords.legado.forEach(w => { if(text.includes(w)) scores.legado++ });
            keywords.mobilidade.forEach(w => { if(text.includes(w)) scores.mobilidade++ });
            keywords.expansao.forEach(w => { if(text.includes(w)) scores.expansao++ });
            keywords.saude.forEach(w => { if(text.includes(w)) scores.saude++ });

            // Default logic
            let result = { 
                name: 'Análise de Expansão', 
                id: 'consorcio', 
                reason: 'Identificamos um potencial de alavancagem patrimonial. O sistema recomenda acesso imediato ao simulador de estratégia.',
                active: true
            };

            const maxScore = Math.max(scores.legado, scores.mobilidade, scores.expansao, scores.saude);

            if (maxScore > 0) {
                if (scores.expansao >= maxScore) {
                    result = { 
                        name: 'Estratégia de Aquisição', 
                        id: 'consorcio', 
                        reason: 'Intenção de crescimento patrimonial detectada. A Estratégia de Consórcio utiliza juro zero para aquisição planejada de ativos.',
                        active: true
                    };
                } else if (scores.legado === maxScore) {
                    result = { 
                        name: 'Protocolo Legado', 
                        id: 'vida', 
                        reason: 'Preocupação com sucessão e segurança familiar identificada. O Sistema Legado cria liquidez imediata e blinda a dinastia.',
                        active: true
                    };
                } else if (scores.mobilidade === maxScore) {
                    result = { 
                        name: 'Mandato de Mobilidade', 
                        id: 'auto', 
                        reason: 'Foco em ativos de transporte. Necessário blindagem contra paralisação e passivos civis.',
                        active: false
                    };
                } else if (scores.saude === maxScore) {
                    result = { 
                        name: 'Escudo Capital Humano', 
                        id: 'saude', 
                        reason: 'Prioridade biológica detectada. Conexão com a elite médica necessária.',
                        active: false
                    };
                }
            }

            setSuggestion(result);
            setStage('result');
            if(onComplete) onComplete(result.id);
        }, 4500);
    };

    const handleSystemAccess = () => {
        if (!suggestion) return;
        
        if (suggestion.id === 'consorcio') {
            window.open('https://consorcio.consegseguro.com/', '_blank');
        } else if (suggestion.id === 'vida') {
            window.open('https://protocolo-de-legado-455137106232.us-west1.run.app/', '_blank');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto font-mono shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-[#050505] relative">
            {/* Animated Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-blue to-transparent animate-[shimmer_2s_infinite]"></div>
            
            {/* Terminal Header */}
            <div className="bg-[#0a0a0a] p-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-xs text-slate-500 font-bold tracking-widest flex items-center gap-2">
                    <BrainCircuit size={12} /> CONSEG_NEURAL_CORE_V4.0
                </div>
            </div>

            <div className="p-6 md:p-10 min-h-[400px] flex flex-col justify-center relative z-10">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 opacity-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

                {stage === 'idle' && (
                    <div className="space-y-6 animate-fade-in relative z-10">
                        <div className="text-magic-blue mb-8 text-center">
                            <Terminal size={48} className="mx-auto mb-4 opacity-80" />
                            <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-2">Interface de Diagnóstico</h3>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Descreva seu objetivo atual. Nossa I.A. processará sua necessidade e conectará você ao sistema de blindagem ou aquisição correto.
                            </p>
                        </div>
                        
                        <div className="relative group max-w-2xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-magic-blue to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative">
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-[#080808] border border-slate-700 text-green-400 placeholder-slate-700 rounded-lg p-6 focus:border-magic-blue focus:ring-0 outline-none transition-all h-40 resize-none text-lg leading-relaxed shadow-inner font-mono"
                                    placeholder="// Ex: Preciso aumentar meu patrimônio com segurança... ou Preciso proteger minha família..."
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-slate-600 font-bold">
                                    {input.length} CHARS
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <button 
                                onClick={analyzeContext}
                                disabled={!input.trim()}
                                className="bg-white text-black hover:bg-magic-blue hover:text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <Cpu size={18} /> Processar Dados
                            </button>
                        </div>
                    </div>
                )}

                {stage === 'analyzing' && (
                    <div className="py-8 font-mono max-w-xl mx-auto w-full">
                        {terminalLines.map((line, i) => (
                            <div key={i} className="text-green-500 text-sm mb-2 pl-2 border-l-2 border-green-800 animate-fade-in">
                                {line}
                            </div>
                        ))}
                        <div className="mt-4 h-1 w-full bg-slate-800 rounded overflow-hidden">
                            <div className="h-full bg-green-500 animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                    </div>
                )}

                {stage === 'result' && suggestion && (
                    <div className="animate-fade-in text-center relative z-10 max-w-2xl mx-auto">
                        <div className="inline-block p-4 rounded-full bg-slate-900 border border-slate-700 mb-6 shadow-2xl">
                            {suggestion.active ? (
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            ) : (
                                <Lock className="w-12 h-12 text-amber-500" />
                            )}
                        </div>

                        <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                            {suggestion.name}
                        </h3>
                        
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl mb-8 text-left">
                            <p className="text-sm text-slate-500 uppercase tracking-widest mb-2 font-bold">Relatório da I.A.</p>
                            <p className="text-slate-300 text-lg leading-relaxed font-light">
                                "{suggestion.reason}"
                            </p>
                        </div>

                        {suggestion.active ? (
                            <div className="space-y-4">
                                <button 
                                    onClick={handleSystemAccess}
                                    className="w-full sm:w-auto bg-gradient-to-r from-magic-blue to-blue-600 text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest hover:shadow-[0_0_40px_rgba(0,191,255,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto"
                                >
                                    Acessar Sistema <ExternalLink size={20} />
                                </button>
                                <p className="text-xs text-slate-500 mt-4">
                                    Redirecionando para ambiente seguro (SSL).
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-200 text-sm">
                                    <p className="font-bold flex items-center justify-center gap-2 mb-1">
                                        <Zap size={14} /> SISTEMA EM ATUALIZAÇÃO
                                    </p>
                                    Este protocolo específico está passando por upgrades de segurança.
                                </div>
                                <button 
                                    onClick={() => { setStage('idle'); setInput(''); }}
                                    className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
                                >
                                    <RefreshCw size={14} /> Nova Análise
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentRoute, setCurrentRoute] = useState<RouteName>('inicio');
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<UserRole>('broker');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    
    const [activeSystem, setActiveSystem] = useState<string>('');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1).split('?')[0] as RouteName;
            setCurrentRoute(hash || 'inicio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); 

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                setUser(currentUser);
                if (currentUser) {
                    const email = currentUser.email || '';
                    if (email === 'Consegcn@terra.com.br' || email.startsWith('admin')) {
                        setUserRole('admin');
                    } else {
                        setUserRole('broker');
                    }
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUserRole('broker');
                }
                setIsAuthLoading(false);
            });
            return () => unsubscribe();
        } else {
            setIsAuthLoading(false);
        }
    }, []);

    const updateRoute = (route: RouteName) => {
        window.location.hash = route;
    };

    const activateSystem = (product: string) => {
        setActiveSystem(product);
        // Rotas diretas para sistemas ativos
        if (product === 'consorcio') {
             window.open('https://consorcio.consegseguro.com/', '_blank');
        } else if (product === 'vida') {
             window.open('https://protocolo-de-legado-455137106232.us-west1.run.app/', '_blank');
        } else {
            updateRoute('contato');
        }
    };

    const FloatingWhatsApp = () => (
        <a 
            href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20iniciar%20minha%20estratégia%20de%20blindagem." 
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-glow-strong transition-all hover:scale-110 flex items-center justify-center group"
        >
            <MessageCircle size={28} className="fill-white" />
            <span className="absolute right-full mr-4 bg-white text-slate-800 px-3 py-1 rounded-lg text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Falar com Estrategista
            </span>
        </a>
    );

    const renderContent = () => {
        switch (currentRoute) {
            case 'inicio':
                return (
                    <div className="animate-fade-in">
                        <FloatingWhatsApp />
                        
                        {/* HERO SECTION - DEEP NEURAL MESH */}
                        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#020617]">
                            {/* Neural Mesh Background */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Deep Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                                
                                {/* Glowing Nodes */}
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magic-blue rounded-full shadow-[0_0_15px_rgba(0,191,255,1)] animate-ping"></div>
                                <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,1)] animate-ping delay-700"></div>
                                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>
                                
                                {/* Atmospheric Glow */}
                                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-magic-blue/10 rounded-full blur-[120px] animate-pulse"></div>
                                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                            </div>
                            
                            <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                                <div className="text-left space-y-8 order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-black/40 border border-magic-blue/30 text-magic-blue text-[10px] font-orbitron font-bold tracking-[0.25em] shadow-[0_0_20px_rgba(0,191,255,0.15)] backdrop-blur-md uppercase">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magic-blue opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-magic-blue"></span>
                                        </span>
                                        System V4.1 Neural-Ready
                                    </div>
                                    
                                    <h1 className="font-orbitron text-5xl sm:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                                        Soberania <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-blue via-cyan-400 to-white animate-[shimmer_3s_infinite]">Algorítmica</span>
                                    </h1>
                                    
                                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light pl-6 border-l border-magic-blue/50">
                                        Modelagem preditiva de riscos patrimoniais. Utilizamos inteligência de dados para construir ecossistemas de proteção que antecipam o caos.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-5 pt-6">
                                        <Button onClick={() => updateRoute('contato')} className="shadow-[0_0_30px_rgba(0,191,255,0.3)] bg-gradient-to-r from-magic-blue to-blue-700 border-none">
                                            <BrainCircuit className="mr-2" size={20}/> Consultar I.A.
                                        </Button>
                                        <Button variant="secondary" onClick={() => updateRoute('filosofia')} className="border-slate-700 text-slate-300 hover:text-white hover:border-magic-blue hover:bg-magic-blue/5">
                                            <Network className="mr-2" size={20}/> Explorar Rede
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-8 text-[10px] font-bold text-slate-500 font-orbitron pt-10 uppercase tracking-widest border-t border-white/5 mt-8">
                                        <span className="flex items-center gap-2 text-slate-400"><ShieldCheck size={14} className="text-green-500"/> 256-bit Encrypted</span>
                                        <span className="flex items-center gap-2 text-slate-400"><Database size={14} className="text-purple-500"/> Real-Time Sync</span>
                                    </div>
                                </div>

                                {/* VISUAL: NEURAL CORE */}
                                <div className="relative hidden lg:block perspective-1000 order-1 lg:order-2 h-[600px]">
                                    {/* Central Core */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-black/60 to-slate-900/80 rounded-full border border-magic-blue/30 backdrop-blur-xl shadow-[0_0_60px_rgba(0,191,255,0.2)] z-20 flex items-center justify-center group overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20 animate-[spin_60s_linear_infinite]"></div>
                                        
                                        <div className="text-center relative z-10">
                                            <div className="w-20 h-20 mx-auto bg-magic-blue/10 rounded-full flex items-center justify-center border border-magic-blue/50 mb-4 group-hover:scale-110 transition-transform duration-500">
                                                <BrainCircuit size={40} className="text-magic-blue" />
                                            </div>
                                            <div className="font-orbitron font-bold text-white text-xl tracking-widest">CORE</div>
                                            <div className="text-[10px] text-magic-blue font-mono mt-1">ANALYSIS ACTIVE</div>
                                        </div>
                                    </div>

                                    {/* Floating Data Cards */}
                                    <div className="absolute top-[10%] right-[5%] w-64 p-4 bg-black/60 backdrop-blur-md border border-green-500/30 rounded-lg transform rotate-6 animate-float z-10">
                                        <div className="flex justify-between items-center mb-2 text-green-400 text-xs font-mono">
                                            <span>LIFESPAN.METRIC</span>
                                            <span>98%</span>
                                        </div>
                                        <div className="h-1 bg-green-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[98%]"></div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-[15%] left-[0%] w-72 p-4 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg transform -rotate-3 animate-float z-30" style={{animationDelay: '1.5s'}}>
                                        <div className="flex justify-between items-center mb-2 text-purple-400 text-xs font-mono">
                                            <span>ASSET.PROTECTION</span>
                                            <Shield size={12}/>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1">
                                            {[1,2,3,4,5].map(i => <div key={i} className="h-1 bg-purple-500/50 rounded-sm"></div>)}
                                        </div>
                                        <div className="mt-2 text-[10px] text-slate-400 font-mono">Firewall patrimonial ativado.</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Modules Grid */}
                        <section className="py-32 bg-slate-50 relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020617] to-transparent pointer-events-none"></div>
                            
                            <div className="container mx-auto px-4 relative z-10">
                                <div className="text-center mb-20">
                                    <h2 className="font-orbitron text-4xl font-black text-cosmic mb-4">Módulos Estratégicos</h2>
                                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">Acesse terminais dedicados para cada dimensão do seu patrimônio.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { 
                                            title: "Módulo Legado", 
                                            subtitle: "Sucessão & Vida",
                                            status: "Sistema Ativo",
                                            desc: "Engenharia financeira para garantir que sua dinastia prospere. Liquidez imediata e proteção contra inventários.", 
                                            icon: <Crown className="w-8 h-8" />, 
                                            route: 'legado',
                                            color: 'text-white',
                                            bg: 'bg-gradient-to-br from-rose-500 to-pink-600',
                                            glow: 'shadow-rose-500/30'
                                        },
                                        { 
                                            title: "Módulo Mobilidade", 
                                            subtitle: "Auto & Frota",
                                            status: "Em Breve",
                                            desc: "Continuidade de movimento. Sistemas anti-paralisação para seus veículos e responsabilidade civil massiva.", 
                                            icon: <Zap className="w-8 h-8" />, 
                                            route: 'mobilidade',
                                            color: 'text-white',
                                            bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
                                            glow: 'shadow-amber-500/30'
                                        },
                                        { 
                                            title: "Módulo Expansão", 
                                            subtitle: "Invest & Consórcio",
                                            status: "Sistema Ativo",
                                            desc: "A matemática do crescimento. Aquisição de ativos imobiliários e veículos sem o custo de oportunidade dos juros.", 
                                            icon: <TrendingUp className="w-8 h-8" />, 
                                            route: 'consorcio',
                                            color: 'text-white',
                                            bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
                                            glow: 'shadow-emerald-500/30'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} onClick={() => updateRoute(item.route as RouteName)} className={`group cursor-pointer p-1 rounded-[32px] bg-white shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden`}>
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${item.bg}`}></div>
                                            
                                            <div className="relative bg-white h-full rounded-[28px] p-8 flex flex-col border border-slate-100 overflow-hidden">
                                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                                                    <ArrowRight className="text-slate-800" />
                                                </div>

                                                <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                                    {item.icon}
                                                </div>

                                                <div className="mb-auto">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{item.subtitle}</div>
                                                    <h3 className="font-orbitron text-2xl font-bold text-cosmic mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-500 transition-all">{item.title}</h3>
                                                    <p className="text-slate-600 font-medium leading-relaxed">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                                
                                                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status do Sistema</span>
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide text-white ${item.status === 'Sistema Ativo' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'} shadow-md`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Metrics Section */}
                        <section className="bg-[#020617] py-24 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617] to-[#1e293b] opacity-90"></div>
                            
                            <div className="container mx-auto px-4 relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-700/50 pb-6">
                                    <div>
                                        <h3 className="font-orbitron text-2xl font-bold text-white flex items-center gap-2">
                                            <Database size={20} className="text-magic-blue" /> Métricas Globais
                                        </h3>
                                        <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Consolidado 10 Anos / Rede de Parceiros</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400 text-xs font-mono mt-4 md:mt-0">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        LIVE FEED
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-px bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                                    {[
                                        { val: "+12 Bi", label: "Vidas Indenizadas", sub: "Recursos entregues" },
                                        { val: "+8.5 Bi", label: "Patrimônio Salvo", sub: "Recuperação de ativos" },
                                        { val: "+25 Bi", label: "Capital Segurado", sub: "Cobertura total ativa" },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#050b14] p-8 hover:bg-[#0f172a] transition-colors group border-r border-white/5 last:border-0">
                                            <div className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-2 group-hover:text-magic-blue transition-colors">
                                                {stat.val}
                                            </div>
                                            <p className="text-slate-300 font-bold text-sm uppercase tracking-wider mb-1">{stat.label}</p>
                                            <p className="text-slate-500 text-xs font-mono">{stat.sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                );

            case 'legado':
                return (
                    <SectionWrapper 
                        id="legado" 
                        title="Protocolo de Legado" 
                        subtitle="Sua família não precisa sofrer com o inventário. O Sistema Legado cria liquidez instantânea e garante a soberania da sua dinastia."
                    >
                        <FloatingWhatsApp />
                        <VideoPlayer videoId="uXEC8wRPYuo" title="Protocolo de Legado" />
                        
                        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-12">
                            {[
                                { title: "Zero Inventário", text: "Recursos entregues diretamente aos beneficiários, livres de impostos de transmissão e custos judiciais." },
                                { title: "Liquidez em Horas", text: "Enquanto o patrimônio físico fica travado na justiça, o Sistema Legado injeta capital imediato na conta." },
                                { title: "Sucessão Empresarial", text: "Garanta que seus sócios ou herdeiros tenham caixa para comprar as cotas e manter a empresa viva." }
                            ].map((card, i) => (
                                <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-glow transition-shadow duration-300">
                                    <h3 className="font-orbitron text-lg font-bold text-cosmic mb-3">{card.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-light">{card.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center text-center flex-col items-center gap-4">
                            <Button 
                                onClick={() => window.open('https://protocolo-de-legado-455137106232.us-west1.run.app/', '_blank')}
                                className="shadow-[0_0_30px_rgba(0,191,255,0.4)] px-10 py-5 text-lg"
                            >
                                Acessar Protocolo Legado <ExternalLink size={20} className="ml-2" />
                            </Button>
                            <p className="text-sm text-slate-400">Acesso seguro ao sistema de blindagem.</p>
                        </div>
                    </SectionWrapper>
                );

            case 'mobilidade':
                return (
                    <SectionWrapper 
                        id="mobilidade" 
                        title="Mandato de Mobilidade" 
                        subtitle="Sua liberdade de movimento é inegociável. Proteção total para seus veículos, garantindo que sua vida e seus negócios nunca parem."
                    >
                        <FloatingWhatsApp />
                        <VideoPlayer videoId="D8afEYQl2I8" title="Mandato de Mobilidade" />
                        
                        <div className="flex flex-col md:flex-row gap-12 items-center my-16">
                            <div className="flex-1 space-y-10">
                                <div className="flex gap-6">
                                    <div className="bg-soft-blue p-4 rounded-2xl h-fit text-magic-blue shadow-sm"><Zap size={28} /></div>
                                    <div>
                                        <h3 className="font-orbitron text-xl font-bold text-cosmic mb-2">Continuidade Operacional</h3>
                                        <p className="text-slate-600 font-light">Imprevistos acontecem, mas a paralisação é opcional. Garantimos carro reserva e assistência ágil para você seguir em frente.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="bg-soft-blue p-4 rounded-2xl h-fit text-magic-blue shadow-sm"><Shield size={28} /></div>
                                    <div>
                                        <h3 className="font-orbitron text-xl font-bold text-cosmic mb-2">Blindagem Jurídica</h3>
                                        <p className="text-slate-600 font-light">Acidentes podem gerar passivos enormes. Nosso escudo de responsabilidade civil protege suas reservas financeiras.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-white border border-slate-100 p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-magic-blue"></div>
                                <h3 className="font-orbitron text-2xl font-bold mb-6 text-cosmic">Cobertura Elite</h3>
                                <ul className="space-y-5">
                                    {['Colisão, Roubo e Furto', 'Danos a Terceiros (RCF-V)', 'Assistência 24h Premium', 'Proteção de Vidros Completa'].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-600">
                                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-xs">✓</div> 
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-center text-center">
                             <Button disabled variant="secondary" className="opacity-70 cursor-not-allowed px-12 w-full md:w-auto">Sistema em Atualização</Button>
                        </div>
                    </SectionWrapper>
                );

            case 'saude':
                return (
                    <SectionWrapper 
                        id="saude" 
                        title="Escudo do Capital Humano" 
                        subtitle="Você é o ativo mais valioso do seu império. Cuidar da sua saúde e da sua família é a estratégia mais inteligente de todas."
                    >
                        <FloatingWhatsApp />
                        <VideoPlayer videoId="5r8arWpALhY" title="Seguro Saúde" />
                        
                        <div className="grid md:grid-cols-2 gap-8 my-12">
                            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-lg hover:border-magic-blue/30 transition-all">
                                <h3 className="font-orbitron text-2xl text-cosmic mb-4">Performance & Vitalidade</h3>
                                <p className="text-slate-600 font-light leading-relaxed">Para liderar, você precisa estar no seu auge. Oferecemos acesso à medicina preventiva e curativa de ponta para manter sua alta performance.</p>
                            </div>
                            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-lg hover:border-magic-blue/30 transition-all">
                                <h3 className="font-orbitron text-2xl text-cosmic mb-4">Rede de Excelência</h3>
                                <p className="text-slate-600 font-light leading-relaxed">Nos momentos críticos, você merece o melhor. Acesso desburocratizado aos hospitais e especialistas de elite (Einstein, Sírio, Vila Nova).</p>
                            </div>
                        </div>
                        <div className="flex justify-center text-center">
                            <Button disabled variant="secondary" className="opacity-70 cursor-not-allowed px-12 w-full md:w-auto">Sistema em Atualização</Button>
                        </div>
                    </SectionWrapper>
                );

            case 'consorcio':
                return (
                    <SectionWrapper 
                        id="consorcio" 
                        title="Aquisição Estratégica" 
                        subtitle="O sistema inteligente para quem pensa a longo prazo. Expanda seu patrimônio com planejamento, sem pagar o preço da impaciência."
                    >
                        <FloatingWhatsApp />
                        <VideoPlayer videoId="nckxl3HMtcY" title="Consórcio Estratégico" />
                        
                        {/* A Matemática da Prosperidade */}
                        <div className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mt-16 mb-12 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-magic-blue to-power-blue"></div>
                            <h3 className="font-orbitron text-center text-2xl text-cosmic mb-10">A Matemática da Prosperidade</h3>
                            <div className="grid md:grid-cols-3 gap-10 text-center">
                                <div className="p-4">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-magic-blue to-power-blue mb-3">0%</div>
                                    <div className="font-bold text-cosmic text-lg">Juros</div>
                                    <div className="text-slate-500 mt-2 font-light">Fuja das taxas abusivas. Pague apenas a taxa administrativa justa.</div>
                                </div>
                                <div className="p-4 md:border-x border-slate-100">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-magic-blue to-power-blue mb-3">100%</div>
                                    <div className="font-bold text-cosmic text-lg">Planejado</div>
                                    <div className="text-slate-500 mt-2 font-light">Previsibilidade total de fluxo de caixa para sua empresa ou família.</div>
                                </div>
                                <div className="p-4">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-magic-blue to-power-blue mb-3">∞</div>
                                    <div className="font-bold text-cosmic text-lg">Potencial</div>
                                    <div className="text-slate-500 mt-2 font-light">Use a carta contemplada para negociar à vista e alavancar ativos.</div>
                                </div>
                            </div>
                        </div>

                        {/* O Que Nosso Sistema Possui - UPDATED GLOW */}
                        <div className="max-w-6xl mx-auto mb-16">
                            <h3 className="font-orbitron text-center text-2xl text-cosmic mb-10">Arsenal do Sistema</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: <BarChart3 size={24} />, title: "Alavancagem Inteligente", text: "Acelere sua contemplação sem usar seu próprio capital. Utilize até 30% da própria carta de crédito como lance (Lance Embutido)." },
                                    { icon: <Wallet size={24} />, title: "Poder de Negociação", text: "A carta contemplada é dinheiro à vista na mesa de negociação. Isso lhe confere o poder de barganha para exigir descontos agressivos." },
                                    { icon: <Shield size={24} />, title: "Blindagem Inflacionária", text: "Seu poder de compra é sagrado. O valor da carta de crédito é reajustado anualmente, garantindo que a inflação não corroa seu patrimônio." },
                                    { icon: <Target size={24} />, title: "Liberdade de Escolha", text: "Não fique preso a catálogos. Com a carta na mão, você tem liberdade absoluta para escolher imóveis ou veículos em qualquer lugar." }
                                ].map((card, i) => (
                                    <div key={i} className="relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-100 
                                        hover:bg-white hover:border-magic-blue/50 hover:shadow-[0_0_40px_rgba(0,191,255,0.4)] 
                                        hover:-translate-y-2 transition-all duration-500 group">
                                        
                                        {/* Inner Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-magic-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-magic-blue/20 blur-2xl group-hover:bg-magic-blue/40 transition-colors duration-500 rounded-full"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-magic-blue mb-4 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-all duration-500">
                                                {card.icon}
                                            </div>
                                            <h4 className="font-orbitron text-sm font-bold text-cosmic mb-2 group-hover:text-magic-blue transition-colors">{card.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">{card.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="text-center flex flex-col items-center gap-4">
                            <Button onClick={() => window.open('https://consorcio.consegseguro.com/', '_blank')}>
                                Acessar Sistema de Aquisição
                            </Button>
                            <p className="text-sm text-slate-400">Simulação em tempo real diretamente no nosso sistema estratégico.</p>
                        </div>
                    </SectionWrapper>
                );

            case 'filosofia':
                return (
                    <div className="animate-fade-in">
                        <SectionWrapper id="filosofia" title="Manifesto" subtitle="Soberania através da Segurança">
                            <FloatingWhatsApp />
                            <div className="max-w-4xl mx-auto prose prose-lg text-slate-600">
                                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mb-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-magic-blue/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <p className="text-3xl font-light leading-relaxed mb-12 text-center text-cosmic font-orbitron">
                                        "A segurança não é o medo do erro. <br/>É a liberdade absoluta para o acerto."
                                    </p>
                                    <p className="mb-8 leading-relaxed text-lg">
                                        O mundo ensina que seguro é uma despesa para "se der errado". Uma obrigação chata. Um escudo reativo contra o azar.
                                        <strong className="text-magic-blue"> Nós rejeitamos essa visão pequena.</strong>
                                    </p>
                                    <p className="mb-8 leading-relaxed text-lg">
                                        Para nós, a proteção é a <span className="text-cosmic font-bold">ferramenta ofensiva mais poderosa</span> do seu arsenal. Pense: como você agiria se soubesse que, aconteça o que acontecer, sua base está sólida? Se sua família está garantida? Se seu patrimônio é inabalável?
                                    </p>
                                    <p className="mb-2 leading-relaxed text-center font-bold text-xl text-slate-800">
                                        Você agiria com ousadia. Com coragem. Sem hesitação.
                                    </p>
                                </div>

                                {/* OS 4 SISTEMAS - NOVO CONTEÚDO */}
                                <div className="mb-24">
                                    <h3 className="font-orbitron text-center text-2xl text-cosmic mb-10 font-bold relative inline-block w-full">
                                        Pilares da Soberania
                                        <span className="block w-16 h-1 bg-magic-blue mx-auto mt-4 rounded-full shadow-glow"></span>
                                    </h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-6 not-prose">
                                        {/* Card 1: Legado */}
                                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-500 group cursor-pointer hover:-translate-y-1" onClick={() => updateRoute('legado')}>
                                            <Crown className="w-10 h-10 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-orbitron font-bold text-xl text-cosmic mb-2 group-hover:text-rose-600 transition-colors">Sistema Legado</h4>
                                            <p className="text-slate-600 font-light leading-relaxed">A soberania sobre o tempo. Garantir que sua construção financeira atravesse gerações sem ser dilapidada por burocracias.</p>
                                        </div>

                                        {/* Card 2: Mobilidade */}
                                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 group cursor-pointer hover:-translate-y-1" onClick={() => updateRoute('mobilidade')}>
                                            <Zap className="w-10 h-10 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-orbitron font-bold text-xl text-cosmic mb-2 group-hover:text-amber-600 transition-colors">Sistema Mobilidade</h4>
                                            <p className="text-slate-600 font-light leading-relaxed">A soberania sobre o movimento. Eliminar o risco de paralisação operacional em sua frota ou deslocamento pessoal.</p>
                                        </div>

                                         {/* Card 3: Expansão */}
                                         <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 group cursor-pointer hover:-translate-y-1" onClick={() => updateRoute('consorcio')}>
                                            <TrendingUp className="w-10 h-10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-orbitron font-bold text-xl text-cosmic mb-2 group-hover:text-emerald-600 transition-colors">Sistema Expansão</h4>
                                            <p className="text-slate-600 font-light leading-relaxed">A soberania sobre o capital. Alavancagem patrimonial matemática, sem o custo de oportunidade dos juros bancários.</p>
                                        </div>

                                        {/* Card 4: Humana */}
                                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-magic-blue/50 hover:shadow-[0_0_30px_rgba(0,191,255,0.2)] transition-all duration-500 group cursor-pointer hover:-translate-y-1" onClick={() => updateRoute('saude')}>
                                            <Activity className="w-10 h-10 text-magic-blue mb-4 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-orbitron font-bold text-xl text-cosmic mb-2 group-hover:text-magic-blue transition-colors">Sistema Humano</h4>
                                            <p className="text-slate-600 font-light leading-relaxed">A soberania biológica. Acesso irrestrito à melhor tecnologia médica para manter a máquina principal em performance máxima.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção: Visão de Futuro / Predição */}
                                <div className="bg-[#020617] text-white p-12 rounded-3xl relative overflow-hidden not-prose shadow-glow-strong border border-magic-blue/20">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magic-blue/10 rounded-full blur-[80px] animate-pulse"></div>
                                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px]"></div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-orbitron font-bold tracking-widest mb-6">
                                            <BrainCircuit size={14} className="text-magic-blue" /> HORIZONTE 2030
                                        </div>
                                        <h3 className="font-orbitron text-3xl sm:text-4xl font-black mb-6">O Futuro é <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-blue to-electric-blue">Preditivo</span></h3>
                                        <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-light text-lg">
                                            O modelo antigo de seguros reage ao desastre. <strong className="text-white">Nós estamos construindo o modelo que o impede.</strong> Utilizando Big Data e IA, nossa visão é antecipar riscos à sua saúde e ao seu patrimônio antes que eles se materializem.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seção de Parceiros Estratégicos (Logos Reais) */}
                            <div className="pt-24 bg-white">
                                <div className="max-w-7xl mx-auto px-4">
                                    <h3 className="font-orbitron text-2xl text-center text-cosmic mb-4 font-bold relative inline-block w-full">
                                        Ecossistema de Elite
                                        <span className="block w-16 h-1 bg-magic-blue mx-auto mt-4 rounded-full shadow-glow"></span>
                                    </h3>
                                    <p className="text-center text-slate-500 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                                        Nossa operação é alicerçada pelos maiores conglomerados do mundo. Solidez global garantindo sua tranquilidade local.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center grayscale hover:grayscale-0 transition-all duration-500">
                                        {[
                                            { name: "Porto Seguro", domain: "portoseguro.com.br" },
                                            { name: "Allianz", domain: "allianz.com.br" },
                                            { name: "Bradesco", domain: "bradescoseguros.com.br" },
                                            { name: "SulAmérica", domain: "sulamerica.com.br" },
                                            { name: "Mapfre", domain: "mapfre.com.br" },
                                            { name: "Zurich", domain: "zurich.com.br" },
                                            { name: "Tokio Marine", domain: "tokiomarine.com.br" },
                                            { name: "HDI", domain: "hdiseguros.com.br" },
                                            { name: "Amil", domain: "amil.com.br" },
                                            { name: "Omint", domain: "omint.com.br" },
                                            { name: "Suhai", domain: "suhai.com.br" },
                                            { name: "Azul", domain: "azulseguros.com.br" }
                                        ].map((partner, idx) => (
                                            <div key={idx} className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 p-2">
                                                <img 
                                                    src={`https://logo.clearbit.com/${partner.domain}?size=120`} 
                                                    alt={partner.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="120"
                                                    height="60"
                                                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <span className="hidden font-orbitron font-bold text-xs text-slate-400 uppercase">{partner.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SectionWrapper>
                    </div>
                );

            case 'contato':
                return (
                    <SectionWrapper id="contato" title="Inicie Sua Estratégia" subtitle="O sistema está pronto para receber seus dados.">
                        <FloatingWhatsApp />
                        <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center">
                            <NeuralDiagnostic onComplete={(systemId) => setActiveSystem(systemId)} />
                        </div>
                    </SectionWrapper>
                );

            case 'login':
                return (
                    <Login onLoginSuccess={(email) => {
                        setIsAuthenticated(true);
                         if (email === 'Consegcn@terra.com.br' || email.startsWith('admin')) {
                            setUserRole('admin');
                        } else {
                            setUserRole('broker');
                        }
                        updateRoute('dashboard');
                    }} />
                );

            case 'dashboard':
                if (isAuthLoading) {
                    return (
                        <div className="min-h-screen flex items-center justify-center bg-slate-50">
                            <div className="w-12 h-12 border-4 border-magic-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    );
                }

                if (user || isAuthenticated) {
                    return (
                        <BrokerDashboard 
                            onLogout={() => {
                                setUser(null);
                                setIsAuthenticated(false);
                                setUserRole('broker'); // Reset role
                                updateRoute('login');
                            }} 
                            userRole={userRole}
                        />
                    );
                }
                // Redirecionar se não logado
                setTimeout(() => updateRoute('login'), 0);
                return null;

            default:
                return (
                     <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
                        <h1 className="text-6xl font-orbitron text-cosmic mb-4">404</h1>
                        <p className="text-slate-600 mb-8 font-light text-xl">Rota não mapeada.</p>
                        <Button onClick={() => updateRoute('inicio')}>Retornar à Base</Button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white font-inter text-slate-800 selection:bg-magic-blue selection:text-white">
            <Navigation currentRoute={currentRoute} onNavigate={updateRoute} />
            
            <main className={currentRoute === 'dashboard' ? '' : ''}>
                {renderContent()}
            </main>

            {/* Ocultar rodapé se estiver no dashboard */}
            {currentRoute !== 'dashboard' && (
                <footer className="bg-white border-t border-slate-100 mt-20 py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                        <p className="font-orbitron text-2xl font-bold text-cosmic mb-6">ConsegSeguro</p>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-light">
                            © 2025. Todos os direitos reservados.<br/>
                            A segurança é o alicerce da sua soberania.
                        </p>
                        <div className="flex justify-center gap-8 mt-10 text-slate-400">
                            <Mail size={24} className="hover:text-magic-blue cursor-pointer transition-colors hover:scale-110 duration-300" />
                            <Lock size={24} className="hover:text-magic-blue cursor-pointer transition-colors hover:scale-110 duration-300" />
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default App;