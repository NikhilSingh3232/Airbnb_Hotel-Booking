const express = require('express');
const bookingrouter = express.Router();
const bookingController = require('../controller/bookingController');

// Use bookingrouter instead of router
bookingrouter.get('/bookings', bookingController.getBookings);
bookingrouter.post('/book/:homeId', bookingController.postBookHome);

module.exports = bookingrouter;

