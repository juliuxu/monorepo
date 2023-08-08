import type { getMultiSelectAndColor } from "@julianjark/notion-utils";

type NotionSelectColor = NonNullable<
  ReturnType<typeof getMultiSelectAndColor>
>[number]["color"];
export const notionSelectColorMap: Record<NotionSelectColor, string> /*tw*/ = {
  default: "bg-gray-100 text-j-gray-700 border-gray-700",
  gray: "bg-gray-100 text-j-gray-700 border-gray-700",
  brown: "bg-brown-100 text-j-brown-700 border-brown-700",
  orange: " bg-orange-100 text-j-orange-700 border-orange-700",
  yellow: "bg-yellow-100 text-j-yellow-700 border-yellow-700",
  green: "bg-green-100 text-j-green-700 border-green-700",
  blue: "bg-blue-100 text-j-blue-700 border-blue-700",
  purple: "bg-purple-100 text-j-purple-700 border-purple-700",
  pink: "bg-pink-100 text-j-pink-700 border-pink-700",
  red: "bg-red-100 text-j-red-700 border-red-700",
};
