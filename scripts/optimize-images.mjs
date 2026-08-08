import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/images");

const photos = [
  "photo-06",
  "photo-08",
  "photo-09",
  "photo-20",
  "photo-21",
  "photo-22",
  "photo-23",
  "photo-24",
  "photo-27",
  "photo-29",
  "photo-30",
  "photo-31",
  "photo-32",
  "forsommarhonung",
  "sensommarhonung",
  "forsommarhonung-2",
  "sensommarhonung-2",
  "slungning",
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function toWebp(input, output, opts) {
  await sharp(input).webp(opts).toFile(output);
  const inStat = await sharp(input).metadata();
  console.log(`✓ ${path.basename(output)} (${inStat.width}x${inStat.height})`);
}

async function main() {
  const photosDir = path.join(root, "photos");

  for (const name of photos) {
    const input = path.join(photosDir, `${name}.png`);
    if (!(await exists(input))) {
      console.warn(`skip missing ${name}.png`);
      continue;
    }
    const isHero = name === "photo-24";
    await toWebp(input, path.join(photosDir, `${name}.webp`), {
      quality: isHero ? 72 : 75,
      effort: 6,
    });
  }

  // Hero LCP: also a slightly smaller mobile-friendly max width
  const heroPng = path.join(photosDir, "photo-24.png");
  if (await exists(heroPng)) {
    await sharp(heroPng)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(path.join(photosDir, "photo-24-hero.webp"));
    console.log("✓ photo-24-hero.webp (LCP)");
  }

  // OG image 1200x630
  if (await exists(heroPng)) {
    await sharp(heroPng)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(root, "og-image.jpg"));
    console.log("✓ og-image.jpg");
  }

  // Compact logo for UI
  const logo = path.join(root, "logo.png");
  if (await exists(logo)) {
    await sharp(logo)
      .resize(256, 256)
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(root, "logo.webp"));
    console.log("✓ logo.webp");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
