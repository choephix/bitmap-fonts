const fs = require('fs');
const path = require('path');

function generateJSONLinksPage(folderPath, urlPrefix, pageTitle) {
  const files = getAllJSONFiles(folderPath);
  const links = files.map(file => {
    const relativePath = path.relative(folderPath, file);
    const link = `${urlPrefix}/${relativePath}`;
    return `<li><a href="${link}">${relativePath}</a></li>`;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${pageTitle}</title>
    </head>
    <body>cd      
      <h1>${pageTitle}</h1>
      <ul>
        ${links.join('\n')}
      </ul>
    </body>
    </html>
  `;

  return html;
}

function getAllJSONFiles(folderPath) {
  let files = [];
  const dirents = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fullPath = path.join(folderPath, dirent.name);
    if (dirent.isDirectory()) {
      const nestedFiles = getAllJSONFiles(fullPath);
      files = files.concat(nestedFiles);
    } else if (dirent.isFile() && path.extname(fullPath) === '.json') {
      files.push(fullPath);
    }
  }

  return files;
}

// Usage example
const folderPath = './bitmap-fonts';
const urlPrefix = 'https://choephix.github.io/bitmap-fonts';
const pageTitle = 'MSDF Bitmap Fonts';

const htmlPage = generateJSONLinksPage(folderPath, urlPrefix, pageTitle);

fs.writeFileSync('index.html', htmlPage);
