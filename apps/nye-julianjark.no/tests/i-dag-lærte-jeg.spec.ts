import { expect, test } from "@playwright/test";

test("i dag lærte jeg", async ({ page }) => {
  await page.goto("/i-dag-lærte-jeg");

  await expect(page).toHaveTitle(/I dag lærte jeg/);

  const entries = page
    .getByTestId("i-dag-lærte-jeg-entries")
    .getByRole("listitem");
  await expect(entries).not.toHaveCount(0);

  // a single entry
  const entry = entries.first();
  const entryLink = entry.getByRole("link");
  const entryTitle = await entryLink.innerText();

  await entryLink.click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    entryTitle,
  );
  await expect(page).toHaveTitle(new RegExp(entryTitle));
});

test("i dag lærte jeg - social image", async ({ page }) => {
  await page.goto("/i-dag-lærte-jeg");

  // Navigate to the first entry
  await page
    .getByTestId("i-dag-lærte-jeg-entries")
    .getByRole("listitem")
    .first()
    .getByRole("link")
    .click();

  const socialImageUrl = await page
    .locator("meta[property='og:image']")
    .first()
    .getAttribute("content");
  expect(socialImageUrl).not.toBeNull();

  const imageResponse = await fetch(socialImageUrl!);
  expect(imageResponse.ok).toBe(true);
  expect(imageResponse.headers.get("content-type")).toBe("image/png");
  expect((await imageResponse.blob()).size).toBeGreaterThan(0);
});
