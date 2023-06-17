import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllPortfolioItems } from "~/notion-portfolio/client";

export const loader = async () => {
  const items = await getAllPortfolioItems();
  return json({ items });
};
export const Component = () => {
  const { items } = useLoaderData<typeof loader>();
  return (
    <>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </>
  );
};
