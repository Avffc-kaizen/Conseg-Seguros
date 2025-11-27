
import React, { useState, useEffect } from 'react';
import { RouteName } from '../types';
import { Menu, X, Shield, Share2, Phone } from 'lucide-react';

interface NavigationProps {
    currentRoute: RouteName;
    onNavigate: (route: RouteName) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems: { id: RouteName; label: string }[] = [
        { id: 'inicio', label: 'Início' },
        { id: 'vida', label: 'Seguro Vida' },
        { id: 'auto', label: 'Auto & Frota' },
        { id: 'saude', label: 'Saúde' },
        { id: 'consorcio', label: 'Consórcio' },
        { id: 'sobre', label: 'Sobre Nós' },
    ];

    const handleNavClick = (route: RouteName) => {
        onNavigate(route);
        setIsMobileOpen(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'ConsegSeguro',
            text: 'Conheça a ConsegSeguro: proteção simples para sua família.',
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link do site copiado!');
            }
        } catch (err) {
            console.log('Share dismissed', err);
        }
    };

    return (
        <nav 
            className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
                isScrolled 
                ? 'glass-nav py-2 lg:py-3 shadow-sm' 
                : 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 lg:py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 lg:h-16">
                    {/* Logo Area */}
                    <div 
                        className="cursor-pointer flex items-center gap-2 lg:gap-3 group z-50 relative" 
                        onClick={() => handleNavClick('inicio')}
                    >
                        <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500 bg-trust-blue`}>
                            <Shield size={18} className="lg:w-5 lg:h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-serif text-lg lg:text-xl font-bold leading-tight tracking-tight transition-colors duration-300 text-trust-blue`}>
                                Conseg<span className="text-warm-gold">Seguro</span>
                            </span>
                            <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold">Corretora</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center bg-slate-100/50 backdrop-blur-md rounded-full px-2 py-1 border border-slate-200/50 shadow-sm ml-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative hover:-translate-y-0.5 ${
                                    currentRoute === item.id 
                                    ? 'text-white bg-trust-blue shadow-md' 
                                    : 'text-slate-600 hover:text-trust-blue hover:bg-white'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Actions Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button 
                            className="bg-white text-slate-500 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-200 hover:text-trust-blue hover:border-trust-blue transition-all"
                        >
                            Franquia <span className="bg-blue-50 text-trust-blue text-[9px] px-1.5 py-0.5 rounded uppercase border border-blue-100">Em Breve</span>
                        </button>
                        <button 
                            onClick={() => handleNavClick('contato')}
                            className="bg-trust-blue text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-trust-light transition-all shadow-lg shadow-trust-blue/20 flex items-center gap-2"
                        >
                            <Phone size={16} /> Fale Conosco
                        </button>
                    </div>

                    {/* Mobile Menu Button - Right Aligned & Clean */}
                    <div className="lg:hidden flex items-center gap-2 z-50 relative">
                        <button 
                            onClick={handleShare}
                            className="p-2 text-trust-blue hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                            aria-label="Compartilhar"
                        >
                            <Share2 size={22} />
                        </button>
                        <button 
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="p-2 rounded-lg text-trust-blue hover:bg-blue-50 transition-colors active:scale-95"
                            aria-label="Menu"
                        >
                            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-24 pb-10 px-8">
                    {/* Centralized Links */}
                    <div className="flex flex-col items-center justify-center space-y-6 flex-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`text-2xl font-serif font-medium transition-all ${
                                    currentRoute === item.id ? 'text-trust-blue scale-110 font-bold' : 'text-slate-400 hover:text-trust-blue'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Bottom Actions */}
                    <div className="mt-auto flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                        <button 
                            className="bg-slate-50 text-slate-400 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 w-full"
                        >
                            Franquia Em Breve
                        </button>
                        <button 
                            onClick={() => window.open('https://wa.me/5561999949724', '_blank')}
                            className="w-full bg-trust-blue text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-trust-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Phone size={20} />
                            Falar no WhatsApp
                        </button>
                        <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-4">ConsegSeguro © 2025</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};
