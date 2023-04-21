const fs = require("fs");
const path = require("path");

const write = (data, title, type = "json") => {
  let textToLog = new Date().toString();

  if (type === "json") {
    textToLog += `\n${title}\n${JSON.stringify(data, null, 4)}\n`;
  }

  const filePath = path.join(__dirname, "../payment.log");
  fs.appendFile(filePath, textToLog, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = {
  write,
};
