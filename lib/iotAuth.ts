// /lib/iotAuth.ts
import { NextRequest } from 'next/server';

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function extractBearer(req: { headers: Headers }) {
  const auth = (req.headers.get('authorization') ?? '').trim();
  if (!auth) return null;

  // If it already starts with Bearer, strip it
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();

  // Otherwise treat the entire header as the token
  return auth;
}
export function requireAnyIotBearer(req: NextRequest, envKeyNames: string[]) {
  console.log('auth header:', req.headers.get('authorization'));
  const token = extractBearer(req);
  console.log(token);
  if (!token) return { ok: false as const, status: 401, msg: 'Missing bearer token' };

  for (const keyName of envKeyNames) {
    const expected = process.env[keyName];
    if (!expected) continue; // missing key -> ignore, or fail closed if you prefer
    if (timingSafeEqual(token, expected)) return { ok: true as const, matched: keyName };
  }

  return { ok: false as const, status: 403, msg: 'Invalid token' };
}
