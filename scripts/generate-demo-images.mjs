// Generates clearly-labelled DEMO illustrations (simple shoe silhouettes) into public/images.
// Replace these files with real product photography before launch (see docs/PRODUCT-GUIDE.md).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
mkdirSync(root, { recursive: true });

const shapes = {
  sneaker: (c) => `
    <path d="M150 470 C150 400 190 360 250 350 L330 345 C360 345 380 330 400 305 L440 300 C470 340 520 370 600 385 C660 395 680 420 680 470 L680 500 L150 500 Z" fill="${c}"/>
    <rect x="140" y="498" width="550" height="34" rx="17" fill="#FFFFFF" stroke="#D8D3CA"/>
    <path d="M330 345 L400 390 M360 340 L430 385 M390 330 L460 375" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity=".85"/>`,
  formal: (c) => `
    <path d="M140 480 C140 420 175 392 235 386 L360 376 C400 372 420 350 440 330 L470 332 C500 380 560 410 640 420 C690 428 700 455 700 480 L700 500 L140 500 Z" fill="${c}"/>
    <rect x="130" y="498" width="580" height="26" rx="13" fill="#2A2622"/>
    <path d="M360 376 C390 380 420 392 450 385" stroke="#FFFFFF" stroke-width="5" opacity=".5" fill="none"/>`,
  loafer: (c) => `
    <path d="M140 482 C140 430 180 405 240 400 L400 392 C440 390 470 365 490 342 C540 380 600 405 650 420 C690 432 700 455 700 482 L700 500 L140 500 Z" fill="${c}"/>
    <rect x="130" y="498" width="580" height="26" rx="13" fill="#3A332C"/>
    <rect x="360" y="410" width="90" height="22" rx="11" fill="#B89B72"/>`,
  sandal: (c) => `
    <rect x="130" y="470" width="580" height="46" rx="23" fill="#EDE7DB" stroke="#CFC7B8"/>
    <path d="M250 470 C260 400 330 380 400 392 C470 404 520 430 560 470" fill="none" stroke="${c}" stroke-width="30" stroke-linecap="round"/>
    <path d="M330 470 C340 430 400 420 440 470" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round" opacity=".85"/>`,
  heel: (c) => `
    <path d="M170 470 C220 440 300 420 380 380 C430 355 470 360 520 395 C580 430 650 440 690 470 L660 492 L190 492 Z" fill="${c}"/>
    <path d="M190 492 L215 600 L238 600 L250 492 Z" fill="#2A2622"/>
    <rect x="450" y="488" width="230" height="16" rx="8" fill="#2A2622"/>`,
  boot: (c) => `
    <path d="M250 230 L440 230 L450 380 C470 400 560 410 650 425 C690 432 700 455 700 482 L700 500 L170 500 L200 340 Z" fill="${c}"/>
    <rect x="160" y="498" width="550" height="34" rx="17" fill="#2A2622"/>
    <rect x="250" y="220" width="190" height="24" rx="8" fill="#FFFFFF" opacity=".25"/>`,
  kids: (c) => `
    <path d="M190 470 C190 410 225 380 280 372 L340 368 C370 366 390 345 405 320 L440 318 C465 355 510 375 570 385 C620 392 640 420 640 470 L640 495 L190 495 Z" fill="${c}"/>
    <rect x="180" y="493" width="470" height="32" rx="16" fill="#FFFFFF" stroke="#D8D3CA"/>
    <circle cx="330" cy="420" r="18" fill="#FFFFFF" opacity=".85"/>`,
};

function productSvg(kind, color, bg, label, variant = 0) {
  const body = shapes[kind](color);
  const tilt = variant === 1 ? ' transform="scale(-1 1) translate(-840 0)"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 840 700" role="img" aria-label="${label}">
  <rect width="840" height="700" fill="${bg}"/>
  <ellipse cx="420" cy="540" rx="300" ry="26" fill="#000" opacity=".08"/>
  <g${tilt}>${body}</g>
  <text x="420" y="640" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#686868" letter-spacing="3">DEMO IMAGE</text>
</svg>`;
}

const bgs = ['#F8F7F4', '#EEEAE3'];
const items = [
  ['mens-sneaker-white', 'sneaker', '#F3F1EC'], ['mens-sneaker-sand', 'sneaker', '#CDBA9A'],
  ['mens-oxford', 'formal', '#5A3E2B'], ['mens-derby-black', 'formal', '#1F1D1B'],
  ['mens-loafer', 'loafer', '#7A5A3C'], ['mens-boot', 'boot', '#6B4A32'],
  ['womens-sneaker', 'sneaker', '#E6DCCB'], ['womens-flat', 'loafer', '#B89B72'],
  ['womens-heel', 'heel', '#8A6E4B'], ['womens-sandal', 'sandal', '#B89B72'],
  ['womens-boot', 'boot', '#3A332C'], ['kids-sneaker', 'kids', '#C9D6C3'],
  ['kids-school', 'formal', '#1F1D1B'], ['kids-sandal', 'sandal', '#9DB4C0'],
  ['sports-runner', 'sneaker', '#4A5A63'], ['sports-trainer', 'sneaker', '#2F3B40'],
  ['slide-sandal', 'sandal', '#8A8378'], ['mens-sandal', 'sandal', '#6B4A32'],
];

for (const [name, kind, color] of items) {
  for (const v of [0, 1]) {
    const file = `${name}-${v + 1}.svg`;
    writeFileSync(
      join(root, file),
      productSvg(kind, color, bgs[v], `Demo illustration of ${name.replace(/-/g, ' ')}`, v),
    );
  }
}

// Category and hero images (wider crop)
const cats = [
  ['category-mens', 'formal', '#5A3E2B'], ['category-womens', 'heel', '#8A6E4B'],
  ['category-kids', 'kids', '#C9D6C3'], ['category-sports', 'sneaker', '#4A5A63'],
  ['category-sandals', 'sandal', '#B89B72'], ['hero', 'sneaker', '#B89B72'],
];
for (const [name, kind, color] of cats) {
  writeFileSync(join(root, `${name}.svg`), productSvg(kind, color, '#EEEAE3', `Demo illustration: ${name}`));
}

writeFileSync(
  join(root, 'og-default.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F8F7F4"/><text x="600" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="84" fill="#202020">Royal Footwear</text><text x="600" y="370" text-anchor="middle" font-family="Georgia,serif" font-size="32" fill="#B89B72" letter-spacing="6">STEP INTO YOUR STYLE</text></svg>`,
);

console.log('Demo images written to', root);
