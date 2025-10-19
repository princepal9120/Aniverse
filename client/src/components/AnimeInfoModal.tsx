import { X, Play, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/api";
import { useFavorites } from "@/contexts/FavoriteContext";

interface AnimeInfoModalProps {
    movie: Movie;
    onClose: () => void;
    onWatch: (movie: Movie) => void;
    onAddToFavorites: (movie: Movie) => void;
}

const AnimeInfoModal = ({ movie, onClose, onWatch, onAddToFavorites }: AnimeInfoModalProps) => {
    const { isFavorite } = useFavorites();

    return (
        <div
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-background-secondary rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                >
                    <X size={24} className="text-white" />
                </button>

                {/* Hero Image */}
                <div className="relative h-[300px] md:h-[400px]">
                    <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-background-secondary/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 -mt-20 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        {movie.title}
                    </h2>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <Button
                            variant="hero"
                            size="lg"
                            leftIcon={<Play size={20} />}
                            onClick={() => {
                                onWatch(movie);
                                onClose();
                            }}
                            className="shadow-glow-primary"
                        >
                            Watch Trailer
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={isFavorite(movie.imdb_id) ? <Check size={20} /> : <Plus size={20} />}
                            onClick={() => onAddToFavorites(movie)}
                        >
                            {isFavorite(movie.imdb_id) ? "In My List" : "Add to List"}
                        </Button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Rating</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">
                                    {movie.ranking.ranking_value}
                                </span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <span key={i} className="text-primary text-lg">★</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.genre.map((g) => (
                                    <span
                                        key={g.genre_id}
                                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30"
                                    >
                                        {g.genre_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Admin Review */}
                    {movie.admin_review && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Review</h3>
                            <p className="text-foreground leading-relaxed">
                                {movie.admin_review}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AnimeInfoModal;
