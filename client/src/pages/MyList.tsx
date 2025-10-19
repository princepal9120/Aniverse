import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Tv, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoriteContext";
import { useToast } from "@/hooks/use-toast";
import { useScrollPosition } from "@/hooks/use-scroll";
import { Movie } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import AnimeCarousel from "@/components/AnimeCarousel";
import AnimeInfoModal from "@/components/AnimeInfoModal";

const MyList = () => {
  const { user, logout } = useAuth();
  const { favorites, removeFromFavorites, addToFavorites } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrolled = useScrollPosition();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // Favorites are loaded from context automatically
  }, []);

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

  const removeFromList = (movieId: string) => {
    removeFromFavorites(movieId);
    toast({
      title: "Removed from list",
      description: "Movie has been removed from your list",
    });
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

  const handleShowInfo = (movie: Movie) => {
    setInfoMovie(movie);
    setShowInfoModal(true);
  };

  const handleCloseInfo = () => {
    setShowInfoModal(false);
    setInfoMovie(null);
  };

  const handleAddToFavorites = (movie: Movie) => {
    // Already in favorites, so this would be a no-op
    toast({
      title: "Already in your list",
      description: `${movie.title} is in your list`,
    });
  };

  // Get movies by genre from favorites
  const getFavoritesByGenre = (genreName: string) => {
    return favorites.filter(movie =>
      movie.genre.some(g => g.genre_name === genreName)
    );
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
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/movies" className="text-white/70 hover:text-white transition-colors">
                  Browse
                </Link>
                <Link to="/my-list" className="text-white font-semibold hover:text-white/80 transition-colors">
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

      {/* Header Section */}
      <div className="pt-24 pb-8 px-4 md:px-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
            <Heart size={32} className="text-white md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient-neon">My List</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70">
              {favorites.length} {favorites.length === 1 ? "anime" : "anime"} saved for later
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-primary/50 transition-all">
              <h3 className="text-white/60 text-xs md:text-sm font-medium mb-1 flex items-center gap-2">
                <Tv size={14} className="text-primary" />
                Total
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-white">{favorites.length}</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-primary/50 transition-all">
              <h3 className="text-white/60 text-xs md:text-sm font-medium mb-1">
                Genres
              </h3>
              <p className="text-sm md:text-base font-bold text-secondary line-clamp-2">
                {user?.favourite_genres.map(g => g.genre_name).join(", ") || "None"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content - Netflix Style Carousels */}
      <div className="pb-20">
        {favorites.length > 0 ? (
          <>
            {/* All Favorites */}
            <AnimeCarousel
              title="Your Favorites"
              movies={favorites}
              onWatchMovie={handleWatchMovie}
              onAddToFavorites={handleAddToFavorites}
              onShowInfo={handleShowInfo}
            />

            {/* Favorites by Genre - Action */}
            {getFavoritesByGenre("Action").length > 0 && (
              <AnimeCarousel
                title="Action Favorites"
                movies={getFavoritesByGenre("Action")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Favorites by Genre - Fantasy */}
            {getFavoritesByGenre("Fantasy").length > 0 && (
              <AnimeCarousel
                title="Fantasy Favorites"
                movies={getFavoritesByGenre("Fantasy")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Favorites by Genre - Thriller */}
            {getFavoritesByGenre("Thriller").length > 0 && (
              <AnimeCarousel
                title="Thriller Favorites"
                movies={getFavoritesByGenre("Thriller")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Favorites by Genre - Comedy */}
            {getFavoritesByGenre("Comedy").length > 0 && (
              <AnimeCarousel
                title="Comedy Favorites"
                movies={getFavoritesByGenre("Comedy")}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToFavorites}
                onShowInfo={handleShowInfo}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-32 h-32 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/30">
              <Heart size={60} className="text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-neon">Your list is empty</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-md mx-auto">
              Start adding anime you want to watch later and build your personal collection
            </p>
            <Link to="/movies">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-black font-bold px-8 shadow-xl"
              >
                Browse Anime
              </Button>
            </Link>
          </div>
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
    </div>
  );
};

export default MyList;
