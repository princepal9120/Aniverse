import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, Genre } from "@/lib/api";
import { User, Mail, Lock } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    favourite_genres: [] as Genre[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await api.genres.getGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load genres",
          variant: "destructive",
        });
      }
    };
    fetchGenres();
  }, []);

  const toggleGenre = (genre: Genre) => {
    setFormData((prev) => ({
      ...prev,
      favourite_genres: prev.favourite_genres.some(g => g.genre_id === genre.genre_id)
        ? prev.favourite_genres.filter((g) => g.genre_id !== genre.genre_id)
        : [...prev.favourite_genres, genre],
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { label: "Weak", color: "text-destructive" };
    if (password.length < 10) return { label: "Medium", color: "text-warning" };
    return { label: "Strong", color: "text-accent" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.first_name.length < 2) newErrors.first_name = "First name is too short";
    if (formData.last_name.length < 2) newErrors.last_name = "Last name is too short";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords don't match";
    }
    if (formData.favourite_genres.length === 0) {
      newErrors.favourite_genres = "Please select at least one genre";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { confirm_password, ...registrationData } = formData;
      await register({
        ...registrationData,
        role: "USER", // Default role
      });

      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6 py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-0 right-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl bottom-0 left-1/4 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg" />
          <span className="text-2xl font-bold">MagicStream</span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Start your cinematic journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                leftIcon={<User size={18} />}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={errors.first_name}
                required
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                leftIcon={<User size={18} />}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={errors.last_name}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                leftIcon={<Lock size={18} />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {formData.password && (
                <p className={`text-sm mt-1.5 ${passwordStrength.color}`}>
                  Password strength: {passwordStrength.label}
                </p>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} />}
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              error={errors.confirm_password}
              required
            />

            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Favorite Genres <span className="text-muted-foreground">(Select at least one)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.genre_id}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${formData.favourite_genres.some(g => g.genre_id === genre.genre_id)
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-background-secondary text-muted-foreground hover:bg-background-elevated hover:text-foreground"
                      }`}
                  >
                    {genre.genre_name}
                  </button>
                ))}
              </div>
              {errors.favourite_genres && (
                <p className="text-sm text-destructive mt-2">{errors.favourite_genres}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
