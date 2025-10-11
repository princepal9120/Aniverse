import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Star, TrendingUp, ArrowRight, Tv, Users, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen sakura-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-glow-primary">
                <Tv size={32} className="text-white" />
              </div>
              <span className="text-4xl font-bold text-gradient-neon">AniVerse</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              Your Ultimate
              <br />
              <span className="text-gradient-neon">Anime Streaming</span>
              <br />
              Platform
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Stream 10,000+ anime titles with AI-powered recommendations. 
              Discover shounen, romance, slice of life, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button variant="hero" size="lg" leftIcon={<Play size={20} />} className="shadow-glow-primary">
                  Start Watching Free
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Features
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
              <Users size={16} className="text-accent" />
              Join 100,000+ anime fans worldwide • No credit card required
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center opacity-50">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background-secondary relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 border border-primary/20">
              ✨ Premium Features
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Industry-leading anime streaming experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI-Powered Recommendations",
                description: "Smart suggestions based on your favorite genres and watch history. Discover hidden gems you'll absolutely love.",
                color: "primary",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Community Reviews & Ratings",
                description: "Read expert reviews with sentiment analysis. Know what to watch before you commit your time.",
                color: "secondary",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Personalized Experience",
                description: "Your genres, your rules. Customize your feed and get content that matters to you most.",
                color: "accent",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-2 anime-border"
              >
                <div className={`w-16 h-16 bg-${feature.color}/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anime Categories Showcase */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl top-1/2 left-1/4" />
          <div className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl bottom-1/4 right-1/4" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold mb-4">
              Browse by Genre
            </h2>
            <p className="text-xl text-muted-foreground">
              From action-packed shounen to heartwarming slice of life
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Shounen", icon: <Zap size={16} />, color: "bg-anime-shounen" },
              { name: "Seinen", icon: "🗡️", color: "bg-anime-seinen" },
              { name: "Shoujo", icon: "💖", color: "bg-anime-shoujo" },
              { name: "Slice of Life", icon: "☕", color: "bg-anime-slice-of-life" },
              { name: "Romance", icon: "💕", color: "bg-anime-romance" },
              { name: "Thriller", icon: "🔪", color: "bg-anime-thriller" },
              { name: "Fantasy", icon: "✨", color: "bg-primary" },
              { name: "Sci-Fi", icon: "🚀", color: "bg-accent" },
            ].map((genre, index) => (
              <div
                key={index}
                className={`px-6 py-3 ${genre.color}/10 border-2 border-${genre.color === 'bg-primary' ? 'primary' : genre.color === 'bg-accent' ? 'accent' : 'current'}/30 rounded-full text-lg font-semibold hover:scale-110 transition-transform cursor-pointer flex items-center gap-2`}
              >
                {typeof genre.icon === 'string' ? <span>{genre.icon}</span> : genre.icon}
                {genre.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Anime Titles" },
              { value: "100K+", label: "Active Users" },
              { value: "4.9/5", label: "User Rating" },
              { value: "24/7", label: "Streaming" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold text-gradient-neon mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to Start Your
            <br />
            <span className="text-gradient-neon">Anime Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the ultimate anime community. Create your free account and start watching in minutes.
          </p>
          <Link to="/register">
            <Button variant="hero" size="lg" rightIcon={<ArrowRight size={20} />} className="shadow-glow-primary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background-secondary border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center">
                <Tv size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-neon">AniVerse</span>
            </div>
            <div className="flex gap-8 text-muted-foreground text-sm">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Community</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 AniVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
