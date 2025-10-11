import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Trash2, Heart, Tv, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Movie } from "@/lib/api";

const MyList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch user's watchlist from API when endpoint is available
    setIsLoading(false);
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
    setWatchlist(watchlist.filter((movie) => movie.imdb_id !== movieId));
    toast({
      title: "Removed from list",
      description: "Movie has been removed from your list",
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
                <Link to="/movies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse
                </Link>
                <Link to="/my-list" className="text-foreground font-semibold border-b-2 border-primary pb-1">
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
        <div className="mb-12 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary animate-pulse-glow">
            <Heart size={40} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-gradient-neon">My List</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {watchlist.length} {watchlist.length === 1 ? "anime" : "anime"} saved for later
            </p>
          </div>
        </div>

        {/* Watchlist */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((movie, index) => (
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
                      variant="destructive"
                      size="sm"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => removeFromList(movie.imdb_id)}
                    >
                      Remove
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
          <div className="text-center py-24 bg-card rounded-2xl border-2 border-primary/20">
            <div className="w-32 h-32 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/30">
              <Heart size={60} className="text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient-neon">Your list is empty</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding anime you want to watch later and build your personal collection
            </p>
            <Link to="/movies">
              <Button variant="hero" size="lg" className="shadow-glow-primary">
                Browse Anime
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        {watchlist.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 hover:shadow-glow-primary transition-all anime-border">
              <h3 className="text-muted-foreground text-sm font-medium mb-2 flex items-center gap-2">
                <Tv size={16} className="text-primary" />
                Total Movies
              </h3>
              <p className="text-5xl font-bold text-gradient-neon">{watchlist.length}</p>
            </div>
            <div className="bg-card border-2 border-secondary/30 rounded-2xl p-6 hover:shadow-glow-secondary transition-all anime-border">
              <h3 className="text-muted-foreground text-sm font-medium mb-2 flex items-center gap-2">
                <Heart size={16} className="text-secondary" />
                Favorite Genres
              </h3>
              <p className="text-2xl font-bold text-secondary">
                {user?.favourite_genres.map(g => g.genre_name).join(", ") || "None"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
