// API Configuration and Base Setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export interface ApiError {
    error: string;
    details?: string;
}

export interface Genre {
    genre_id: number;
    genre_name: string;
}

export interface Ranking {
    ranking_value: number;
    ranking_name: string;
}

export interface Movie {
    _id?: string;
    imdb_id: string;
    title: string;
    poster_path: string;
    youtube_id: string;
    genre: Genre[];
    admin_review: string;
    ranking: Ranking;
}

export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    favourite_genres: Genre[];
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    favourite_genres: Genre[];
    role?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    favourite_genres: Genre[];
}

// Helper function to handle API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: 'include', // Important for cookies
    };

    try {
        console.log(`API Request: ${config.method || 'GET'} ${url}`);
        const response = await fetch(url, config);

        // Handle different response types
        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        console.log(`API Response [${response.status}]:`, data);

        if (!response.ok) {
            const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
            console.error(`API Error: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        return data as T;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}

// Auth APIs
export const authApi = {
    register: async (userData: RegisterRequest): Promise<any> => {
        return apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return apiRequest<LoginResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    logout: async (userId: string): Promise<{ message: string }> => {
        return apiRequest('/logout', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId }),
        });
    },

    refreshToken: async (): Promise<{ message: string }> => {
        return apiRequest('/refresh', {
            method: 'POST',
        });
    },
};

// Movie APIs
export const movieApi = {
    // Public endpoint - Get all movies
    getMovies: async (): Promise<Movie[]> => {
        return apiRequest<Movie[]>('/movies', {
            method: 'GET',
        });
    },

    // Protected endpoint - Get single movie by imdb_id
    getMovie: async (imdbId: string): Promise<Movie> => {
        return apiRequest<Movie>(`/movie/${imdbId}`, {
            method: 'GET',
        });
    },

    // Protected endpoint - Add a new movie (admin only)
    addMovie: async (movieData: Omit<Movie, '_id'>): Promise<any> => {
        return apiRequest('/addmovie', {
            method: 'POST',
            body: JSON.stringify(movieData),
        });
    },

    // Protected endpoint - Get recommended movies based on user preferences
    getRecommendedMovies: async (): Promise<Movie[]> => {
        const result = await apiRequest<Movie[]>('/recommendedmovies', {
            method: 'GET',
        });
        console.log("API getRecommendedMovies response:", result);
        return result;
    },

    // Protected endpoint - Update movie admin review (admin only)
    updateReview: async (
        imdbId: string,
        adminReview: string
    ): Promise<{ ranking_name: string; admin_review: string }> => {
        return apiRequest(`/updatereview/${imdbId}`, {
            method: 'PATCH',
            body: JSON.stringify({ admin_review: adminReview }),
        });
    },
};

// Genre APIs
export const genreApi = {
    // Public endpoint - Get all genres
    getGenres: async (): Promise<Genre[]> => {
        return apiRequest<Genre[]>('/genres', {
            method: 'GET',
        });
    },
};

// Export all APIs
export const api = {
    auth: authApi,
    movies: movieApi,
    genres: genreApi,
};

export default api;
