export const VERIFY_SIGNATURE_WASM_PATH = "https://arweave.net/xsc_3gxsYZXcrdidKdIxpdnrE4gb6cB1Tq9rffJN-0Q"
export const VERIFY_SIGNATURE_ZKEY_PATH = "https://arweave.net/7FMPzXoXz5i4J8XXtSAwO0O_y9jHSlGMD2e4enTF-zM"
export const WALLET_CONNECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? ''

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
export const HOST = ((): string => {
  if (process.env.NEXT_PUBLIC_HOST) {
    return process.env.NEXT_PUBLIC_HOST
  }

  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
})()

export const COOKIE_NAME = "zkshield-siwe";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? '';
export const SUPABASE_JWT = process.env.SUPABASE_JWT ?? '';