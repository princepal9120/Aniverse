import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Tv, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoriteContext";
import { useToast } from "@/hooks/use-toast";
import { useScrollPosition } from "@/hooks/use-scroll";
import { api, Movie, Genre } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import AnimeCarousel from "@/components/AnimeCarousel";
import AnimeInfoModal from "@/components/AnimeInfoModal";

const Movies = () => {
  const { user, logout } = useAuth();
  const { addToFavorites, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrolled = useScrollPosition();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMovies, fetchedGenres] = await Promise.all([
          api.movies.getMovies(),
          api.genres.getGenres()
        ]);
        setMovies(fetchedMovies);
        setGenres(fetchedGenres);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load movies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" ||
      movie.genre.some(g => g.genre_name === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handleAddToList = async (movie: Movie) => {
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

  // Get movies by genre
  const getMoviesByGenre = (genreName: string) => {
    return filteredMovies.filter(movie =>
      movie.genre.some(g => g.genre_name === genreName)
    );
  };

  // Get top rated from filtered
  const getTopRated = () => {
    return [...filteredMovies]
      .sort((a, b) => b.ranking.ranking_value - a.ranking.ranking_value)
      .slice(0, 15);
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
                <Link to="/movies" className="text-white font-semibold hover:text-white/80 transition-colors">
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

      {/* Header Section */}
      <div className="pt-24 pb-8 px-4 md:px-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-primary" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient-neon">Browse Anime</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/70">
            Explore our collection of {movies.length}+ amazing titles
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-2xl">
              <Input
                type="search"
                placeholder="Search anime titles..."
                leftIcon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background-secondary border-white/10"
              />
            </div>
            <Button
              variant="secondary"
              leftIcon={<SlidersHorizontal size={18} />}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Filters
            </Button>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <div className="animate-fade-in p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-white">
                Filter by Genre
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedGenre("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedGenre === "All"
                      ? "bg-primary text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                >
                  All
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.genre_id}
                    onClick={() => setSelectedGenre(genre.genre_name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedGenre === genre.genre_name
                        ? "bg-primary text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                  >
                    {genre.genre_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-white/60 text-sm">
            Showing <span className="text-primary font-bold">{filteredMovies.length}</span> of{" "}
            <span className="text-primary font-bold">{movies.length}</span> anime
            {selectedGenre !== "All" && (
              <span> in <span className="text-secondary font-bold">{selectedGenre}</span></span>
            )}
          </p>
        </div>
      </div>      {/* Content - Netflix Style Carousels */}
      <div className="pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <>
            {/* Top Rated */}
            {getTopRated().length > 0 && (
              <AnimeCarousel
                title="Top Rated"
                movies={getTopRated()}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToList}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* All Results or Filtered by Genre */}
            {selectedGenre === "All" ? (
              <>
                {/* All Anime */}
                <AnimeCarousel
                  title="All Anime"
                  movies={filteredMovies}
                  onWatchMovie={handleWatchMovie}
                  onAddToFavorites={handleAddToList}
                  onShowInfo={handleShowInfo}
                />

                {/* By Genre - Action */}
                {getMoviesByGenre("Action").length > 0 && (
                  <AnimeCarousel
                    title="Action"
                    movies={getMoviesByGenre("Action")}
                    onWatchMovie={handleWatchMovie}
                    onAddToFavorites={handleAddToList}
                    onShowInfo={handleShowInfo}
                  />
                )}

                {/* By Genre - Fantasy */}
                {getMoviesByGenre("Fantasy").length > 0 && (
                  <AnimeCarousel
                    title="Fantasy"
                    movies={getMoviesByGenre("Fantasy")}
                    onWatchMovie={handleWatchMovie}
                    onAddToFavorites={handleAddToList}
                    onShowInfo={handleShowInfo}
                  />
                )}

                {/* By Genre - Thriller */}
                {getMoviesByGenre("Thriller").length > 0 && (
                  <AnimeCarousel
                    title="Thriller"
                    movies={getMoviesByGenre("Thriller")}
                    onWatchMovie={handleWatchMovie}
                    onAddToFavorites={handleAddToList}
                    onShowInfo={handleShowInfo}
                  />
                )}

                {/* By Genre - Comedy */}
                {getMoviesByGenre("Comedy").length > 0 && (
                  <AnimeCarousel
                    title="Comedy"
                    movies={getMoviesByGenre("Comedy")}
                    onWatchMovie={handleWatchMovie}
                    onAddToFavorites={handleAddToList}
                    onShowInfo={handleShowInfo}
                  />
                )}
              </>
            ) : (
              /* Filtered Results */
              <AnimeCarousel
                title={`${selectedGenre} Anime`}
                movies={filteredMovies}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToList}
                onShowInfo={handleShowInfo}
              />
            )}

            {/* Search Results */}
            {searchQuery && (
              <AnimeCarousel
                title={`Search Results for "${searchQuery}"`}
                movies={filteredMovies}
                onWatchMovie={handleWatchMovie}
                onAddToFavorites={handleAddToList}
                onShowInfo={handleShowInfo}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-white/40" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">No anime found</h3>
            <p className="text-white/60 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Clear Filters
            </Button>
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
          onAddToFavorites={handleAddToList}
        />
      )}
    </div>
  );
};

export default Movies;
