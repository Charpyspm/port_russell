const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');


router.get('/', async (req, res) => {
  const catways = await Catway.find({}).sort({ catwayNumber: 1 });
  res.json(catways);
});

router.post("/", async (req, res) => {
    try {
        const lastCatway = await Catway.findOne().sort({ catwayNumber: -1 });
        const nextNumber = lastCatway ? lastCatway.catwayNumber + 1 : 1;

        const { catwayType, catwayState } = req.body;
        const catway = new Catway({
            catwayNumber: nextNumber,
            catwayType,
            catwayState
        });
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});

router.patch('/:catwayNumber', async (req, res) => {
  try {
    const { catwayState } = req.body;
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.catwayNumber },
      { catwayState },
      { new: true }
    );
    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }
    res.json(catway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:catwayNumber', async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }
    res.json({ message: 'Catway supprimé' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reserve', private.checkJWT, async (req, res) => {
  try {
    const { catwayNumber, startDate, endDate, boatName, fullName } = req.body;
    const userId = req.decoded.user._id;

    
    const conflit = await Reservation.findOne({
      catwayNumber,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });
    if (conflit) {
      return res.status(400).json({ error: "Ce catway est déjà réservé sur cette période." });
    }

    const reservation = new Reservation({
      catwayNumber,
      startDate,
      endDate,
      boatName,
      fullName,
      user: userId
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;