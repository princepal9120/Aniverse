package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/princepal9120/ai-movie-recommedation/server/database"
	"github.com/princepal9120/ai-movie-recommedation/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	client := database.Connect()
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatalf("Failed to disconnect from MongoDB: %v", err)
		}
	}()

	if err := seedGenresFromJSON(client); err != nil {
		log.Fatalf("Failed to seed genres: %v", err)
	}

	if err := seedRankingsFromJSON(client); err != nil {
		log.Fatalf("Failed to seed rankings: %v", err)
	}

	if err := seedUsersFromJSON(client); err != nil {
		log.Fatalf("Failed to seed users: %v", err)
	}

	if err := seedMoviesFromJSON(client); err != nil {
		log.Fatalf("Failed to seed movies: %v", err)
	}

	fmt.Println("Database seeded successfully!")
}

func seedGenresFromJSON(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	genreCollection := database.OpenCollection("genres", client)

	count, err := genreCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return err
	}

	if count > 0 {
		fmt.Printf("Genres already exist (%d genres). Skipping...\n", count)
		return nil
	}

	data, err := os.ReadFile("../genres.json")
	if err != nil {
		return fmt.Errorf("failed to read genres.json: %v", err)
	}

	var genres []models.Genre
	if err := json.Unmarshal(data, &genres); err != nil {
		return fmt.Errorf("failed to parse genres.json: %v", err)
	}

	if len(genres) == 0 {
		fmt.Println("No genres to insert")
		return nil
	}

	var documents []interface{}
	for _, genre := range genres {
		documents = append(documents, genre)
	}

	result, err := genreCollection.InsertMany(ctx, documents)
	if err != nil {
		return err
	}

	fmt.Printf("Inserted %d genres\n", len(result.InsertedIDs))
	return nil
}

func seedRankingsFromJSON(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	rankingCollection := database.OpenCollection("rankings", client)

	count, err := rankingCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return err
	}

	if count > 0 {
		fmt.Printf("Rankings already exist (%d rankings). Skipping...\n", count)
		return nil
	}

	data, err := os.ReadFile("../rankings.json")
	if err != nil {
		return fmt.Errorf("failed to read rankings.json: %v", err)
	}

	var rankings []models.Ranking
	if err := json.Unmarshal(data, &rankings); err != nil {
		return fmt.Errorf("failed to parse rankings.json: %v", err)
	}

	if len(rankings) == 0 {
		fmt.Println("No rankings to insert")
		return nil
	}

	var documents []interface{}
	for _, ranking := range rankings {
		documents = append(documents, ranking)
	}

	result, err := rankingCollection.InsertMany(ctx, documents)
	if err != nil {
		return err
	}

	fmt.Printf("Inserted %d rankings\n", len(result.InsertedIDs))
	return nil
}

func seedUsersFromJSON(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userCollection := database.OpenCollection("users", client)

	count, err := userCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return err
	}

	if count > 0 {
		fmt.Printf("Users already exist (%d users). Skipping...\n", count)
		return nil
	}

	data, err := os.ReadFile("./users.json")
	if err != nil {
		return fmt.Errorf("failed to read users.json: %v", err)
	}

	var users []models.User
	if err := json.Unmarshal(data, &users); err != nil {
		return fmt.Errorf("failed to parse users.json: %v", err)
	}

	if len(users) == 0 {
		fmt.Println("No users to insert")
		return nil
	}

	var documents []interface{}
	for _, user := range users {
		documents = append(documents, user)
	}

	result, err := userCollection.InsertMany(ctx, documents)
	if err != nil {
		return err
	}

	fmt.Printf("Inserted %d users\n", len(result.InsertedIDs))
	return nil
}

func seedMoviesFromJSON(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	movieCollection := database.OpenCollection("movies", client)

	count, err := movieCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return err
	}

	if count > 0 {
		fmt.Printf("Movies already exist (%d movies). Skipping...\n", count)
		return nil
	}

	data, err := os.ReadFile("./movies.json")
	if err != nil {
		return fmt.Errorf("failed to read movies.json: %v", err)
	}

	var movies []models.Movie
	if err := json.Unmarshal(data, &movies); err != nil {
		return fmt.Errorf("failed to parse movies.json: %v", err)
	}

	if len(movies) == 0 {
		fmt.Println("No movies to insert")
		return nil
	}

	var documents []interface{}
	for _, movie := range movies {
		documents = append(documents, movie)
	}

	result, err := movieCollection.InsertMany(ctx, documents)
	if err != nil {
		return err
	}

	fmt.Printf("Inserted %d movies\n", len(result.InsertedIDs))
	return nil
}
