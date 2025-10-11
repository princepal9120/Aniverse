package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/princepal9120/ai-movie-recommedation/server/controllers"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupUnProtectedRoutes(router *gin.Engine, client *mongo.Client) {


	router.GET("/movies", controllers.GetMovies(client))
	router.POST("/register", controllers.RegisterUser(client))
	router.POST("/login", controllers.LoginUser(client))
	router.POST("/logout", controllers.LogoutHandler(client))
	router.POST("/refresh", controllers.RefreshTokenHandler(client))
	router.GET("/genres", controllers.GetGenres(client))

}
