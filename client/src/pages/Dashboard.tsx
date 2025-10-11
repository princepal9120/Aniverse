import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Tv, TrendingUp, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, Movie } from "@/lib/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (!user) {
        console.log("User not authenticated, skipping recommended movies fetch");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching recommended movies for user:", user.user_id);
        const movies = await api.movies.getRecommendedMovies();
        console.log("Recommended movies response:", movies);
        setRecommendedMovies(movies || []);
      } catch (error) {
        console.error("Failed to fetch recommended movies:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load recommended movies";
        console.error("Error details:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setRecommendedMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedMovies();
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
                <Link to="/dashboard" className="text-foreground font-semibold border-b-2 border-primary pb-1">
                  Home
                </Link>
                <Link to="/movies" className="text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Featured Anime */}
      <section className="relative h-[75vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=1920&h=1080&fit=crop"
            alt="Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-destructive/20 rounded-full text-destructive text-sm font-bold border border-destructive/50 flex items-center gap-2">
                <TrendingUp size={16} />
                #1 Trending
              </div>
              <div className="px-3 py-1 bg-accent/20 rounded-full text-accent text-sm font-bold border border-accent/50">
                Shounen
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 leading-tight">
              Jujutsu Kaisen
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A boy swallows a cursed talisman and becomes possessed. He must learn sorcery to protect
              those he loves and exorcise the demons within himself in this dark supernatural action series.
            </p>
            <div className="flex items-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">4.9</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-5 h-5 text-primary">★</div>
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground">2020 • 24 Episodes • MAPPA</span>
              <div className="px-3 py-1 bg-success/20 rounded-full text-success text-sm font-bold border border-success/50">
                Ongoing
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="hero" size="lg" leftIcon={<Play size={20} />} className="shadow-glow-primary">
                Watch Now
              </Button>
              <Button variant="secondary" size="lg" leftIcon={<Plus size={20} />}>
                Add to List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended For You */}
      <section className="py-16 container mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-gradient-neon">Recommended For You</span>
          </h2>
          {user && user.favourite_genres.length > 0 && (
            <p className="text-muted-foreground flex items-center gap-2">
              Based on your favorite genres: {user.favourite_genres.map((genre, index) => (
                <span key={genre.genre_id}>
                  {index > 0 && ", "}
                  <span className="text-primary font-medium">{genre.genre_name}</span>
                </span>
              ))}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : recommendedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendedMovies.map((movie) => (
              <div
                key={movie.imdb_id}
                className="group cursor-pointer animate-fade-in"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-background-secondary border-2 border-transparent hover:border-primary/50 transition-all">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="hero" size="sm" leftIcon={<Play size={16} />} className="shadow-glow-primary">
                      Watch
                    </Button>
                    <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
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
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No recommendations available yet.</p>
          </div>
        )}
      </section>

      {/* Continue Watching */}
      <section className="py-16 container mx-auto px-6 bg-background-secondary/50 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Clock className="text-accent" size={32} />
          Continue Watching
        </h2>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-background-elevated rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={40} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            Nothing here yet. Start your anime journey!
          </p>
          <Link to="/movies">
            <Button variant="secondary">
              Browse Anime
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
