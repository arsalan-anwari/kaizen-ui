// The two README screenshots: run `npm run build` first, then `npm run shots`.
import { preview } from "vite";
import { chromium } from "playwright";

const server = await preview({ preview: { port: 4173 } });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch();

async function shoot(name, { dark = false, at = null } = {}) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1
  });
  // The header controls read their prefs from localStorage, so set the theme
  // before the page boots rather than clicking through the cycle.
  if (dark) {
    await page.addInitScript(() =>
      localStorage.setItem("kaizen-prefs", JSON.stringify({ theme: "dark" }))
    );
  }
  await page.goto(url + (at ?? ""), { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `../screenshots/${name}.png`, animations: "disabled" });
  await page.close();
  console.log(name);
}

await shoot("overview");
await shoot("overview-dark", { at: "#button", dark: true });

await browser.close();
await server.close();
