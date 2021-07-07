const express = require('express')
const Route = express.Router()
const premiereController = require('./premiere_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/uploads')
const redisMiddleware = require('../../middleware/redis')

Route.get('/name', premiereController.getPremiereName)
Route.get('/location', premiereController.getAllLocation)
Route.get('/location/:id', premiereController.getLocationById)

Route.get('/main', premiereController.getAllPremiere)
Route.get('/main/:id', premiereController.getPremiereById)

Route.get(
  '/premiere-movie',
  redisMiddleware.getPremiereByMovie,
  premiereController.premiereInfoByMovieId
)

Route.post(
  '/location',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.postLocation
)

Route.post(
  '/main',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadFile,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.postPremiere
)

Route.patch(
  '/location/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.updateLocation
)
Route.patch(
  '/main/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadFile,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.updatePremiere
)

Route.delete(
  '/location/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.deletedLocation
)
Route.delete(
  '/main/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearDataPremiereRedis,
  premiereController.deletedPremiere
)

module.exports = Route
