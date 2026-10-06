// Generates the land dots of the hero globe: a Fibonacci sphere sampled
// against Natural Earth 1:110m land, written as a flat [lat, lon, …] list
// (tenths of a degree) that the WebGL scene turns into positions.
// Run: node scripts/build-globe.mjs
import { readFileSync, writeFileSync } from "fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);

const SAMPLES = 15000;
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // Antarctica reads as noise at this density
  if (geoContains(land, [lon, lat])) out.push(Math.round(lat * 10), Math.round(lon * 10));
}
writeFileSync(
  "src/data/globe-points.json",
  JSON.stringify(out),
);
console.log(`${out.length / 2} land points`);
