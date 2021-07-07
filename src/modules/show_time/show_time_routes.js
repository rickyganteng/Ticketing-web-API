const express = require('express')
const Route = express.Router()
const showTimeController = require('./show_time_controller')
const authMiddleware = require('../../middleware/auth')

Route.get('/hello', showTimeController.sayHello)
Route.get('/:id', showTimeController.getShowTimeById)
Route.post(
  '/',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  showTimeController.postShowTime
)
Route.patch(
  '/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  showTimeController.updateShowTime
)
Route.delete(
  '/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  showTimeController.deletedShowTime
)

module.exports = Route
