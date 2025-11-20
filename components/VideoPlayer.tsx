import React from 'react';

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => {
    return (
        <div className="w-full max-w-4xl mx-auto my-10 rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 group hover:border-magic-blue transition-colors duration-500">
            <div className="relative pb-[56.25%] h-0">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
};