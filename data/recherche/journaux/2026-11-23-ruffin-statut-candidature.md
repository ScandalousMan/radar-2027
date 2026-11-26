# Compte rendu — 2026-11-23-ruffin-statut-candidature

Mode : PERSONALITY · Auteur : claude (opus) · Dates : 2026-11-23 → 2026-11-23 · État : completed

## 1. Périmètre de recherche

Statut de candidature (kind CANDIDACY) de François Ruffin (`francois-ruffin`), publié `declared`
depuis le 2026-04-10. Le propriétaire indiquait un retrait. Il fallait le vérifier en source
primaire, relever la date exacte et dire s'il s'agit d'un renoncement simple ou d'un désistement.
Aucun thème, aucune question. Recherche non exhaustive (`exhaustive: false`).

## 2. Personnalités et thèmes couverts

- François Ruffin (`francois-ruffin`), Debout! : statut de candidature seulement.

## 3. Sources consultées

- **[Fait vérifié]** Canal Telegram public certifié « François Ruffin », message n° 4336 du
  2026-11-21 à 17:01:59 UTC (18:01 heure de Paris) : https://t.me/francoisruffin/4336.
  Retenu, enregistré sous `francois-ruffin-renoncement-candidature`.
- **[Fait vérifié]** Messages suivants du même canal, publiés le 2026-11-22 (n° 4337 à 4345) :
  extraits de l'entretien BFMTV du 22 novembre à 21 h. Utilisés pour le contexte, non enregistrés.
  https://t.me/s/francoisruffin
- **[Fait vérifié]** Article de francoisruffin.fr du 2026-11-22, de même titre. Son corps se
  limite à la vidéo intégrée.
  https://francoisruffin.fr/presidentielle-2027-face-au-risque-du-pire-je-retire-ma-candidature/
- **[Fait vérifié]** Vidéo YouTube de sa chaîne, publiée le 2026-11-22 (31 min 40 s). Elle n'a que
  des sous-titres automatiques et n'a pas été retranscrite. https://www.youtube.com/watch?v=I7yZcMRwLAQ
- Presse secondaire du 2026-11-21 : RTBF (https://www.rtbf.be/article/france-ma-campagne-est-dans-une-impasse-francois-ruffin-retire-sa-candidature-pour-la-presidentielle-11819128)
  et Yahoo Actualités (https://fr.news.yahoo.com/sport/francois-ruffin-retire-candidature-a-181352223.html),
  toutes deux lues. Ouest-France a renvoyé HTTP 403 et n'a pas été lu.
- debout.fr : aucun communiqué daté sur le retrait.

## 4. Citations et preuves ajoutées

- `francois-ruffin-candidature-002` : CANDIDACY, `candidacyStatus: WITHDRAWN`, `VERIFIED_QUOTE`,
  qualité A, attribution `PERSONAL_DIRECT` / HIGH, `statedAt` 2026-11-21.
  **[Citation]** « Face au risque du pire, je retire ma candidature à l'élection présidentielle. »
  (https://t.me/francoisruffin/4336, texte intégral du message).

## 5. Sources ayant corroboré des éléments existants

Aucun.

## 6. Corrections effectuées

Aucun.

## 7. Doublons évités

Aucun. Le corpus ne contenait aucune preuve ni source sur un retrait.

## 8. Éléments non vérifiés ou non résolus

- **[Fait vérifié]** Le communiqué écrit complet cité par la presse n'a pas été lu en source
  primaire. RTBF en rapporte notamment « Dès lors, les autres candidatures, dont la mienne, sont
  cantonnées à un rôle de témoignage ». L'image jointe au message Telegram est illisible dans
  l'aperçu public, et le compte X est sous authentification (non contourné).
- **[Hypothèse]** L'image du message n° 4336 est probablement ce communiqué.
- Écart de date de déclaration, hors périmètre : **[Paraphrase]** la presse (info.fr, Yahoo) date
  l'officialisation de la candidature au 26 janvier 2026, alors que le registre et la liste publiée
  retiennent le 2026-04-10 (meeting de Lyon). Ce point n'a pas été réexaminé.

## 9. Changements de statut de candidature identifiés

- **[Fait vérifié]** `francois-ruffin` passe de DECLARED (2026-04-10) à **WITHDRAWN (2026-11-21)**.
  Le statut est ajouté en fin d'historique dans `personnalites.yaml`, avec la preuve
  `francois-ruffin-candidature-002`.
- **[Interprétation]** Il s'agit d'un **renoncement simple, sans désistement au profit d'une
  candidature nommée**. **[Citation]** « Alors à tous les candidats de gauche encore en lice, je
  leur dis bon courage et bonne chance. » (message n° 4340, 2026-11-22). Aucun nom n'est cité.
- **[Citation]** « Pour 2027, le moment venu, je prendrai mes responsabilités. Mais je ne prendrai
  pas cette décision seul. » (message n° 4341, 2026-11-22). Il annonce une consultation de ses
  soutiens dans les semaines à venir. Un soutien ultérieur reste donc possible et serait à suivre.

## 10. Contradictions et évolutions de position

- **[Interprétation]** C'est une évolution, sans contradiction. En mai 2026, il conditionnait sa
  candidature à l'absence de primaire (« S'il n'y a pas de primaire, moi j'y vais », LCP, source
  secondaire non ouverte). Il se retire faute de « grande primaire », jugeant sa candidature
  devenue « de témoignage » (**[Citation]** « Le retrait de ma candidature est une évidence. »,
  message n° 4338).

## 11. Lacunes documentaires restantes

- `PRIMARY_INACCESSIBLE` : le texte complet du communiqué écrit du 2026-11-21 (voir rubrique 8).
- Entretien BFMTV / YouTube du 2026-11-22 : pas de transcription officielle ou manuelle.

## 12. Fichiers créés ou modifiés

- `data/corpus/sources/francois-ruffin.yaml` : ajout de `francois-ruffin-renoncement-candidature`
  via `pnpm data:source fetch … --from-file` (cache `.cache/sources/`).
- `data/recherche/preuves/francois-ruffin.yaml` : ajout de `francois-ruffin-candidature-002`.
- `data/recherche/personnalites.yaml` : statut WITHDRAWN ajouté en fin d'historique de
  `francois-ruffin`, et `updatedAt` passé au 2026-11-23.
- `data/recherche/journaux/2026-11-23-ruffin-statut-candidature.yaml` et `.md` : créés.

## 13. Arbitrages nécessitant une intervention humaine

Signalement `CANDIDATE_STATUS` proposé. Il n'est pas écrit, car `signalements.yaml` est réservé
aux missions parallèles. Tant qu'il n'existe pas, `pnpm data:validate` signale `RECH-STATUS
francois-ruffin`.

```yaml
- id: sig-2026-11-23-ruffin-retrait-candidature
  kind: CANDIDATE_STATUS
  raisedAt: 2026-11-23
  journal: 2026-11-23-ruffin-statut-candidature
  personality: francois-ruffin
  evidence: [francois-ruffin-candidature-002]
  reason: "Liste publiée : declared (2026-04-10). Statut courant du registre : WITHDRAWN au 2026-11-21, d'après son canal Telegram certifié (https://t.me/francoisruffin/4336) : « Face au risque du pire, je retire ma candidature à l'élection présidentielle. » Renoncement simple, sans soutien nommé."
  state: open
```

Décision humaine attendue : passer `francois-ruffin` à `withdrawn` (statusChangedAt 2026-11-21,
source `francois-ruffin-renoncement-candidature`) dans `candidates.yaml`, et choisir le sort de
ses positions publiées.
