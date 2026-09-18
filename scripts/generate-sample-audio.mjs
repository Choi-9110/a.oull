// 도슨트 플레이어 디자인·개발용 샘플 오디오 생성 (실제 음성 아님).
// 사용: node scripts/generate-sample-audio.mjs → public/samples/docent-sample.wav
import { mkdirSync, writeFileSync } from "node:fs";

const SAMPLE_RATE = 16000;
const SECONDS = 20;
const n = SAMPLE_RATE * SECONDS;
const data = Buffer.alloc(n * 2);

// 부드러운 화음(가야금 느낌의 감쇠 음)을 2초 간격으로 반복
const notes = [293.66, 329.63, 392.0, 440.0, 493.88]; // D E G A B (평조 5음)
for (let i = 0; i < n; i++) {
  const t = i / SAMPLE_RATE;
  const beat = Math.floor(t / 2);
  const local = t - beat * 2;
  const f = notes[beat % notes.length];
  const env = Math.exp(-local * 2.2);
  const sample =
    0.28 * env * Math.sin(2 * Math.PI * f * t) +
    0.08 * env * Math.sin(2 * Math.PI * f * 2 * t) +
    0.04 * Math.sin(2 * Math.PI * 146.83 * t); // 낮은 지속음
  const fade = Math.min(1, t / 0.5, (SECONDS - t) / 1.0);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample * fade)) * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

mkdirSync("public/samples", { recursive: true });
writeFileSync("public/samples/docent-sample.wav", Buffer.concat([header, data]));
console.log(
  "public/samples/docent-sample.wav",
  ((44 + data.length) / 1024).toFixed(0),
  "KB",
);
