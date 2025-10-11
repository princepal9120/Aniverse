package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/princepal9120/ai-movie-recommedation/server/utils"
)

func AuthMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := utils.GetAccessToken(c)
		if err != nil {
			log.Printf("Auth Middleware: Failed to get access token - %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token not found"})
			c.Abort()
			return
		}
		if token == "" {
			log.Printf("Auth Middleware: Empty token received")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}
		claims, err := utils.ValidateToken(token)

		if err != nil {
			log.Printf("Auth Middleware: Token validation failed - %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		log.Printf("Auth Middleware: User authenticated - UserID: %s, Role: %s", claims.UserId, claims.Role)
		c.Set("userId", claims.UserId)
		c.Set("role", claims.Role)
		c.Next()

	}
}
