const fs = require('fs');
const path = require('path');

function generatePNGLinksPage(folderPath, urlPrefix, pageTitle) {
  const files = getAllPNGFiles(folderPath);
  const links = files.map(file => {
    const relativePath = path.relative(folderPath, file);
    const link = `${urlPrefix}/bitmap-fonts/${relativePath}`;
    return `        <div><a href="${link}" onclick="showPreview('${link}'); return false;">${relativePath}</a></div>`;
  });
  const htmlTemplate = fs.readFileSync('scripts/template.html').toString();
  return htmlTemplate.replace(/\${PAGE_TITLE}/g, pageTitle).replace(/\${LINKS}/g, links.join('\n'));
}

function getAllPNGFiles(folderPath) {
  let files = [];
  const dirents = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fullPath = path.join(folderPath, dirent.name);
    if (dirent.isDirectory()) {
      const nestedFiles = getAllPNGFiles(fullPath);
      files = files.concat(nestedFiles);
    } else if (dirent.isFile() && path.extname(fullPath) === '.png') {
      files.push(fullPath);
    }
  }

  return files;
}

const folderPath = './bitmap-fonts';
const urlPrefix = 'https://choephix.github.io/bitmap-fonts';
const pageTitle = 'MSDF Bitmap Fonts';
const htmlPage = generatePNGLinksPage(folderPath, urlPrefix, pageTitle);
fs.writeFileSync('index.html', htmlPage);
