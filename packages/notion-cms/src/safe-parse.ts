import type { z } from "zod";
import type { Relaxed } from "./misc";

/**
 * Safe parse a list of elements according to a schema
 * return both the successfully parsed elements and the failed ones
 */
export async function safeParseList<
  Element,
  Schema extends z.Schema,
  Mapper extends (
    element: Element,
  ) => Relaxed<z.infer<Schema>> | Promise<Relaxed<z.infer<Schema>>>,
>(list: Element[], schema: Schema, mapper: Mapper) {
  const success: z.infer<Schema>[] = [];
  const failed: {
    unparsed: Relaxed<z.infer<Schema>>;
    errors: z.ZodIssue[];
  }[] = [];

  const mapped = await Promise.all(list.map(mapper));
  mapped
    .map((unparsed) => ({
      unparsed,
      parsed: schema.safeParse(unparsed),
    }))
    .forEach(({ unparsed, parsed }) => {
      if (parsed.success) {
        success.push(parsed.data);
      } else {
        failed.push({
          unparsed,
          errors: parsed.error.errors,
        });
      }
    });

  return { success, failed };
}
