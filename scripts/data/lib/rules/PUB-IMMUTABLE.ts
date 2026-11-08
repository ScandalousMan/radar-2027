// PUB-IMMUTABLE : chaque fichier d'une version publiée a l'empreinte enregistrée au registre (SC-011).
import { violation, type Rule, type Violation } from './types';

export const PUB_IMMUTABLE: Rule = {
  code: 'PUB-IMMUTABLE',
  run({ published }) {
    if (!published) return [];
    const out: Violation[] = [];
    const { registry, files } = published;
    const expected = new Set<string>(['versions.json']);
    registry.versions.forEach((v, i) => {
      const id = `version ${v.number}`;
      if (v.number !== i + 1) out.push(violation('PUB-IMMUTABLE', 'version', id, `numéro ${v.number} attendu ${i + 1}`));
      const main = `versions/${v.number}/main.json`;
      expected.add(main);
      const f = files.get(main);
      if (!f) out.push(violation('PUB-IMMUTABLE', 'version', id, `${main} manquant`));
      else if (f.hash !== v.mainHash) out.push(violation('PUB-IMMUTABLE', 'version', id, `${main} modifié après publication (empreinte ${f.hash})`));
      for (const [candidate, hash] of Object.entries(v.detailHashes)) {
        const path = `versions/${v.number}/candidates/${candidate}.json`;
        expected.add(path);
        const d = files.get(path);
        if (!d) out.push(violation('PUB-IMMUTABLE', 'version', id, `${path} manquant`));
        else if (d.hash !== hash) out.push(violation('PUB-IMMUTABLE', 'version', id, `${path} modifié après publication`));
      }
    });
    for (const path of files.keys()) {
      if (!expected.has(path)) out.push(violation('PUB-IMMUTABLE', 'version', path, `fichier publié absent du registre : ${path}`));
    }
    return out;
  },
};
