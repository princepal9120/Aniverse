import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/api";
import { useFavorites } from "@/contexts/FavoriteContext";

interface AnimeCarouselProps {
    title: string;
    movies: Movie[];
    onWatchMovie: (movie: Movie) => void;
    onAddToFavorites: (movie: Movie) => void;
    onShowInfo?: (movie: Movie) => void;
}

const AnimeCarousel = ({
    title,
    movies,
    onWatchMovie,
    onAddToFavorites,
    onShowInfo
}: AnimeCarouselProps) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { isFavorite } = useFavorites();

    const checkArrows = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkArrows();
        window.addEventListener("resize", checkArrows);
        return () => window.removeEventListener("resize", checkArrows);
    }, [movies]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            const newScrollLeft = direction === "left"
                ? scrollRef.current.scrollLeft - scrollAmount
                : scrollRef.current.scrollLeft + scrollAmount;

            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });

            setTimeout(checkArrows, 300);
        }
    };

    if (movies.length === 0) return null;

    return (
        <div className="relative group/carousel mb-12">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 px-6 text-gradient-neon">{title}</h2>

            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center hover:bg-background/95 hover:scale-110 transition-all shadow-xl">
                            <ChevronLeft size={28} className="text-white" />
                        </div>
                    </button>
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center hover:bg-background/95 hover:scale-110 transition-all shadow-xl">
                            <ChevronRight size={28} className="text-white" />
                        </div>
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    onScroll={checkArrows}
                    className="flex gap-3 overflow-x-auto scrollbar-hide px-6 py-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {movies.map((movie, index) => (
                        <div
                            key={movie.imdb_id}
                            className="flex-shrink-0 w-[180px] md:w-[220px] group/card"
                            onMouseEnter={() => setHoveredMovie(movie.imdb_id)}
                            onMouseLeave={() => setHoveredMovie(null)}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-background-secondary border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:z-10">
                                <img
                                    src={movie.poster_path}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                                {/* Hover Info */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                                    <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">
                                        {movie.title}
                                    </h3>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onWatchMovie(movie);
                                            }}
                                            className="w-8 h-8 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <Play size={16} className="text-black fill-black ml-0.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToFavorites(movie);
                                            }}
                                            className="w-8 h-8 rounded-full border-2 border-white/60 hover:border-white bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            {isFavorite(movie.imdb_id) ? (
                                                <Check size={16} className="text-white" />
                                            ) : (
                                                <Plus size={16} className="text-white" />
                                            )}
                                        </button>
                                        {onShowInfo && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onShowInfo(movie);
                                                }}
                                                className="w-8 h-8 rounded-full border-2 border-white/60 hover:border-white bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all hover:scale-110 ml-auto"
                                            >
                                                <Info size={16} className="text-white" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {movie.genre.slice(0, 2).map((g) => (
                                            <span
                                                key={g.genre_id}
                                                className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full border border-primary/30"
                                            >
                                                {g.genre_name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 text-xs text-white/80">
                                        <span className="text-primary font-bold">★</span>
                                        <span>{movie.ranking.ranking_name}</span>
                                    </div>
                                </div>

                                {/* Top Corner Badge */}
                                {hoveredMovie !== movie.imdb_id && (
                                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary border border-primary/30">
                                        {movie.ranking.ranking_name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimeCarousel;
