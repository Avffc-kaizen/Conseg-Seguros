import React, { useState } from 'react';
import { RouteName } from '../types';
import { Menu, X, Lock, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
    currentRoute: RouteName;
    onNavigate: (route: RouteName) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems: { id: RouteName; label: string }[] = [
        { id: 'legado', label: 'Legado' },
        { id: 'mobilidade', label: 'Mobilidade' },
        { id: 'saude', label: 'Humana' },
        { id: 'consorcio', label: 'Estratégia' },
        { id: 'filosofia', label: 'Filosofia' },
        { id: 'contato', label: 'Contato' },
    ];

    const handleNavClick = (route: RouteName) => {
        onNavigate(route);
        setIsMobileOpen(false);
    };

    // Ocultar navegação padrão se estiver no dashboard
    if (currentRoute === 'dashboard') {
        return null;
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div 
                        className="cursor-pointer group" 
                        onClick={() => handleNavClick('inicio')}
                    >
                        <span className="font-orbitron text-2xl font-bold text-cosmic group-hover:text-magic-blue transition-colors duration-300">
                            ConsegSeguro<span className="text-magic-blue">360</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`text-sm font-medium transition-all duration-200 relative group ${
                                    currentRoute === item.id ? 'text-magic-blue' : 'text-slate-600 hover:text-cosmic'
                                }`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-magic-blue transition-all duration-300 ${
                                    currentRoute === item.id ? 'w-full shadow-glow' : 'w-0 group-hover:w-full'
                                }`}></span>
                            </button>
                        ))}
                        <button 
                            onClick={() => handleNavClick('login')}
                            className="px-5 py-2 rounded-xl text-sm font-orbitron font-bold bg-cosmic text-white hover:bg-magic-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-glow flex items-center gap-2 border border-white/10"
                        >
                            <Lock size={14} /> Área do Corretor
                        </button>
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="text-cosmic hover:text-magic-blue transition-colors"
                        >
                            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`block w-full text-left px-3 py-4 text-base font-medium border-l-4 transition-all ${
                                    currentRoute === item.id 
                                    ? 'border-magic-blue text-magic-blue bg-soft-blue' 
                                    : 'border-transparent text-slate-600 hover:text-cosmic hover:bg-slate-50'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={() => handleNavClick('login')}
                            className="block w-full text-left px-3 py-4 text-base font-bold text-white bg-cosmic hover:bg-magic-blue transition-colors mt-4 rounded-lg flex items-center gap-2 justify-center"
                        >
                             <Lock size={16} /> Área do Corretor
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};