const net = require("net");

const connectToPrinter = (host, port, buffer) => {
  return new Promise((resolve, reject) => {
    let device = new net.Socket();

    console.log('device', device);

    device.on("close", () => {
      if (device) {
        device.destroy();
        device = null;
      }
      resolve(true);
      return;
    });

    device.on("error", () => {
      console.log('error coming')
    });

    device.connect(port, host, () => {
      device.write(buffer);
      device.emit("close");
    });
  });
};
module.exports = connectToPrinter;
