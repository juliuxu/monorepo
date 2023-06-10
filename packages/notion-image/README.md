# Notion image utility

This package provides a utility to download images from Notion pages.

## Example

```typescript
export const imageUrlBuilder = createImageUrlBuilder("/api/notion-image");

export const loader = async ({ request }: { request: Request }) => {
  return getNotionImage("YOUR NOTION TOKEN")(
    Object.fromEntries(new URL(request.url).searchParams)
  );
};
```
