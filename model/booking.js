const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
