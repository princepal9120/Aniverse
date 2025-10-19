import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
    youtubeId: string;
    title: string;
    onClose: () => void;
}

const VideoPlayer = ({ youtubeId, title, onClose }: VideoPlayerProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const playerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";

        // Simulate loading state for smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => {
            document.body.style.overflow = "unset";
            clearTimeout(timer);
        };
    }, []);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm transition-opacity duration-300"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white shadow-2xl transition-all duration-200 hover:scale-110"
                    onClick={onClose}
                >
                    <X size={28} strokeWidth={2.5} />
                </Button>

                {/* Video Container */}
                <div
                    className="w-full max-w-7xl mx-auto transition-all duration-500 ease-out"
                    style={{
                        opacity: isLoading ? 0 : 1,
                        transform: isLoading ? 'scale(0.95)' : 'scale(1)'
                    }}
                >
                    {/* Title */}
                    <div className="mb-6 px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl">
                            {title}
                        </h2>
                    </div>

                    {/* Video Player */}
                    <div
                        ref={playerRef}
                        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-white/10"
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                            </div>
                        )}
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                            onLoad={() => setIsLoading(false)}
                        />
                    </div>

                    {/* Controls Overlay */}
                    <div className="mt-6 flex items-center justify-center px-4">
                        <div className="text-white/60 text-sm flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <span>Press</span>
                            <kbd className="px-2 py-1 bg-white/10 rounded text-white/80 font-mono text-xs border border-white/20">ESC</kbd>
                            <span>to close</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;
