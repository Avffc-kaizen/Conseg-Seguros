
import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Button } from './components/Button';
import { ContactForm } from './components/ContactForm';
import { SectionWrapper } from './pages/SectionWrapper';
import { BannerGenerator } from './components/BannerGenerator';
import { RouteName } from './types';
import { 
    ShieldCheck, Heart, ArrowRight, Send, Share2, X, 
    Bot, CheckCircle, Car, Home, TrendingUp, Umbrella, Briefcase,
    AlertTriangle, ThumbsUp, Star, Phone, ExternalLink, MessageCircle, Link as LinkIcon, Check, Instagram, Stethoscope, Building2
} from 'lucide-react';

// --- DADOS DE CONTATO ---
const CONTACT_PHONE_DISPLAY = "+55 (61) 99994-9724";
const CONTACT_WHATSAPP_LINK = "https://wa.me/5561999949724";
const CONTACT_EMAIL = "Consegcn@terra.com.br";
const CONTACT_ADDRESS = "Rua das Carnaúbas, Lotes 4, Sala 403 - Ed. Plaza Mall";
const CONTACT_INSTAGRAM = "https://www.instagram.com/consegseguro";

// --- LINKS EXTERNOS DOS SISTEMAS ---
const LINK_SISTEMA_LEGADO = "https://vida.consegseguro.com/";
const LINK_SISTEMA_CONSORCIO = "https://consorcio.consegseguro.com/";

// --- CONSTANTES DE LOGOS ---
const INSURERS = [
    { name: 'Amil', url: 'https://logo.clearbit.com/amil.com.br' },
    { name: 'Allianz', url: 'https://logo.clearbit.com/allianz.com.br' },
    { name: 'Zurich', url: 'https://logo.clearbit.com/zurich.com.br' },
    { name: 'Suhai', url: 'https://logo.clearbit.com/suhaiseguradora.com' },
    { name: 'Sura', url: 'https://logo.clearbit.com/segurossura.com.br' },
    { name: 'Yelum', url: 'https://yt3.googleusercontent.com/v3YtjpR4rHO_s2I9Up9pgs9O8vXgUqjHk9X3H5l5q5J3j5K5h5o5_5p5q5r5s5t5u5v5w5x5y5z5' }, 
    { name: 'Porto Seguro', url: 'https://logo.clearbit.com/portoseguro.com.br' },
    { name: 'Bradesco', url: 'https://logo.clearbit.com/bradescoseguros.com.br' },
    { name: 'SulAmérica', url: 'https://logo.clearbit.com/sulamerica.com.br' },
    { name: 'Tokio Marine', url: 'https://logo.clearbit.com/tokiomarine.com.br' },
    { name: 'Mapfre', url: 'https://logo.clearbit.com/mapfre.com.br' },
    { name: 'HDI', url: 'https://logo.clearbit.com/hdiseguros.com.br' },
    { name: 'Sompo', url: 'https://logo.clearbit.com/sompo.com.br' },
];

// --- SISTEMA DE CHAT SIMPLIFICADO ---
interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    action?: {
        label: string;
        route?: RouteName;
        link?: string;
    };
}

const SentinelChat = ({ onNavigate }: { onNavigate: (route: RouteName) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            text: "Olá! Sou o assistente da Conseg. Como posso ajudar a proteger seu patrimônio hoje?", 
            sender: 'bot' 
        },
        { 
            id: '2', 
            text: "Posso te orientar sobre Seguro de Vida (Legado), Proteção Veicular, Saúde ou Investimento via Consórcio.", 
            sender: 'bot' 
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const analyzeRequest = (text: string) => {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('vida') || lowerText.includes('morre') || lowerText.includes('familia') || lowerText.includes('filho') || lowerText.includes('sucessao') || lowerText.includes('patrimonio')) {
            return {
                response: "Garantir a segurança financeira da sua família é o nosso propósito. Com o Seguro de Vida, você blinda seu patrimônio e garante o futuro de quem ama.",
                action: { label: "Simular Legado", link: LINK_SISTEMA_LEGADO }
            };
        }
        
        if (lowerText.includes('carro') || lowerText.includes('moto') || lowerText.includes('bate') || lowerText.includes('roubo') || lowerText.includes('veiculo')) {
            return {
                response: "Seu veículo é uma conquista e merece proteção completa. Vamos cotar agora as melhores opções para sua mobilidade.",
                action: { label: "Ver Seguro Auto", route: 'auto' as RouteName }
            };
        }

        if (lowerText.includes('casa') || lowerText.includes('invest') || lowerText.includes('consorcio') || lowerText.includes('juro') || lowerText.includes('construir')) {
            return {
                response: "Investir com inteligência é não pagar juros. O consórcio é a estratégia ideal para ampliar seu patrimônio imobiliário ou renovar sua frota.",
                action: { label: "Simular Consórcio", link: LINK_SISTEMA_CONSORCIO }
            };
        }

        if (lowerText.includes('saude') || lowerText.includes('medico') || lowerText.includes('hospit') || lowerText.includes('convenio')) {
            return {
                response: "Sua saúde é seu bem mais valioso. Trabalhamos com a rede premium (Bradesco, Amil, SulAmérica) para garantir o melhor atendimento.",
                action: { label: "Ver Planos de Saúde", route: 'saude' as RouteName }
            };
        }

        return {
            response: "Entendi perfeitamente. Para essa questão específica, vou conectar você diretamente com um de nossos consultores especialistas no WhatsApp.",
            action: { label: "Chamar no WhatsApp", route: 'contato' as RouteName }
        };
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const analysis = analyzeRequest(userMsg.text);
            const botMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                text: analysis.response, 
                sender: 'bot',
                action: analysis.action
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-inter">
            <div 
                className={`mb-6 w-[300px] md:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 origin-bottom-right ${
                    isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-12 pointer-events-none h-0'
                }`}
            >
                <div className="bg-trust-blue p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Consultoria Conseg</h3>
                            <p className="text-[10px] text-blue-200 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span> Online Agora
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="h-[350px] bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div 
                                className={`max-w-[85%] p-3 text-sm rounded-xl ${
                                    msg.sender === 'user' 
                                    ? 'bg-trust-blue text-white rounded-tr-none' 
                                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                                }`}
                            >
                                {msg.text}
                            </div>
                            
                            {msg.action && (
                                <button 
                                    onClick={() => {
                                        if (msg.action?.link) {
                                            window.open(msg.action.link, '_blank');
                                        } else if (msg.action?.route) {
                                            onNavigate(msg.action.route);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="mt-2 text-xs font-bold bg-warm-gold text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors self-start flex items-center gap-1 shadow-sm"
                                >
                                    {msg.action.label} <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="text-xs text-slate-400 ml-2 flex items-center gap-1">
                            <span>Analisando</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua necessidade..."
                        className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trust-blue/50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-2 bg-trust-blue text-white rounded-lg hover:bg-trust-light disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-trust-blue hover:bg-trust-light text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </button>
        </div>
    );
};

const SimpleDiagnostic = ({ onComplete }: { onComplete?: (system: string) => void }) => {
    const [input, setInput] = useState('');
    const [stage, setStage] = useState<'idle' | 'analyzing' | 'result'>('idle');
    const [suggestion, setSuggestion] = useState<{ name: string, id: string, reason: string, link?: string } | null>(null);

    const analyzeNeed = () => {
        if (!input.trim()) return;
        setStage('analyzing');

        setTimeout(() => {
            const text = input.toLowerCase();
            let result = { 
                name: 'Falar com Consultor', 
                id: 'contato', 
                reason: 'Entendemos que sua necessidade é específica. Nossos especialistas vão analisar seu caso com atenção exclusiva.',
                link: undefined
            };
            
            if (text.includes('carro') || text.includes('moto') || text.includes('frota') || text.includes('veiculo')) {
                result = { name: 'Seguro Auto & Frota', id: 'auto', reason: 'Garanta a continuidade da sua mobilidade. Proteção total contra imprevistos para você ou sua empresa.', link: undefined };
            } else if (text.includes('saude') || text.includes('hospital') || text.includes('doença') || text.includes('medico')) {
                result = { name: 'Gestão de Saúde', id: 'saude', reason: 'Acesso à medicina de ponta é inegociável. Temos as melhores redes credenciadas para sua segurança.', link: undefined };
            } else if (text.includes('filho') || text.includes('familia') || text.includes('esposa') || text.includes('marido') || text.includes('vida') || text.includes('patrimonio')) {
                result = { name: 'Planejamento Sucessório (Vida)', id: 'vida', reason: 'Proteja seu legado e garanta o padrão de vida da sua família. A forma mais inteligente de sucessão patrimonial.', link: LINK_SISTEMA_LEGADO };
            } else if (text.includes('casa') || text.includes('investir') || text.includes('comprar') || text.includes('imovel')) {
                result = { name: 'Consórcio Estratégico', id: 'consorcio', reason: 'Amplie seu patrimônio sem pagar juros. A ferramenta financeira ideal para aquisição de imóveis e veículos.', link: LINK_SISTEMA_CONSORCIO };
            }

            setSuggestion(result);
            setStage('result');
            if(onComplete && !result.link) onComplete(result.id);
        }, 1500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-trust-blue p-8 text-white text-center">
                <h3 className="font-serif font-bold text-2xl mb-2">Consultoria Inteligente</h3>
                <p className="text-blue-100 text-sm">Descreva o que você busca para proteger ou ampliar seu patrimônio.</p>
            </div>

            <div className="p-8 bg-slate-50">
                {stage === 'idle' && (
                    <div className="space-y-4">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-trust-blue/20 outline-none h-32 resize-none"
                            placeholder="Ex: Quero garantir o futuro dos meus filhos... ou... Preciso renovar a frota da empresa..."
                        />
                        <button 
                            onClick={analyzeNeed}
                            disabled={!input.trim()}
                            className="w-full bg-trust-blue text-white py-4 rounded-xl font-bold hover:bg-trust-light transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            Analisar Melhor Opção <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {stage === 'analyzing' && (
                    <div className="text-center py-10">
                        <div className="animate-spin w-10 h-10 border-4 border-trust-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600 font-bold">Processando sua necessidade estratégica...</p>
                    </div>
                )}

                {stage === 'result' && suggestion && (
                    <div className="text-center animate-fade-in">
                        <div className="inline-block p-3 bg-green-100 text-green-600 rounded-full mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-trust-blue mb-2">Solução: {suggestion.name}</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">{suggestion.reason}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <button 
                                onClick={() => { setStage('idle'); setInput(''); }}
                                className="text-slate-500 text-sm font-bold underline hover:text-trust-blue"
                            >
                                Nova Consulta
                            </button>
                            <button 
                                onClick={() => {
                                    if (suggestion.link) {
                                        window.open(suggestion.link, '_blank');
                                    } else {
                                        onComplete && onComplete(suggestion.id);
                                    }
                                }}
                                className="bg-trust-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-trust-light shadow-lg"
                            >
                                Acessar Solução
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentRoute, setCurrentRoute] = useState<RouteName>('inicio');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1).split('?')[0] as RouteName;
            if (hash) {
                setCurrentRoute(hash);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        if (window.location.hash) handleHashChange();
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const updateRoute = (route: RouteName) => {
        window.location.hash = route;
        setCurrentRoute(route);
    };

    const renderLogos = () => (
        <div className="py-10 border-y border-slate-100 bg-slate-50/50 mb-12">
            <div className="container mx-auto px-4">
                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Parceiros Estratégicos</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {INSURERS.map((insurer) => (
                        <div key={insurer.name} className="group flex flex-col items-center justify-center" title={insurer.name}>
                            {insurer.url.includes('http') ? (
                                <img 
                                    src={insurer.url} 
                                    alt={insurer.name}
                                    className="h-8 md:h-10 w-auto object-contain hover:scale-110 transition-transform"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const span = (e.target as HTMLImageElement).nextSibling as HTMLElement;
                                        if(span) span.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span className="text-xs font-bold text-slate-500 hidden group-hover:block mt-1">{insurer.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (currentRoute) {
            case 'inicio':
                return (
                    <div className="animate-fade-in">
                        {/* HERO SECTION - Espaçamento Mobile Ajustado para pt-28 */}
                        <section className="relative pt-28 md:pt-48 pb-20 bg-[#F9FAFB] overflow-hidden">
                            <div className="container mx-auto px-4 text-center relative z-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-trust-blue text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200">
                                    Segurança Patrimonial & Familiar
                                </span>
                                <h1 className="font-serif text-4xl md:text-6xl font-bold text-trust-blue leading-tight mb-6">
                                    Proteja o que você levou <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-blue to-blue-600">uma vida inteira para construir.</span>
                                </h1>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                                    Unimos inteligência estratégica e atendimento humano para blindar seu patrimônio e garantir o futuro da sua família. Seguros e Consórcios sem burocracia.
                                </p>
                                <div className="mx-auto max-w-3xl">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                        <Button onClick={() => updateRoute('contato')} className="w-full sm:w-auto min-w-[220px] shadow-2xl">
                                            Solicitar Estudo
                                        </Button>
                                        <Button variant="secondary" onClick={() => updateRoute('sobre')} className="w-full sm:w-auto min-w-[220px]">
                                            Nossa História
                                        </Button>
                                    </div>
                                </div>

                                <SimpleDiagnostic onComplete={(route) => updateRoute(route as RouteName)} />
                            </div>
                        </section>

                        {/* LOGOS SECTION */}
                        {renderLogos()}

                        {/* CARDS DE SERVIÇOS SIMPLIFICADOS */}
                        <section className="py-10 bg-white">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl font-serif font-bold text-trust-blue mb-4">Soluções Completas</h2>
                                    <p className="text-slate-500">Gestão de riscos e ampliação de patrimônio em um só lugar.</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {/* Vida */}
                                    <div onClick={() => updateRoute('vida')} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-trust-blue hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-trust-blue mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                            <Umbrella size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-trust-blue mb-3">Seguro de Vida & Sucessão</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            A certeza de que o padrão de vida da sua família será mantido. Liquidez imediata e proteção financeira.
                                        </p>
                                        <span className="text-trust-blue text-sm font-bold flex items-center gap-2 mt-auto">Ver detalhes <ArrowRight size={16}/></span>
                                    </div>

                                    {/* Auto */}
                                    <div onClick={() => updateRoute('auto')} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-trust-blue hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-trust-blue mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                            <Car size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-trust-blue mb-3">Auto & Frota</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            Mais que proteção veicular: sua tranquilidade no trânsito com assistência completa e agilidade no sinistro.
                                        </p>
                                        <span className="text-trust-blue text-sm font-bold flex items-center gap-2 mt-auto">Ver detalhes <ArrowRight size={16}/></span>
                                    </div>

                                    {/* Saúde */}
                                    <div onClick={() => updateRoute('saude')} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-trust-blue hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-trust-blue mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                            <Heart size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-trust-blue mb-3">Saúde Premium</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            O maior patrimônio é a sua saúde. Acesso à melhor medicina do país para você e seus colaboradores.
                                        </p>
                                        <span className="text-trust-blue text-sm font-bold flex items-center gap-2 mt-auto">Ver detalhes <ArrowRight size={16}/></span>
                                    </div>

                                    {/* Consórcio */}
                                    <div onClick={() => updateRoute('consorcio')} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-trust-blue hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-trust-blue mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                            <TrendingUp size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-trust-blue mb-3">Consórcios</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            Planejamento financeiro inteligente. Aumente seu patrimônio imobiliário e veicular fugindo dos juros bancários.
                                        </p>
                                        <span className="text-trust-blue text-sm font-bold flex items-center gap-2 mt-auto">Ver detalhes <ArrowRight size={16}/></span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                );

            case 'vida':
                return (
                    <SectionWrapper id="vida" title="Seguro de Vida" subtitle="Garantia de futuro para quem você mais ama.">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                <p>
                                    Seguro de vida não é sobre morte, é sobre <strong>amor e responsabilidade</strong>. É garantir que sua família mantenha a dignidade, a casa e os estudos dos filhos, independente das circunstâncias.
                                </p>
                                <h4 className="font-bold text-trust-blue text-xl mt-4">Pilares da Proteção:</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24}/>
                                        <span><strong>Sucessão Patrimonial:</strong> Liquidez imediata para custos de inventário, sem travar os bens da família.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24}/>
                                        <span><strong>Proteção em Vida:</strong> Indenização para diagnóstico de doenças graves (Câncer, Infarto, AVC) para custear o melhor tratamento.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={24}/>
                                        <span><strong>Personalização:</strong> Apólices desenhadas sob medida para sua realidade financeira.</span>
                                    </li>
                                </ul>
                                <div className="pt-8 flex justify-center md:justify-start">
                                    <Button onClick={() => window.open(LINK_SISTEMA_LEGADO, '_blank')} className="w-full sm:w-auto shadow-2xl">
                                        Simular Proteção Agora <ExternalLink size={18} className="ml-2"/>
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-center md:text-left">Redirecionamento seguro para nosso sistema de cálculo.</p>
                            </div>
                            <div className="md:order-last order-first">
                                <BannerGenerator 
                                    title="Legado & Família" 
                                    image="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop"
                                />
                            </div>
                        </div>
                        {renderLogos()}
                    </SectionWrapper>
                );

            case 'auto':
                return (
                    <SectionWrapper id="auto" title="Seguro Auto & Frota" subtitle="Sua liberdade de ir e vir, sempre protegida.">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:order-first order-last">
                                <BannerGenerator 
                                    title="Seguro Auto" 
                                    image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2883&auto=format&fit=crop"
                                />
                            </div>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                <p>
                                    O trânsito é imprevisível, mas sua segurança não pode ser. Com a ConsegSeguro, você tem a certeza de resolução rápida para qualquer incidente, seja um pequeno reparo ou um sinistro complexo.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-trust-blue flex items-center gap-2 mb-1"><AlertTriangle size={16}/> Assistência 24h</h4>
                                        <p className="text-sm text-slate-500">Guincho e socorro mecânico em todo território nacional.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-trust-blue flex items-center gap-2 mb-1"><Car size={16}/> Carro Reserva</h4>
                                        <p className="text-sm text-slate-500">Sua rotina não para enquanto cuidamos do seu veículo.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-trust-blue flex items-center gap-2 mb-1"><ShieldCheck size={16}/> Danos a Terceiros</h4>
                                        <p className="text-sm text-slate-500">Proteção jurídica e financeira em acidentes com terceiros.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-trust-blue flex items-center gap-2 mb-1"><Briefcase size={16}/> Gestão de Frotas</h4>
                                        <p className="text-sm text-slate-500">Condições exclusivas para blindar o patrimônio da sua empresa.</p>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-center md:justify-start">
                                    <Button onClick={() => updateRoute('contato')} className="w-full sm:w-auto">
                                        Solicitar Cotação Auto
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {renderLogos()}
                    </SectionWrapper>
                );

            case 'saude':
                const whatsappMessage = encodeURIComponent("Olá, preciso de um plano de saúde individual ou PME.");
                const whatsappLink = `https://wa.me/5561999949724?text=${whatsappMessage}`;

                return (
                    <SectionWrapper id="saude" title="Planos de Saúde" subtitle="Medicina de Ponta & Rede Premium.">
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                            <div className="space-y-6">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Em momentos críticos, o acesso rápido aos melhores hospitais e especialistas faz toda a diferença. Um plano de saúde bem estruturado é o <strong>"cinto de segurança"</strong> da sua vida e o benefício mais valorizado por colaboradores.
                                </p>
                                
                                <ul className="space-y-4 my-6">
                                    <li className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle className="text-trust-blue mt-1 flex-shrink-0" size={20}/>
                                        <span><strong>Rede Credenciada Premium:</strong> Acesso aos hospitais de referência (Sírio-Libanês, Einstein).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle className="text-trust-blue mt-1 flex-shrink-0" size={20}/>
                                        <span><strong>Reembolso Ágil:</strong> Liberdade para escolher seus médicos de confiança fora da rede.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle className="text-trust-blue mt-1 flex-shrink-0" size={20}/>
                                        <span><strong>Gestão PME:</strong> Planos empresariais com redução de custos e isenção de carência (conforme regras).</span>
                                    </li>
                                </ul>

                                <div className="pt-4">
                                    <Button onClick={() => window.open(whatsappLink, '_blank')} className="w-full sm:w-auto shadow-2xl flex items-center gap-2">
                                        <MessageCircle size={20} /> Falar com Especialista Saúde
                                    </Button>
                                    <p className="text-xs text-slate-400 mt-2">Atendimento direto via WhatsApp para cotação personalizada.</p>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <BannerGenerator 
                                    title="Saúde & Bem-estar" 
                                    image="https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2070&auto=format&fit=crop"
                                    className="aspect-[4/3] shadow-2xl"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center group hover:border-trust-blue transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-trust-blue mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <Stethoscope size={32} />
                                </div>
                                <h3 className="font-serif font-bold text-xl mb-3 text-trust-blue">Individual e Familiar</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Proteção completa para você e sua família com cobertura nacional e acomodação em apartamento.
                                </p>
                            </div>

                            <div className="bg-trust-blue p-8 rounded-3xl shadow-premium text-center relative overflow-hidden group transform hover:-translate-y-2 transition-all duration-300">
                                <div className="absolute top-0 right-0 bg-warm-gold text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MAIS PROCURADO</div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mx-auto mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <Building2 size={32} />
                                </div>
                                <h3 className="font-serif font-bold text-xl mb-3 text-white">Empresarial (PME)</h3>
                                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                                    Use seu CNPJ (a partir de 2 vidas) para contratar planos até 40% mais econômicos que o individual.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center group hover:border-trust-blue transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-trust-blue mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <Star size={32} />
                                </div>
                                <h3 className="font-serif font-bold text-xl mb-3 text-trust-blue">Linha Black/Premium</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Coberturas internacionais, check-up executivo anual e os maiores múltiplos de reembolso do mercado.
                                </p>
                            </div>
                        </div>
                        
                        {renderLogos()}
                    </SectionWrapper>
                );

            case 'consorcio':
                return (
                    <SectionWrapper id="consorcio" title="Consórcio Inteligente" subtitle="Construa patrimônio sem pagar juros.">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                             <div className="md:order-first order-last">
                                <BannerGenerator 
                                    title="Consórcio" 
                                    image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
                                />
                            </div>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                <h3 className="text-2xl font-bold text-trust-blue">Por que investir via consórcio?</h3>
                                <p>
                                    É a ferramenta financeira mais sofisticada para quem planeja. Você adquire bens de alto valor pagando apenas uma taxa administrativa, fugindo dos juros compostos do financiamento bancário.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <Home className="text-trust-blue" size={28}/>
                                        <div>
                                            <strong className="block text-slate-800">Imóveis e Construção</strong>
                                            <span className="text-sm text-slate-500">Saia do aluguel, compre terrenos ou construa sua casa.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <Car className="text-trust-blue" size={28}/>
                                        <div>
                                            <strong className="block text-slate-800">Veículos e Pesados</strong>
                                            <span className="text-sm text-slate-500">Carros, motos e caminhões sem entrada e sem juros.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <Briefcase className="text-trust-blue" size={28}/>
                                        <div>
                                            <strong className="block text-slate-800">Serviços</strong>
                                            <span className="text-sm text-slate-500">Reformas, viagens e procedimentos estéticos.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-center md:justify-start">
                                    <Button onClick={() => window.open(LINK_SISTEMA_CONSORCIO, '_blank')} className="w-full sm:w-auto shadow-2xl">
                                        Simular Consórcio <ExternalLink size={18} className="ml-2"/>
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-center md:text-left">Acesso ao simulador oficial Conseg.</p>
                            </div>
                        </div>
                    </SectionWrapper>
                );

            case 'sobre':
                return (
                    <SectionWrapper id="sobre" title="Quem Somos" subtitle="Compromisso com a sua história.">
                        <div className="max-w-4xl mx-auto">
                            <BannerGenerator 
                                title="Nossa Trajetória" 
                                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                                className="aspect-[21/9] mb-12 shadow-2xl"
                            />
                            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100 text-center">
                                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                                    A ConsegSeguro atua <strong>desde 1991</strong> com uma missão clara: oferecer <strong>tranquilidade real</strong>. Não vendemos apenas apólices, entregamos a certeza de que, nos momentos mais delicados, você não estará sozinho.
                                </p>
                                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                                    Combinamos a tradição de uma corretora que conhece cada cliente pelo nome com a agilidade da tecnologia moderna. Brigamos pelos seus direitos e garantimos que sua proteção seja efetiva.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-100">
                                    <div>
                                        <h4 className="text-4xl font-serif font-bold text-trust-blue mb-2">1991</h4>
                                        <p className="text-sm text-slate-400 uppercase tracking-widest">Ano de Fundação</p>
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-serif font-bold text-trust-blue mb-2">+5k</h4>
                                        <p className="text-sm text-slate-400 uppercase tracking-widest">Vidas e Bens Protegidos</p>
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-serif font-bold text-trust-blue mb-2">100%</h4>
                                        <p className="text-sm text-slate-400 uppercase tracking-widest">Dedicação ao Cliente</p>
                                    </div>
                                </div>
                            </div>
                            {renderLogos()}
                        </div>
                    </SectionWrapper>
                );

            case 'contato':
                return (
                    <SectionWrapper id="contato" title="Fale Conosco" subtitle="Nossos especialistas estão prontos para ouvir você.">
                         <div className="max-w-3xl mx-auto">
                            <ContactForm initialProduct="" />
                            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                                <div onClick={() => window.open(CONTACT_WHATSAPP_LINK, '_blank')} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all">
                                    <Phone className="mx-auto text-trust-blue mb-3" size={24} />
                                    <h4 className="font-bold text-trust-blue mb-2">WhatsApp / Telefone</h4>
                                    <p className="text-slate-600 text-sm hover:text-trust-blue">{CONTACT_PHONE_DISPLAY}</p>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <Send className="mx-auto text-trust-blue mb-3" size={24} />
                                    <h4 className="font-bold text-trust-blue mb-2">E-mail</h4>
                                    <p className="text-slate-600 text-sm">{CONTACT_EMAIL}</p>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <Home className="mx-auto text-trust-blue mb-3" size={24} />
                                    <h4 className="font-bold text-trust-blue mb-2">Endereço</h4>
                                    <p className="text-slate-600 text-sm px-4">{CONTACT_ADDRESS}</p>
                                </div>
                            </div>
                        </div>
                    </SectionWrapper>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-inter selection:bg-trust-blue selection:text-white">
            <Navigation currentRoute={currentRoute} onNavigate={updateRoute} />
            
            <main>
                {renderContent()}
            </main>

            {/* Footer */}
            <footer className="bg-trust-blue text-white py-12 border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="font-serif text-2xl font-bold mb-4">Conseg<span className="text-warm-gold">Seguro</span></h3>
                            <p className="text-blue-200 text-sm leading-relaxed max-w-md">
                                Sua corretora de confiança desde 1991. Protegemos o que você conquistou com seriedade e transparência.
                            </p>
                            <div className="mt-6 text-blue-200 text-sm space-y-2">
                                <p className="flex items-center gap-2"><Phone size={14} /> {CONTACT_PHONE_DISPLAY}</p>
                                <p className="flex items-center gap-2"><Send size={14} /> {CONTACT_EMAIL}</p>
                                <p className="flex items-start gap-2"><Home size={14} className="mt-1 flex-shrink-0" /> {CONTACT_ADDRESS}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Serviços</h4>
                            <ul className="space-y-2 text-sm text-blue-200">
                                <li><button onClick={() => updateRoute('vida')} className="hover:text-white">Seguro de Vida</button></li>
                                <li><button onClick={() => updateRoute('auto')} className="hover:text-white">Seguro Auto</button></li>
                                <li><button onClick={() => updateRoute('saude')} className="hover:text-white">Planos de Saúde</button></li>
                                <li><button onClick={() => updateRoute('consorcio')} className="hover:text-white">Consórcios</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contato</h4>
                            <ul className="space-y-2 text-sm text-blue-200">
                                <li><button onClick={() => window.open(CONTACT_WHATSAPP_LINK, '_blank')} className="hover:text-white">Fale pelo WhatsApp</button></li>
                                <li><button onClick={() => updateRoute('sobre')} className="hover:text-white">Quem Somos</button></li>
                                <li><a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2"><Instagram size={14}/> Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 text-center text-xs text-blue-300">
                        &copy; {new Date().getFullYear()} ConsegSeguro Corretora. Todos os direitos reservados.
                    </div>
                </div>
            </footer>

            <SentinelChat onNavigate={updateRoute} />
        </div>
    );
}

export default App;
