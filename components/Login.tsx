import React, { useState, useEffect, useRef } from 'react';
import { auth, signInWithEmailAndPassword } from '../services/firebaseService';
import { Button } from './Button';
import { Lock, AlertCircle, Shield, Globe, Key, Cpu, ScanFace, Info, Smartphone, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFACode, setTwoFACode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);
    
    // Inputs refs for 2FA auto-focus logic could be added here, 
    // but using single input for simplicity in this design.

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // --- BYPASS CREDENTIALS (HARDCODED) ---
        const adminUser = 'Consegcn@terra.com.br';
        const adminPass = 'Conseg00**';
        const demoUser = 'demo@consegseguro.com';
        const demoPass = 'demo123';

        const cleanEmail = email.trim();

        // Simulação de delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        if ((cleanEmail === adminUser && password === adminPass) || 
            (cleanEmail === demoUser && password === demoPass)) {
            setLoading(false);
            setStep('2fa'); // Move to 2FA step
            return;
        }

        // --- FIREBASE AUTH (ATTEMPT) ---
        try {
            if (auth) {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
                // Se passar, move para 2FA (Autenticação simulada no frontend para este demo)
                setLoading(false);
                setStep('2fa');
            } else {
                throw new Error("Auth service unavailable");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            let errorMessage = 'Acesso Negado.';
            
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                errorMessage = 'Credenciais inválidas.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Muitas tentativas. Aguarde um momento.';
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = 'Login via Cloud desativado. Use credenciais DEMO.';
                setShowHint(true);
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Erro de conexão.';
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulação de verificação
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Código Demo Fixo: 123456
        if (twoFACode === '123456') {
            onLoginSuccess(email);
        } else {
            setError('Token de segurança inválido.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic relative overflow-hidden font-inter">
            
            {/* --- ATMOSPHERE & BACKGROUND EFFECTS --- */}
            
            {/* Grid Floor Perspective */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(transparent 0%, rgba(0, 191, 255, 0.2) 2%, transparent 3%),
                        linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.2) 2%, transparent 3%)
                    `,
                    backgroundSize: '60px 60px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)',
                    maskImage: 'linear-gradient(to bottom, transparent, black)'
                }}
            ></div>

            {/* Global Pulse Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-magic-blue/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            
            {/* Rotating Orbit Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-magic-blue/10 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-magic-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none"></div>

            {/* --- MAIN SECURITY PANEL --- */}
            <div className="w-full max-w-md relative z-10 mx-4">
                
                {/* Holographic Container */}
                <div className="backdrop-blur-xl bg-cosmic/60 border border-magic-blue/30 rounded-3xl p-1 shadow-[0_0_50px_rgba(0,191,255,0.15)] overflow-hidden relative group">
                    
                    {/* Scanning Line Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-blue to-transparent opacity-50 animate-[float_3s_ease-in-out_infinite]"></div>

                    <div className="bg-cosmic/80 rounded-[22px] p-8 sm:p-10 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                        
                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-magic-blue"></div>
                        <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-magic-blue"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-magic-blue"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-magic-blue"></div>

                        {/* STEP 1: CREDENTIALS */}
                        {step === 'credentials' && (
                            <div className="animate-fade-in">
                                {/* Header Section */}
                                <div className="text-center mb-10 relative">
                                    {/* Animated Shield Core */}
                                    <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-magic-blue/20 rounded-full animate-ping"></div>
                                        <div className="absolute inset-0 border-2 border-magic-blue rounded-full shadow-[0_0_20px_rgba(0,191,255,0.6)] flex items-center justify-center bg-cosmic">
                                            <Shield size={40} className="text-magic-blue drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]" />
                                        </div>
                                        <div className="absolute -right-2 -top-2 bg-cosmic border border-magic-blue/50 text-[10px] text-magic-blue px-2 py-0.5 rounded-full font-mono uppercase tracking-wider flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            Secure
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-3xl font-orbitron font-black text-white tracking-wider mb-2 uppercase drop-shadow-lg">
                                        Conseg<span className="text-magic-blue">Seguro</span>
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 text-magic-blue/60 text-xs font-mono tracking-[0.2em] uppercase">
                                        <Globe size={12} /> Global Access Node
                                    </div>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleCredentialsSubmit} className="space-y-6 relative z-20">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-magic-blue mb-2 font-orbitron uppercase tracking-widest ml-1">ID Operacional</label>
                                        <div className="relative transition-all duration-300 transform group-hover:scale-[1.02]">
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-magic-blue/20 text-white placeholder-slate-500 focus:border-magic-blue focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,191,255,0.2)] outline-none transition-all font-mono text-sm"
                                                placeholder="agent@consegseguro.com"
                                                required
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <ScanFace className="text-magic-blue/50" size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs font-bold text-magic-blue mb-2 font-orbitron uppercase tracking-widest ml-1">Chave de Criptografia</label>
                                        <div className="relative transition-all duration-300 transform group-hover:scale-[1.02]">
                                            <input 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-magic-blue/20 text-white placeholder-slate-500 focus:border-magic-blue focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,191,255,0.2)] outline-none transition-all font-mono text-sm"
                                                placeholder="••••••••••••"
                                                required
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Key className="text-magic-blue/50" size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hint for Demo User */}
                                    {(showHint || error) && (
                                        <div className="text-xs bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg animate-fade-in">
                                            <p className="text-blue-300 font-bold mb-1 flex items-center gap-2"><Info size={12}/> Credenciais Demo:</p>
                                            <p className="text-slate-400 font-mono">User: demo@consegseguro.com</p>
                                            <p className="text-slate-400 font-mono">Pass: demo123</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="flex items-center text-red-400 text-xs bg-red-950/30 border border-red-500/30 p-3 rounded-lg backdrop-blur-md animate-fade-in">
                                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-magic-blue to-power-blue text-white font-orbitron font-bold tracking-widest uppercase relative overflow-hidden group hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Cpu className="animate-spin" size={18} /> Validando...
                                                </>
                                            ) : (
                                                <>
                                                    Avançar <ArrowRight size={16} />
                                                </>
                                            )}
                                        </span>
                                        {/* Button Shine Effect */}
                                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: 2FA VERIFICATION */}
                        {step === '2fa' && (
                            <div className="animate-fade-in">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-magic-blue/10 rounded-full border border-magic-blue/50 mx-auto flex items-center justify-center mb-4 shadow-glow relative">
                                        <Smartphone size={36} className="text-magic-blue" />
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-black rounded-full p-1 border border-black">
                                            <ShieldCheck size={14} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">Verificação em 2 Etapas</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed max-w-[250px] mx-auto">
                                        Protocolo de segurança ativo. Um token foi enviado para seu dispositivo cadastrado.
                                    </p>
                                </div>

                                <form onSubmit={handle2FASubmit} className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-magic-blue mb-2 font-orbitron uppercase tracking-widest text-center">Token de Segurança</label>
                                        <div className="relative max-w-[200px] mx-auto">
                                            <input 
                                                type="text" 
                                                value={twoFACode}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setTwoFACode(val);
                                                }}
                                                className="w-full py-4 text-center rounded-xl bg-white/5 border-2 border-magic-blue/30 text-white text-2xl font-mono tracking-[0.5em] placeholder-slate-600 focus:border-magic-blue focus:shadow-[0_0_20px_rgba(0,191,255,0.2)] outline-none transition-all"
                                                placeholder="000000"
                                                autoFocus
                                                required
                                            />
                                        </div>
                                        <div className="text-center mt-4">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Token de Teste (Demo):</p>
                                            <p className="text-sm font-mono text-green-400 font-bold bg-green-900/20 inline-block px-3 py-1 rounded border border-green-500/20">123456</p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center justify-center text-red-400 text-xs bg-red-950/30 border border-red-500/30 p-3 rounded-lg backdrop-blur-md animate-fade-in">
                                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading || twoFACode.length < 6}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-magic-blue to-power-blue text-white font-orbitron font-bold tracking-widest uppercase relative overflow-hidden group hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Cpu className="animate-spin" size={18} /> Autenticando...
                                                </>
                                            ) : (
                                                <>
                                                    Liberar Acesso <Lock size={16} />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setStep('credentials');
                                            setTwoFACode('');
                                            setError('');
                                        }}
                                        className="w-full text-xs text-slate-500 hover:text-white transition-colors"
                                    >
                                        Voltar para Login
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Footer Status */}
                        <div className="mt-auto pt-6 border-t border-white/5 text-center">
                            <div className="flex justify-center items-center gap-4 text-[10px] text-slate-500 font-mono">
                                <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full"></div> SERVER: ONLINE</span>
                                <span className="flex items-center gap-1"><div className="w-1 h-1 bg-magic-blue rounded-full"></div> TLS 1.3 ENCRYPTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};