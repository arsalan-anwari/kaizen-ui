// Builds the bundled Japanese font: Noto Sans JP, subset to the kana and the
// jōyō kanji. Run it when the upstream font or KANJIDIC2 release is bumped.
//
//   node tools/build-jp-font.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";
import { gunzipSync } from "node:zlib";

const FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/295d98a7a0c17c68f1341eaeea354e7960ea70d3/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf";
const LICENCE_URL =
  "https://raw.githubusercontent.com/google/fonts/295d98a7a0c17c68f1341eaeea354e7960ea70d3/ofl/notosansjp/OFL.txt";
const KANJIDIC_URL =
  "https://github.com/scriptin/jmdict-simplified/releases/download/3.6.2%2B20260914172325/kanjidic2-en-3.6.2%2B20260914172325.json.tgz";

const OUT_DIR = fileURLToPath(new URL("../src/assets/fonts/", import.meta.url));
const OUT_NAME = "noto-sans-jp.woff2";

// Grades 1 to 8 are the jōyō set: the 2136 characters Japanese schooling
// teaches, which every JLPT level is drawn from.
const JOUYOU_GRADES = new Set([1, 2, 3, 4, 5, 6, 8]);

const KANA_START = 0x3041;
const KANA_END = 0x30ff;

// Punctuation and marks that show up in Japanese running text.
const EXTRAS = "　、。〃〆〇〈〉《》「」『』【】〒〔〕〜ー・￥…‥！？（）：；";

const TAR_BLOCK = 512;

function readNulTerminated(block, start, length) {
  const field = block.subarray(start, start + length);
  const end = field.indexOf(0);
  return new TextDecoder().decode(end === -1 ? field : field.subarray(0, end));
}

/** The archives hold one JSON file; pull it out without a tar dependency. */
function readSingleTarEntry(tar) {
  let offset = 0;
  while (offset + TAR_BLOCK <= tar.length) {
    const name = readNulTerminated(tar, offset, 100);
    if (name === "") break;
    const size = Number.parseInt(readNulTerminated(tar, offset + 124, 12).trim(), 8);
    const type = readNulTerminated(tar, offset + 156, 1);
    const start = offset + TAR_BLOCK;
    if (type === "" || type === "0") return tar.subarray(start, start + size);
    offset = start + Math.ceil(size / TAR_BLOCK) * TAR_BLOCK;
  }
  throw new Error("tar archive contains no regular file");
}

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

function charactersToKeep(kanjidic) {
  const kept = new Set(EXTRAS);
  for (let code = KANA_START; code <= KANA_END; code += 1) {
    kept.add(String.fromCodePoint(code));
  }
  for (const character of kanjidic.characters) {
    if (JOUYOU_GRADES.has(character.misc?.grade)) kept.add(character.literal);
  }
  return [...kept].sort().join("");
}

const [font, licence, archive] = await Promise.all([
  download(FONT_URL),
  download(LICENCE_URL),
  download(KANJIDIC_URL)
]);

const kanjidic = JSON.parse(
  new TextDecoder().decode(readSingleTarEntry(gunzipSync(archive)))
);
const kept = charactersToKeep(kanjidic);
const subset = await subsetFont(font, kept, { targetFormat: "woff2" });

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(new URL(OUT_NAME, `file://${OUT_DIR}`), subset);
writeFileSync(new URL("OFL.txt", `file://${OUT_DIR}`), licence);

process.stdout.write(
  `${OUT_NAME}: ${[...kept].length} characters, ${Math.round(subset.length / 1024)} kB\n`
);
