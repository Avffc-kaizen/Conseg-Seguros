import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
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
    const baseClasses = "font-orbitron uppercase font-bold tracking-wider py-4 px-8 rounded-lg transition-all duration-300 ease-out active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    
    const variants = {
        // Blue gradient with stronger glow
        primary: "bg-gradient-to-r from-magic-blue to-power-blue text-white hover:brightness-110 shadow-[0_0_20px_rgba(0,191,255,0.4)] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] hover:-translate-y-1 border border-transparent",
        // Outline blue with glow on hover
        secondary: "bg-transparent text-magic-blue border-2 border-magic-blue hover:bg-magic-blue hover:text-white shadow-none hover:shadow-[0_0_20px_rgba(0,191,255,0.4)]"
    };

    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};