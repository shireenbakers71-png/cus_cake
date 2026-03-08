const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

function renameFilesRecursive(dir) {
  fs.readdirSync(dir).forEach(file => {
    const oldPath = path.join(dir, file);
    if (fs.lstatSync(oldPath).isDirectory()) {
      renameFilesRecursive(oldPath);
    } else {
      const newFile = file.replace(/ /g, '');
      const newPath = path.join(dir, newFile);
      if (newFile !== file) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${newFile}`);
      }
    }
  });
}

renameFilesRecursive(imagesDir);
console.log('All images renamed (spaces removed).');
