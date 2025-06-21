const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  catwayNumber: Number,
  startDate: Date,
  endDate: Date,
  boatName: String,
  fullName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('Reservation', reservationSchema);
