const express = require('express');
const router = express.Router();
const CurrencyService = require('../services/currencyService');
const { isAuthenticated } = require('../middleware/auth');

router.get('/latest', async (req, res) => {
    try {
        const { base } = req.query;
        const data = await CurrencyService.getCurrency(base);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch currency data' });
    }
});

router.get('/historical/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const { base } = req.query;
        const data = await CurrencyService.getCurrencyByDate(date, base);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

router.get('/range/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const { base, symbols } = req.query;
        const data = await CurrencyService.getCurrencyByDateRange(startDate, endDate, base, symbols);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch date range data' });
    }
});

router.get('/convert', async (req, res) => {
    try {
        const { base, target, amount } = req.query;
        const data = await CurrencyService.convert(base, target, parseFloat(amount));
        res. json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to convert currency' });
    }
});

module.exports = router;