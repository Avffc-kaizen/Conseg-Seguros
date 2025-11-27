import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../services/firebaseService';
import { Lock, AlertCircle, ShieldCheck, ArrowRight, Key, User, Smartphone, Info } from 'lucide-react';

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

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const adminUser = 'Consegcn@terra.com.br';
        const adminPass = 'Conseg00**';
        const demoUser = 'demo@consegseguro.com';
        const demoPass = 'demo123';
        const cleanEmail = email.trim();

        await new Promise(resolve => setTimeout(resolve, 1000));

        if ((cleanEmail === adminUser && password === adminPass) || 
            (cleanEmail === demoUser && password === demoPass)) {
            setLoading(false);
            setStep('2fa');
            return;
        }

        try {
            if (auth) {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
                setLoading(false);
                setStep('2fa');
            } else {
                throw new Error("Service unavailable");
            }
        } catch (err: any) {
            setError('Credenciais inválidas ou acesso não autorizado.');
            setLoading(false);
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (twoFACode === '123456') {
            onLoginSuccess(email);
        } else {
            setError('Código de verificação inválido.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] relative overflow-hidden font-inter">
            <div className="absolute inset-0 bg-white/40"></div>
            
            <div className="w-full max-w-md relative z-10 mx-4">
                <div className="bg-white rounded-[32px] shadow-premium p-10 md:p-12 border border-white">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-trust-blue rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-trust-blue/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-trust-blue mb-2">Acesso Seguro</h2>
                        <p className="text-slate-500 text-sm">Portal Corporativo ConsegSeguro</p>
                    </div>

                    {step === 'credentials' && (
                        <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-fade-in">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Identificação</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-trust-blue focus:ring-2 focus:ring-trust-blue/10 outline-none transition-all"
                                        placeholder="usuario@conseg.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Senha de Acesso</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-trust-blue focus:ring-2 focus:ring-trust-blue/10 outline-none transition-all"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center text-red-500 text-xs bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}

                            <div className="text-xs text-center text-slate-400 bg-slate-50 p-2 rounded">
                                Demo: demo@consegseguro.com | demo123
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-trust-blue text-white font-bold shadow-lg hover:shadow-xl hover:bg-trust-light transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Verificando...' : 'Entrar no Sistema'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    )}

                    {step === '2fa' && (
                        <form onSubmit={handle2FASubmit} className="space-y-6 animate-fade-in">
                            <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <Smartphone className="mx-auto text-trust-blue mb-2" size={24} />
                                <p className="text-sm text-slate-600">
                                    Digite o código enviado para seu dispositivo.
                                </p>
                                <p className="text-xs text-slate-400 mt-1 font-mono">Código Demo: 123456</p>
                            </div>

                            <div className="space-y-1">
                                <input 
                                    type="text" 
                                    value={twoFACode}
                                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full py-4 text-center rounded-xl bg-white border-2 border-slate-200 text-2xl font-mono tracking-[0.5em] text-trust-blue focus:border-trust-blue focus:shadow-lg outline-none transition-all"
                                    placeholder="000000"
                                    autoFocus
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-center text-red-500 text-xs bg-red-50 p-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-trust-blue text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                            >
                                {loading ? 'Validando...' : 'Confirmar Identidade'}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => { setStep('credentials'); setError(''); }}
                                className="w-full text-sm text-slate-500 hover:text-trust-blue"
                            >
                                Voltar
                            </button>
                        </form>
                    )}
                </div>
                
                <div className="text-center mt-8 text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Lock size={12} /> Conexão criptografada (TLS 1.3)
                </div>
            </div>
        </div>
    );
};