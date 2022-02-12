const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { EscPos } = require("@tillpos/xml-escpos-helper");
const connectToPrinter = require("./connectToPrinter");
const fs = require("fs");
var cors = require('cors')
// const { getPrinters } = require('printer');
// const ThermalPrinter = require("node-thermal-printer").printer;
// const PrinterTypes = require("node-thermal-printer").types;

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

/**
 *
 * @params template - the xml template
 * @params data - the dynamic data which ever to be printed
 *
 * @returns bytes - buffers stream
 */
const generateBuffer = (template, data) => {
  // Will add implementation here to generate buffer
  return EscPos.getBufferFromTemplate(template, data);
};

/**
 *
 * @params host - printer IP address
 * @params port - printer port
 * @params message - the buffer stream generated from `generateBuffer` function
 *
 * @return void
 */
const sendMessageToPrinter = async (host, port, message) => {
  try {
    await connectToPrinter(host, port, message);
  } catch (err) {
    console.log("some error", err);
  }
};


app.post('/api/world', async (req, res) => {
  // try {

  // const datas = getPrinters();
  // console.log('datas', datas);

  //   const printers = new ThermalPrinter({
  //     type: 'epson',                                  // Printer type: 'star' or 'epson'
  //     interface: 'tcp://192.168.1.211:9100',                       // Printer interface,
  //     // interface: 'printer:auto',                       // Printer interface
  //     characterSet: 'SLOVENIA',                                 // Printer character set - default: SLOVENIA
  //     removeSpecialCharacters: false,                           // Removes special characters - default: false
  //     lineCharacter: "=",                                       // Set character for lines - default: "-"
  //     options: {                                                 // Additional options
  //       timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //     }
  //   });

  //   const isConnected = await printers.isPrinterConnected();      // Check if printer is connected, return bool of status
  //   console.log('isConnected', isConnected);
  //   // let execute = await printer.execute();                      // Executes all the commands. Returns success or throws error
  //   // let raw = await printer.raw(Buffer.from("Hello world"));    // Print instantly. Returns success or throws error
  //   // printer.print("Hello World");                               // Append text
  //   printers.println("Hello World");                            // Append text with new line
  //   // printer.openCashDrawer();    
  //   printers.cut();

  //   try {
  //     const execute = printers.execute()
  //     console.error("Print done!");
  //   } catch (error) {
  //     console.log("Print failed:", error);
  //   }

  //   res.send(
  //     `I received your POST request. This is what you sent me: ${req.body.post}`,
  //   );
  // } catch (err) {
  //   console.log(err);
  // }

  const template = fs.readFileSync("./sample.xml", { encoding: "utf8" });

  const PRINTER = {
    device_name: "PRTII-A",
    host: "192.168.1.211",
    port: 9100,
  };
  const sampleInputData = {
    title: "Hello World!",
    date: "07-08-2021",
  };
  const message = generateBuffer(template, sampleInputData);
  await sendMessageToPrinter(PRINTER.host, PRINTER.port, message);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
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
