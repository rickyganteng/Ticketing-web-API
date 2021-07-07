const express = require('express')
const Route = express.Router()
const bookingController = require('./booking_controller')
const redisMiddleware = require('../../middleware/redis')
const authMiddleware = require('../../middleware/auth')

Route.get('/hello', bookingController.sayHello)
Route.get('/book', bookingController.getAllBooking)
Route.get(
  '/book-seat',
  authMiddleware.authentication,
  redisMiddleware.getBookingRedis,
  bookingController.getBookingById
)

Route.get(
  '/user-book',
  authMiddleware.authentication,
  redisMiddleware.getBookingRedis,
  bookingController.getUserHistory
)

Route.get(
  '/book-sale',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.getBookingRedis,
  bookingController.getBookingIncome
)

Route.post(
  '/book',
  authMiddleware.authentication,
  redisMiddleware.clearDataBookingRedis,
  bookingController.postBooking
)

module.exports = Route
