import { classNames } from "~/utils/misc";
import { notionSelectColorMap } from "~/styles/notion-select-colors";

interface BadgeProps {
  as: "li" | "span" | "div";
  children: React.ReactNode;
  color: keyof typeof notionSelectColorMap;
}
export function Badge({ as: Component, children, color }: BadgeProps) {
  return (
    <Component
      className={classNames(
        "px-2 py-1",
        "h-fit",
        "text-body lg:text-body",

        "border-2",
        "border-current",

        // "text-transparent bg-clip-text bg-gradient-to-r from-j-pink-400 via-j-pink-500 to-j-pink-600",
        // notionSelectColorMap[color],

        "rounded"
      )}
    >
      {children}
    </Component>
  );
}
