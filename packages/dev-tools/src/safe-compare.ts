import crypto from "crypto";

// Protect against timing attacks
// https://github.com/jshttp/basic-auth/issues/39#issuecomment-787635167
export function safeCompare(a: string, b: string): boolean {
  const key = (crypto as any).randomBytes(32);
  const ha = (crypto as any).createHmac("sha256", key).update(a).digest();
  const hb = (crypto as any).createHmac("sha256", key).update(b).digest();
  return (crypto as any).timingSafeEqual(ha, hb) && a === b;
}
