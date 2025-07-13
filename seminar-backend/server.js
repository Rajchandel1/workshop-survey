const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.status(200).send('Backend server is running. Use POST /register to submit form data.');
});

// Path to Excel file
const excelFilePath = path.join(__dirname, 'registrations.xlsx');

// Initialize Excel workbook
let workbook;
try {
    if (fs.existsSync(excelFilePath)) {
        workbook = xlsx.readFile(excelFilePath, { cellDates: true });
    } else {
        workbook = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, ws, 'Registrations');
        xlsx.writeFile(workbook, excelFilePath);
        console.log('Created new registrations.xlsx');
    }
} catch (error) {
    console.error('Error initializing Excel file:', error.message);
    process.exit(1); // Exit if initialization fails
}

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, year, division } = req.body;

        // Validate input
        if (!fullName || !email || !phone || !year || !division) {
            console.log('Validation failed: Missing fields', req.body);
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Validation failed: Invalid email format', email);
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate phone format (basic check for digits, adjust as needed)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            console.log('Validation failed: Invalid phone number', phone);
            return res.status(400).json({ error: 'Invalid phone number (must be 10 digits)' });
        }

        // Prepare data
        const newData = {
            FullName: fullName,
            Email: email,
            Phone: phone,
            Year: year,
            Division: division,
            Timestamp: new Date().toISOString(),
        };

        console.log('Received data:', newData);

        // Read existing data
        let ws = workbook.Sheets['Registrations'];
        if (!ws) {
            console.log('Worksheet "Registrations" not found, creating new one');
            ws = xlsx.utils.json_to_sheet([]);
            workbook.Sheets['Registrations'] = ws;
        }
        const jsonData = xlsx.utils.sheet_to_json(ws, { defval: '' }) || [];
        jsonData.push(newData);

        // Update worksheet
        const newWs = xlsx.utils.json_to_sheet(jsonData, {
            header: ['FullName', 'Email', 'Phone', 'Year', 'Division', 'Timestamp'],
        });
        workbook.Sheets['Registrations'] = newWs;

        // Save to file synchronously to avoid async issues
        try {
            xlsx.writeFile(workbook, excelFilePath);
            console.log('Data saved to registrations.xlsx');
        } catch (writeError) {
            console.error('Error writing to Excel file:', writeError.message);
            return res.status(500).json({ error: 'Failed to save data to Excel' });
        }

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error processing registration:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});