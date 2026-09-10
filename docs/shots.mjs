// Screenshots for the README: run `npm run build` first, then `npm run shots`.
import { preview } from "vite";
import { chromium } from "playwright";

const server = await preview({ preview: { port: 4173 } });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch();

async function shoot(name, { dark = false, mobile = false, selector = null, at = null, before = null } = {}) {
  const page = await browser.newPage({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
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
  if (before !== null) await before(page);
  await page.waitForTimeout(800);
  const target = selector === null ? page : page.locator(selector);
  await target.screenshot({ path: `../screenshots/${name}.png`, animations: "disabled" });
  await page.close();
  console.log(name);
}

await shoot("overview");
await shoot("overview-dark", { at: "#button", dark: true });
await shoot("cards", { selector: "#card", at: "#card" });
await shoot("progress", { selector: "#meter", at: "#meter" });
await shoot("board", { selector: "#board", at: "#board" });
await shoot("audio", { selector: "#recordplayer", at: "#recordplayer" });
await shoot("mobile", { mobile: true });
await shoot("select", {
  at: "#select",
  selector: null,
  before: async (page) => await page.getByRole("button", { name: "Level" }).click()
});

await browser.close();
await server.close();
