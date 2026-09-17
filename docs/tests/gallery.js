import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

export const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export const themes = ["light", "dark", "high-contrast"];

export async function openGallery(page, theme = "light") {
  await page.addInitScript((prefs) => {
    localStorage.setItem("kaizen-prefs", JSON.stringify(prefs));
  }, theme === "high-contrast" ? { theme: "system", contrast: true } : { theme, contrast: false });

  await page.goto("./");
  await expect(page.locator("#splash")).toHaveCount(0);
  await expect(page.locator("main section[id]").first()).toBeVisible();
}

export async function section(page, name) {
  await page.goto(`./#${name}`);
  await expect(page.locator("#splash")).toHaveCount(0);
  return page.locator(`main section#${name}`);
}

export async function violations(page) {
  const result = await new AxeBuilder({ page })
    .withTags(TAGS)
    .exclude(".code-block")
    .analyze();
  const found = [];

  for (const violation of result.violations) {
    for (const node of violation.nodes) {
      const selector = Array.isArray(node.target) ? String(node.target[0]) : String(node.target);
      const where = await page.evaluate((target) => {
        const element = document.querySelector(target);
        return element?.closest("section[id]")?.id ?? "page";
      }, selector);
      found.push(`${where}: ${violation.id}`);
    }
  }

  return [...new Set(found)].sort();
}
