let chequeNumber = 1000;
let givenToOptions = [];
let transactions = [];

// Simulating backend data for givenToOptions
givenToOptions = [
    { name: "Pepsi", description: "Beverage company" },
    { name: "Coca-Cola", description: "Beverage company" }
];

document.addEventListener('DOMContentLoaded', function() {
    populateGivenToOptions();
});

function populateGivenToOptions() {
    const givenToOptionsList = document.getElementById('givenToOptions');
    givenToOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        givenToOptionsList.appendChild(optionElement);
    });
}

document.getElementById('chequeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const chequeGivenTo = document.getElementById('chequeGivenTo').value;
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;

    // Find description based on givenTo
    const description = givenToOptions.find(option => option.name === chequeGivenTo).description;

    // Simulate saving transaction
    transactions.push({
        chequeNumber: chequeNumber++,
        date: date,
        chequeGivenTo: chequeGivenTo,
        description: description,
        amount: amount
    });

    // Reset form
    document.getElementById('chequeNumber').value = chequeNumber;
    document.getElementById('date').value = '';
    document.getElementById('chequeGivenTo').value = '';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';

    // Update description field based on givenTo selection
    document.getElementById('chequeGivenTo').addEventListener('input', function() {
        const selectedGivenTo = this.value;
        const description = givenToOptions.find(option => option.name === selectedGivenTo).description;
        document.getElementById('description').value = description;
    });
});

function viewMonthlyTransactions() {
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';

    // Filter transactions by month and year
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === getMonthIndex(month) && transactionDate.getFullYear() === parseInt(year);
    });

    if (filteredTransactions.length > 0) {
        // Create table header
        const tableHeader = document.createElement('div');
        tableHeader.innerHTML = `
            <b>Cheque Number</b> | <b>Date</b> | <b>Cheque Given To</b> | <b>Description</b> | <b>Amount</b>
            <hr>
        `;
        transactionsDiv.appendChild(tableHeader);

        let totalAmount = 0;

        filteredTransactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.innerHTML = `
                ${transaction.chequeNumber} | ${transaction.date} | ${transaction.chequeGivenTo} | ${transaction.description} | ${transaction.amount}
            `;
            transactionsDiv.appendChild(transactionElement);
            totalAmount += parseInt(transaction.amount); // Ensure amount is an integer
        });

        // Display total amount
        const totalElement = document.createElement('div');
        totalElement.innerHTML = `
            <hr>
            <b>Total:</b> ${totalAmount}
        `;
        transactionsDiv.appendChild(totalElement);
    } else {
        transactionsDiv.innerHTML = 'No transactions found for this month.';
    }
}

function downloadMonthlyTransactions() {
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;

    // Filter transactions by month and year
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === getMonthIndex(month) && transactionDate.getFullYear() === parseInt(year);
    });

    let csvContent = "Cheque Number,Date,Cheque Given To,Description,Amount\n";
    let totalAmount = 0;

    filteredTransactions.forEach(transaction => {
        csvContent += `${transaction.chequeNumber},${transaction.date},${transaction.chequeGivenTo},${transaction.description},${transaction.amount}\n`;
        totalAmount += parseInt(transaction.amount); // Ensure amount is an integer
    });

    // Add total amount to CSV
    csvContent += `\nTotal, , , ,${totalAmount}`;

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${month}_${year}_transactions.csv`);
    link.click();
}

function getMonthIndex(monthName) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames.indexOf(monthName);
}


function login() {
    // Simulate login logic
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appPage').style.display = 'block';
}

// Admin page functionality
document.getElementById('addGivenToForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newGivenTo = document.getElementById('newGivenTo').value;
    const newDescription = document.getElementById('newDescription').value;

    // Simulate adding new givenTo option
    givenToOptions.push({ name: newGivenTo, description: newDescription });
    populateGivenToOptions();

    // Reset form
    document.getElementById('newGivenTo').value = '';
    document.getElementById('newDescription').value = '';
});
