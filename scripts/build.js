const fs = require('fs');
const path = require('path');

function generatePNGLinksPage(folderPath, urlPrefix, pageTitle) {
  const files = getAllPNGFiles(folderPath);
  const links = files.map(file => {
    const relativePath = path.relative(folderPath, file);
    const link = `${urlPrefix}/bitmap-fonts/${relativePath}`;
    return `        <li><a href="${link}" onclick="showPreview('${link}'); return false;">${relativePath}</a></li>`;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${pageTitle}</title>
      <style>
        .container {
          display: flex;
          flex-direction: row;
          height: 100vh;
        }
        .sidebar {
          flex: 0 0 200px;
          background-color: #f0f0f0;
          padding: 10px;
        }
        .preview {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .preview img {
          max-width: 100%;
          max-height: 100%;
        }
      </style>
      <script>
        function showPreview(src) {
          const preview = document.getElementById('preview');
          preview.innerHTML = '<img src="' + src + '">';
        }
      </script>
    </head>
    <body>
      <div class="container">
        <div class="sidebar">
          <h1>${pageTitle}</h1>
          <ul>
${links.join('\n')}
          </ul>
        </div>
        <div class="preview" id="preview">
          <p>Select a file to preview</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
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
