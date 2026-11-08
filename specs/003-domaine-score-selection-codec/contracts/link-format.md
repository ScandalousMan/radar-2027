# Contrat : format du lien de résultat, version `1`

Fragment : `#1.<charge>` où `<charge>` est la charge binaire ci-dessous en base64url
(alphabet `A–Z a–z 0–9 - _`), **sans** `=`, bits de queue du dernier caractère nuls (FR-028).
L'état n'apparaît jamais dans la query string (principe II).

## Charge binaire (FR-029 → FR-032)

| Octets | Contenu | Règle |
|---|---|---|
| 0 | version de banque | `numéro − 1` (version 1 → `0x00`) ; doit désigner une version publiée |
| 1 | drapeaux | bit 0 : mode (`0` complet, `1` court) ; bits 1–7 réservés, **nuls** |
| 2–4 | masque des sujets | octet 2 : thèmes d'indice 0–7 (bit 0 = indice 0), octet 3 : 8–15, octet 4 : 16–23 ; 3 à 5 bits à 1, tous < `T` |
| 5 … 5 + ⌈3n/8⌉ − 1 | réponses | 3 bits chacune, ordre de présentation, du bit de poids fort vers le bit de poids faible ; bourrage final nul |
| dernier | CRC-8 | polynôme `0x07` (x⁸ + x² + x + 1), init `0x00`, sans réflexion ni masque final, sur tous les octets précédents |

Longueur totale : `5 + ⌈3n/8⌉ + 1` octets, `n` = taille de la sélection (`min(N, taille de la
banque)`). Caractères base64url : `⌈8·octets / 6⌉`.

| Mode | `n` | octets | caractères après `1.` |
|---|---|---|---|
| complet | 100 | 44 | 59 |
| court | 25 | 16 | 22 |
| complet, banque de 96 (état au 2026-11-08) | 96 | 42 | 56 |

Codes de réponse (FR-030) : `0` non répondue, `1` passée, `2` = −2, `3` = −1, `4` = 0, `5` = +1,
`6` = +2, `7` invalide.

## Ordre des vérifications au décodage (FR-033) et motif de rejet (FR-034)

1. Préfixe `1.` (après un `#` optionnel) → sinon `unsupported-link-version`.
2. Alphabet base64url, pas de `=`, bits de queue nuls → sinon `invalid-content`.
3. Au moins 6 octets (en-tête + somme) → sinon `invalid-length`.
4. Octet 0 + 1 ≤ nombre de versions publiées → sinon `unknown-bank-version`.
5. Bits réservés nuls → sinon `invalid-content`.
6. Masque : 3 à 5 bits, tous d'indice < `T` de la version → sinon `invalid-content`.
7. Sélection recalculée ; longueur = `5 + ⌈3n/8⌉ + 1` → sinon `invalid-length`.
8. CRC-8 → sinon `invalid-checksum`.
9. Chaque code ∈ 0…6, bits de bourrage nuls → sinon `invalid-content`.

Le premier échec l'emporte ; aucun état partiel n'est produit. `decodeHeader` s'arrête après
l'étape 6 (elle vérifie le nombre de bits, pas `T`, qu'elle ne connaît pas encore).

## Fixtures de référence (US3 scénarios 1 et 2 ; vérifiées indépendamment le 2026-11-08)

**Complet** : version 1, mode complet, sujets d'indices 2, 7, 9 ; réponses `+2`, passée, `−1`,
puis 97 non répondues.

```text
octets (44) : 00 00 84 02 00 C5 80 00 00 … 00 C3
fragment    : #1.AACEAgDFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMM
```

Détail : masque `0x000284` = bits 2, 7, 9 → octets `84 02 00` ; réponses `110 001 011 000…`
→ `C5 80 00 …` ; CRC `C3`.

**Court** : version 1, mode court, sujets 0, 2, 7, 9, 12 ; mêmes trois premières réponses,
22 non répondues.

```text
octets (16) : 00 01 85 12 00 C5 80 00 00 00 00 00 00 00 00 9E
fragment    : #1.AAGFEgDFgAAAAAAAAAAAng
```

Ces deux fragments sont exportés par `src/core/codec/fixtures.ts` et testés caractère par
caractère (SC-007) ; ils peuvent être affichés par la page Méthodologie.

## Propriétés garanties (SC-002, SC-003, SC-007)

- `decodeFragment(encodeFragment(s, b), b) = { ok: true, value: s }` pour tout état valide `s`
  de la banque `b` (priorités normalisées en ordre canonique).
- `encodeFragment(decodeFragment(c, b).value, b) = c` pour toute charge valide `c`.
- Toute substitution, insertion ou suppression d'un caractère d'un fragment valide est rejetée
  (longueur, alphabet, bits de queue ou CRC) ; une charge aléatoire de longueur correcte est
  rejetée dans au moins 99 % des cas.
- La longueur du fragment ne dépend que du mode et de la taille de la banque, jamais des
  sujets ni des réponses.
