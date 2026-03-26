/**
 * One-time script: Generate Sri Rama chant audio using Sarvam TTS API.
 *
 * Usage: SARVAM_API_KEY=sk_xxx node scripts/generate-chant.mjs
 * Or:    node scripts/generate-chant.mjs  (reads from ../.env)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read API key from env or .env file
let API_KEY = process.env.SARVAM_API_KEY || process.env.VITE_SARVAM_API_KEY;
if (!API_KEY) {
  try {
    const envFile = readFileSync(resolve(__dirname, '../../.env'), 'utf8');
    const match = envFile.match(/VITE_SARVAM_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  } catch (_) {}
}
if (!API_KEY) {
  console.error('No Sarvam API key found. Set SARVAM_API_KEY env var or add to .env');
  process.exit(1);
}

// Chant text — repeated for a ~30-40 second loop
const CHANT_TEXT = `శ్రీ రామ జయ రామ జయ జయ రామ.
శ్రీ రామ జయ రామ జయ జయ రామ.
శ్రీ రామ జయ రామ జయ జయ రామ.
శ్రీ రామ జయ రామ జయ జయ రామ.
శ్రీ రామ జయ రామ జయ జయ రామ.`;

async function generate() {
  console.log('Generating Sri Rama chant via Sarvam TTS...');
  console.log(`Text: ${CHANT_TEXT.split('\n')[0].trim()}... (5 repetitions)`);

  const res = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': API_KEY,
    },
    body: JSON.stringify({
      text: CHANT_TEXT,
      target_language_code: 'te-IN',
      speaker: 'kavitha',     // Female voice — devotional feel
      model: 'bulbul:v3',
      pace: 0.75,             // Slow, meditative pace
      speech_sample_rate: 22050,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Sarvam API error ${res.status}: ${err}`);
    process.exit(1);
  }

  const data = await res.json();
  if (!data.audios || !data.audios[0]) {
    console.error('No audio in response:', data);
    process.exit(1);
  }

  // Decode base64 audio and save
  const audioBuffer = Buffer.from(data.audios[0], 'base64');
  const outPath = resolve(__dirname, '../public/assets/sounds/sri_rama_chant.mp3');
  writeFileSync(outPath, audioBuffer);

  const sizeMB = (audioBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`✅ Saved: ${outPath} (${sizeMB} MB)`);
}

generate().catch(e => { console.error(e); process.exit(1); });
