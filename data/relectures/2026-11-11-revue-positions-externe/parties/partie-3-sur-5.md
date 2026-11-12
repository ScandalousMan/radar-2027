# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** part 3 of 5 — 254 positions (Jean-Luc Mélenchon, Juan Branco). The other parts are reviewed separately; references (P0001…) are global.

## Context

Radar 2027 is a non-partisan voting-advice site. Voters answer statements ("énoncés") on a 5-point scale; their answers are compared with the positions of the 18 declared candidates. Each position below links one candidate to one statement and is backed by **one contiguous quote** from a source listed for that candidate (programme, party platform or published declaration/vote). Quotes have already been checked mechanically, word for word, against the cached source text: **you do not need to verify that the quote exists**. A source URL is given in case you can browse, but browsing is optional.

## Extraction rules the positions must follow

1. **Directness.** A position exists only if the passage answers the statement **directly**. A loose thematic link, a general value or an inference ("they are left-wing, so…") is not enough → the position must be deleted.
2. **Sign.** The value is read against the **text of the statement**: agreeing with what the statement says = positive, disagreeing = negative. A statement phrased negatively ("…doit rester interdit", "…ne doit pas…") is a common trap: check the sign carefully.
3. **Magnitude.**
   - ±2: the passage states the measure itself, or its explicit opposite.
   - ±1: a neighbouring, partial or conditional version of the measure.
   - 0: an explicit intermediate position (not "no position").
   - There is no "unknown" value: if the passage does not settle it, the position should not exist.
4. **Owner conventions.**
   - (a) A measure **broader** than the statement, in the same direction, scores **±1**, not ±2.
   - (b) A measure the candidate **defers to a referendum or a citizens' convention**, without taking a side, gets **no position**.
   - (c) Positions on referendum statements deduced from the candidate's support for a citizens' initiative referendum (RIC) are accepted.
5. **Attribution.** A party platform or programme listed for the candidate counts as theirs. A press article that reports the candidate's own stated intention ("she wants to…", "he proposes…") is acceptable. But a passage voicing **someone else's** view (a measure attributed to the party or movement as a whole, an ally, an opponent being quoted, a description of current law) does not back a position.
6. **Justification.** The one-sentence justification must match the quote and the value; it may not claim more than the quote says.

## What to check for each position

For each position, decide:

- `OK`: directness, sign, magnitude and attribution are all correct.
- `CHANGE_VALUE`: the position should exist, but with another value (wrong sign, ±2 that should be ±1 or the reverse, or 0 misused).
- `DELETE`: the passage does not answer the statement directly, breaks convention 4b, or is not the candidate's own view.
- `FLAG`: you have a substantive doubt that a human should settle (ambiguous wording, statement poorly matched to the quote, source or date problem).

Be conservative. Do not propose a change for a borderline ±1/±2 nuance unless the rules above clearly require it. Do not report stylistic issues in justifications unless the justification contradicts the quote or the value.

## Output format (mandatory)

1. **Summary.** One line per candidate: number reviewed, OK, CHANGE_VALUE, DELETE and FLAG.
2. **Findings.** A single JSON array containing **only the non-OK positions**, in reference order, with this shape:

```json
[
  {
    "ref": "P0000",
    "candidate": "prenom-nom",
    "question": "theme-identifiant-de-question",
    "current": 1,
    "verdict": "CHANGE_VALUE",
    "proposed": 2,
    "severity": "high",
    "reason": "Une à deux phrases en français : quelle règle est enfreinte et pourquoi."
  }
]
```

   - `proposed` is the new value for `CHANGE_VALUE`, and `null` otherwise.
   - `severity`:
     - `high`: wrong sign, or a position with no direct basis;
     - `medium`: wrong magnitude, or a convention breach;
     - `low`: a doubt worth a look.
3. **Cross-candidate remarks** (optional, at most 10 lines): inconsistencies in how the same statement was scored across candidates (e.g. two near-identical quotes given different values).

Review **every** position in the data below. If your output is cut off, end with the last `ref` you completed so the review can resume from there.

---

# Données
*254 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

## Jean-Luc Mélenchon (La France insoumise) — 163 positions

### P0523 · jean-luc-melenchon · agriculture-autoriser-nouvelles-techniques-genomiques
- **Énoncé :** La culture de plantes issues des nouvelles techniques génomiques doit être autorisée en France.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Refuser les organismes génétiquement modifiés (OGM et nouvelles techniques génomiques) »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme refuse explicitement les nouvelles techniques génomiques, à l'inverse de l'autorisation de leur culture.

### P0524 · jean-luc-melenchon · agriculture-bio-restauration-collective-v2
- **Énoncé :** Les produits issus de l'agriculture biologique doivent représenter au moins 30 % des achats alimentaires de la restauration collective publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Porter l'alimentation dans la restauration collective et scolaire à 100 % biologique et locale »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme vise 100 % d'alimentation biologique et locale dans la restauration collective, au-delà du minimum de 30 % des achats de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0525 · jean-luc-melenchon · agriculture-derogations-neonicotinoides
- **Énoncé :** Les agriculteurs doivent pouvoir obtenir des dérogations pour utiliser des insecticides néonicotinoïdes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « interdire immédiatement les plus dangereux (glyphosate, néonicotinoïdes) »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme demande l'interdiction immédiate des néonicotinoïdes, ce qui exclut toute dérogation.

### P0526 · jean-luc-melenchon · agriculture-interdire-glyphosate
- **Énoncé :** L'usage du glyphosate doit être interdit en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « interdire immédiatement les plus dangereux (glyphosate, néonicotinoïdes) »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme demande l'interdiction immédiate du glyphosate.

### P0527 · jean-luc-melenchon · agriculture-interdire-poules-cage
- **Énoncé :** L'élevage de poules pondeuses en cage doit être interdit.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Prohiber les pratiques cruelles : élevage de poules et de lapins en batterie »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme prévoit de prohiber l'élevage de poules en batterie, c'est-à-dire en cage.

### P0528 · jean-luc-melenchon · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Planifier la réduction progressive des doses d'engrais et de pesticides »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme planifie une réduction progressive des pesticides, sans fixer l'objectif chiffré d'une division par deux d'ici 2030.

### P0529 · jean-luc-melenchon · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Garantir des prix rémunérateurs aux producteurs en instaurant des prix planchers pour les agriculteurs »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose d'instaurer des prix planchers pour les agriculteurs.

### P0530 · jean-luc-melenchon · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Sanctuariser la ressource en eau en instaurant un moratoire immédiat sur les méga-bassines »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme propose un moratoire immédiat sur les méga-bassines, mesure inverse d'une facilitation des retenues d'eau pour l'irrigation.

### P0531 · jean-luc-melenchon · defense-cesser-ventes-armes-conflits
- **Énoncé :** La France doit cesser de vendre des armes aux États engagés dans un conflit armé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Refuser tout soutien aux guerres illégales, quels qu'en soient les belligérants, en interdisant l'accès aux infrastructures logistiques françaises et en stoppant toutes les exportations d'armement et de biens à double usage »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une France indépendante au service de la paix (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2
- **Justification :** Le programme propose de cesser les exportations d'armement vers les belligérants de guerres illégales, version plus restreinte que l'arrêt des ventes à tout État engagé dans un conflit armé.

### P0532 · jean-luc-melenchon · defense-controle-exportations-armes
- **Énoncé :** Les exportations d'armes françaises doivent être soumises à un contrôle parlementaire préalable.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Instaurer un contrôle parlementaire effectif des exportations d'armes »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une France indépendante au service de la paix (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2
- **Justification :** Le programme propose un contrôle parlementaire effectif des exportations d'armes, sans préciser qu'il intervient avant chaque exportation.

### P0533 · jean-luc-melenchon · defense-traite-interdiction-armes-nucleaires
- **Énoncé :** La France doit signer le traité sur l'interdiction des armes nucléaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « participer comme observateur au traité sur l'interdiction des armes nucléaires (TIAN) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une France indépendante au service de la paix (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2
- **Justification :** Le programme propose de participer au traité comme observateur, démarche qui va dans le sens de l'énoncé sans aller jusqu'à sa signature.

### P0534 · jean-luc-melenchon · democratie-parrainages-elus-maintenus
- **Énoncé :** Les candidats à l'élection présidentielle doivent continuer à recueillir 500 parrainages d'élus.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Instaurer une procédure de parrainages citoyens pour l'élection présidentielle à la place des 500 parrainages d'élus »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose de remplacer les 500 parrainages d'élus par des parrainages citoyens.

### P0535 · jean-luc-melenchon · democratie-petition-debat-parlement
- **Énoncé :** Une pétition signée par un million de personnes doit obligatoirement être débattue en séance au Parlement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Obliger l'Assemblée nationale à débattre des pétitions qui ont recueilli plus de 500 000 signatures »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme impose un débat à l'Assemblée nationale dès 500 000 signatures, seuil plus bas que le million de l'énoncé, sans préciser qu'il a lieu en séance.

### P0536 · jean-luc-melenchon · democratie-raccourcir-consultations-public
- **Énoncé :** Les procédures de consultation du public sur les projets d'aménagement doivent être raccourcies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Revenir sur l'affaiblissement des normes environnementales et des mécanismes de participation publique décidés lors du précédent quinquennat »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme veut revenir sur l'affaiblissement des mécanismes de participation du public, sans viser spécifiquement la durée des consultations sur les projets d'aménagement.

### P0537 · jean-luc-melenchon · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Rendre obligatoire le recours au référendum en cas de modification de la Constitution ou d'adoption d'un nouveau traité européen »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme rend le référendum obligatoire pour toute révision constitutionnelle et tout nouveau traité européen, en plus du référendum d'initiative citoyenne, ce qui est l'inverse d'un recours exceptionnel.

### P0538 · jean-luc-melenchon · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer le référendum d'initiative citoyenne (RIC), par lequel les citoyens qui réunissent suffisamment de signatures peuvent révoquer des élus, proposer ou abroger une loi et modifier la Constitution »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose d'instaurer un référendum d'initiative citoyenne déclenché par un nombre suffisant de signatures.

### P0539 · jean-luc-melenchon · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Instaurer le référendum d'initiative citoyenne (RIC), par lequel les citoyens qui réunissent suffisamment de signatures peuvent révoquer des élus, proposer ou abroger une loi et modifier la Constitution »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Avec le RIC, les citoyens pourraient déclencher eux-mêmes un référendum, ce qui retire au président et au Parlement l'exclusivité de ce déclenchement.

### P0540 · jean-luc-melenchon · democratie-referendum-revocatoire
- **Énoncé :** Les électeurs doivent pouvoir révoquer un élu en cours de mandat par référendum.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer le référendum d'initiative citoyenne (RIC), par lequel les citoyens qui réunissent suffisamment de signatures peuvent révoquer des élus »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose un référendum d'initiative citoyenne permettant de révoquer des élus en cours de mandat.

### P0541 · jean-luc-melenchon · democratie-revision-par-congres
- **Énoncé :** Une révision de la Constitution doit pouvoir continuer à être adoptée par le Parlement réuni en Congrès, sans référendum.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Rendre obligatoire le recours au référendum en cas de modification de la Constitution ou d'adoption d'un nouveau traité européen »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme rend le référendum obligatoire pour toute modification de la Constitution, ce qui exclut une révision adoptée par le seul Congrès.

### P0542 · jean-luc-melenchon · democratie-vote-16-ans
- **Énoncé :** Le droit de vote doit être accordé dès 16 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Donner le droit de vote à 16 ans »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose d'accorder le droit de vote dès 16 ans.

### P0543 · jean-luc-melenchon · democratie-vote-blanc-exprime
- **Énoncé :** Le vote blanc doit être pris en compte dans les suffrages exprimés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Reconnaître le vote blanc, mettre en place le vote obligatoire et instaurer un seuil de votes exprimés pour valider une élection »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose de reconnaître le vote blanc, formule qui renvoie à sa prise en compte dans les suffrages, sans préciser explicitement le terme de suffrages exprimés.

### P0544 · jean-luc-melenchon · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Refuser le libre-échange, instaurer un protectionnisme écologique et la coopération économique entre les États »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme refuse le libre-échange et prévoit un droit de veto sur les accords de libre-échange, à l'inverse de la conclusion de nouveaux accords.

### P0545 · jean-luc-melenchon · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les licenciements boursiers et économiques par les entreprises qui versent des dividendes ou bénéficient des aides de l'État »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Un pacte productif pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre3
- **Justification :** Le programme interdit les licenciements économiques aux entreprises bénéficiant d'aides de l'État, ce qui lie les aides au maintien de l'emploi.

### P0546 · jean-luc-melenchon · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Ainsi, refuser les coupes budgétaires et proposer un autre chemin, ce n'est pas seulement le résultat d'une vision politique, c'est aussi le choix économique le plus rationnel. »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire refuse les coupes dans les dépenses et prévoit environ 80 milliards de dépenses nouvelles, sans se prononcer explicitement sur le ratio de dépense publique au PIB.

### P0547 · jean-luc-melenchon · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renforcer le contrôle des investissements étrangers dans tous les secteurs présentant un caractère stratégique »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Un pacte productif pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre3
- **Justification :** Le programme propose de renforcer le contrôle des investissements étrangers dans les secteurs stratégiques.

### P0548 · jean-luc-melenchon · economie-eau-operateurs-publics
- **Énoncé :** La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Organiser la gestion publique autour de régies locales d'eau potable et d'assainissement, ouvertes avec voix délibérative aux habitantes et habitants et aux salariés »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Les nouveaux droits de l’espèce : protéger les biens communs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1
- **Justification :** Le programme confie l'eau potable à des régies publiques locales, sans exclure explicitement tout opérateur privé.

### P0549 · jean-luc-melenchon · economie-encadrer-marges-distribution
- **Énoncé :** Les marges de la grande distribution doivent être encadrées par la loi.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en encadrant les marges des industries agroalimentaires et de la grande distribution »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose d'encadrer les marges de la grande distribution.

### P0550 · jean-luc-melenchon · economie-etat-finance-usines
- **Énoncé :** L'État doit financer directement la construction d'usines dans les secteurs qu'il juge prioritaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Engager un plan de reconstruction industrielle pour mettre fin à la dépendance de la France dans les domaines stratégiques (semi-conducteurs, médicaments, etc.) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Produire nous-mêmes pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre2
- **Justification :** Le programme prévoit un plan public de reconstruction industrielle dans les domaines stratégiques, sans préciser un financement direct de la construction d'usines.

### P0551 · jean-luc-melenchon · economie-ouverture-dimanche-libre-v2
- **Énoncé :** Les commerces doivent pouvoir ouvrir le dimanche sans autorisation préalable.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Remettre en cause les autorisations de travail le dimanche »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme veut remettre en cause les autorisations de travail le dimanche, à l'opposé d'une ouverture dominicale des commerces sans autorisation préalable.

### P0552 · jean-luc-melenchon · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Produire en France l'acier décarboné dont nous avons besoin pour la bifurcation écologique, notamment en nationalisant ArcelorMittal France »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Produire nous-mêmes pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre2
- **Justification :** Le programme propose des prises de contrôle publiques dans l'industrie stratégique, dont la nationalisation d'ArcelorMittal France.

### P0553 · jean-luc-melenchon · economie-plafonnement-loyers-zones-tendues
- **Énoncé :** Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Geler les loyers le temps de déployer un encadrement des loyers partout sur le territoire et à la baisse dans les grandes villes »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Une France sans déserts de droits (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre3
- **Justification :** Le programme veut encadrer les loyers partout sur le territoire, au-delà des seules zones tendues. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0554 · jean-luc-melenchon · economie-plafonner-prix-alimentaires
- **Énoncé :** Les prix des produits alimentaires de première nécessité doivent être plafonnés par l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Plafonner le prix des produits alimentaires en fixant des coefficients multiplicateurs »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose de plafonner le prix des produits alimentaires.

### P0555 · jean-luc-melenchon · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Remettre en place des tarifs réglementés de l'énergie, calculés à partir des coûts de production, pour les particuliers »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose de rétablir des tarifs réglementés de l'énergie pour les particuliers.

### P0556 · jean-luc-melenchon · economie-reduire-nombre-fonctionnaires
- **Énoncé :** Le nombre de fonctionnaires doit diminuer au cours du prochain quinquennat.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Planifier des moyens pour la justice et recruter davantage de fonctionnaires »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme prévoit des recrutements de fonctionnaires dans plusieurs services publics (justice, éducation, santé), sans objectif global chiffré d'effectifs.

### P0557 · jean-luc-melenchon · economie-regle-equilibre-constitution
- **Énoncé :** Une règle d'équilibre des comptes publics doit être inscrite dans la Constitution.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La suspension pour tous des règles budgétaires des 3 % de déficit »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme demande la suspension des règles européennes de déficit, sans se prononcer explicitement sur une règle d'équilibre constitutionnelle.

### P0558 · jean-luc-melenchon · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer l'Agence nationale de la recherche (ANR) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Élever le niveau d’éducation et de savoirs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2
- **Justification :** Le programme propose de supprimer certaines agences comme l'ANR et le Hcéres, tout en créant par ailleurs de nombreux organismes publics.

### P0559 · jean-luc-melenchon · economie-vendre-participations-etat
- **Énoncé :** L'État doit vendre une partie de ses participations dans les entreprises cotées en bourse.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Revenir sur les privatisations (aéroports, autoroutes, Française des jeux, etc.) »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : L’ère d’un nouveau collectivisme (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre1
- **Justification :** Le programme propose de revenir sur les privatisations, mesure inverse de la vente de participations de l'État.

### P0560 · jean-luc-melenchon · energie-fonds-publics-renouvelables
- **Énoncé :** Les fonds publics consacrés à l'énergie doivent aller en priorité aux énergies renouvelables plutôt qu'au nucléaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Planifier le passage à 100 % d'énergies renouvelables avec un double mot d'ordre : sobriété et efficacité énergétiques »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme vise 100 % d'énergies renouvelables et l'arrêt du nouveau nucléaire, sans traiter explicitement de la répartition des fonds publics.

### P0561 · jean-luc-melenchon · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Planifier la fermeture progressive des centrales nucléaires existantes en ne prolongeant pas au-delà de 60 ans leur durée de vie et arrêter le programme de nouveau nucléaire (EPR2) »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose d'arrêter le programme EPR2 lui-même, ce qui exclut tout réacteur supplémentaire.

### P0562 · jean-luc-melenchon · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Le nucléaire n'est pas non plus une solution d'avenir. »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme écarte le nucléaire comme solution d'avenir et arrête le nouveau nucléaire, sans mentionner explicitement les petits réacteurs modulaires.

### P0563 · jean-luc-melenchon · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Planifier la fermeture progressive des centrales nucléaires existantes en ne prolongeant pas au-delà de 60 ans leur durée de vie »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme exclut explicitement toute prolongation des réacteurs au-delà de 60 ans.

### P0564 · jean-luc-melenchon · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Planifier la fermeture progressive des centrales nucléaires existantes en ne prolongeant pas au-delà de 60 ans leur durée de vie et arrêter le programme de nouveau nucléaire (EPR2) »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme planifie la fermeture progressive des centrales nucléaires et l'arrêt du nouveau nucléaire.

### P0565 · jean-luc-melenchon · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Déployer l'éolien en mer, posé et flottant, pour atteindre au moins 45 gigawatts de puissance installée en 2050 »
- **Source :** L'Avenir en commun 2027 : Chapitre 5 : Entrer en mer sans saccage (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre5
- **Justification :** Le programme prévoit un déploiement massif de l'éolien en mer, à l'inverse d'une suspension des nouvelles éoliennes.

### P0566 · jean-luc-melenchon · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Mettre en place un plan de protection généralisée du foncier agricole, forestier et naturel en vue de mettre en œuvre le " zéro artificialisation nette " (ZAN) des sols dans l'Hexagone »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme veut mettre en œuvre l'objectif de zéro artificialisation nette, ce qui va à l'encontre d'un assouplissement sans le rejeter en ces termes.

### P0567 · jean-luc-melenchon · environnement-calendrier-logements-mal-isoles
- **Énoncé :** L'interdiction de louer les logements les moins bien isolés doit être appliquée selon le calendrier prévu.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Privilégier les rénovations complètes, interdire réellement la location des passoires thermiques »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme demande d'interdire réellement la location des passoires thermiques, sans mentionner explicitement le calendrier prévu.

### P0568 · jean-luc-melenchon · environnement-ecocide-crime
- **Énoncé :** L'écocide doit être reconnu comme un crime dans le Code pénal.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Reconnaître le crime d'écocide »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une France indépendante au service de la paix (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2
- **Justification :** Le programme propose de reconnaître le crime d'écocide dans le cadre du droit international, sans préciser son inscription dans le Code pénal français.

### P0569 · jean-luc-melenchon · environnement-exploitation-hydrocarbures
- **Énoncé :** L'exploitation de nouveaux gisements d'hydrocarbures doit être autorisée sur le territoire français.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Défendre un moratoire sur les forages en Méditerranée et sur l'extraction minière en eaux profondes »
- **Source :** L'Avenir en commun 2027 : Chapitre 5 : Entrer en mer sans saccage (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre5
- **Justification :** Le programme défend un moratoire sur les forages en Méditerranée et la sortie des énergies fossiles, sans viser explicitement tout nouveau gisement sur le territoire.

### P0570 · jean-luc-melenchon · environnement-interdire-vols-interieurs
- **Énoncé :** Les vols intérieurs doivent être interdits lorsqu'une alternative en train de moins de quatre heures existe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer les lignes aériennes intérieures quand l'alternative en train est inférieure à quatre heures »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose exactement de supprimer les vols intérieurs lorsqu'une alternative en train de moins de quatre heures existe.

### P0571 · jean-luc-melenchon · environnement-pause-normes-europeennes
- **Énoncé :** L'Union européenne doit suspendre l'adoption de nouvelles normes environnementales pendant plusieurs années.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Ce principe nous permettra de refuser l'application : Des grands plans de dérégulation dits " omnibus ", qui détruisent les rares progrès permis par le droit européen et mettent en danger les travailleurs, la santé et l'environnement »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme refuse l'application des plans européens de dérégulation environnementale, position contraire à une pause des normes sans traiter explicitement de l'adoption de nouvelles normes.

### P0572 · jean-luc-melenchon · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire immédiatement et réellement les plastiques à usage unique »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose d'interdire immédiatement les plastiques à usage unique, avant l'échéance de 2030.

### P0573 · jean-luc-melenchon · environnement-publicite-vehicules-emetteurs
- **Énoncé :** La publicité pour les véhicules les plus émetteurs de CO2 doit être interdite.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Proscrire, sur tous types de supports, la publicité des produits et des services les plus émetteurs de GES »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme interdit la publicité pour les produits les plus émetteurs de gaz à effet de serre, ce qui inclut les véhicules les plus émetteurs.

### P0574 · jean-luc-melenchon · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Décréter un moratoire sur les zones à faibles émissions (ZFE) dans leur conception actuelle »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme propose un moratoire sur les ZFE dans leur conception actuelle, et non leur suppression définitive.

### P0575 · jean-luc-melenchon · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer des droits de douane sur des critères écologiques (émissions carbone, pollution, consommation d'eau) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Produire nous-mêmes pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre2
- **Justification :** Le programme propose des droits de douane fondés sur les émissions carbone des produits importés.

### P0576 · jean-luc-melenchon · environnement-taxer-kerosene-vols-interieurs
- **Énoncé :** Le kérosène des vols intérieurs doit être taxé comme les autres carburants.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin aux niches fiscales sur le kérosène »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Produire nous-mêmes pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre2
- **Justification :** Le programme veut mettre fin aux niches fiscales sur le kérosène, avec pour motif le commerce en ligne, sans viser spécifiquement les vols intérieurs.

### P0577 · jean-luc-melenchon · environnement-trajectoire-emissions-entreprises
- **Énoncé :** Les grandes entreprises doivent être tenues de réduire leurs émissions selon une trajectoire fixée par la loi.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Obliger les entreprises à adopter une comptabilité carbone pour les émissions directes et indirectes de GES certifiée par un organisme public agréé »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Planification écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre1
- **Justification :** Le programme oblige les entreprises à une comptabilité carbone accompagnée d'une trajectoire de baisse de leurs émissions, en commençant par les plus polluantes puis selon leur taille.

### P0578 · jean-luc-melenchon · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « nous proposons d'augmenter d'un peu plus de 100 milliards d'euros les recettes fiscales pour l'année prochaine »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire propose d'augmenter les recettes fiscales d'environ 100 milliards d'euros, à l'inverse d'une baisse des prélèvements obligatoires.

### P0579 · jean-luc-melenchon · fiscalite-capital-aligne-travail
- **Énoncé :** Le taux d'imposition des revenus du capital doit être aligné sur celui des revenus du travail.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer la flat tax et imposer les revenus du capital comme ceux du travail »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme propose d'imposer les revenus du capital comme ceux du travail.

### P0580 · jean-luc-melenchon · fiscalite-csg-progressive-v2
- **Énoncé :** Le taux de la contribution sociale généralisée (CSG) doit augmenter avec le revenu.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Créer une cotisation sociale universelle pour financer la Sécurité sociale, fusionnant les différentes cotisations sociales actuelles et la contribution sociale généralisée (CSG), perçue uniquement et directement par les caisses de la Sécurité sociale, avec une part progressive selon les revenus »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme fond la CSG dans une cotisation sociale universelle comportant une part progressive selon les revenus, version voisine d'une CSG dont le taux augmente avec le revenu.

### P0581 · jean-luc-melenchon · fiscalite-exit-tax-conservation-15-ans
- **Énoncé :** Quand une personne quitte la France avec plus de 800 000 € d'actions, l'impôt sur ses plus-values déjà acquises au départ ne doit être effacé que si elle les garde 15 ans, contre 2 ou 5 aujourd'hui.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « rétablir une exit tax renforcée pour lutter contre l'évasion fiscale »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme veut une exit tax renforcée, version voisine de l'énoncé sans la durée de conservation de 15 ans ni le seuil.

### P0582 · jean-luc-melenchon · fiscalite-hausse-taxe-transactions-financieres
- **Énoncé :** Le taux de la taxe sur les transactions financières doit être relevé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en augmentant les taxes sur les transactions financières (5 milliards d'euros) »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire propose d'augmenter les taxes sur les transactions financières.

### P0583 · jean-luc-melenchon · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablir et renforcer l'impôt de solidarité sur la fortune (ISF) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme propose de rétablir et renforcer l'ISF, qui inclut les actifs financiers.

### P0584 · jean-luc-melenchon · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Introduire une garantie d'impôt de 2 % sur le patrimoine des centimillionaires »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme instaure une garantie d'impôt de 2 % sur le patrimoine des centimillionaires, soit le prélèvement minimal annuel de 2 % de l'énoncé.

### P0585 · jean-luc-melenchon · fiscalite-quotient-familial-credit-enfant
- **Énoncé :** Le quotient familial doit être remplacé par un crédit d'impôt du même montant pour chaque enfant, quel que soit le revenu des parents.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin au quotient conjugal, système patriarcal favorisant les inégalités salariales entre les femmes et les hommes Créer un crédit d'impôt par enfant pour toutes les familles »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme crée un crédit d'impôt par enfant pour toutes les familles et supprime le quotient conjugal, version voisine sans dire explicitement que ce crédit remplace la part enfant du quotient familial.

### P0586 · jean-luc-melenchon · fiscalite-reduire-allegements-cotisations
- **Énoncé :** Les allègements de cotisations sociales accordés aux employeurs sur les salaires doivent être réduits.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Aussi pro- posons-nous d'interrompre cette subvention au-dessus de 2 SMIC, où les exonérations ne sont plus qu'un effet d'aubaine sans aucun effet sur l'emploi. »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le chiffrage propose de supprimer les exonérations de cotisations au-dessus de 2 SMIC, ce qui réduit les allègements accordés aux employeurs. Version partielle (au-delà d'un seuil de salaire) : 1, harmonisé entre candidats.

### P0587 · jean-luc-melenchon · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « rabotage et suppression des niches fiscales et sociales les plus injustes dont le coût a explosé (22 milliards d'euros en 2027) »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire prévoit de raboter et supprimer une partie des niches fiscales et sociales, sans objectif de division par deux de leur montant total.

### P0588 · jean-luc-melenchon · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** 0 (position intermédiaire explicite)
- **Citation :** « Exonérer de droits de succession les héritages inférieurs à 150 000 euros »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme exonère les petits héritages mais augmente les droits sur les plus hauts patrimoines, position intermédiaire face à une baisse générale pour les transmissions familiales.

### P0589 · jean-luc-melenchon · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « réta- blissement de la CVAE sur les plus grandes entreprises (3 milliards) »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire prévoit de rétablir la CVAE, un impôt de production, sur les plus grandes entreprises, à l'inverse de la suppression des impôts de production.

### P0590 · jean-luc-melenchon · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Établir une taxe sur les superprofits de toutes les grandes entreprises, activée en cas de hausse soudaine de leurs bénéfices en période de crise »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme propose une taxe sur les superprofits des grandes entreprises.

### P0591 · jean-luc-melenchon · fiscalite-tranche-hauts-revenus
- **Énoncé :** Les plus hauts revenus doivent être soumis à une tranche d'impôt supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rendre l'impôt sur le revenu plus progressif avec un barème à 14 tranches contre 5 aujourd'hui »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme porte le barème de l'impôt sur le revenu à 14 tranches, ce qui ajoute des tranches pour les plus hauts revenus.

### P0592 · jean-luc-melenchon · immigration-ame-soins-urgents
- **Énoncé :** L'aide médicale d'État doit être limitée aux soins urgents.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Intégrer l'aide médicale d'État (AME) au régime général de la Sécurité sociale, abroger les restrictions d'accès instaurées en 2026 et renforcer sa couverture »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme veut abroger les restrictions de l'AME et renforcer sa couverture, à l'inverse d'une limitation aux soins urgents.

### P0593 · jean-luc-melenchon · immigration-frais-etudiants-etrangers
- **Énoncé :** Les étudiants étrangers hors Union européenne doivent payer les mêmes frais d'inscription que les étudiants français.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer la gratuité de l'enseignement supérieur, de la licence au doctorat, quelle que soit la nationalité des étudiants »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Élever le niveau d’éducation et de savoirs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2
- **Justification :** Le programme prévoit la gratuité de l'enseignement supérieur quelle que soit la nationalité, donc les mêmes frais pour les étudiants étrangers que pour les Français.

### P0594 · jean-luc-melenchon · immigration-reduire-duree-naturalisation
- **Énoncé :** La durée de résidence exigée pour demander la naturalisation doit être réduite.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « faciliter l'accès à la nationalité française »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire triompher l’égalité contre le racisme et les discriminations (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre4
- **Justification :** Le programme veut faciliter l'accès à la nationalité française, sans mentionner la durée de résidence exigée.

### P0595 · jean-luc-melenchon · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régulariser les travailleurs, étudiants, parents d'enfants scolarisés sans papiers »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme propose de régulariser plusieurs catégories de sans-papiers, sans critère de durée de présence.

### P0596 · jean-luc-melenchon · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Régulariser les travailleurs, étudiants, parents d'enfants scolarisés sans papiers »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme propose de régulariser les travailleurs sans papiers, ce qui inclut ceux des métiers en tension.

### P0597 · jean-luc-melenchon · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Garantir le droit du sol intégral à tous les enfants nés en France »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire triompher l’égalité contre le racisme et les discriminations (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre4
- **Justification :** Le programme garantit le droit du sol intégral, à l'inverse de sa suppression.

### P0598 · jean-luc-melenchon · immigration-titre-sejour-longue-duree
- **Énoncé :** Les étrangers en situation régulière doivent obtenir plus facilement un titre de séjour de longue durée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Faciliter l'accès aux visas et instituer la carte de séjour de dix ans comme titre de séjour de référence »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme fait de la carte de séjour de dix ans le titre de référence.

### P0599 · jean-luc-melenchon · immigration-visas-professions-qualifiees-v2
- **Énoncé :** Les conditions de délivrance des visas de travail aux personnes exerçant des professions qualifiées doivent être assouplies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faciliter l'accès aux visas »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme veut faciliter l'accès aux visas en général, sans viser spécifiquement les visas de travail des professions qualifiées. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0600 · jean-luc-melenchon · immigration-vote-local-etrangers-v2
- **Énoncé :** Les étrangers non ressortissants de l'Union européenne résidant en France depuis plusieurs années doivent pouvoir voter aux élections locales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instituer le droit de vote des étrangers aux élections locales »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire triompher l’égalité contre le racisme et les discriminations (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre4
- **Justification :** Le programme institue le droit de vote des étrangers aux élections locales, ce qui couvre les résidents non européens visés par l'énoncé.

### P0601 · jean-luc-melenchon · institutions-autonomie-corse-constitution-v2
- **Énoncé :** La Constitution doit reconnaître un statut d'autonomie pour la Corse.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Donner à la Corse le statut garanti par un nouvel article de la Constitution »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme veut un statut de la Corse garanti par un nouvel article de la Constitution, sans employer explicitement le mot « autonomie ».

### P0602 · jean-luc-melenchon · institutions-autonomie-fiscale-collectivites
- **Énoncé :** Les collectivités locales doivent disposer d'une plus grande autonomie fiscale.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Redonner des moyens aux communes en rétablissant une taxe d'habitation calculée selon un barème progressif »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Une France sans déserts de droits (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre3
- **Justification :** Le programme rétablit un impôt local propre aux communes, ce qui accroît leurs ressources fiscales sans viser explicitement l'autonomie fiscale.

### P0603 · jean-luc-melenchon · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Recentraliser la protection de l'enfance »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme recentralise la protection de l'enfance, compétence départementale, ce qui est un transfert partiel de compétences vers l'État.

### P0604 · jean-luc-melenchon · institutions-fusions-communes-obligatoires
- **Énoncé :** Le nombre de communes doit être réduit par des fusions obligatoires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Refuser les fusions forcées de communes »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Une France sans déserts de droits (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre3
- **Justification :** Le programme refuse explicitement les fusions forcées de communes.

### P0605 · jean-luc-melenchon · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Élire l'Assemblée nationale au scrutin proportionnel »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose d'élire l'Assemblée nationale au scrutin proportionnel.

### P0606 · jean-luc-melenchon · institutions-supprimer-49-3
- **Énoncé :** Le recours à l'article 49.3 de la Constitution doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abolir les procédures de " votes forcés " du Parlement comme l'article 49.3 de la Constitution de la Ve République »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme propose d'abolir les procédures de votes forcés comme l'article 49.3.

### P0607 · jean-luc-melenchon · international-aide-developpement-0-7
- **Énoncé :** L'aide publique au développement doit atteindre 0,7 % du revenu national brut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Consacrer 0,7 % du revenu national brut à une aide publique au développement »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les nouvelles coopérations de la diplomatie altermondialiste (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre3
- **Justification :** Le programme propose de consacrer 0,7 % du revenu national brut à l'aide publique au développement.

### P0608 · jean-luc-melenchon · international-impots-propres-ue
- **Énoncé :** L'Union européenne doit disposer de nouveaux impôts qui lui sont propres.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « L'introduction de protections douanières et d'un impôt sur les multinationales dans le prochain budget européen »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme propose d'introduire un impôt sur les multinationales dans le budget européen.

### P0609 · jean-luc-melenchon · international-majorite-qualifiee-ue
- **Énoncé :** La France doit accepter que davantage de décisions soient prises à la majorité qualifiée au sein de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « La suppression du veto des paradis fiscaux européens en matière fiscale »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme veut supprimer l'unanimité en matière fiscale, extension limitée à ce domaine de la majorité qualifiée.

### P0610 · jean-luc-melenchon · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « elle appliquera, en revanche, sans aucune concession, le programme choisi démocratiquement par son peuple, même si cela n'est pas permis par les traités »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme appliquera le programme choisi par le peuple même lorsque les traités européens ne le permettent pas, donc la loi nationale contre la règle de l'Union.

### P0611 · jean-luc-melenchon · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Se retirer immédiatement du commandement intégré de l'OTAN »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une France indépendante au service de la paix (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre2
- **Justification :** Le programme propose de quitter immédiatement le commandement intégré de l'OTAN.

### P0612 · jean-luc-melenchon · international-referendum-traites-europeens
- **Énoncé :** Tout nouveau traité européen doit être soumis à référendum en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rendre obligatoire le recours au référendum en cas de modification de la Constitution ou d'adoption d'un nouveau traité européen »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : Le pouvoir au peuple (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre1
- **Justification :** Le programme rend obligatoire le référendum pour tout nouveau traité européen.

### P0613 · jean-luc-melenchon · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous mettrons sur la table des propositions pour fonder de nouveaux traités : La souveraineté budgétaire des parlements nationaux »
- **Source :** L'Avenir en commun 2027, chapitre : se libérer du libéralisme en Europe (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/un-monde-ordonne/chapitre1
- **Justification :** Le programme propose de nouveaux traités rendant notamment la souveraineté budgétaire aux parlements nationaux, tout en demandant aussi davantage d'harmonisation européenne.

### P0614 · jean-luc-melenchon · justice-accompagnement-emploi-detenus
- **Énoncé :** Les détenus doivent bénéficier d'un accompagnement vers l'emploi pendant toute leur détention.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « assurer aux personnes détenues les moyens de se réinsérer dans notre société »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme veut assurer aux détenus les moyens de se réinsérer, sans mentionner un accompagnement vers l'emploi pendant toute la détention.

### P0615 · jean-luc-melenchon · justice-comparution-immediate-mineurs
- **Énoncé :** Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Revenir sur toutes les mesures qui alignent la justice des mineurs sur celle des adultes »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme veut revenir sur l'alignement de la justice des mineurs sur celle des majeurs, sans citer la comparution immédiate.

### P0616 · jean-luc-melenchon · justice-juridictions-mineurs-specialisees-v2
- **Énoncé :** Les mineurs doivent être jugés par des juridictions distinctes de celles des majeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Revenir sur toutes les mesures qui alignent la justice des mineurs sur celle des adultes, rétablir les principes de l'ordonnance de février 1945 »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme veut rétablir les principes de l'ordonnance de 1945 et revenir sur l'alignement de la justice des mineurs sur celle des adultes, donc des juridictions distinctes.

### P0617 · jean-luc-melenchon · justice-majorite-penale-16-ans
- **Énoncé :** La majorité pénale doit être abaissée à 16 ans.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Revenir sur toutes les mesures qui alignent la justice des mineurs sur celle des adultes »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme s'oppose à l'alignement de la justice des mineurs sur celle des adultes, sans évoquer explicitement l'âge de la majorité pénale.

### P0618 · jean-luc-melenchon · justice-plafonner-detenus-places
- **Énoncé :** Le nombre de détenus doit être plafonné au nombre de places de prison disponibles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en finir avec la surpopulation carcérale par la mise en place d'un mécanisme contraignant de régulation carcérale »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme propose un mécanisme contraignant de régulation carcérale contre la surpopulation, sans préciser un plafond strict au nombre de places.

### P0619 · jean-luc-melenchon · numerique-assouplir-consentement-traceurs
- **Énoncé :** Les règles de consentement aux traceurs publicitaires sur internet doivent être assouplies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Ne pas faire du seul consentement des utilisateurs un fondement suffisant pour le traitement de leurs données »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme durcit l'encadrement de la collecte de données au-delà du seul consentement, sans viser spécifiquement les traceurs publicitaires.

### P0620 · jean-luc-melenchon · numerique-assouplir-regles-ia
- **Énoncé :** Les règles européennes encadrant l'intelligence artificielle doivent être assouplies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Créer une autorité nationale de l'intelligence artificielle qui délivre aux systèmes d'IA définis comme à haut risque une autorisation de mise sur le marché »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme renforce l'encadrement de l'IA par une autorisation de mise sur le marché, sans se prononcer sur les règles européennes elles-mêmes.

### P0621 · jean-luc-melenchon · numerique-chiffrement-messageries-v2
- **Énoncé :** Les autorités publiques ne doivent pas pouvoir accéder au contenu des messages privés protégés par un chiffrement de bout en bout.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Constitutionnaliser le droit au chiffrement et à la sécurité des données et des communications, afin de se prémunir contre les moyens d'interception et de surveillance »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme veut constitutionnaliser le droit au chiffrement des communications pour se prémunir contre l'interception et la surveillance, donc contre l'accès des autorités aux messages chiffrés.

### P0622 · jean-luc-melenchon · numerique-donnees-sante-hebergeurs-europeens
- **Énoncé :** Les données de santé des Français doivent être hébergées exclusivement par des entreprises européennes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Garantir l'hébergement des données des services publics français et des entreprises essentielles sur des serveurs publics situés en France »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme impose un hébergement public en France des données des services publics, sans viser spécifiquement les données de santé.

### P0623 · jean-luc-melenchon · numerique-faciliter-centres-donnees
- **Énoncé :** L'implantation de centres de données doit bénéficier de procédures administratives accélérées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Décréter un moratoire sur l'installation de centres de données non souverains (sans aucune participation publique) »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme prévoit un moratoire sur les centres de données non souverains et une autorisation de construction, à l'opposé de procédures accélérées.

### P0624 · jean-luc-melenchon · numerique-ia-remuneration-auteurs
- **Énoncé :** Les entreprises d'intelligence artificielle doivent rémunérer les auteurs dont les œuvres servent à entraîner leurs modèles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « mettre en place des accords de rémunération équitables pour les créateurs dont l'œuvre est utilisée »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Humaniser par la culture et le sport (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre3
- **Justification :** Le programme prévoit la rémunération des créateurs dont les œuvres sont utilisées par les IA génératives.

### P0625 · jean-luc-melenchon · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Généraliser l'usage des logiciels libres dans les administrations publiques et l'Éducation nationale »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme propose de généraliser les logiciels libres dans les administrations.

### P0626 · jean-luc-melenchon · numerique-taxe-plateformes
- **Énoncé :** Les grandes plateformes numériques doivent payer un impôt sur le chiffre d'affaires réalisé en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « le renforcement de la taxe Gafam (3,9 milliards) »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire prévoit de renforcer la taxe sur les grandes plateformes numériques assise sur leur activité en France.

### P0627 · jean-luc-melenchon · sante-assurance-sante-privee-option-v2
- **Énoncé :** Les assurés doivent pouvoir quitter l'Assurance maladie obligatoire au profit d'une assurance santé privée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « en intégrant les assurances maladie complémentaires dans la Sécurité sociale »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme intègre les complémentaires dans la Sécurité sociale, ce qui va à l'encontre d'une sortie de l'Assurance maladie vers un assureur privé, sans traiter explicitement cette possibilité.

### P0628 · jean-luc-melenchon · sante-budget-hopital-inflation
- **Énoncé :** Le budget de l'hôpital public doit augmenter plus vite que l'inflation chaque année.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous proposons une hausse globale de 3 milliards d'euros du budget des hôpitaux »
- **Source :** Comment nous allons remettre de l'ordre dans les comptes publics (melenchon2027.fr, PDF) — programme, 2026-10-14 — https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf
- **Justification :** Le document budgétaire prévoit une hausse de 3 milliards du budget des hôpitaux, sans règle annuelle d'évolution supérieure à l'inflation.

### P0629 · jean-luc-melenchon · sante-centres-sante-publics
- **Énoncé :** Chaque département doit disposer de centres de santé publics employant des médecins salariés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mailler le territoire de centres de santé publics en exercice salarié »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme propose de mailler le territoire de centres de santé publics employant des médecins salariés.

### P0630 · jean-luc-melenchon · sante-depassements-honoraires-libres
- **Énoncé :** Les médecins doivent rester libres de pratiquer des dépassements d'honoraires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin aux dépassements d'honoraires dans le secteur conventionné »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme propose de mettre fin aux dépassements d'honoraires dans le secteur conventionné.

### P0631 · jean-luc-melenchon · sante-depenses-assurance-maladie-inflation
- **Énoncé :** La croissance des dépenses de l'Assurance maladie doit être limitée à l'inflation.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Remplacer l'objectif national des dépenses d'assurance maladie (ONDAM) par un objectif national des besoins d'assurance maladie (ONBAM) »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme remplace l'objectif de dépenses par un objectif fondé sur les besoins, ce qui s'oppose à un plafonnement sans évoquer l'inflation.

### P0632 · jean-luc-melenchon · sante-derembourser-faible-service-rendu
- **Énoncé :** Les médicaments dont le service médical rendu est jugé faible doivent être déremboursés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « en remboursant à 100 % les soins de santé prescrits »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme prévoit le remboursement intégral des soins prescrits, ce qui va à l'encontre de déremboursements sans viser spécifiquement les médicaments à faible service rendu.

### P0633 · jean-luc-melenchon · sante-doubler-etudiants-medecine
- **Énoncé :** Le nombre d'étudiants admis en deuxième année de médecine doit être doublé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmenter le nombre de places en faculté de médecine »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme veut augmenter le nombre de places en médecine, sans objectif de doublement.

### P0634 · jean-luc-melenchon · sante-hausse-franchises-medicales
- **Énoncé :** Les franchises médicales payées par les patients doivent être augmentées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Garantir le zéro reste à charge en supprimant les franchises médicales »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme supprime les franchises médicales, à l'inverse de leur augmentation.

### P0635 · jean-luc-melenchon · sante-mutuelles-part-accrue-v2
- **Énoncé :** Les complémentaires santé doivent prendre en charge une part plus importante des dépenses actuellement remboursées par l'Assurance maladie.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « en remboursant à 100 % les soins de santé prescrits et en intégrant les assurances maladie complémentaires dans la Sécurité sociale »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme rembourse à 100 % les soins prescrits et intègre les complémentaires dans la Sécurité sociale, à l'opposé d'un transfert de dépenses vers les complémentaires.

### P0636 · jean-luc-melenchon · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Construire un pôle public du médicament qui devra : Assurer une relocalisation de la production de médicaments »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme crée un pôle public du médicament chargé de produire et de garantir une réserve de médicaments essentiels.

### P0637 · jean-luc-melenchon · sante-psychologues-rembourses
- **Énoncé :** Les consultations chez un psychologue doivent être remboursées sans limite de nombre.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Élargir le conventionnement de psychologues par la Sécurité sociale, au-delà de 12 séances par an et avec un remboursement à 100 % »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme rembourse à 100 % les psychologues au-delà de 12 séances par an, sans affirmer une absence totale de limite.

### P0638 · jean-luc-melenchon · sante-ratios-soignants-patients
- **Énoncé :** Un nombre minimal de soignants par patient doit être fixé par la loi dans les hôpitaux.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Former, qualifier et recruter du personnel en nombre suffisant pour respecter un ratio minimal d'encadrement »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme fixe un ratio minimal d'encadrement dans les EHPAD, et non dans les hôpitaux.

### P0639 · jean-luc-melenchon · sante-reduire-indemnites-arret-maladie
- **Énoncé :** Les indemnités journalières versées pendant un arrêt maladie doivent être réduites.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Garantir le droit à l'arrêt maladie par l'indemnisation à 100 % du salaire »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme prévoit une indemnisation des arrêts maladie à 100 % du salaire, à l'inverse d'une réduction.

### P0640 · jean-luc-melenchon · sante-regulation-installation-medecins
- **Énoncé :** L'installation des médecins doit être régulée dans les zones déjà bien dotées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réguler l'installation des médecins »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme propose de réguler l'installation des médecins.

### P0641 · jean-luc-melenchon · securite-armer-polices-municipales
- **Énoncé :** Les policiers municipaux doivent être armés dans toutes les communes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Intégrer progressivement les polices municipales dans une police de proximité républicaine, formée aux exigences du service public, sous l'autorité fonctionnelle des maires et l'autorité hiérarchique de l'État, sans armes létales »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme prévoit des polices municipales intégrées à une police de proximité sans armes létales.

### P0642 · jean-luc-melenchon · securite-budget-vers-prevention
- **Énoncé :** Une partie du budget des forces de l'ordre doit être réorientée vers la prévention de la délinquance.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « renforcer les logiques de prévention, notamment grâce à davantage de moyens humains (éducateurs spécialisés, éducateurs de rue, médiateurs) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme renforce les moyens de prévention, sans préciser qu'ils sont pris sur le budget des forces de l'ordre.

### P0643 · jean-luc-melenchon · securite-enquetes-policiers-independantes
- **Énoncé :** Les enquêtes visant des policiers doivent être confiées à un organisme indépendant du ministère de l'Intérieur.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer l'Inspection générale de la police nationale (IGPN) et l'Inspection générale de la gendarmerie nationale (IGGN) et les remplacer par une autorité indépendante »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme remplace l'IGPN et l'IGGN par une autorité indépendante.

### P0644 · jean-luc-melenchon · securite-interdire-lbd-manifestations
- **Énoncé :** L'usage des lanceurs de balles de défense doit être interdit lors des manifestations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les pistolets à impulsion électrique (tasers), les grenades de désencerclement, les lanceurs de balles de défense (LBD) pour la police du quotidien ou la gestion des rassemblements »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme interdit les LBD pour la gestion des rassemblements, dont les manifestations.

### P0645 · jean-luc-melenchon · securite-interdire-plaquage-ventral
- **Énoncé :** Il doit être interdit aux forces de l'ordre d'immobiliser une personne au sol, à plat ventre, en exerçant une pression sur son dos ou son thorax.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les techniques d'immobilisation létales : plaquage ventral, pliage ventral, clé d'étranglement »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme interdit explicitement le plaquage ventral aux forces de l'ordre.

### P0646 · jean-luc-melenchon · securite-presomption-legitime-defense
- **Énoncé :** Les policiers doivent bénéficier d'une présomption de légitime défense lorsqu'ils font usage de leur arme.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « refuser la loi dite " permis de tuer XXL " instaurant une présomption de légitime défense pour les policiers »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme refuse la loi instaurant une présomption de légitime défense pour les policiers.

### P0647 · jean-luc-melenchon · securite-recepisse-controles-identite
- **Énoncé :** Les contrôles d'identité doivent donner lieu à la remise d'un récépissé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mettre en place le récépissé de contrôle d'identité par les agents de police et la gendarmerie »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire triompher l’égalité contre le racisme et les discriminations (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre4
- **Justification :** Le programme propose le récépissé de contrôle d'identité.

### P0648 · jean-luc-melenchon · securite-reconnaissance-faciale-police
- **Énoncé :** La reconnaissance faciale en temps réel doit être autorisée dans l'espace public pour la police.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Interdire la reconnaissance faciale »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme propose d'interdire la reconnaissance faciale dans les espaces publics.

### P0649 · jean-luc-melenchon · securite-renseignement-autorisation-juge
- **Énoncé :** Les techniques de renseignement doivent être soumises à l'autorisation préalable d'un juge.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Garantir le contrôle du juge judiciaire dans la lutte contre le terrorisme »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme garantit le contrôle du juge judiciaire dans la lutte antiterroriste, sans préciser une autorisation préalable des techniques de renseignement.

### P0650 · jean-luc-melenchon · securite-restreindre-tirs-refus-obtemperer
- **Énoncé :** Les règles d'usage des armes à feu par les policiers lors des refus d'obtempérer doivent être restreintes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abroger la loi dite " Cazeneuve " sur le refus d'obtempérer »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme abroge la loi Cazeneuve sur le refus d'obtempérer, qui a élargi l'usage des armes par les policiers.

### P0651 · jean-luc-melenchon · securite-supprimer-bac
- **Énoncé :** Les brigades anticriminalité (BAC) de la police nationale doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablir la police de proximité comme pilier du service public et démanteler les brigades anticriminalité (BAC) ainsi que les brigades de répression des actions violentes motorisées (BRAV-M) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Libertés publiques et sûreté (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/fonder-la-6e-republique/chapitre2
- **Justification :** Le programme veut démanteler les brigades anticriminalité (BAC).

### P0652 · jean-luc-melenchon · securite-videosurveillance-algorithmique
- **Énoncé :** La vidéosurveillance algorithmique doit être autorisée de façon permanente dans l'espace public.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Interdire certains usages de l'IA et du " big data " qui vont à l'encontre des droits individuels et sociaux : identification biométrique »
- **Source :** L'Avenir en commun 2027 : Chapitre 7 : Démocratiser la révolution numérique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre7
- **Justification :** Le programme interdit les dispositifs de surveillance biométrique et de police prédictive, sans viser nommément la vidéosurveillance algorithmique.

### P0653 · jean-luc-melenchon · societe-aide-active-a-mourir
- **Énoncé :** L'aide active à mourir doit être autorisée pour les adultes atteints d'une maladie incurable.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ajouter dans la Constitution le droit de mourir dans la dignité (y compris avec assistance) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme inscrit dans la Constitution le droit de mourir dans la dignité avec assistance.

### P0654 · jean-luc-melenchon · societe-cannabis-legalisation
- **Énoncé :** La consommation de cannabis par les adultes doit être légalisée et encadrée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Légaliser et encadrer par un monopole d'État la consommation, la production et la vente de cannabis à des fins médicales et récréatives »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme propose de légaliser et d'encadrer la consommation de cannabis récréatif.

### P0655 · jean-luc-melenchon · societe-conge-second-parent
- **Énoncé :** Le congé de naissance du second parent doit avoir la même durée que celui de la mère.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Remplacer le congé paternité et le congé maternité actuels par un congé d'accueil de l'enfant, identique et obligatoire pour les deux parents, d'une durée de 20 semaines par parent »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Entrer pleinement dans l’ère de l’émancipation des femmes (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3
- **Justification :** Le programme crée un congé identique pour les deux parents.

### P0656 · jean-luc-melenchon · societe-education-sexualite-accord-parents
- **Énoncé :** Les séances d'éducation à la sexualité à l'école doivent être soumises à l'accord des parents.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Fournir les moyens réels pour assurer à tous les élèves en collège et lycée les trois séances annuelles d'éducation à la vie affective, relationnelle et à la sexualité (EVARS) prévues par la loi »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Élever le niveau d’éducation et de savoirs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2
- **Justification :** Le programme veut assurer ces séances à tous les élèves, ce qui s'oppose à une condition d'accord parental sans l'évoquer explicitement.

### P0657 · jean-luc-melenchon · societe-gpa-interdite-v2
- **Énoncé :** La gestation pour autrui doit être interdite en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « refuser la gestation pour autrui (GPA) »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme refuse la gestation pour autrui, donc son interdiction en France.

### P0658 · jean-luc-melenchon · societe-salles-consommation-drogue-v2
- **Énoncé :** Les salles de consommation de drogue supervisées doivent être généralisées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Pérenniser et généraliser les salles de consommation à moindre risque sur l'ensemble du territoire »
- **Source :** L'Avenir en commun 2027 : Chapitre 4 : Faire de la santé un enjeu global (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4
- **Justification :** Le programme veut pérenniser et généraliser les salles de consommation à moindre risque sur tout le territoire.

### P0659 · jean-luc-melenchon · societe-service-national-obligatoire
- **Énoncé :** Le service national doit devenir obligatoire pour tous les jeunes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous proposons à la place un service citoyen obligatoire avant l'âge de 25 ans »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Élever le niveau d’éducation et de savoirs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2
- **Justification :** Le programme propose un service citoyen obligatoire de neuf mois pour tous les jeunes.

### P0660 · jean-luc-melenchon · societe-simplifier-changement-sexe-etat-civil
- **Énoncé :** La procédure de changement de la mention du sexe à l'état civil doit être simplifiée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Déjudiciariser le changement de sexe à l'état civil en le rendant libre et gratuit devant un officier d'état civil »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme simplifie le changement de sexe à l'état civil en le déjudiciarisant.

### P0661 · jean-luc-melenchon · societe-statut-beau-parent-v2
- **Énoncé :** Un beau-parent doit pouvoir obtenir un statut juridique lui donnant des droits à l'égard de l'enfant de son conjoint.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Reconnaître un statut de beau-parent sous condition de l'intérêt supérieur de l'enfant »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Une République de l’égalité réelle et des droits nouveaux (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre2
- **Justification :** Le programme veut reconnaître un statut de beau-parent, sous condition de l'intérêt supérieur de l'enfant.

### P0662 · jean-luc-melenchon · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin à l'expérimentation de l'uniforme »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Élever le niveau d’éducation et de savoirs (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2
- **Justification :** Le programme met fin à l'expérimentation de l'uniforme, à l'inverse de son obligation.

### P0663 · jean-luc-melenchon · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renationaliser les autoroutes en revenant sur les hausses de prix passées »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme renationalise les autoroutes, à l'opposé de la poursuite de leur exploitation par des concessionnaires privés.

### P0664 · jean-luc-melenchon · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renationaliser la Société nationale des chemins de fer français (SNCF) et refuser la mise en concurrence des lignes de transport »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme refuse la mise en concurrence des lignes ferroviaires.

### P0665 · jean-luc-melenchon · transport-doubler-investissement-ferroviaire
- **Énoncé :** Les investissements dans le réseau ferroviaire doivent être doublés sur le quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Lancer des grands travaux de rénovation des voies ferrées et de réouverture des lignes et gares fermées ces trente dernières années »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme prévoit de grands travaux ferroviaires, sans objectif chiffré de doublement des investissements.

### P0666 · jean-luc-melenchon · transport-milliard-amenagements-cyclables
- **Énoncé :** L'État doit consacrer au moins un milliard d'euros par an aux aménagements cyclables.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablir le plan Vélo supprimé par la Macronie et porter les investissements à la hauteur des besoins »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme rétablit le plan Vélo et augmente les investissements, sans montant annuel chiffré.

### P0667 · jean-luc-melenchon · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Stopper la suppression des lignes ferroviaires du quotidien et en réouvrir »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme arrête la suppression des petites lignes et propose d'en rouvrir.

### P0668 · jean-luc-melenchon · transport-sncf-entreprise-publique-v2
- **Énoncé :** La SNCF doit être détenue intégralement par des entités publiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renationaliser la Société nationale des chemins de fer français (SNCF) et refuser la mise en concurrence des lignes de transport »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme veut renationaliser la SNCF, donc une détention intégralement publique.

### P0669 · jean-luc-melenchon · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Développer massivement le fret ferroviaire, notamment le wagon isolé »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Les grands chantiers de la bifurcation écologique (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/pour-une-bifurcation-ecologique-et-sociale/chapitre3
- **Justification :** Le programme veut développer massivement le fret ferroviaire, sans évoquer explicitement de subvention.

### P0670 · jean-luc-melenchon · travail-augmenter-jours-carence
- **Énoncé :** Le nombre de jours de carence en cas d'arrêt maladie doit être augmenté.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « la suppression des jours de carence »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme supprime les jours de carence, à l'inverse de leur augmentation.

### P0671 · jean-luc-melenchon · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Annuler les réformes Macron sur l'éligibilité et les méthodes de calcul du montant et de la durée de l'allocation »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme annule les durcissements de l'assurance chômage, mesure inverse de l'énoncé.

### P0672 · jean-luc-melenchon · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « rétablir le principe de faveur : un accord d'entreprise doit être plus favorable qu'un accord de branche, lui-même plus favorable que la loi »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme rétablit le principe de faveur et la durée légale de 35 heures, ce qui exclut qu'un accord d'entreprise fixe une durée moins favorable.

### P0673 · jean-luc-melenchon · travail-elargir-penibilite-retraite
- **Énoncé :** Les critères de pénibilité ouvrant droit à un départ anticipé à la retraite doivent être élargis.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « prendre en compte leur pénibilité en réinstaurant les facteurs de risques supprimés par Macron en 2017 et en créant de nouveaux critères liés aux contraintes émotionnelles fortes »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Entrer pleinement dans l’ère de l’émancipation des femmes (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre3
- **Justification :** Le programme rétablit les facteurs de pénibilité supprimés en 2017 et en crée de nouveaux.

### P0674 · jean-luc-melenchon · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « indexer les salaires sur l'inflation dans le privé comme dans la fonction publique »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme propose d'indexer les salaires sur l'inflation.

### P0675 · jean-luc-melenchon · travail-limiter-licenciements-beneficiaires-v2
- **Énoncé :** Les entreprises qui réalisent des bénéfices doivent être limitées dans leur recours aux licenciements économiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les licenciements boursiers et économiques par les entreprises qui versent des dividendes ou bénéficient des aides de l'État »
- **Source :** L'Avenir en commun 2027 : Chapitre 3 : Un pacte productif pour répondre aux besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre3
- **Justification :** Le programme interdit les licenciements économiques aux entreprises qui versent des dividendes, ce qui limite leur recours aux licenciements.

### P0676 · jean-luc-melenchon · travail-plafond-prudhommes-maintenu-v2
- **Énoncé :** Le barème légal plafonnant les indemnités accordées par les prud'hommes en cas de licenciement sans cause réelle et sérieuse doit être maintenu.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Abroger les ordonnances dites " Pénicaud " ainsi que la loi dite " El Khomri " »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme abroge les ordonnances Pénicaud, qui ont instauré le barème plafonnant les indemnités prud'homales, sans citer ce barème.

### P0677 · jean-luc-melenchon · travail-plafonner-ecart-salaires
- **Énoncé :** L'écart entre les salaires les plus élevés et les plus bas d'une même entreprise doit être plafonné par la loi.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fixer un salaire maximal autorisé pour limiter l'écart de 1 à 20 entre le salaire le plus bas et le salaire le plus haut dans une entreprise »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme plafonne l'écart de salaires de 1 à 20 dans une entreprise.

### P0678 · jean-luc-melenchon · travail-plateformes-presomption-salariat
- **Énoncé :** Les travailleurs des plateformes numériques doivent être présumés salariés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Transposer dans le droit français la directive européenne sur la présomption de salariat empêchant les plateformes numériques (Uber, Deliveroo, etc.) d'avoir recours aux faux indépendants »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme instaure la présomption de salariat pour les travailleurs des plateformes.

### P0679 · jean-luc-melenchon · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Abroger la réforme Macron passant l'âge de départ à la retraite à 64 ans, puis abaisser l'âge de départ jusqu'à restaurer le droit à la retraite à 60 ans à taux plein pour 40 annuités de cotisations »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme ramène l'âge de départ sous 64 ans jusqu'à 60 ans, ce qui va au-delà d'un retour à 62 ans. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0680 · jean-luc-melenchon · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Abroger la réforme Macron passant l'âge de départ à la retraite à 64 ans, puis abaisser l'âge de départ jusqu'à restaurer le droit à la retraite à 60 ans à taux plein pour 40 annuités de cotisations »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme abaisse l'âge de départ, à l'inverse de son report au-delà de 64 ans.

### P0681 · jean-luc-melenchon · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Supprimer les avantages fiscaux de la retraite par capitalisation pour financer le système par répartition »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme supprime les avantages de la capitalisation au profit de la répartition, mesure inverse de l'énoncé.

### P0682 · jean-luc-melenchon · travail-salaries-conseils-administration
- **Énoncé :** Les salariés doivent occuper au moins un tiers des sièges des conseils d'administration des grandes entreprises.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renforcer la représentation des salariés dans les instances de décision des grandes entreprises à hauteur d'un tiers au moins »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : L’ère d’un nouveau collectivisme (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre1
- **Justification :** Le programme fixe au moins un tiers de salariés dans les instances de décision des grandes entreprises.

### P0683 · jean-luc-melenchon · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « passer aux 32 heures dans les métiers pénibles ou de nuit et favoriser leur généralisation par la négociation collective »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme instaure les 32 heures dans les métiers pénibles ou de nuit et favorise leur généralisation par la négociation, sans réduction de la durée légale pour tous.

### P0684 · jean-luc-melenchon · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Porter immédiatement le SMIC mensuel à 1 700 euros net »
- **Source :** L'Avenir en commun 2027 : Chapitre 2 : Partager les richesses (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/une-economie-au-service-des-besoins/chapitre2
- **Justification :** Le programme porte immédiatement le SMIC à 1 700 euros net, hausse supérieure à l'inflation.

### P0685 · jean-luc-melenchon · travail-statut-fonction-publique-regalien
- **Énoncé :** Le statut de fonctionnaire doit être réservé aux missions régaliennes de l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Titulariser les précaires des trois fonctions publiques »
- **Source :** L'Avenir en commun 2027 : Chapitre 1 : À chacun selon ses besoins (melenchon2027.fr) — programme, 2026-11-06 — https://melenchon2027.fr/programme/livre/mettre-en-securite-sociale/chapitre1
- **Justification :** Le programme étend le statut de fonctionnaire aux précaires des trois fonctions publiques, ce qui s'oppose à sa restriction aux missions régaliennes sans l'évoquer explicitement.

## Juan Branco (Les Ruches) — 91 positions

### P0686 · juan-branco · agriculture-autoriser-nouvelles-techniques-genomiques
- **Énoncé :** La culture de plantes issues des nouvelles techniques génomiques doit être autorisée en France.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Encadrement radical des New Genomic Techniques (NGT) »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit un encadrement strict des nouvelles techniques génomiques, sans en demander explicitement l'interdiction, d'où -1 plutôt que -2.

### P0687 · juan-branco · agriculture-encadrer-prix-terres
- **Énoncé :** Le prix de vente des terres agricoles doit être encadré par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Contrôle étatique de l'ensemble des transactions portant sur des terres et immeubles agricoles, avec un renforcement des réquisitions et préemptions. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit un contrôle de l'État sur toutes les transactions de terres agricoles, sans mentionner explicitement l'encadrement de leur prix, d'où 1 plutôt que 2.

### P0688 · juan-branco · agriculture-interdire-poules-cage
- **Énoncé :** L'élevage de poules pondeuses en cage doit être interdit.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdiction progressive des élevages en cage et de l'élevage laitier intensif. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit l'interdiction progressive de tous les élevages en cage, ce qui inclut les poules pondeuses. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0689 · juan-branco · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdiction à horizon quinquennal des pesticides CMR de catégorie 1et perturbateurs endocriniens identifiés, et réduction des CMR de catégorie 2. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit l'interdiction en cinq ans de certaines catégories de pesticides et la réduction d'autres, sans objectif global de réduction de moitié ni échéance 2030, d'où 1.

### P0690 · juan-branco · agriculture-plafonner-aides-pac
- **Énoncé :** Les aides de la politique agricole commune versées à une même exploitation doivent être plafonnées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « plafonnement des aides par exploitation à 70K par actif, avec dégressivité »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit un plafonnement des aides agricoles par exploitation, dans un cadre de la PAC qu'il propose de rendre extra-communautaire.

### P0691 · juan-branco · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablissement des prix planchers garantis et prix minimum d'entrée. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement des prix planchers garantis pour les productions agricoles.

### P0692 · juan-branco · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Arrêt des livraisons d'armes à l'Ukraine. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose l'arrêt des livraisons d'armes à l'Ukraine, soit le contraire de l'énoncé.

### P0693 · juan-branco · defense-doubler-reservistes
- **Énoncé :** Le nombre de réservistes opérationnels des armées doit être doublé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ce service d'État abondera des corps de réserve civils et militaires obligatoires. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit des corps de réserve obligatoires alimentés par un service d'État universel, sans chiffrer un doublement des réservistes opérationnels, d'où 1.

### P0694 · juan-branco · defense-renoncer-modernisation-dissuasion
- **Énoncé :** La France doit renoncer à moderniser sa dissuasion nucléaire.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Développements de vecteurs hypersoniques à statoréacteurs mixtes en remplacement des M51. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de remplacer les missiles M51 de la dissuasion par de nouveaux vecteurs, ce qui revient à la moderniser, sans que le texte mentionne la dissuasion nucléaire en tant que telle, d'où -1.

### P0695 · juan-branco · democratie-assemblees-tirees-consultatives-v2
- **Énoncé :** Les assemblées citoyennes tirées au sort doivent avoir un rôle consultatif et non décisionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « des intercommunalités, remplacées par des assemblées composées au tiers d'élus et aux deux tiers de citoyens tirés au sort »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme confie à des assemblées aux deux tiers tirées au sort les compétences des intercommunalités, donc un rôle décisionnel, sans se prononcer sur toutes les assemblées tirées au sort, d'où -1.

### P0696 · juan-branco · democratie-chambre-tiree-au-sort
- **Énoncé :** Des citoyens tirés au sort doivent siéger dans une chambre du Parlement aux côtés des élus.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Concernant la chambre haute : fonctionnement "à l'athénienne" avec un tirage au sort des 200 représentants tous les vingt-quatre mois. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme présente, parmi trois options de réorganisation du Parlement, une chambre haute entièrement tirée au sort à côté d'une chambre élue, d'où 1 (option parmi d'autres).

### P0697 · juan-branco · democratie-champ-referendum-inchange
- **Énoncé :** Le référendum sur un texte de loi doit rester limité à ses sujets actuels (notamment institutions, politique économique, sociale ou environnementale), sans être étendu à tous les domaines de la loi.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Création d'un RIC en toutes matières. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme ouvre le référendum d'initiative citoyenne à toutes les matières, soit l'extension du référendum à tous les domaines que l'énoncé refuse. Déduit d'un RIC en toutes matières, et non de l'article 11 lui-même : -1, harmonisé avec les autres candidats.

### P0698 · juan-branco · democratie-parrainages-elus-maintenus
- **Énoncé :** Les candidats à l'élection présidentielle doivent continuer à recueillir 500 parrainages d'élus.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Remplacement du système actuel de parrainages à l'élection présidentielle par 50.000 parrainages citoyens avec mise en place de quotas territoriaux et soutien de 150 maires comme garantie de représentativité territoriale. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de remplacer les 500 parrainages d'élus par des parrainages citoyens et le soutien de 150 maires.

### P0699 · juan-branco · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Création d'un RIC en toutes matières. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose un référendum d'initiative citoyenne en toutes matières, ce qui va à l'encontre d'un recours exceptionnel au référendum, sans le dire explicitement, d'où -1.

### P0700 · juan-branco · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Création d'un RIC en toutes matières. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose la création d'un référendum d'initiative citoyenne en toutes matières, ce que confirme la déclaration de candidature.

### P0701 · juan-branco · democratie-referendum-local-initiative
- **Énoncé :** Les habitants d'une commune doivent pouvoir imposer l'organisation d'un référendum local par une pétition.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « sous contrôle de référendums d'initiative locaux permettant d'instaurer un dialogue des légitimités »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme mentionne des référendums d'initiative locaux, sans préciser leur déclenchement par pétition des habitants d'une commune, d'où 1.

### P0702 · juan-branco · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Création d'un RIC en toutes matières. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme crée un référendum d'initiative citoyenne en toutes matières, ce qui retire au président et au Parlement le monopole du déclenchement d'un référendum national.

### P0703 · juan-branco · democratie-referendum-revocatoire
- **Énoncé :** Les électeurs doivent pouvoir révoquer un élu en cours de mandat par référendum.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instauration du principe de mandat révocable, et de la possibilité permanente de transformer le mandat représentatif en mandat impératif »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose le mandat révocable par référendum, ce que confirme la déclaration de candidature (mandats révocatoires).

### P0704 · juan-branco · democratie-supprimer-cese
- **Énoncé :** Le Conseil économique, social et environnemental doit être supprimé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Création d'une chambre haute absorbant le Sénat et le Conseil Économique, Social et Environnemental (CESE) »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit, dans l'une de ses trois options, l'absorption du CESE par une nouvelle chambre haute, d'où 1 plutôt que 2.

### P0705 · juan-branco · democratie-vote-blanc-exprime
- **Énoncé :** Le vote blanc doit être pris en compte dans les suffrages exprimés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « prise en compte du vote nul et blanc (réduisant proportionnellement le financement public et rendant caduque le mandat électoral en cas de majorité de vote blanc) »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose la prise en compte du vote blanc, avec des effets sur le financement public et la validité du mandat.

### P0706 · juan-branco · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Blocage de négociations de traités de libre-échange. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de bloquer la négociation des traités de libre-échange, soit le contraire de l'énoncé.

### P0707 · juan-branco · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Abrogation de tous les dispositifs normatifs créant une contrainte excessive sur les collectivités, petites et moyennes entreprises. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit d'abroger les normes jugées excessives pour les petites et moyennes entreprises, sans viser l'ensemble des règles de création et de gestion des entreprises, d'où 1.

### P0708 · juan-branco · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Baisse des prélèvements obligatoires et des dépenses publiques »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme inscrit la baisse des dépenses publiques parmi ses priorités.

### P0709 · juan-branco · economie-eau-operateurs-publics
- **Énoncé :** La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renationalisation des entreprises de distribution de l'eau. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de renationaliser les entreprises de distribution de l'eau, ce qui confie celle-ci à des opérateurs publics.

### P0710 · juan-branco · economie-etat-finance-usines
- **Énoncé :** L'État doit financer directement la construction d'usines dans les secteurs qu'il juge prioritaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Financement de scieries, fabriques de meubles et papeteries nationales. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit le financement par l'État d'unités de production nationales dans des filières qu'il désigne.

### P0711 · juan-branco · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mise en place d'un pôle public de l'armement et fin de la privatisation des industries d'armement et des missions de défense nationale, avec reprise en main des conseils d'administration de Dassault, Thalès, Airbus, etc. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit la reprise en main par l'État d'entreprises industrielles stratégiques de l'armement.

### P0712 · juan-branco · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Modulation des tarifs énergétiques selon le niveau de consommation, et octroi d'un minima vital forfaitaire. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit des tarifs énergétiques modulés et un minimum vital forfaitaire, ce qui suppose une fixation publique des prix sans le dire explicitement, d'où 1.

### P0713 · juan-branco · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « suppression de l'ANCT, CNDS, DRAJES, CESER »
- **Source :** Le Projet 2027 : programme en 6 piliers (Les Ruches) — programme, 2026 — https://ruches.org/le-projet
- **Justification :** Le programme propose la suppression nommée de plusieurs agences et organismes publics, ainsi que la fusion de nombreux opérateurs de l'État.

### P0714 · juan-branco · economie-vendre-participations-etat
- **Énoncé :** L'État doit vendre une partie de ses participations dans les entreprises cotées en bourse.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Interdiction de cession de patrimoine public, y compris de privatisations, hors référendum. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose d'interdire toute cession de patrimoine public et toute privatisation hors référendum, soit le contraire de l'énoncé.

### P0715 · juan-branco · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Construction de 14 EPR 2, développement d'une filière intégrée RNR-NA. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit quatorze EPR2, soit davantage que les six prévus, et une filière de réacteurs à neutrons rapides.

### P0716 · juan-branco · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Fin de la politique de privatisation des projets SMR, orientation vers AMR. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de ne plus confier les petits réacteurs modulaires au privé et de s'orienter vers les réacteurs modulaires avancés, sans mentionner explicitement un financement public, d'où 1.

### P0717 · juan-branco · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Construction de 14 EPR 2, développement d'une filière intégrée RNR-NA. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit la construction de quatorze EPR2 et d'une filière de réacteurs à neutrons rapides, mesure inverse d'une réduction de la part du nucléaire.

### P0718 · juan-branco · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Conditionnalisation des aides au développement des énergies alternatives à des critères de fabrication locale. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme maintient les aides aux énergies renouvelables en les conditionnant à une fabrication locale, plutôt que de les supprimer, d'où -1.

### P0719 · juan-branco · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Plan d'arrêt et de reconversion des sols artificialisés durcissant les ZAN »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de durcir les objectifs de zéro artificialisation nette, soit le contraire d'un assouplissement.

### P0720 · juan-branco · environnement-gazole-non-routier-agriculteurs
- **Énoncé :** Les agriculteurs doivent conserver un taux réduit de taxe sur le gazole non routier.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Plafonnement des aides au GNR et sur les serres chauffées au gaz. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de plafonner les aides au gazole non routier, sans les supprimer, d'où -1.

### P0721 · juan-branco · environnement-limiter-recours-projets-v2
- **Énoncé :** Les possibilités de recours juridictionnel contre les autorisations de projets industriels doivent être limitées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Création d'un guichet unique pour la création de sites industriels, avec un délai d'étude maximal de six mois avant approbation ou rejet ; et un délai maximal de trois mois concernant le traitement de tout recours. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme plafonne à trois mois le traitement des recours contre les sites industriels, version voisine qui encadre les recours sans en restreindre explicitement les possibilités, d'où 1.

### P0722 · juan-branco · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdiction des contenants en plastique aux fins de consommation et création de consignes pour les contenants liquides. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose d'interdire les contenants en plastique de consommation, sans échéance fixée à 2030, d'où 1.

### P0723 · juan-branco · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abolition des Zones à Faibles Émissions. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement la suppression des zones à faibles émissions.

### P0724 · juan-branco · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Création d'une TCI, taxe à l'importation sur tout pays utilisant plus de 200mwH de charbon, proportionnel au taux d'emploi du charbon dans la consommation énergétique totale »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une taxe sur les importations liée à l'usage du charbon par le pays d'origine, et non aux émissions des produits importés, d'où 1.

### P0725 · juan-branco · environnement-taxer-kerosene-vols-interieurs
- **Énoncé :** Le kérosène des vols intérieurs doit être taxé comme les autres carburants.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fin de l'exemption de TICPE sur les vols intérieurs. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de mettre fin à l'exonération de taxe sur le carburant des vols intérieurs.

### P0726 · juan-branco · fiscalite-baisse-cotisations-salaries
- **Énoncé :** Les cotisations sociales payées par les salariés doivent baisser.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Réduction des cotisations sociales sur les salaires financée par l'adoption d'une TVA sociale sur les bien non-essentiels »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une baisse des cotisations sur les salaires sans préciser qu'elle porte sur la part salariale, d'où 1.

### P0727 · juan-branco · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Baisse des prélèvements obligatoires et des dépenses publiques »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme inscrit la baisse des prélèvements obligatoires parmi ses priorités.

### P0728 · juan-branco · fiscalite-hausse-taxe-transactions-financieres
- **Énoncé :** Le taux de la taxe sur les transactions financières doit être relevé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mise en œuvre d'une taxe sur les transactions financières. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une taxe sur les transactions financières sans mentionner le relèvement du taux de la taxe existante, d'où 1.

### P0729 · juan-branco · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablissement de l'ISF avec un mécanisme de précompte sur les droits de succession. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement le rétablissement de l'ISF.

### P0730 · juan-branco · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablissement de l'ISF avec un mécanisme de précompte sur les droits de succession. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme rétablit l'ISF, qui taxe chaque année les grands patrimoines sans seuil de 100 millions ni taux minimal de 2 %. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0731 · juan-branco · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmentation de 30% de la recherche et développement, à travers notamment le doublement du budget du CNRS et l'augmentation des budgets universitaires, financés par la suppression du CIR. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme supprime le crédit d'impôt recherche, sans objectif global de réduction de moitié de l'ensemble des crédits et réductions d'impôt, d'où 1.

### P0732 · juan-branco · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Fin des DMTG pour 90% des foyers fiscaux. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme supprime les droits de succession pour 90 % des foyers mais les rend confiscatoires pour les plus gros héritages, d'où 1 plutôt que 2.

### P0733 · juan-branco · fiscalite-tranche-hauts-revenus
- **Énoncé :** Les plus hauts revenus doivent être soumis à une tranche d'impôt supplémentaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « une baisse des prélèvements obligatoires moyens sur l'ensemble de la population à l'exception du dernier décile, faisant l'objet d'une imposition effective renforcée »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une imposition renforcée du dernier décile, sans préciser la création d'une tranche d'impôt supplémentaire, d'où 1.

### P0734 · juan-branco · immigration-amende-sejour-irregulier
- **Énoncé :** Le séjour irrégulier en France doit être sanctionné par une amende.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « systématisation des TIG pour infraction au séjour »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de sanctionner l'infraction au séjour par des travaux d'intérêt général et non par une amende, d'où 1.

### P0735 · juan-branco · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Conditionnalisation du regroupement familial et déconcentration du traitement de l'asile au niveau consulaire. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme déplace le traitement de l'asile vers les consulats, donc hors du territoire national, sans parler de centres situés hors de l'Union européenne, d'où 1.

### P0736 · juan-branco · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Conditionnalisation du regroupement familial et déconcentration du traitement de l'asile au niveau consulaire. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de conditionner le regroupement familial, sans préciser de conditions de ressources, d'où 1.

### P0737 · juan-branco · immigration-visas-professions-qualifiees-v2
- **Énoncé :** Les conditions de délivrance des visas de travail aux personnes exerçant des professions qualifiées doivent être assouplies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Développement d'une politique d'attractivité en faveur des individus à haut niveau de qualification »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une politique d'attractivité envers les personnes très qualifiées, sans viser explicitement l'assouplissement des conditions de délivrance des visas de travail, d'où 1.

### P0738 · juan-branco · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « reconcentrer une grande partie de politiques déléguées en un foisonnement d'agences, institutions et collectivités décentralisées »
- **Source :** Le Projet 2027 : programme en 6 piliers (Les Ruches) — programme, 2026 — https://ruches.org/le-projet
- **Justification :** Le programme propose que l'État reconcentre une grande partie des politiques aujourd'hui déléguées notamment aux collectivités décentralisées.

### P0739 · juan-branco · institutions-mandat-presidentiel-sept-ans
- **Énoncé :** Le mandat présidentiel doit être porté à sept ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Changement de la durée du mandat présidentiel (7 ans), avec limitation de trois mandats. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement un mandat présidentiel de sept ans.

### P0740 · juan-branco · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « élection à scrutin proportionnel sur listes à un tour pour 200 députés, au scrutin uninominal à un tour pour 101 députés sur les circonscriptions départementales »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme présente, dans l'une de ses options, un scrutin mixte où une partie seulement des députés est élue à la proportionnelle, d'où 1.

### P0741 · juan-branco · institutions-referendum-revision-constitution
- **Énoncé :** Le président de la République doit pouvoir soumettre directement au référendum une révision de la Constitution.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Référendum fondé sur l'article 11 de la Constitution proposant la convocation d'une assemblée constituante »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de soumettre directement au référendum des changements constitutionnels sur le fondement de l'article 11, sans se prononcer sur la procédure de révision en général, d'où 1.

### P0742 · juan-branco · institutions-supprimer-49-3
- **Énoncé :** Le recours à l'article 49.3 de la Constitution doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abrogation des articles 49.3 et assimilés de la Constitution. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement l'abrogation de l'article 49.3.

### P0743 · juan-branco · international-aide-developpement-0-7
- **Énoncé :** L'aide publique au développement doit atteindre 0,7 % du revenu national brut.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « réduction de l'aide au développement multilatérale aux chantiers prioritaires et transformation des autres crédits en crédits de coopération »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme réduit l'aide multilatérale au développement en la transformant en crédits de coopération, sans se prononcer sur l'objectif de 0,7 %, d'où -1.

### P0744 · juan-branco · international-referendum-maintien-ue
- **Énoncé :** La France doit organiser un référendum sur son maintien dans l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Référendums sur l'appartenance à l'Union Européenne et à l'euro »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement un référendum sur l'appartenance de la France à l'Union européenne.

### P0745 · juan-branco · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « adoption d'un plan pénitentiaire avec des cellules collectives (6 à 12 personnes) »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit un plan pénitentiaire, ce qui va dans le sens contraire d'un arrêt des constructions sans le dire explicitement, d'où -1.

### P0746 · juan-branco · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Fin du modèle Badinter : peines réelles, exécution des peines courtes »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose l'exécution des peines courtes, soit le contraire de leur remplacement par des peines alternatives.

### P0747 · juan-branco · justice-imprescriptibilite-crimes-sexuels-mineurs
- **Énoncé :** Les crimes sexuels commis sur des mineurs doivent être imprescriptibles.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Retour de la prescription délictuelle à 3 ans et criminelle à 10 ans. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose une prescription criminelle générale de dix ans, sans mentionner les crimes sexuels sur mineurs, d'où -1.

### P0748 · juan-branco · numerique-algorithmes-publics
- **Énoncé :** Les plateformes doivent rendre publics les algorithmes qui hiérarchisent les contenus.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Obligation de transparence concernant les algorithmes des réseaux sociaux. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une obligation de transparence sur les algorithmes des réseaux sociaux, sans préciser leur publication, d'où 1.

### P0749 · juan-branco · numerique-ia-remuneration-auteurs
- **Énoncé :** Les entreprises d'intelligence artificielle doivent rémunérer les auteurs dont les œuvres servent à entraîner leurs modèles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Offensive juridique et commerciale visant à obtenir la compensation du pillage des données Françaises aux fins de constitution de LLM »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme vise une compensation pour l'usage des données françaises par les modèles de langage, sans parler de rémunération des auteurs, d'où 1.

### P0750 · juan-branco · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Imposition de logiciels libres et fonctionnement en source ouverte pour l'Administration. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement d'imposer les logiciels libres à l'administration.

### P0751 · juan-branco · sante-assurance-sante-privee-option-v2
- **Énoncé :** Les assurés doivent pouvoir quitter l'Assurance maladie obligatoire au profit d'une assurance santé privée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « financé notamment par la suppression des complémentaires et mutuelles privées »
- **Source :** Le Projet 2027 : programme en 6 piliers (Les Ruches) — programme, 2026 — https://ruches.org/le-projet
- **Justification :** Le programme veut un service public de santé universel et la suppression des assurances santé privées, ce qui exclut de quitter l'Assurance maladie pour un assureur privé sans que la question soit posée explicitement, d'où -1.

### P0752 · juan-branco · sante-centres-sante-publics
- **Énoncé :** Chaque département doit disposer de centres de santé publics employant des médecins salariés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en une politique unique, dirigée par des centres de santé départementaux dotés d'antennes, accompagnés d'obligations d'exercice en zones sous-dotées, d'une régulation de l'installation décennale, et la création d'un corps de médecins généralistes et ambulatoires d'État »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit des centres de santé départementaux et un corps de médecins d'État.

### P0753 · juan-branco · sante-depassements-honoraires-libres
- **Énoncé :** Les médecins doivent rester libres de pratiquer des dépassements d'honoraires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « la fin des dépassements d'honoraires »
- **Source :** Le Projet 2027 : programme en 6 piliers (Les Ruches) — programme, 2026 — https://ruches.org/le-projet
- **Justification :** Le programme propose la fin des dépassements d'honoraires, soit le contraire de l'énoncé.

### P0754 · juan-branco · sante-hausse-franchises-medicales
- **Énoncé :** Les franchises médicales payées par les patients doivent être augmentées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « remplaçant tous les forfaits hospitaliers, tickets modérateurs, franchises, fixant une limite annuelle à la prise en charge par l'assuré des frais de santé, corrélatif au revenu et au patrimoine »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de remplacer les franchises médicales par un plafond annuel lié au revenu, soit le contraire d'une hausse des franchises.

### P0755 · juan-branco · sante-jeunes-medecins-zones-sous-dotees
- **Énoncé :** Les jeunes médecins doivent exercer au moins deux ans dans une zone sous-dotée à la fin de leurs études.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « accompagnés d'obligations d'exercice en zones sous-dotées »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit des obligations d'exercice en zones sous-dotées, sans préciser qu'elles visent les jeunes médecins pendant deux ans, d'où 1.

### P0756 · juan-branco · sante-mutuelles-part-accrue-v2
- **Énoncé :** Les complémentaires santé doivent prendre en charge une part plus importante des dépenses actuellement remboursées par l'Assurance maladie.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « financé notamment par la suppression des complémentaires et mutuelles privées »
- **Source :** Le Projet 2027 : programme en 6 piliers (Les Ruches) — programme, 2026 — https://ruches.org/le-projet
- **Justification :** Le programme veut supprimer les complémentaires et mutuelles privées au profit d'un service public de santé, soit le contraire d'une part accrue des complémentaires.

### P0757 · juan-branco · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Création d'une industrie pharmaceutique publique »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose une industrie pharmaceutique publique, ce qui va au-delà d'une production publique en cas de défaut de l'offre privée. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0758 · juan-branco · sante-psychologues-rembourses
- **Énoncé :** Les consultations chez un psychologue doivent être remboursées sans limite de nombre.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Remboursement intégral des consultations chez le psychologue »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose le remboursement intégral des consultations chez le psychologue.

### P0759 · juan-branco · sante-regulation-installation-medecins
- **Énoncé :** L'installation des médecins doit être régulée dans les zones déjà bien dotées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « d'une régulation de l'installation décennale »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose une régulation de l'installation des médecins, couplée à des obligations d'exercice en zones sous-dotées.

### P0760 · juan-branco · sante-taxer-boissons-sucrees
- **Énoncé :** La taxe sur les boissons sucrées doit être augmentée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Surtaxation et abaissement des limites maximales pour la teneur en sel, en sucre et en acides gras saturés dans les aliments ultra-transformés. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une surtaxe sur les aliments ultra-transformés trop sucrés, sans viser spécifiquement les boissons sucrées, d'où 1.

### P0761 · juan-branco · securite-enquetes-policiers-independantes
- **Énoncé :** Les enquêtes visant des policiers doivent être confiées à un organisme indépendant du ministère de l'Intérieur.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Création d'un nouveau corps d'inspection indépendant des forces de l'ordre. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose une inspection indépendante des forces de l'ordre, sans préciser son indépendance vis-à-vis du ministère de l'Intérieur, d'où 1.

### P0762 · juan-branco · securite-interdire-lbd-manifestations
- **Énoncé :** L'usage des lanceurs de balles de défense doit être interdit lors des manifestations.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Abandon des outils de maintien de l'ordre " intermédiaires " »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose l'abandon des armes intermédiaires de maintien de l'ordre, sans nommer les lanceurs de balles de défense, d'où 1.

### P0763 · juan-branco · securite-recepisse-controles-identite
- **Énoncé :** Les contrôles d'identité doivent donner lieu à la remise d'un récépissé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Création d'un récépissé d'un contrôle d'identité »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement un récépissé de contrôle d'identité.

### P0764 · juan-branco · securite-supprimer-bac
- **Énoncé :** Les brigades anticriminalité (BAC) de la police nationale doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Suppression des brigades anticriminalité (BAC) au profit d'une police de proximité. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose explicitement de supprimer les BAC au profit d'une police de proximité.

### P0765 · juan-branco · societe-instruction-famille-autorisation
- **Énoncé :** L'instruction en famille doit rester soumise à une autorisation préalable.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Simplification des conditions de l'instruction en famille. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de simplifier les conditions de l'instruction en famille, sans mentionner explicitement la suppression de l'autorisation préalable, d'où -1.

### P0766 · juan-branco · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Expropriation des compagnies d'autoroutes. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose d'exproprier les sociétés d'autoroutes, soit le contraire de la poursuite des concessions privées.

### P0767 · juan-branco · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Fin de la concurrence dans le ferroviaire »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose la fin de la concurrence dans le ferroviaire, soit le contraire de l'énoncé.

### P0768 · juan-branco · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « lancement d'un grand plan d'investissement dans les lignes secondaires, notamment des 4000 kilomètres de lignes menacées d'effondrement »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit d'investir dans les lignes secondaires menacées, sans se prononcer sur celles qui sont peu fréquentées, d'où 1.

### P0769 · juan-branco · transport-routes-90-kmh
- **Énoncé :** La limitation de vitesse sur les routes secondaires doit être relevée à 90 km/h partout.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « fin des limitations de vitesse sur les tronçons non-accidentogènes »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme propose de supprimer les limitations de vitesse sur les tronçons non accidentogènes, mesure voisine qui ne porte pas sur un relèvement à 90 km/h, d'où 1.

### P0770 · juan-branco · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Grand plan d'investissement dans le ferroutage et le cabotage pour réduire les émissions liées au transport routier »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit un plan d'investissement dans le ferroutage, sans parler de subvention du fret ferroviaire en général, d'où 1.

### P0771 · juan-branco · transport-supprimer-controle-technique-motos-v2
- **Énoncé :** Le contrôle technique périodique obligatoire des deux-roues motorisés doit être supprimé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Limitation des contrôles techniques aux points essentiels. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme veut limiter les contrôles techniques aux points essentiels, sans les supprimer ni viser spécifiquement les deux-roues, version partielle dans le même sens, d'où 1.

### P0772 · juan-branco · transport-taxe-kilometrique-poids-lourds
- **Énoncé :** Les poids lourds doivent payer une taxe kilométrique sur le réseau routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mise en place d'une redevance poids lourds internationaux. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une redevance limitée aux poids lourds internationaux, d'où 1.

### P0773 · juan-branco · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Dégressivité des allocations chômage à partir de la première année »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit la dégressivité des allocations chômage mais aussi l'ouverture de droits en cas de démission, d'où 1 plutôt que 2.

### P0774 · juan-branco · travail-salaries-conseils-administration
- **Énoncé :** Les salariés doivent occuper au moins un tiers des sièges des conseils d'administration des grandes entreprises.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Loi de participation et de représentation obligatoire des salariés au sein des conseils d'administration. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une représentation obligatoire des salariés dans les conseils d'administration, sans fixer la proportion d'un tiers, d'où 1.

### P0775 · juan-branco · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Déconcentration du SMIC, avec réhaussement du seuil minimal national à 1500 euros net. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit de relever le seuil national du SMIC à 1 500 euros net, sans référence explicite à l'inflation, d'où 1.

### P0776 · juan-branco · travail-smic-regional
- **Énoncé :** Le SMIC doit pouvoir varier selon les régions.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Déconcentration du SMIC, avec réhaussement du seuil minimal national à 1500 euros net. »
- **Source :** La Voie : pour sauver le peuple français (« Le Projet » version 9, Les Ruches, PDF) — programme, 2026-05-27 — https://media.ruches.org/projet-1784217879253.pdf
- **Justification :** Le programme prévoit une déconcentration du SMIC au-dessus d'un seuil national, sans préciser une variation par région, d'où 1.

