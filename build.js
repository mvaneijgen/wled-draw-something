const fs = require('fs-extra');
const cheerio = require('cheerio');

const inputFile = 'index.html';
const outputFile = 'dist/drawsomething.html';


fs.readFile(inputFile, 'utf-8')
  .then((htmlContent) => {
    // Replace inline script tags
    htmlContent = htmlContent.replace(/<script src="(.*?)" inline><\/script>/g, (_, src) => {
      const scriptContents = fs.readFileSync(src, 'utf-8');
      return `<script>${scriptContents}</script>`;
    });

    // Replace inline link tags (stylesheets)
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="(.*?)" inline>/g, (_, href) => {
      const stylesheetContents = fs.readFileSync(href, 'utf-8');
      return `<style>${stylesheetContents}</style>`;
    });

    return htmlContent;
  })
  .then((modifiedHtml) => fs.writeFile(outputFile, modifiedHtml, 'utf-8'))
  .then(() => console.log(`Scripts and styles inlined successfully. Output: ${outputFile}`))
  .catch((error) => console.error('Error inlining scripts and styles:', error));