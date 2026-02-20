const express = require('express');
const router = express.Router();
const statsController = require('../controller/statsController');

router.get('/loan-by-item', statsController.getLoanByItem);

router.get('/loan-gold-by-item', statsController.getLoanAndGoldByItem);

router.get('/monthly-interest', statsController.getMonthlyInterest);
router.get('/item-distribution', statsController.getItemDistribution);

module.exports = router;
