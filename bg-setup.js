import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './backgrounds';
const tempDir = './backgrounds_temp';
const htmlFiles = ['./index.html', './topo.html'];

async function processImages() {
  try {
    // 1. Read the main directory
    if (!fs.existsSync(dir)) {
      console.error(`❌ Directory ${dir} does not exist!`);
      return;
    }
    const files = fs.readdirSync(dir);

    // 2. Gather ALL images (both existing webp and raw files)
    const allImageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp', '.webp'].includes(ext);
    });

    if (allImageFiles.length === 0) {
      console.log('✨ No images found in the backgrounds folder.');
      return;
    }

    console.log(`🚀 Found ${allImageFiles.length} total images. Re-indexing and optimizing everything...`);

    // 3. Create a temporary folder to avoid overwriting files we are currently processing
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    let counter = 1;

    // 4. Process each file into the temp folder
    for (const file of allImageFiles) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(tempDir, `${counter}.webp`);
      const ext = path.extname(file).toLowerCase();

      if (ext === '.webp') {
        // If it's already a webp, just move/rename it instantly
        fs.renameSync(inputPath, outputPath);
      } else {
        // If it's a raw image, convert it to optimized webp
        await sharp(inputPath)
          .toFormat('webp', { quality: 85 })
          .toFile(outputPath);
        
        // Delete the original raw file
        fs.unlinkSync(inputPath);
      }
      counter++;
    }

    // 5. Clean out any remaining junk from the original folder, delete it, and swap temp back
    const remainingFiles = fs.readdirSync(dir);
    remainingFiles.forEach(file => fs.unlinkSync(path.join(dir, file)));
    fs.rmdirSync(dir);
    fs.renameSync(tempDir, dir);

    const totalImages = counter - 1;
    console.log(`🎉 Perfect sequence generated: 1.webp through ${totalImages}.webp`);

    // 6. AUTOMATION: Update totalImages inside the HTML files directly
    htmlFiles.forEach(htmlPath => {
      if (fs.existsSync(htmlPath)) {
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const updatedHtml = htmlContent.replace(/totalImages\s*=\s*\d+/g, `totalImages = ${totalImages}`);
        fs.writeFileSync(htmlPath, updatedHtml);
        console.log(`🤖 Automatically updated ${htmlPath}!`);
      } else {
        console.warn(`⚠️ Could not find ${htmlPath} to update totalImages.`);
      }
    });

    console.log('✨ System updated perfectly!');

  } catch (error) {
    console.error('❌ Error during clean re-indexing:', error);
    // Cleanup temp folder if something exploded mid-way
    if (fs.existsSync(tempDir)) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

processImages();