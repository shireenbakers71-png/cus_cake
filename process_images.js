const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const inputDir = path.join(__dirname, 'raw_images');
const targetSize = 400;
const compressionQuality = 50; // 50 as requested for higher compression

// Create input directory if it doesn't exist so user can upload folders there
if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`Created input directory at: ${inputDir}`);
    console.log('Please put your raw category folders in this directory and run the script again.');
    process.exit(0);
}

// Function to process a single file
async function processImage(filePath, outputDir) {
    try {
        const fileExt = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, fileExt);
        const relativePath = path.relative(inputDir, getParentDir(filePath));
        
        // Target sub-directory inside the workspace 'images' folder
        const finalOutputDir = path.join(__dirname, 'images', relativePath);
        
        if (!fs.existsSync(finalOutputDir)) {
            fs.mkdirSync(finalOutputDir, { recursive: true });
        }

        const outputPath = path.join(finalOutputDir, `${fileName}.webp`);

        // Use Sharp to resize to 400x400 (cropping to fit exactly), convert to webp, and compress
        await sharp(filePath)
            .resize(targetSize, targetSize, {
                fit: sharp.fit.cover, // Crop uniformly to fit 400x400 exactly
                position: sharp.strategy.entropy // Focus on the most interesting part of the image
            })
            .webp({ quality: compressionQuality })
            .toFile(outputPath);

        console.log(`✅ Processed: ${fileName}${fileExt} -> ${path.relative(__dirname, outputPath)}`);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Helper to get parent directory of a file
function getParentDir(filePath) {
    return path.dirname(filePath);
}

// Function to recursively find all images in the input directory and its subfolders
function walkDirAndProcess(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            walkDirAndProcess(fullPath); // Recursively search folders
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            // Match common image formats you might upload
            if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
                processImage(fullPath);
            }
        }
    }
}

console.log('Starting image processing...');
walkDirAndProcess(inputDir);
console.log('Processing queued! Wait for all ✅ messages to complete.');
