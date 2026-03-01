const fs = require('fs');
const path = require('path');

const categoriesDir = path.join(__dirname, 'categories');
const imagesDir = path.join(__dirname, 'images');

const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const htmlPath = path.join(categoriesDir, file);
    let content = fs.readFileSync(htmlPath, 'utf8');
    
    // Find the folder name used in the template literal: `<img src="../images/FOLDER/${file}"`
    const match = content.match(/\.\.\/images\/([^\/"'`]+)\/\$\{file\}/);
    if (!match) {
        continue;
    }
    
    const folderName = match[1];
    const targetImgDir = path.join(imagesDir, folderName);
    
    if (!fs.existsSync(targetImgDir)) {
        console.log(`❌ Folder not found for ${file}: ${folderName}`);
        continue;
    }
    
    // Read valid image files
    const validExts = ['.webp', '.jpg', '.jpeg', '.png'];
    const imageFiles = fs.readdirSync(targetImgDir).filter(img => {
        return validExts.includes(path.extname(img).toLowerCase());
    });
    
    // Convert to JSON array string
    const jsonStr = JSON.stringify(imageFiles);
    
    // Replace const imageFiles = [...];
    const regex = /const imageFiles\s*=\s*(?:\[.*?\]|;)/s;
    const newContent = content.replace(regex, `const imageFiles = ${jsonStr};`);
    
    if (content !== newContent) {
        fs.writeFileSync(htmlPath, newContent, 'utf8');
        console.log(`✅ Updated ${file} with ${imageFiles.length} images from ${folderName}`);
    } else {
        // console.log(`⚡ No changes needed for ${file}`);
    }
}
console.log("Done checking all HTML pages.");
