import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Tv, Info, Volume2, VolumeX, LogOut, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoriteContext";
import { useToast } from "@/hooks/use-toast";
import { useScrollPosition } from "@/hooks/use-scroll";
import { api, Movie } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import AnimeCarousel from "@/components/AnimeCarousel";
import AnimeInfoModal from "@/components/AnimeInfoModal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addToFavorites, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrolled = useScrollPosition();

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeroDetails, setShowHeroDetails] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user) {
        console.log("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const [recommended, all] = await Promise.all([
          api.movies.getRecommendedMovies(),
          api.movies.getMovies()
        ]);
        setRecommendedMovies(recommended || []);
        setAllMovies(all || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load movies";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setRecommendedMovies([]);
        setAllMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [user, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleWatchMovie = (movie: Movie) => {
    if (movie.youtube_id) {
      setSelectedMovie(movie);
      setShowPlayer(true);
    } else {
      toast({
        title: "Video not available",
        description: "This anime doesn't have a trailer yet.",
        variant: "destructive",
      });
    }
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedMovie(null);
  };

  const handleAddToFavorites = (movie: Movie) => {
    if (isFavorite(movie.imdb_id)) {
      toast({
        title: "Already in list",
        description: `${movie.title} is already in your list`,
      });
    } else {
      addToFavorites(movie);
      toast({
        title: "Added to list",
        description: `${movie.title} has been added to your list`,
      });
    }
  };

  const handleShowInfo = (movie: Movie) => {
    setInfoMovie(movie);
    setShowInfoModal(true);
  };

  const handleCloseInfo = () => {
    setShowInfoModal(false);
    setInfoMovie(null);
  };

  // Get movies by genre
  const getMoviesByGenre = (genreName: string) => {
    return allMovies.filter(movie =>
      movie.genre.some(g => g.genre_name === genreName)
    ).slice(0, 10);
  };

  // Get top rated movies
  const getTopRated = () => {
    return [...allMovies]
      .sort((a, b) => b.ranking.ranking_value - a.ranking.ranking_value)
      .slice(0, 10);
  };

  // Get trending (you can customize this logic)
  const getTrending = () => {
    return allMovies.slice(0, 10);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPlayer) {
        handleClosePlayer();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showPlayer]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Netflix Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(0,0,0,0.95)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none'
        }}
      >
        <div className="px-4 md:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tv size={18} className="text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-gradient-neon">AniVerse</span>
              </Link>
              <div className="hidden md:flex gap-6 text-sm">
                <Link to="/dashboard" className="text-white font-semibold hover:text-white/80 transition-colors">
                  Home
                </Link>
                <Link to="/movies" className="text-white/70 hover:text-white transition-colors">
                  Browse
                </Link>
                <Link to="/my-list" className="text-white/70 hover:text-white transition-colors">
                  My List
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut size={16} />}
                onClick={handleLogout}
                className="text-white/70 hover:text-white hidden md:flex"
              >
                Logout
              </Button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-primary rounded flex items-center justify-center text-primary-foreground font-bold cursor-pointer hover:scale-110 transition-transform">
                {user ? getInitials(user.first_name, user.last_name) : "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Netflix Style with Video Background */}
      <section className="relative h-[85vh] md:h-[95vh]">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {/* YouTube Embed as Background */}
            <iframe
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src={`https://www.youtube.com/embed/pkKu9hLT-t8?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=pkKu9hLT-t8&playsinline=1&enablejsapi=1`}
              title="Hero Background"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                transform: 'scale(1.5)',
                pointerEvents: 'none'
              }}
            />
          </div>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-24 right-4 md:right-12 z-20 w-10 h-10 rounded-full border-2 border-white/40 bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-all hover:scale-110"
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center px-4 md:px-12">
          <div
            className="max-w-2xl transition-all duration-500"
            style={{
              opacity: showHeroDetails ? 1 : 0,
              transform: showHeroDetails ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-red-600 rounded text-white text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} />
                #1 Trending
              </div>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-white text-xs font-bold">
                Shounen
              </div>
              <div className="px-3 py-1 bg-green-600/80 rounded text-white text-xs font-bold">
                Ongoing
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
              Jujutsu Kaisen
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <span className="text-primary text-xl font-bold">4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-primary text-lg">★</span>
                  ))}
                </div>
              </div>
              <span className="text-white/80">2020</span>
              <span className="text-white/80">•</span>
              <span className="text-white/80">24 Episodes</span>
              <span className="text-white/80">•</span>
              <span className="text-white/80">MAPPA</span>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-xl line-clamp-3">
              A boy swallows a cursed talisman and becomes possessed. He must learn sorcery to protect
              those he loves and exorcise the demons within himself in this dark supernatural action series.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-black font-bold px-8 shadow-xl"
                leftIcon={<Play size={20} className="fill-black" />}
                onClick={() => handleWatchMovie({
                  imdb_id: "jjk001",
                  title: "Jujutsu Kaisen",
                  youtube_id: "pkKu9hLT-t8",
                  poster_path: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=1920&h=1080&fit=crop",
                  genre: [{ genre_id: 1, genre_name: "Shounen" }],
                  ranking: { ranking_value: 4.9, ranking_name: "Excellent" },
                  admin_review: ""
                })}
              >
                Watch Trailer
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 font-bold"
                leftIcon={<Info size={20} />}
                onClick={() => handleShowInfo({
                  imdb_id: "jjk001",
                  title: "Jujutsu Kaisen",
                  youtube_id: "pkKu9hLT-t8",
                  poster_path: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=1920&h=1080&fit=crop",
                  genre: [{ genre_id: 1, genre_name: "Shounen" }],
                  ranking: { ranking_value: 4.9, ranking_name: "Excellent" },
                  admin_review: "An incredible supernatural action series with stunning animation by MAPPA."
                })}
              >
                More Info
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 font-bold"
                leftIcon={isFavorite("jjk001") ? <Check size={20} /> : <Plus size={20} />}
                onClick={() => handleAddToFavorites({
                  imdb_id: "jjk001",
                  title: "Jujutsu Kaisen",
                  youtube_id: "pkKu9hLT-t8",
                  poster_path: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=1920&h=1080&fit=crop",
                  genre: [{ genre_id: 1, genre_name: "Shounen" }],
                  ranking: { ranking_value: 4.9, ranking_name: "Excellent" },
                  admin_review: ""
                })}
              >
                {isFavorite("jjk001") ? "✓ My List" : "+ My List"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Rows - Netflix Style Carousels */}
      <div className="relative -mt-32 z-20 pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Recommended For You */}
            {recommendedMovies.length > 0 && (
              <AnimeCarousel
                title="Recommended For You"
                movies={recommendedMovies}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Trending Now */}
            {getTrending().length > 0 && (
              <AnimeCarousel
                title="Trending Now"
                movies={getTrending()}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Top Rated */}
            {getTopRated().length > 0 && (
              <AnimeCarousel
                title="Top Rated Anime"
                movies={getTopRated()}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Action Anime */}
            {getMoviesByGenre("Action").length > 0 && (
              <AnimeCarousel
                title="Action Anime"
                movies={getMoviesByGenre("Action")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Fantasy Anime */}
            {getMoviesByGenre("Fantasy").length > 0 && (
              <AnimeCarousel
                title="Fantasy Adventures"
                movies={getMoviesByGenre("Fantasy")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Thriller Anime */}
            {getMoviesByGenre("Thriller").length > 0 && (
              <AnimeCarousel
                title="Thrilling Series"
                movies={getMoviesByGenre("Thriller")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* All Anime */}
            {allMovies.length > 0 && (
              <AnimeCarousel
                title="Explore More"
                movies={allMovies.slice(0, 15)}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showPlayer && selectedMovie && (
        <VideoPlayer
          youtubeId={selectedMovie.youtube_id}
          title={selectedMovie.title}
          onClose={handleClosePlayer}
        />
      )}

      {showInfoModal && infoMovie && (
        <AnimeInfoModal
          movie={infoMovie}
          onClose={handleCloseInfo}
          onWatch={handleWatchMovie}
          onAddToFavorites={handleAddToFavorites}
        />
      )}

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
