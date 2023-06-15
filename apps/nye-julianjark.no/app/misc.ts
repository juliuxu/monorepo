// Like the built-in Partial, but requires all keys
export type Relaxed<T extends object> = {
  [K in keyof T]: T[K] | undefined;
};

export function typedBoolean<T>(
  value: T
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

export function chunked<T>(l: T[], chunkSize: number) {
  const result: T[][] = [];
  const copy = l.slice();
  while (copy.length > 0) {
    result.push(copy.splice(0, chunkSize));
  }

  return result;
}

export function filterPublishedPredicate({
  published,
}: {
  published: "PUBLISHED" | "UNPUBLISHED" | "DEV";
}) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === "development") {
    return ["PUBLISHED", "DEV"].includes(published);
  }
  return published === "PUBLISHED";
}

type ClassName =
  | undefined
  | string
  | number
  | Record<string, boolean>
  | ClassName[];

/**
 * Simple utility function for creating conditional class names with a bit more
 * help than template strings gives you.
 *
 * Basically this: https://www.npmjs.com/package/classnames
 *
 * @param args {ClassName[]} - class names to combine.
 */
export function classNames(...args: ClassName[]): string {
  const resolved: (string | number)[] = [];
  for (const arg of args) {
    if (typeof arg === "number" || typeof arg === "string") {
      resolved.push(arg);
    } else if (Array.isArray(arg)) {
      resolved.push(classNames(...arg));
    } else if (typeof arg === "object") {
      resolved.push(...Object.keys(arg).filter((it) => arg[it]));
    }
  }
  return resolved.filter(typedBoolean).join(" ");
}
