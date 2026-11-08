// Mesure des fichiers publiés (SC-004).
export function measure(json: string): number {
  return Buffer.byteLength(json, 'utf8');
}
