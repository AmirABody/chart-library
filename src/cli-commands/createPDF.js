const fs = require("fs/promises");
const { createWriteStream, watchFile } = require("fs");
const path = require("path");
const wkhtmltopdf = require("wkhtmltopdf");

async function createPDF() {
  const htmlPath = path.join(__dirname, "..", "..", "views", "reports", "sample.html");
  const outputDir = path.join(__dirname, "..", "output", "pdf test", "sample1.pdf");
  return fs.readFile(htmlPath).then((buffer) => {
    const content = buffer.toString();
    return new Promise((resolve, reject) => {
      wkhtmltopdf(content, { output: outputDir }, (err, stream) => {
        if (err) reject(err);
        resolve()
      });
    });
  });
}

module.exports = createPDF;
