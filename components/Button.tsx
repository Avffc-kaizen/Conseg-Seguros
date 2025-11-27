import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'gold';
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    children, 
    fullWidth = false,
    className = '',
    ...props 
}) => {
    const baseClasses = "relative font-orbitron font-bold tracking-wider py-4 px-8 rounded-xl transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group";
    
    const variants = {
        // Deep Navy Premium - Authority & Trust
        primary: "bg-gradient-to-br from-trust-blue to-[#1E3A8A] text-white shadow-[0_8px_25px_-8px_rgba(15,42,74,0.6)] hover:shadow-[0_15px_35px_-10px_rgba(15,42,74,0.7)] hover:-translate-y-1 border-t border-white/20",
        
        // Clean Outline - Professional & Minimal
        secondary: "bg-transparent text-slate-600 border-2 border-slate-200 hover:border-trust-blue hover:text-trust-blue hover:bg-white hover:shadow-lg hover:-translate-y-1",
        
        // Gold Accent - High Value Actions
        gold: "bg-gradient-to-br from-warm-gold to-[#B8860B] text-white shadow-[0_8px_25px_-8px_rgba(197,160,89,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(197,160,89,0.6)] hover:-translate-y-1 border-t border-white/20"
    };

    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
            
            <span className="relative z-20 flex items-center gap-2">
                {children}
            </span>
        </button>
    );
};