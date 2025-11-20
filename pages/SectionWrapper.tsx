import React from 'react';

interface SectionWrapperProps {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, subtitle, children, className = '' }) => {
    return (
        <section id={id} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 animate-fade-in ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-cosmic mb-4 relative inline-block">
                        {title}
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-magic-blue rounded-full shadow-glow"></span>
                    </h2>
                    {subtitle && (
                        <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
};