import { expect, test } from "@playwright/test";
import { openGallery, section } from "./gallery.js";

test("a tile grid is one tab stop and its arrow keys move inside it", async ({ page }) => {
  await openGallery(page);

  const tiles = page.locator("main section#tilegrid .tile-grid button");
  await expect(tiles.first()).toHaveAttribute("tabindex", "0");
  await expect(tiles.nth(1)).toHaveAttribute("tabindex", "-1");

  await tiles.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tiles.nth(1)).toBeFocused();
  await expect(tiles.nth(1)).toHaveAttribute("tabindex", "0");
  await expect(tiles.first()).toHaveAttribute("tabindex", "-1");

  await page.keyboard.press("End");
  await expect(tiles.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tiles.first()).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(tiles.first()).toBeFocused();
});

test("a tile grid moves a whole row on the up and down keys", async ({ page }) => {
  await openGallery(page);

  const tiles = page.locator("main section#tilegrid .tile-grid button");
  const perRow = await tiles.evaluateAll((list) => {
    const top = list[0].offsetTop;
    const wrapped = list.findIndex((item) => item.offsetTop > top);
    return wrapped <= 0 ? list.length : wrapped;
  });
  test.skip(perRow >= (await tiles.count()), "the grid did not wrap at this width");

  await tiles.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tiles.nth(perRow)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(tiles.first()).toBeFocused();
});

test("a segmented control is a real tab strip", async ({ page }) => {
  const demo = await section(page, "segmented");
  const tabs = demo.getByRole("tab");

  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(demo.locator("[role='tablist']").first()).toBeVisible();

  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
});

test("the header carries a skip link and a named tab strip", async ({ page }) => {
  await openGallery(page);

  await page.evaluate(() => {
    const header = document.querySelector("header");
    header.insertAdjacentHTML(
      "afterbegin",
      '<a id="probe" class="skip-link" href="#top">Skip to content</a>'
    );
  });

  const probe = page.locator("#probe");
  await expect(probe).toHaveCSS("position", "absolute");
  await probe.focus();
  await expect(probe).toHaveCSS("position", "fixed");
  await expect(probe).toBeInViewport();
});

test("japanese text is tagged as japanese", async ({ page }) => {
  const demo = await section(page, "glyph");

  const kana = demo.locator(".jp").first();
  await expect(kana).toHaveAttribute("lang", "ja");
  await expect(kana).toHaveCSS("font-feature-settings", '"palt" 0');

  const labelled = demo.getByRole("img", { name: "kai, improvement" });
  await expect(labelled).toHaveAttribute("lang", "ja");

  await expect(demo.locator("[lang='en']").first()).toHaveClass(/jp/);
});

test("the announcer speaks the same text twice", async ({ page }) => {
  const demo = await section(page, "announcer");

  const live = demo.locator("[role='status']");
  await expect(live).toHaveAttribute("aria-live", "polite");
  await expect(live).toHaveClass(/sr-only/);

  const say = demo.getByRole("button", { name: "Say it politely" });
  await say.click();
  await expect(live).toHaveText("Exported 1 runs");

  // The blank frame that re-fires the live region lasts 60ms, too short to
  // catch by polling, so record every change to the node instead.
  const changes = live.evaluate(
    (node) =>
      new Promise((resolve) => {
        const seen = [];
        new MutationObserver(() => {
          seen.push(node.textContent);
          if (seen.length === 2) resolve(seen);
        }).observe(node, { characterData: true, childList: true, subtree: true });
      })
  );
  await say.click();
  expect(await changes).toEqual(["", "Exported 2 runs"]);

  await demo.getByRole("button", { name: "Interrupt" }).click();
  const urgent = demo.locator("[role='alert']");
  await expect(urgent).toHaveAttribute("aria-live", "assertive");
  await expect(urgent).toHaveText("Not quite. あ = a");
});

test("the heat charts describe every cell in words", async ({ page }) => {
  const heatmap = await section(page, "rowheatmap");
  await expect(heatmap.getByRole("img", { name: "o, never came up" })).toBeVisible();
  await expect(heatmap.getByRole("img", { name: "nu: 2 of 9 right, Shaky" })).toBeVisible();

  const grid = await section(page, "accuracygrid");
  await expect(grid.getByRole("img", { name: "a: 14 of 14 right, Mastered" })).toBeVisible();
  await expect(grid.getByRole("img").first()).toHaveAccessibleName(/right/);
});

test("keyboard mode starts on ctrl+/ and ? opens the shortcut menu", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "keynav stays off on a touch screen");
  await openGallery(page);

  await page.keyboard.press("Control+Slash");
  await expect(page.locator("html")).toHaveClass(/kbd-nav/);
  await expect(page.getByText("Keyboard mode", { exact: true })).toBeVisible();

  await page.keyboard.press("Shift+Slash");
  const sheet = page.locator("dialog[open]");
  await expect(sheet.getByText("Start keyboard mode")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);

  await page.keyboard.press("Control+Shift+Slash");
  await expect(page.locator("html")).not.toHaveClass(/kbd-nav/);
});

test("shift+arrow walks the sections of the page", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "keynav stays off on a touch screen");
  await openGallery(page);

  await page.keyboard.press("Control+Slash");
  await page.keyboard.press("Shift+ArrowDown");
  const first = await page.evaluate(() => document.querySelector("[data-keynav]")?.tagName);
  expect(first).toBeDefined();

  await page.keyboard.press("Shift+ArrowDown");
  await expect(page.locator("[data-keynav]")).toHaveCount(1);
  await expect(page.locator("[data-keynav]")).toContainText(/\w/);

  // One stop per component, not per group: the first two steps land on the
  // intro and then on the first demo, so the third is the demo after it.
  await page.keyboard.press("Shift+ArrowDown");
  await expect(page.locator("[data-keynav]")).toHaveAttribute("id", "iconbutton");
});

test("pagination steps through the pages and walks on the arrow keys", async ({ page }) => {
  const pager = (await section(page, "pagination")).getByRole("navigation");
  const previous = pager.getByRole("button", { name: "Previous page" });
  const next = pager.getByRole("button", { name: "Next page" });

  await expect(pager).toContainText("1 / 12");
  await expect(previous).toBeDisabled();

  await next.click();
  await expect(pager).toContainText("2 / 12");
  await expect(previous).toBeEnabled();

  await previous.focus();
  await page.keyboard.press("ArrowRight");
  await expect(next).toBeFocused();
  await page.keyboard.press("Home");
  await expect(previous).toBeFocused();
});

test("an answer tile carries its slot number and says how the answer went", async ({ page }) => {
  const demo = await section(page, "choicetile");
  const tiles = demo.getByRole("button");

  await expect(tiles).toHaveCount(4);
  // The number is decoration: the tile is named by its answer alone.
  await expect(tiles.first()).toHaveAccessibleName("a");
  await expect(tiles.first().locator("[aria-hidden='true']")).toHaveText("1");

  await tiles.first().click();
  for (const tile of await tiles.all()) await expect(tile).toBeDisabled();
  await expect(tiles.nth(2)).toHaveClass(/border-success/);
  await expect(tiles.first()).toHaveClass(/border-danger/);
  await expect(tiles.nth(1)).toHaveClass(/opacity-40/);
});

test("fitted text shrinks as the text gets longer and never wraps", async ({ page }) => {
  const demo = await section(page, "fittext");
  const fitted = demo.locator("span[style*='font-size']").first();

  const size = async () =>
    Number.parseFloat(await fitted.evaluate((node) => getComputedStyle(node).fontSize));

  await expect(fitted).toHaveCSS("white-space", "nowrap");
  const before = await size();

  await demo.getByRole("textbox").fill("counterintuitively unabbreviated");
  await expect.poll(size).toBeLessThan(before);

  // One line, whatever the length: the box height never grows with the text.
  await expect(fitted).toHaveCSS("white-space", "nowrap");
});

test("a tree table group collapses and expands its rows", async ({ page }) => {
  const demo = await section(page, "treetable");
  const group = demo.getByRole("button", { name: "Hiragana" });
  const child = demo.getByText("NA-row", { exact: true });

  await expect(group).toHaveAttribute("aria-expanded", "true");
  await expect(child).toBeVisible();

  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await expect(child).toBeHidden();

  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "true");
  await expect(child).toBeVisible();
});

test("the settings sheet writes the theme it is given", async ({ page }) => {
  const demo = await section(page, "settingsmenu");
  await demo.getByRole("button", { name: "Open settings" }).click();

  const sheet = page.locator("dialog[open]");
  await expect(sheet).toHaveAttribute("aria-label", "Settings");

  await sheet.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await sheet.getByRole("switch", { name: "High contrast" }).click();
  await expect(page.locator("html")).toHaveClass(/high-contrast/);
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  // The sheet owns the prefs, so what it set survives a reload.
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/high-contrast/);
});

test("a dialog closes on escape unless it has no way out", async ({ page }) => {
  const demo = await section(page, "dialog");

  await demo.getByRole("button", { name: "About this deck" }).click();
  const details = page.getByRole("dialog", { name: "Travel phrases" });
  await expect(details).toHaveAccessibleDescription("42 words for stations and hotels.");
  await expect(details.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(details).toHaveCount(0);

  // No onclose: no close button, and escape leaves it up until the work is done.
  await demo.getByRole("button", { name: "First-start download" }).click();
  const blocking = page.getByRole("dialog", { name: "Getting the basics" });
  await expect(blocking.getByRole("button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(blocking).toBeVisible();
  await expect(blocking).toHaveCount(0, { timeout: 5_000 });
});

test("a shelf card is an article named by its title", async ({ page }) => {
  const demo = await section(page, "shelfcard");

  await expect(demo.getByRole("article")).toHaveCount(2);
  const card = demo.getByRole("article", { name: "JLPT N5" });
  await expect(card).toContainText("184 words");
  await expect(card.getByRole("switch", { name: "Use in practice" })).toBeVisible();
});

test("a wood tray fills its slots and gives way to the finished glyph", async ({ page }) => {
  const demo = await section(page, "woodtray");
  const tray = demo.getByRole("group", { name: "休" });

  await tray.getByRole("button", { name: "亻, empty" }).click();
  await expect(tray.getByRole("button", { name: "亻, placed" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  await expect(tray.locator(".anim-glyph")).toHaveCount(0);

  await tray.getByRole("button", { name: "木, empty" }).click();
  await expect(tray.locator(".anim-glyph")).toHaveText("休");

  // The slots stay pressable over the glyph, so a block can come back out.
  await tray.getByRole("button", { name: "木, placed" }).click();
  await expect(tray.locator(".anim-glyph")).toHaveCount(0);
});

test("strokes are an image only when they carry a label", async ({ page }) => {
  const demo = await section(page, "strokes");
  const drawings = demo.locator("svg");

  await expect(drawings).toHaveCount(2);
  await expect(demo.getByRole("img", { name: "亻, person" })).toBeVisible();
  await expect(drawings.nth(1)).toHaveAttribute("aria-hidden", "true");
});

test("a right-to-left document mirrors the layout", async ({ page }) => {
  const demo = await section(page, "shelfcard");
  const card = demo.getByRole("article", { name: "JLPT N5" });
  const corner = card.getByText("N5", { exact: true });
  const badge = card.getByText("Installed");

  const x = async (locator) => (await locator.boundingBox()).x;
  expect(await x(corner)).toBeLessThan(await x(badge));

  await page.evaluate(() => (document.documentElement.dir = "rtl"));
  await expect.poll(async () => (await x(corner)) > (await x(badge))).toBe(true);
});
