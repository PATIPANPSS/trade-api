const express = require('express');
const app = express();
const PORT = 3000;

const tradeRoutes = require('./routes/tradeRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api', tradeRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Tread-API');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})