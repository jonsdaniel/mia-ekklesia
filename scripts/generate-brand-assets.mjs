import sharp from "sharp";
import { fileURLToPath } from "node:url";

const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error("Pass the source Jerusalem Cross image path as the first argument.");
}

const gold = { r: 182, g: 154, b: 99 };
const black = "#0b0b0a";
const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += 4) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const redness = red - Math.max(green, blue);
  const alpha = Math.max(0, Math.min(255, Math.round((redness - 38) * 4.2)));
  data[index] = gold.r;
  data[index + 1] = gold.g;
  data[index + 2] = gold.b;
  data[index + 3] = alpha;
}

const cross = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .extract({ left: 45, top: 45, width: 410, height: 410 })
  .resize(512, 512, { fit: "contain" })
  .png()
  .toBuffer();

await sharp(cross).toFile(fileURLToPath(new URL("../site/assets/jerusalem-cross.png", import.meta.url)));

const socialCross = await sharp(cross)
  .resize(220, 220, { fit: "contain" })
  .png()
  .toBuffer();

const text = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #b69a63; font-family: Georgia, 'Times New Roman', serif; font-size: 68px; letter-spacing: 8px; }
      .subtitle { fill: #b69a63; font-family: Arial, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 9px; }
    </style>
    <text x="600" y="492" text-anchor="middle" class="title">MIA EKKLESIA</text>
    <text x="600" y="548" text-anchor="middle" class="subtitle">ONE CHURCH</text>
  </svg>
`);

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: black },
})
  .composite([
    { input: socialCross, left: 490, top: 72 },
    { input: text, left: 0, top: 0 },
  ])
  .png()
  .toFile(fileURLToPath(new URL("../site/og.png", import.meta.url)));
