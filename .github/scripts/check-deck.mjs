import { existsSync, readFileSync } from 'node:fs';

const htmlPath = 'ppt/index.html';
const html = readFileSync(htmlPath, 'utf8');
const source = html.replace(/<!--[\s\S]*?-->/g, '');
const slides = [...source.matchAll(/<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>/g)];
const layouts = [...source.matchAll(/data-layout="(S\d{2})"/g)].map((m) => m[1]);
const requiredImages = ['ppt/images/01-route-source.png', 'ppt/images/02-lodging-source.png'];
const errors = [];

if (slides.length !== 8) errors.push(`Expected 8 slides, found ${slides.length}.`);
if (layouts.length !== slides.length) errors.push('Every slide must have a Swiss data-layout attribute.');
// The copied template retains commented reference examples; slide/layout checks
// above operate on uncommented HTML and are the source of truth for the deck.
for (const image of requiredImages) if (!existsSync(image)) errors.push(`Missing required image: ${image}`);
if (!source.includes('<title>2026 国庆斯里兰卡')) errors.push('Deck title is missing or incorrect.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Deck check passed: ${slides.length} slides, ${layouts.join(', ')}.`);
