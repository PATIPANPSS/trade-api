const express = require('express');
const router = express.Router();
const {createTrade, getAllTrades, getById, updateTrade, deleteTrade} = require('../controllers/tradeController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/trades', verifyToken, createTrade);
router.get('/trades', verifyToken, getAllTrades);
router.get('/trades/:id', verifyToken, getById);
router.put('/trades/:id', verifyToken, updateTrade);
router.delete('/trades/:id', verifyToken, deleteTrade);

module.exports = router;