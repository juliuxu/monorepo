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

  await expect(page).toHaveTitle(new RegExp(entryTitle));
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    entryTitle,
  );
});
