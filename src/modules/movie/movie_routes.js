const express = require('express')
const Route = express.Router()
const movieController = require('./movie_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/uploads')
const redisMiddleware = require('../../middleware/redis')

Route.get('/name', movieController.getMovieName)
Route.get('/', redisMiddleware.getMovieRedis, movieController.getAllMovie)

Route.get(
  '/:id',
  redisMiddleware.getMovieByIdRedis,
  movieController.getMovieById
)

Route.post(
  '/',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadFile,
  redisMiddleware.clearDataMovieRedis,
  movieController.postMovie
)

Route.patch(
  '/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadFile,
  redisMiddleware.clearDataMovieRedis,
  movieController.updateMovie
)

Route.delete(
  '/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearDataMovieRedis,
  movieController.deletedMovie
)

module.exports = Route
