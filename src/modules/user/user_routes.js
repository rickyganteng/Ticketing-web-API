const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/uploads')

Route.post(
  '/',
  authMiddleware.authentication,
  uploadFile,
  userController.updateUserProfile
)
Route.get('/:id', userController.getShowTimeById)

module.exports = Route
