import fs from "fs";
import path from "path";

const brands = {
  Olympikus: { color: "#E85D04" },
  Puma: { color: "#1A1A1A" },
  Adidas: { color: "#0066B3" },
  Asics: { color: "#0054A6" },
  Nike: { color: "#111111" },
  Mizuno: { color: "#002B5C" },
};

const shoeSilhouette = (color) => `
  <g transform="translate(400 290)">
    <ellipse cx="0" cy="58" rx="190" ry="16" fill="rgba(0,0,0,0.05)"/>
    <path d="M-170 18 Q-115 -32 25 -38 Q145 -40 180 8 Q195 38 160 58 Q75 72 -75 66 Q-155 60 -170 18 Z" fill="${color}"/>
    <path d="M-150 22 Q-85 -18 35 -20 Q125 -22 168 15 Q178 35 145 50 Q55 60 -65 54 Q-135 50 -150 22 Z" fill="#ffffff" opacity="0.28"/>
  </g>
`;

const shoes = [
  ["adidas-boston-13", "Boston 13", "Adidas"],
  ["adidas-evo-sl", "EVO SL", "Adidas"],
  ["adidas-supernova-rise", "Supernova Rise", "Adidas"],
  ["adidas-sl2", "SL2", "Adidas"],
  ["nike-pegasus-41", "Pegasus 41", "Nike"],
  ["nike-vomero-18", "Vomero 18", "Nike"],
  ["nike-invincible-3", "Invincible 3", "Nike"],
  ["nike-structure-25", "Structure 25", "Nike"],
  ["asics-cumulus-26", "Gel-Cumulus 26", "Asics"],
  ["asics-nimbus-26", "Gel-Nimbus 26", "Asics"],
  ["asics-novablast-4", "Novablast 4", "Asics"],
  ["asics-kayano-31", "Gel-Kayano 31", "Asics"],
  ["mizuno-wave-rider-27", "Wave Rider 27", "Mizuno"],
  ["mizuno-wave-sky-7", "Wave Sky 7", "Mizuno"],
  ["mizuno-wave-horizon-7", "Wave Horizon 7", "Mizuno"],
  ["mizuno-wave-rebellion-pro", "Wave Rebellion Pro", "Mizuno"],
  ["puma-velocity-nitro-3", "Velocity Nitro 3", "Puma"],
  ["puma-deviate-nitro-2", "Deviate Nitro 2", "Puma"],
  ["puma-magnify-nitro-2", "Magnify Nitro 2", "Puma"],
  ["puma-forevershift-nitro", "ForeverRun Nitro", "Puma"],
  ["corre-4", "Corre 4", "Olympikus"],
  ["olympikus-corre-max", "Corre Max", "Olympikus"],
  ["olympikus-dexter-3", "Dexter 3", "Olympikus"],
  ["olympikus-fleeting-2", "Fleeting 2", "Olympikus"],
];

const dir = path.join("public", "images", "shoes");
fs.mkdirSync(dir, { recursive: true });

for (const [id, model, brand] of shoes) {
  const palette = brands[brand] || { color: "#333333" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${brand} ${model}">
  <defs>
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f8f8"/>
      <stop offset="100%" style="stop-color:#ececec"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg-${id})"/>
  <text x="400" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="600" fill="#1a1a1a">${brand}</text>
  <text x="400" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#666">${model}</text>
  ${shoeSilhouette(palette.color)}
</svg>`;
  fs.writeFileSync(path.join(dir, `${id}.svg`), svg.trim());
}

console.log(`Generated ${shoes.length} shoe SVGs in ${dir}`);
