import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Movie } from "@/lib/api";

interface FavoriteContextType {
    favorites: Movie[];
    addToFavorites: (movie: Movie) => void;
    removeFromFavorites: (movieId: string) => void;
    isFavorite: (movieId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Movie[]>(() => {
        // Load favorites from localStorage on initial load
        const savedFavorites = localStorage.getItem("aniverse_favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("aniverse_favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie: Movie) => {
        setFavorites((prev) => {
            // Check if movie already exists
            if (prev.some((m) => m.imdb_id === movie.imdb_id)) {
                return prev;
            }
            return [...prev, movie];
        });
    };

    const removeFromFavorites = (movieId: string) => {
        setFavorites((prev) => prev.filter((movie) => movie.imdb_id !== movieId));
    };

    const isFavorite = (movieId: string) => {
        return favorites.some((movie) => movie.imdb_id === movieId);
    };

    return (
        <FavoriteContext.Provider
            value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
        >
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoriteProvider");
    }
    return context;
};
