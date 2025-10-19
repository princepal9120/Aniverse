# Database Seeding Instructions

This seed script will populate your MongoDB database with data from JSON files.

## Prerequisites

1. Make sure MongoDB is running and accessible
2. Ensure your `.env` file is configured with the correct database connection string
3. Have your JSON files ready in the `server/` directory

## JSON Files

The seed script reads from the following JSON files:

- `genres.json` - Movie genres
- `rankings.json` - Movie ranking values
- `users.json` - User accounts (with hashed passwords)
- `movies.json` - Movie data

## Running the Seed Script

### From the seed directory:

```bash
cd server/seed
go run seed.go
```

### Or from the server directory:

```bash
cd server
go run seed/seed.go
```

## What the Script Does

1. **Loads Environment Variables**: Reads configuration from `.env` file
2. **Connects to MongoDB**: Establishes database connection
3. **Seeds Genres**: Inserts all genres from `genres.json`
4. **Seeds Rankings**: Inserts all rankings from `rankings.json`
5. **Seeds Users**: Inserts all users from `users.json`
6. **Seeds Movies**: Inserts all movies from `movies.json`

## Important Notes

- The script checks if data already exists before inserting to prevent duplicates
- If a collection already has data, it will skip that collection
- All JSON files must be in the `server/` directory
- The script will create a new file `movies_sample.json` with sample movie data if `movies.json` is empty

## Expected Output

```
Genres already exist (9 genres). Skipping...
Rankings already exist (6 rankings). Skipping...
Users already exist (3 users). Skipping...
Movies already exist (8 movies). Skipping...
Database seeded successfully!
```

Or if collections are empty:

```
Inserted 9 genres
Inserted 6 rankings
Inserted 3 users
Inserted 8 movies
Database seeded successfully!
```

## Troubleshooting

- **File not found error**: Make sure you're running the command from the correct directory
- **Connection error**: Check your MongoDB connection string in `.env`
- **Parse error**: Verify your JSON files have valid syntax
- **Duplicate key error**: The collection may already have data with the same ID

## Sample Data

A sample `movies_sample.json` file has been created with popular movies. You can:
1. Copy the content to `movies.json` to use it
2. Or add your own movie data to `movies.json`
