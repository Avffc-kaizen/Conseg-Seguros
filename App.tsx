import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { VideoPlayer } from './components/VideoPlayer';
import { Button } from './components/Button';
import { ContactForm } from './components/ContactForm';
import { SectionWrapper } from './pages/SectionWrapper';
import { Login } from './components/Login';
import { BrokerDashboard } from './components/BrokerDashboard';
import { RouteName, UserRole } from './types';
import { Shield, TrendingUp, Users, Lock, Zap, ChevronRight, ArrowRight, Mail, Heart, Crown, Check, Wallet, BarChart3, Target, Building2, Globe, Activity, ShieldCheck, Rocket, Eye, MessageCircle, Radio, Database, Network, MoreVertical, BrainCircuit, Layers } from 'lucide-react';
import { auth, onAuthStateChanged } from './services/firebaseService';

const App: React.FC = () => {
    const [currentRoute, setCurrentRoute] = useState<RouteName>('inicio');
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<UserRole>('broker');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Handle Hash Change
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1).split('?')[0] as RouteName;
            setCurrentRoute(hash || 'inicio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Auth State Listener with Role Assignment
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

    // Floating WhatsApp Button Component
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

    // Content Rendering Logic
    const renderContent = () => {
        switch (currentRoute) {
            case 'inicio':
                return (
                    <div className="animate-fade-in">
                        <FloatingWhatsApp />
                        
                        {/* Hero Section - Deep Tech / Glassmorphism */}
                        <section className="relative min-h-[92vh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                            <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] tech-grid pointer-events-none"></div>
                            
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-magic-blue/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
                            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cosmic/5 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                                <div className="text-left space-y-8">
                                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-magic-blue/30 text-cosmic text-[10px] font-orbitron font-bold tracking-widest shadow-sm backdrop-blur-md">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        SISTEMA OPERACIONAL ATIVO
                                    </div>
                                    
                                    <h1 className="font-orbitron text-5xl sm:text-6xl lg:text-7xl font-black text-cosmic leading-[1.1] tracking-tight">
                                        Inteligência <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-blue to-electric-blue">Patrimonial</span>
                                    </h1>
                                    
                                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-light border-l-2 border-magic-blue/30 pl-6">
                                        A ConsegSeguro 360 não vende apenas apólices. Nós entregamos uma <strong className="text-cosmic font-semibold">arquitetura de soberania</strong> baseada em dados, protegendo seu legado contra a imprevisibilidade do mercado.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Button onClick={() => updateRoute('contato')} className="shadow-glow">
                                            Iniciar Protocolo
                                        </Button>
                                        <Button variant="secondary" onClick={() => updateRoute('filosofia')}>
                                            Explorar Sistema
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-6 text-xs font-bold text-slate-400 font-orbitron pt-8">
                                        <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-magic-blue"/> DADOS ENCRIPTADOS</span>
                                        <span className="flex items-center gap-2"><Network size={14} className="text-magic-blue"/> CONEXÃO GLOBAL</span>
                                    </div>
                                </div>

                                {/* Hero Visual - The "Dashboard" Concept */}
                                <div className="relative hidden lg:block perspective-1000">
                                    <div className="relative z-10 animate-float">
                                        {/* Main Card */}
                                        <div className="glass-panel p-6 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magic-blue via-electric-blue to-transparent"></div>
                                            
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-cosmic text-white flex items-center justify-center">
                                                        <Crown size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-orbitron font-bold text-cosmic text-sm">Status do Legado</h3>
                                                        <p className="text-xs text-green-600 font-bold flex items-center gap-1"><Activity size={10}/> 100% OTIMIZADO</p>
                                                    </div>
                                                </div>
                                                <MoreVertical size={20} className="text-slate-300" />
                                            </div>

                                            <div className="space-y-4">
                                                {/* Stat Row */}
                                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-100 text-magic-blue"><TrendingUp size={16}/></div>
                                                        <span className="text-sm font-bold text-slate-600">Capital Protegido</span>
                                                    </div>
                                                    <span className="font-mono font-bold text-cosmic">R$ 12.5M+</span>
                                                </div>

                                                {/* Stat Row */}
                                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><Users size={16}/></div>
                                                        <span className="text-sm font-bold text-slate-600">Beneficiários</span>
                                                    </div>
                                                    <div className="flex -space-x-2">
                                                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>)}
                                                    </div>
                                                </div>
                                                
                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-bold text-slate-500">Sucessão Patrimonial</span>
                                                        <span className="font-bold text-magic-blue">Ativo</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full w-[85%] bg-gradient-to-r from-magic-blue to-electric-blue shadow-glow"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Widget 1 */}
                                        <div className="absolute -right-12 -top-12 glass-panel p-4 rounded-2xl shadow-lg animate-float" style={{animationDelay: '1s'}}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-bold text-cosmic font-orbitron">REDE ALFA CONECTADA</span>
                                            </div>
                                        </div>

                                         {/* Floating Widget 2 */}
                                         <div className="absolute -left-8 -bottom-8 glass-panel p-4 rounded-2xl shadow-lg animate-float" style={{animationDelay: '2s'}}>
                                            <div className="flex items-center gap-3">
                                                <Radio size={16} className="text-red-500" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Monitoramento</p>
                                                    <p className="text-xs font-bold text-cosmic">24/7 Ativo</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Modules Grid (High Density) */}
                        <section className="py-24 bg-white relative">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-16">
                                    <h2 className="font-orbitron text-3xl font-bold text-cosmic">Módulos Estratégicos</h2>
                                    <p className="text-slate-500 mt-4">Selecione o protocolo de proteção para ativar.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { 
                                            title: "Módulo Legado", 
                                            subtitle: "Proteção Familiar",
                                            status: "Essencial",
                                            desc: "Blindagem financeira contra inventários e perda de renda. Continuidade geracional garantida.", 
                                            icon: <Heart className="w-6 h-6" />, 
                                            route: 'legado',
                                            color: 'text-rose-500',
                                            bg: 'bg-rose-50'
                                        },
                                        { 
                                            title: "Módulo Mobilidade", 
                                            subtitle: "Auto & Frota",
                                            status: "Operacional",
                                            desc: "Sistemas anti-paralisação. Carro reserva, RC Profissional e gestão de frota integrada.", 
                                            icon: <Zap className="w-6 h-6" />, 
                                            route: 'mobilidade',
                                            color: 'text-amber-500',
                                            bg: 'bg-amber-50'
                                        },
                                        { 
                                            title: "Módulo Expansão", 
                                            subtitle: "Consórcio & Invest",
                                            status: "Alavancagem",
                                            desc: "Aquisição de ativos sem juros abusivos. A matemática a favor do seu crescimento.", 
                                            icon: <TrendingUp className="w-6 h-6" />, 
                                            route: 'consorcio',
                                            color: 'text-emerald-500',
                                            bg: 'bg-emerald-50'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} onClick={() => updateRoute(item.route as RouteName)} className="group cursor-pointer p-8 rounded-3xl bg-white border border-slate-100 hover:border-magic-blue/30 hover:shadow-glass transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="text-slate-300 group-hover:text-magic-blue" />
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`${item.bg} ${item.color} p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{item.subtitle}</div>
                                                    <h3 className="font-orbitron text-xl font-bold text-cosmic">{item.title}</h3>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                                    item.status === 'Essencial' ? 'border-rose-200 text-rose-600 bg-rose-50' :
                                                    item.status === 'Operacional' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                                                    'border-emerald-200 text-emerald-600 bg-emerald-50'
                                                }`}>
                                                    STATUS: {item.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* "Impacto Global" - Refined Data Feed Style */}
                        <section className="bg-cosmic py-24 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-cosmic via-cosmic to-cosmic-light opacity-90"></div>
                            
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
                                        <div key={i} className="bg-cosmic p-8 hover:bg-cosmic-light transition-colors group">
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
                        subtitle="O Seguro de Vida não é sobre morte. É sobre o amor que fica. É a estrutura financeira que sustenta sua dinastia quando você não estiver presente."
                    >
                        <FloatingWhatsApp />
                        <VideoPlayer videoId="uXEC8wRPYuo" title="Protocolo de Legado" />
                        
                        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-12">
                            {[
                                { title: "Proteção de Ativos", text: "Blinde o que você construiu. Impeça que o inventário consuma o patrimônio da sua família." },
                                { title: "Liquidez Imediata", text: "Recursos disponíveis exatamente quando seus entes queridos mais precisam, sem burocracia." },
                                { title: "Amor Eternizado", text: "Financie sonhos, educação e qualidade de vida. Sua proteção é o abraço que perdura." }
                            ].map((card, i) => (
                                <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-glow transition-shadow duration-300">
                                    <h3 className="font-orbitron text-lg font-bold text-cosmic mb-3">{card.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-light">{card.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button onClick={() => updateRoute('contato')}>Ativar Protocolo</Button>
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

                        <div className="text-center">
                            <Button onClick={() => updateRoute('contato')}>Garantir Mobilidade</Button>
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
                        <div className="text-center">
                            <Button onClick={() => updateRoute('contato')}>Blindar Capital Humano</Button>
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
                            <Button onClick={() => window.open('https://aquisi-o-estrat-gica-1094902339440.us-west1.run.app/', '_blank')}>
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
                                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 mb-16">
                                    <p className="text-2xl font-light leading-relaxed mb-8 text-center text-cosmic font-orbitron">
                                        "A segurança não é o medo do erro. <br/>É a liberdade absoluta para o acerto."
                                    </p>
                                    <p className="mb-6 leading-relaxed">
                                        O mundo ensina que seguro é uma despesa para "se der errado". Uma obrigação chata. Um escudo reativo contra o azar.
                                        <strong className="text-magic-blue"> Nós rejeitamos essa visão pequena.</strong>
                                    </p>
                                    <p className="mb-6 leading-relaxed">
                                        Para nós, a proteção é a <span className="text-cosmic font-bold">ferramenta ofensiva mais poderosa</span> do seu arsenal. Pense: como você agiria se soubesse que, aconteça o que acontecer, sua base está sólida? Se sua família está garantida? Se seu patrimônio é inabalável?
                                    </p>
                                    <p className="mb-2 leading-relaxed text-center font-medium text-slate-800">
                                        Você agiria com ousadia. Com coragem. Sem hesitação.
                                    </p>
                                </div>

                                {/* Matriz Estratégica Completa */}
                                <h3 className="font-orbitron text-2xl text-center text-cosmic mb-8 font-bold">Matriz Estratégica 360º</h3>
                                <div className="grid sm:grid-cols-2 gap-6 not-prose mb-20">
                                    <div onClick={() => updateRoute('legado')} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-magic-blue hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-magic-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit text-magic-blue group-hover:scale-110 transition-transform"><Crown size={24} /></div>
                                        <h4 className="font-orbitron font-bold text-lg text-cosmic group-hover:text-magic-blue transition-colors">Legado</h4>
                                        <p className="text-sm text-slate-500 mt-2">Perpetuação do amor, da visão e da dignidade familiar através das gerações.</p>
                                    </div>
                                    <div onClick={() => updateRoute('mobilidade')} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-magic-blue hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-magic-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit text-magic-blue group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                                        <h4 className="font-orbitron font-bold text-lg text-cosmic group-hover:text-magic-blue transition-colors">Mobilidade</h4>
                                        <p className="text-sm text-slate-500 mt-2">Liberdade de ação ininterrupta. Seu movimento nunca cessa, não importa o obstáculo.</p>
                                    </div>
                                    <div onClick={() => updateRoute('saude')} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-magic-blue hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-magic-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit text-magic-blue group-hover:scale-110 transition-transform"><Heart size={24} /></div>
                                        <h4 className="font-orbitron font-bold text-lg text-cosmic group-hover:text-magic-blue transition-colors">Escudo Humano</h4>
                                        <p className="text-sm text-slate-500 mt-2">Sua biologia é seu maior ativo. Acesso à elite da medicina para máxima performance.</p>
                                    </div>
                                    <div onClick={() => updateRoute('consorcio')} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-magic-blue hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-magic-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit text-magic-blue group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                                        <h4 className="font-orbitron font-bold text-lg text-cosmic group-hover:text-magic-blue transition-colors">Estratégia & Aquisição</h4>
                                        <p className="text-sm text-slate-500 mt-2">Expansão matemática sem juros. O jogo do longo prazo para construção de impérios.</p>
                                    </div>
                                </div>

                                {/* Nova Seção: Visão de Futuro / Predição */}
                                <div className="bg-cosmic text-white p-12 rounded-3xl relative overflow-hidden mb-20 not-prose">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magic-blue/10 rounded-full blur-[80px] animate-pulse"></div>
                                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px]"></div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    
                                    <div className="relative z-10 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-orbitron font-bold tracking-widest mb-6">
                                            <BrainCircuit size={14} className="text-magic-blue" /> HORIZONTE 2030
                                        </div>
                                        <h3 className="font-orbitron text-3xl sm:text-4xl font-black mb-6">O Futuro é <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-blue to-electric-blue">Preditivo</span></h3>
                                        <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
                                            O modelo antigo de seguros reage ao desastre. <strong className="text-white">Nós estamos construindo o modelo que o impede.</strong> Utilizando Big Data e IA, nossa visão é antecipar riscos à sua saúde e ao seu patrimônio antes que eles se materializem, transformando a ConsegSeguro 360 em um oráculo de estabilidade.
                                        </p>
                                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                                <Layers size={20} className="mx-auto mb-2 text-magic-blue" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Dados</span>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                                <BrainCircuit size={20} className="mx-auto mb-2 text-purple-400" />
                                                <span className="text-xs font-bold uppercase tracking-wider">IA</span>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                                <ShieldCheck size={20} className="mx-auto mb-2 text-green-400" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Defesa</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action - Contato */}
                            <div className="bg-soft-blue border-y border-slate-100 py-16 mb-16">
                                <div className="max-w-4xl mx-auto text-center px-4">
                                    <h3 className="font-orbitron text-2xl font-bold text-cosmic mb-4">Pronto para elevar seu nível de proteção?</h3>
                                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">Não espere o imprevisto ditar o seu futuro. Assuma o controle da sua soberania agora.</p>
                                    <Button onClick={() => updateRoute('contato')} className="shadow-glow hover:scale-105">
                                        Falar com um Estrategista
                                    </Button>
                                </div>
                            </div>

                            {/* Seção de Parceiros Estratégicos (Logos Reais) */}
                            <div className="pt-8">
                                <h3 className="font-orbitron text-2xl text-center text-cosmic mb-4 font-bold relative inline-block w-full">
                                    Ecossistema de Elite
                                    <span className="block w-16 h-1 bg-magic-blue mx-auto mt-4 rounded-full shadow-glow"></span>
                                </h3>
                                <p className="text-center text-slate-500 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                                    Nossa operação é alicerçada pelos maiores conglomerados do mundo. Solidez global garantindo sua tranquilidade local.
                                </p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto px-4 items-center justify-items-center grayscale hover:grayscale-0 transition-all duration-500">
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
                                        <div key={idx} className="w-32 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                                            <img 
                                                src={`https://logo.clearbit.com/${partner.domain}?size=120`} 
                                                alt={partner.name} 
                                                className="max-h-full max-w-full object-contain"
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
                        </SectionWrapper>
                    </div>
                );

            case 'contato':
                return (
                    <SectionWrapper id="contato" title="Inicie Sua Estratégia" subtitle="Conecte-se com um mentor estratégico. Sua análise personalizada começa aqui.">
                        <FloatingWhatsApp />
                        <div className="max-w-3xl mx-auto">
                            <ContactForm />
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
                        <p className="font-orbitron text-2xl font-bold text-cosmic mb-6">ConsegSeguro<span className="text-magic-blue">360</span></p>
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