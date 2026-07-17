const express = require('express');
const router = express.Router();
const {createTrade, getAllTrades, getById, updateTrade, deleteTrade} = require('../controllers/tradeController');

router.post('/trades', createTrade);
router.get('/trades', getAllTrades);
router.get('/trades/:id', getById);
router.put('/trades/:id', updateTrade);
router.delete('/trades/:id', deleteTrade);

module.exports = router;