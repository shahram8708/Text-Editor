const express = require('express');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const pdfOutputFolder = path.join(__dirname, 'pdfOutput');

if (!fs.existsSync(pdfOutputFolder)) {
  fs.mkdirSync(pdfOutputFolder);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-pdf', (req, res) => {
  const htmlContent = req.body.htmlContent;
  const title = req.body.title || 'untitled';

  console.log('Received HTML Content:', htmlContent);

  const options = {
    format: 'Letter',
    border: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    },
  };

  const pdfPath = path.join(pdfOutputFolder, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

  pdf.create(htmlContent, options).toFile(pdfPath, (err, response) => {
    if (err) return console.log(err);
    console.log(response);
    res.download(pdfPath, `${title}.pdf`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
