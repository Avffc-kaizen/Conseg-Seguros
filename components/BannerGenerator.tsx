import React from 'react';

interface BannerGeneratorProps {
    title: string;
    image: string;
    className?: string;
}

export const BannerGenerator: React.FC<BannerGeneratorProps> = ({ title, image, className = '' }) => {
    return (
        <div className={`relative w-full rounded-3xl overflow-hidden shadow-premium border border-white/20 group ${className}`}>
            {/* Display Area */}
            <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-slate-900">
                <img 
                    src={image} 
                    alt={`Banner ${title}`} 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-trust-blue/90 via-trust-blue/20 to-transparent opacity-80" />

                {/* Context Label - Static & Premium */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-block">
                        <span className="block text-warm-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                            Conseg Private
                        </span>
                        <h3 className="text-white font-serif text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg">
                            {title}
                        </h3>
                        <div className="h-1 w-12 bg-warm-gold mt-3 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};