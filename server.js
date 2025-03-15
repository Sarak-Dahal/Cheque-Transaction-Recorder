const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/cheque-transactions', { useNewUrlParser: true, useUnifiedTopology: true });

const chequeTransactionSchema = new mongoose.Schema({
    chequeNumber: Number,
    date: Date,
    chequeGivenTo: String,
    description: String,
    amount: Number
});

const ChequeTransaction = mongoose.model('ChequeTransaction', chequeTransactionSchema);

// API Endpoints
app.post('/transactions', async (req, res) => {
    try {
        const transaction = new ChequeTransaction(req.body);
        await transaction.save();
        res.send('Transaction saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving transaction');
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await ChequeTransaction.find();
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching transactions');
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


app.get('/transactions/monthly', async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;
        const monthIndex = getMonthIndex(month);
        const transactions = await ChequeTransaction.find({
            date: {
                $gte: new Date(year, monthIndex, 1),
                $lt: new Date(year, monthIndex + 1, 1)
            }
        });
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching transactions');
    }
});

function getMonthIndex(monthName) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames.indexOf(monthName);
}
