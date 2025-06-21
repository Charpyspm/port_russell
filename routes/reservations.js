const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();
const Reservation = require('../models/reservation');

// Route pour récupérer les réservations de l'utilisateur connecté
router.get('/me', private.checkJWT, async (req, res) => {
  try {
    const userId = req.decoded.user._id;
    const reservations = await Reservation.find({ user: userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', private.checkJWT, async (req, res) => {
  try {
    const userId = req.decoded.user._id;
    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.id,
      user: userId // Sécurité : ne supprimer que les réservations de l'utilisateur connecté
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', private.checkJWT, async (req, res) => {
  try {
    const userId = req.decoded.user._id;
    const updateFields = req.body; // { startDate, endDate, boatName, fullName, ... }
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updateFields,
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;