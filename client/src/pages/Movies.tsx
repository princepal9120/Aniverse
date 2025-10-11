import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Search, SlidersHorizontal, Tv, Clock, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, Movie, Genre } from "@/lib/api";

const Movies = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    // TODO: Implement add to list functionality
    toast({
      title: "Added to list",
      description: `${movie.title} has been added to your list`,
    });
  };

  return (
    <div className="min-h-screen sakura-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform">
                  <Tv size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient-neon">AniVerse</span>
              </Link>
              <div className="hidden md:flex gap-6 text-sm">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/movies" className="text-foreground font-semibold border-b-2 border-primary pb-1">
                  Browse
                </Link>
                <Link to="/my-list" className="text-muted-foreground hover:text-foreground transition-colors">
                  My List
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut size={18} />}
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-glow-primary cursor-pointer hover:scale-110 transition-transform">
                {user ? getInitials(user.first_name, user.last_name) : "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-primary" size={40} />
            <h1 className="text-5xl font-bold">
              <span className="text-gradient-neon">Browse Anime</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Explore our collection of {movies.length}+ amazing titles
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search anime titles..."
                leftIcon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              leftIcon={<SlidersHorizontal size={18} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <div className="animate-fade-in p-6 bg-card border-2 border-primary/30 rounded-2xl shadow-glow-primary">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-gradient-neon">Filter by Genre</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedGenre("All")}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${selectedGenre === "All"
                      ? "bg-gradient-primary text-primary-foreground shadow-glow-primary border-primary scale-105"
                      : "bg-background-secondary text-muted-foreground hover:bg-background-elevated hover:text-foreground border-border"
                    }`}
                >
                  All
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.genre_id}
                    onClick={() => setSelectedGenre(genre.genre_name)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${selectedGenre === genre.genre_name
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary border-primary scale-105"
                        : "bg-background-secondary text-muted-foreground hover:bg-background-elevated hover:text-foreground border-border"
                      }`}
                  >
                    {genre.genre_name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center gap-2">
          <p className="text-muted-foreground">
            Showing <span className="text-primary font-bold">{filteredMovies.length}</span> of <span className="text-primary font-bold">{movies.length}</span> anime
            {selectedGenre !== "All" && <span> in <span className="text-secondary font-bold">{selectedGenre}</span></span>}
          </p>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.imdb_id}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-background-secondary border-2 border-transparent hover:border-primary/50 transition-all">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="hero"
                      size="sm"
                      leftIcon={<Play size={16} />}
                      className="shadow-glow-primary"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${movie.youtube_id}`, '_blank')}
                    >
                      Watch
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus size={16} />}
                      onClick={() => handleAddToList(movie)}
                    >
                      My List
                    </Button>
                  </div>
                  {/* Ranking Badge */}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 border border-primary/30">
                    <span className="text-primary text-sm font-bold">{movie.ranking.ranking_name}</span>
                  </div>
                  {/* Genre Badge */}
                  {movie.genre.length > 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold bg-success/20 text-success border border-success/50">
                      {movie.genre[0].genre_name}
                    </div>
                  )}
                </div>
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {movie.genre.map(g => g.genre_name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border-2 border-primary/20">
            <div className="w-24 h-24 bg-background-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No anime found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
