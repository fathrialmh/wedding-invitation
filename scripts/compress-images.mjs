import sharp from 'sharp';
import { readdir, mkdir, unlink, stat, rename } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const imagesDir = join(root, 'public/assets/images');
const thumbsDir = join(imagesDir, 'thumbs');

const PHOTO_MAX = 1400;
const THUMB_MAX = 480;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const PNG_QUALITY = 80;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function compressInPlace(filePath, pipeline) {
  const tmpPath = `${filePath}.tmp`;
  await pipeline.toFile(tmpPath);

  const [before, after] = await Promise.all([stat(filePath), stat(tmpPath)]);
  if (after.size < before.size) {
    await rename(tmpPath, filePath);
    return before.size - after.size;
  }

  await unlink(tmpPath);
  return 0;
}

async function processImage(file) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 0;

  const filePath = join(imagesDir, file);
  let saved = 0;

  let pipeline = sharp(filePath).rotate();
  const meta = await pipeline.metadata();

  if (['.jpg', '.jpeg', '.webp'].includes(ext)) {
    pipeline = pipeline.resize(PHOTO_MAX, PHOTO_MAX, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    saved += await compressInPlace(
      filePath,
      pipeline.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    );
  } else if (ext === '.webp') {
    saved += await compressInPlace(
      filePath,
      pipeline.clone().webp({ quality: WEBP_QUALITY })
    );
  } else if (ext === '.png') {
    saved += await compressInPlace(
      filePath,
      pipeline.clone().png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 })
    );
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    const thumbName = `${basename(file, ext)}.webp`;
    const thumbPath = join(thumbsDir, thumbName);
    await sharp(filePath)
      .rotate()
      .resize(THUMB_MAX, THUMB_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(thumbPath);
  }

  const afterStat = await stat(filePath);
  console.log(`  ${file} (${meta.width}x${meta.height}) → ${formatBytes(afterStat.size)}`);
  return saved;
}

async function main() {
  await mkdir(thumbsDir, { recursive: true });

  const files = (await readdir(imagesDir)).filter((f) => f !== 'thumbs');
  let totalSaved = 0;

  console.log(`Compressing ${files.length} images…\n`);

  for (const file of files) {
    totalSaved += await processImage(file);
  }

  const thumbCount = (await readdir(thumbsDir)).length;
  console.log(`\nDone. Saved ${formatBytes(totalSaved)} on originals.`);
  console.log(`Generated ${thumbCount} gallery thumbnails in public/assets/images/thumbs/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
