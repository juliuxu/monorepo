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

type ClassName =
  | false
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

/**
 * Shuffle an array
 *
 * @param arr - The array to shuffle
 * @returns a new shuffled array
 */
export function shuffled<T>(arr: ReadonlyArray<T> | T[]): T[] {
  const _arr = arr.slice();

  let currentIndex = _arr.length;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    const tmp = _arr[currentIndex];
    _arr[currentIndex] = _arr[randomIndex];
    _arr[randomIndex] = tmp;
  }
  return _arr;
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: any = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

/**
 * Helper to assert that an item is found, and throw a 404 if not
 */
export function assertItemFound<T>(item: T | undefined): asserts item is T {
  if (item === undefined)
    throw new Response("Not Found", {
      status: 404,
    });
}

/**
 * Convert a slug back into human readable text
 * om-julian -> Om Julian
 */
export function deSlugify(slug: string) {
  // Replace all dashes with spaces
  let text = slug.replaceAll("-", " ");

  // Capitalize every first letter of every word
  text = text.replace(/\w\S*/g, (w) =>
    w.replace(/^\w/, (c) => c.toUpperCase())
  );

  return text;
}
