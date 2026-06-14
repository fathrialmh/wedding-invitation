import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = 'https://studio.goodchoice.id/wp-content/uploads';

const backgrounds = [
  '2025/10/asset-cover-1-1.webp',
  '2025/10/asset-ayatsuci-java-1.png',
  '2025/10/pattern-profil-asset.png',
  '2025/10/Group-1-1.png',
  '2025/10/asset-event-b26-1.png',
  '2025/10/REELS-2024-1.png',
  '2025/10/asset-penutup-1.webp',
  '2025/10/asset-fix-bg-1-1.webp',
  '2025/10/Martiana-A28-scaled-1.jpg',
  '2025/10/asset-event-b24-1.png',
  '2025/10/asset-event-b25-1.png',
];

const photos = [
  '2025/10/Martiana-A27-scaled-1.jpg',
  '2025/10/Martiana-A33-scaled-1.jpg',
  '2025/10/Martiana-A31-scaled-1.jpg',
  '2025/10/Martiana-A36-scaled-1.jpg',
  '2025/10/Martiana-A51-scaled-1.jpg',
  '2025/10/Martiana-A34-scaled-1.jpg',
  '2025/10/Martiana-A41-scaled-1.jpg',
  '2025/10/Martiana-A30-scaled-1.jpg',
  '2025/10/Martiana-A29-scaled-1.jpg',
  '2025/10/Martiana-A43-scaled-1.jpg',
  '2025/10/Martiana-A44-scaled-1.jpg',
  '2025/10/Martiana-A45-scaled-1.jpg',
  '2025/10/Martiana-A46-scaled-1.jpg',
  '2025/10/Martiana-A25-scaled-1.jpg',
  '2025/10/Martiana-A26-scaled-1.jpg',
  '2025/10/Martiana-A48-scaled-1.jpg',
  '2025/10/Martiana-A49-scaled-1.jpg',
  '2025/10/Martiana-A53-scaled-1.jpg',
  '2025/10/Martiana-A54-scaled-1.jpg',
  '2025/10/Martiana-A55-scaled-1.jpg',
  '2025/10/Martiana-A56-scaled-1.jpg',
  '2025/10/Martiana-A47-scaled-1.jpg',
  '2025/10/Martiana-A37-scaled-1.jpg',
  '2025/10/Martiana-A38-scaled-1.jpg',
];

const fonts = [
  { url: `${base}/useanyfont/9822established-serif.woff2`, dest: 'public/assets/fonts/established-serif.woff2' },
  { url: `${base}/useanyfont/embassy-bt-regular.woff2`, dest: 'public/assets/fonts/embassy-bt-regular.woff2' },
];

const audio = {
  url: 'https://hi.goodchoice.id/wp-content/uploads/2024/10/utomp3.com-LESTARI-Orchestra-Version.mp3',
  dest: 'public/assets/audio/lestari.mp3',
};

async function download(url, destPath) {
  const fullPath = join(root, destPath);
  await mkdir(dirname(fullPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(fullPath, buf);
  console.log('OK', destPath);
}

async function main() {
  for (const path of backgrounds) {
    const name = path.split('/').pop();
    await download(`${base}/${path}`, `public/assets/images/${name}`);
  }
  for (const path of photos) {
    const name = path.split('/').pop();
    await download(`${base}/${path}`, `public/assets/images/${name}`);
  }
  for (const f of fonts) {
    try {
      await download(f.url, f.dest);
    } catch {
      console.warn('Font skipped (may need alternate URL):', f.dest);
    }
  }
  await download(audio.url, audio.dest);
  console.log('All assets downloaded.');
  console.log('Run "npm run compress-images" to optimize images for faster loading.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
