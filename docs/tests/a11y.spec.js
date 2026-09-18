import { expect, test } from "@playwright/test";
import { openGallery, themes, violations } from "./gallery.js";

for (const theme of themes) {
  test(`every component passes WCAG 2.2 AA in the ${theme} theme`, async ({ page }) => {
    await openGallery(page, theme);
    expect(await violations(page)).toEqual([]);
  });
}

const overlays = [
  "popover",
  "confirmdialog",
  "numberroller",
  "select",
  "actionselect",
  "shortcuthelp"
];

for (const name of overlays) {
  test(`${name} passes WCAG 2.2 AA while it is open`, async ({ page }) => {
    await openGallery(page);
    await page.locator(`main section#${name}`).getByRole("button").first().click();
    await expect(page.locator("dialog[open], [role='dialog'], [role='alertdialog']")).toHaveCount(
      1
    );
    expect(await violations(page)).toEqual([]);
  });
}

test("every component the gallery lists is rendered and named", async ({ page }) => {
  await openGallery(page);

  const listed = await page
    .locator("nav a[href^='#']")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href").slice(1)));
  const rendered = await page
    .locator("main section[id]")
    .evaluateAll((sections) => sections.map((element) => element.id));

  expect(listed.length).toBeGreaterThan(0);
  expect(rendered).toEqual(listed);
});
