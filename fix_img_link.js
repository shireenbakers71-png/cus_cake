const fs = require('fs');
const path = require('path');

const catDir = path.join(__dirname, 'categories');
const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html') && f !== 'picture-selected-cakes.html');

let updated = 0;

files.forEach(file => {
  const filePath = path.join(catDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace the imgLink construction with proper web URL
  const old = `var imgEl = btn.closest('.cake-card').querySelector('.cake-img');
      var imgLink = imgEl ? imgEl.src : '';`;

  const replacement = `var imgEl = btn.closest('.cake-card').querySelector('.cake-img');
      var imgSrc = imgEl ? imgEl.getAttribute('src') : '';
      var imgLink = imgSrc ? 'https://www.shireen-bakers.com/' + imgSrc.replace(/^\\.\\.\\//, '') : '';`;

  if (html.includes(old)) {
    html = html.replace(old, replacement);
    fs.writeFileSync(filePath, html, 'utf-8');
    updated++;
  } else {
    console.log('Pattern not found in: ' + file);
  }
});

console.log('Updated ' + updated + ' files.');
