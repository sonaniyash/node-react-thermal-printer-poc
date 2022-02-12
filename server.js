const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', async (req, res) => {
  try {
    const printer = new ThermalPrinter({
      type: 'epson',                                  // Printer type: 'star' or 'epson'
      interface: 'http://192.168.1.211:9100',                       // Printer interface
      characterSet: 'SLOVENIA',                                 // Printer character set - default: SLOVENIA
      removeSpecialCharacters: false,                           // Removes special characters - default: false
      lineCharacter: "=",                                       // Set character for lines - default: "-"
      options: {                                                 // Additional options
        timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
      }
    });

    const isConnected = await printer.isPrinterConnected();      // Check if printer is connected, return bool of status
    console.log('isConnected', isConnected);
    // let execute = await printer.execute();                      // Executes all the commands. Returns success or throws error
    // let raw = await printer.raw(Buffer.from("Hello world"));    // Print instantly. Returns success or throws error
    // printer.print("Hello World");                               // Append text
    printer.println("Hello World");                            // Append text with new line
    // printer.openCashDrawer();    
    printer.cut();

    try {
      const execute = printer.execute()
      console.error("Print done!");
    } catch (error) {
      console.log("Print failed:", error);
    }

    res.send(
      `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
  } catch (err) {
    console.log(err);
  }
});

// if (process.env.NODE_ENV === 'production') {
// Serve any static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
// }

app.listen(port, () => console.log(`Listening on port ${port}`));
