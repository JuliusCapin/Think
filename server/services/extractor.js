const mammoth = require('mammoth');
const PDFParser = require('pdf2json');

async function extractText(file) {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } else if (file.mimetype === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const parser = new PDFParser();
      parser.on('pdfParser_dataReady', data => {
        const text = data.Pages.map(page =>
          page.Texts.map(t => {
            try {
              return decodeURIComponent(t.R.map(r => r.T).join(''));
            } catch {
              return t.R.map(r => r.T).join('');
            }
          }).join(' ')
        ).join('\n');
        resolve(text);
      });
      parser.on('pdfParser_dataError', err => reject(err));
      parser.parseBuffer(file.buffer);
    });
  }
  throw new Error('Unsupported file type');
}

module.exports = { extractText };