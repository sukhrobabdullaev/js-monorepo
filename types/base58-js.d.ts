declare module 'base58-js' {
  export function base58_to_binary(input: string): Uint8Array;
  export function binary_to_base58(input: Uint8Array): string;
}
