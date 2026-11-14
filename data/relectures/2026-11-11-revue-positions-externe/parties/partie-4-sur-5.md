# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** part 4 of 5 — 244 positions (Marine Le Pen, Marine Tondelier, Nathalie Arthaud, Nicolas Dupont-Aignan). The other parts are reviewed separately; references (P0001…) are global.

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
*244 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

## Marine Le Pen (Rassemblement national) — 53 positions

### P0777 · marine-le-pen · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « soient les services de l'État qui consti- tuent le recours direct pour valider des prix minimums en cas de litiges lors des négociations commerciales »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 confie à l'État la validation de prix minimums en cas de litige commercial, sans fixer de prix plancher garantis par production.

### P0778 · marine-le-pen · defense-effectifs-armees-hausse
- **Énoncé :** Les effectifs des armées doivent augmenter d'au moins 10 % d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « un budget de l'ordre de 55 milliards d'euros, de sorte que soit ac- cru le format humain des armées »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit d'accroître le format humain des armées, sans chiffrer la hausse des effectifs ni retenir le seuil de 10 %.

### P0779 · marine-le-pen · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Porter le budget de la défense à 55 milliards d'euros à l'horizon 2027. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient une hausse du budget de la défense en euros, sans l'exprimer en proportion du PIB, d'où -1 plutôt que -2.

### P0780 · marine-le-pen · defense-renoncer-modernisation-dissuasion
- **Énoncé :** La France doit renoncer à moderniser sa dissuasion nucléaire.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « intégralement nationale de la dissuasion nucléaire, ce qui implique la modernisa- tion de l'ensemble de ses composantes »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit explicitement la modernisation de toutes les composantes de la dissuasion, contraire de l'énoncé.

### P0781 · marine-le-pen · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer le Referendum d'Initiative Citoyenne et mettre en place la proportionnelle. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent d'instaurer le référendum d'initiative citoyenne.

### P0782 · marine-le-pen · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « revoir les accords de libre-échange qui ne res- pectent pas les intérêts de la France »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient de revoir les accords de libre-échange jugés contraires aux intérêts français, sans rejeter tout nouvel accord, d'où -1.

### P0783 · marine-le-pen · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Conditionner les subventions à la création d'emplois au titre d'une poli- tique d'aménagement du territoire. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 conditionnent les subventions à la création d'emplois dans un cadre d'aménagement du territoire, variante voisine du maintien de l'emploi en France.

### P0784 · marine-le-pen · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « réduire les normes et réglementations qui, selon elle, empoisonnent la vie des entreprises »
- **Source :** Entre défense du pouvoir d'achat et séduction des entreprises, Marine Le Pen entretient une ligne parfois difficile à concilier (franceinfo) — declaration_vote, 2026-07-08 — https://www.franceinfo.fr/replay-radio/le-decryptage-eco/entre-defense-du-pouvoir-d-achat-et-seduction-des-entreprises-marine-le-pen-entretient-une-ligne-parfois-difficile-a-concilier_8065598.html
- **Justification :** Selon ce compte rendu de 2026, la candidate veut réduire les normes et réglementations pesant sur les entreprises ; le programme de 2022 prévoyait déjà une politique de simplification.

### P0785 · marine-le-pen · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « protéger les entreprises de l'agroalimen- taire face aux menaces de rachat et de démantèle- ment par des groupes étrangers »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 vise la protection contre les rachats étrangers dans le seul secteur agroalimentaire, d'où 1.

### P0786 · marine-le-pen · economie-encadrer-marges-distribution
- **Énoncé :** Les marges de la grande distribution doivent être encadrées par la loi.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Garantir aux paysans des prix res- pectueux de leur travail et mettre un terme aux marges abusives de la grande distribution. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 veulent mettre fin aux marges abusives de la grande distribution, sans préciser un encadrement par la loi.

### P0787 · marine-le-pen · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il sera destiné à l'investissement, dans l'économie française bien sûr, mais également dans des actifs stratégiques pour la souveraineté de la France à l'étranger »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 crée un fonds souverain investissant dans l'économie française et des actifs stratégiques, sans viser expressément des participations dans des entreprises industrielles.

### P0788 · marine-le-pen · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer les ARS et réduire à 10% les postes administratifs dans les hôpi- taux »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 suppriment les agences régionales de santé, une catégorie d'agences de l'État, sans programme général de suppression d'opérateurs.

### P0789 · marine-le-pen · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Arrêter les projets éoliens et dé- manteler progressivement les parcs existants. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient l'arrêt des projets éoliens et le démantèlement des parcs, contraire explicite de l'énoncé.

### P0790 · marine-le-pen · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « engager sans tarder le renouvellement de notre parc nucléaire »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit le renouvellement du parc nucléaire sans chiffrer le nombre de réacteurs ni le situer par rapport aux six EPR2.

### P0791 · marine-le-pen · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « reprendre les études sur les réacteurs à neutrons rapides, scan- daleusement aban- donnés par Emma- nuel Macron, et les petits réacteurs mo- dulaires »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit de reprendre les études sur les petits réacteurs modulaires, sans mentionner un financement public de leur développement.

### P0792 · marine-le-pen · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « le parc nucléaire français sera inté- gralement préservé et sa durée de vie prolongée, sous le contrôle de l'Autorité de sûreté nucléaire »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit de prolonger la durée de vie du parc sous contrôle de l'autorité de sûreté, sans mentionner le seuil de 60 ans.

### P0793 · marine-le-pen · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mon ambi- tion n'est pas seule- ment de préserver le nucléaire français, elle est d'en faire le pivot de notre politique énergétique »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 veut préserver intégralement le parc nucléaire et en faire le pivot de la politique énergétique, à l'opposé d'une réduction de sa part.

### P0794 · marine-le-pen · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Enfin il sera mis fin au sub- ventionnement de ces énergies intermittentes. »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 met fin aux subventions des énergies intermittentes dans un passage consacré aux éoliennes, sans mentionner le solaire, d'où 1.

### P0795 · marine-le-pen · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « un moratoire sur la construction de toute nouvelle éolienne, sur terre ou mer, sera ins- tauré »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit un moratoire sur toute nouvelle éolienne terrestre ou maritime.

### P0796 · marine-le-pen · environnement-calendrier-logements-mal-isoles
- **Énoncé :** L'interdiction de louer les logements les moins bien isolés doit être appliquée selon le calendrier prévu.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « supprimer les "contraintes" liées aux diagnostics de performance énergétique (DPE) »
- **Source :** Réserver les logements HLM aux Français : la proposition de Marine Le Pen provoque une levée de boucliers (LCP) — declaration_vote, 2026-09-14 — https://lcp.fr/actualites/reserver-les-logements-hlm-aux-francais-la-proposition-de-marine-le-pen-provoque-une
- **Justification :** Selon ce compte rendu de 2026, la candidate veut supprimer les contraintes liées au DPE, sur lequel repose l'interdiction de louer les logements mal isolés, sans viser explicitement ce calendrier.

### P0797 · marine-le-pen · fiscalite-baisse-impot-societes
- **Énoncé :** Le taux de l'impôt sur les sociétés doit être abaissé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « elle a affiché sa volonté de baisser l'impôt sur les sociétés »
- **Source :** Entre défense du pouvoir d'achat et séduction des entreprises, Marine Le Pen entretient une ligne parfois difficile à concilier (franceinfo) — declaration_vote, 2026-07-08 — https://www.franceinfo.fr/replay-radio/le-decryptage-eco/entre-defense-du-pouvoir-d-achat-et-seduction-des-entreprises-marine-le-pen-entretient-une-ligne-parfois-difficile-a-concilier_8065598.html
- **Justification :** Selon ce compte rendu de 2026, la candidate veut baisser l'impôt sur les sociétés ; en 2022 elle ne proposait qu'une exonération pour les entrepreneurs de moins de 30 ans.

### P0798 · marine-le-pen · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer l'IFI qui taxe l'enracinement et créer un IFF, impôt sur la fortune financière, pour taxer la spéculation. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 créent un impôt sur la fortune financière ; le programme le limite aux produits financiers détenus depuis moins de 10 ans, d'où 1.

### P0799 · marine-le-pen · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer les impôts sur l'héritage direct pour les familles modestes et les classes moyennes. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 suppriment l'impôt sur l'héritage direct pour les familles modestes et moyennes.

### P0800 · marine-le-pen · fiscalite-supprimer-ifi
- **Énoncé :** L'impôt sur la fortune immobilière doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer l'IFI qui taxe l'enracinement »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de supprimer l'impôt sur la fortune immobilière.

### P0801 · marine-le-pen · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il s'agira de supprimer la Cotisation Fon- cière des Entreprises, CFE. La suppres- sion de la Contribution Sociale de Solida- rité des Sociétés, C3S, sera quant à elle réservée aux zones de relocalisation. »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 supprime la CFE mais réserve la suppression de la C3S aux zones de relocalisation, soit une suppression partielle des impôts de production.

### P0802 · marine-le-pen · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « elle défend une taxation des superprofits »
- **Source :** Entre défense du pouvoir d'achat et séduction des entreprises, Marine Le Pen entretient une ligne parfois difficile à concilier (franceinfo) — declaration_vote, 2026-07-08 — https://www.franceinfo.fr/replay-radio/le-decryptage-eco/entre-defense-du-pouvoir-d-achat-et-seduction-des-entreprises-marine-le-pen-entretient-une-ligne-parfois-difficile-a-concilier_8065598.html
- **Justification :** Selon ce compte rendu de 2026, la candidate défend une taxation des superprofits.

### P0803 · marine-le-pen · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Traiter les demandes de droit d'asile uniquement à l'étranger. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient l'examen des demandes d'asile uniquement à l'étranger, sans préciser des centres hors de l'Union européenne, d'où 1 plutôt que 2.

### P0804 · marine-le-pen · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Expulser systématiquement les clandestins, délinquants et criminels étrangers. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient l'expulsion systématique des étrangers délinquants, sans viser expressément le retrait du titre après une peine de prison ferme.

### P0805 · marine-le-pen · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réserver les aides sociales aux Français, et conditionner à 5 années de travail en France l'accès aux pres- tations de solidarité. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 conditionnent l'accès aux prestations de solidarité à cinq années de travail en France, condition plus stricte que cinq ans de résidence.

### P0806 · marine-le-pen · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin à l'immigration de peu- plement et au regroupement familial. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de mettre fin au regroupement familial, mesure plus radicale que des conditions de ressources plus strictes, d'où 1.

### P0807 · marine-le-pen · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « les étrangers en situation irrégulière, les étrangers criminels ou délinquants soient systématiquement et immédiate- ment reconduits à la frontière »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit la reconduite systématique des étrangers en situation irrégulière, sans se prononcer explicitement sur la régularisation.

### P0808 · marine-le-pen · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer le droit du sol »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de supprimer le droit du sol.

### P0809 · marine-le-pen · immigration-titre-sejour-longue-duree
- **Énoncé :** Les étrangers en situation régulière doivent obtenir plus facilement un titre de séjour de longue durée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Supprimer l'autorisation de séjour pour tout étranger n'ayant pas travail- lé depuis un an en France. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 retirent le droit au séjour après un an sans travail, ce qui va dans le sens contraire d'un accès facilité au séjour de longue durée.

### P0810 · marine-le-pen · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer le Referendum d'Initiative Citoyenne et mettre en place la proportionnelle. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de mettre en place la proportionnelle.

### P0811 · marine-le-pen · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « afin d'empê- cher les juridictions supranationales de forcer la France à suivre des politiques contraires à la volon- té du peuple Français »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 veut empêcher par la Constitution les juridictions supranationales d'imposer leurs décisions en matière migratoire, sans nommer la CEDH, d'où 1.

### P0812 · marine-le-pen · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « afin d'empê- cher les juridictions supranationales de forcer la France à suivre des politiques contraires à la volon- té du peuple Français »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 veut soustraire la France, en matière migratoire, aux décisions de juridictions supranationales contraires à la volonté populaire, sans viser nommément le droit de l'Union, d'où 1.

### P0813 · marine-le-pen · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Cela suppose que la France se retire du commandement intégré de l'OTAN »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 propose explicitement le retrait du commandement intégré de l'OTAN ; aucune source de 2026 ne traite ce point.

### P0814 · marine-le-pen · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la création d'une Al- liance Européenne des Nations qui a vocation à se substituer progressivement à l'Union Européenne »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 vise une Alliance européenne des nations remplaçant progressivement l'Union ; selon un compte rendu de 2026, la sortie de l'Union n'est plus envisagée, d'où 1.

### P0815 · marine-le-pen · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Atteindre 85 000 places de prison en 2027. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 prévoient d'atteindre 85 000 places de prison, contraire explicite de l'arrêt des constructions.

### P0816 · marine-le-pen · justice-comparution-immediate-mineurs
- **Énoncé :** Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les mineurs délinquants doivent être sanctionnés sans délai »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 veut des sanctions sans délai pour les mineurs délinquants, sans mentionner la comparution immédiate.

### P0817 · marine-le-pen · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les aménagements de peine et alternatives à la pri- son (bracelets électroniques, travaux d'intérêt gé- néral) seront drastiquement limités »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 limite fortement les alternatives à la prison, tout en les maintenant pour certains condamnés, d'où -1.

### P0818 · marine-le-pen · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablir les peines planchers pour que tout criminel et délinquant aient une sanction. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de rétablir les peines planchers, au-delà des seuls récidivistes. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0819 · marine-le-pen · justice-perpetuite-reelle-etendue
- **Énoncé :** La réclusion à perpétuité sans possibilité de libération doit s'appliquer à davantage de crimes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Établir une perpétuité réelle. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent d'établir une perpétuité réelle sans préciser les crimes concernés.

### P0820 · marine-le-pen · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer toute possibilité de ré- duction et d'aménagements de peine, en particulier pour les violences contre les personnes. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 suppriment toute possibilité de réduction de peine, ce qui inclut les réductions automatiques.

### P0821 · marine-le-pen · justice-tig-delits-sans-violence
- **Énoncé :** Le travail d'intérêt général doit être préféré à la prison pour les délits commis sans violence.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les aménagements de peine et alternatives à la pri- son (bracelets électroniques, travaux d'intérêt gé- néral) seront drastiquement limités »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 limite fortement le travail d'intérêt général, qui reste réservé aux condamnés sans danger pour l'ordre public, d'où -1.

### P0822 · marine-le-pen · securite-hausse-effectifs-police
- **Énoncé :** Les effectifs de police et de gendarmerie doivent augmenter d'au moins 10 % sur le quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il faut augmenter les effectifs et les budgets des forces de l'ordre et de la justice »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit d'augmenter les effectifs des forces de l'ordre sans chiffrer la hausse.

### P0823 · marine-le-pen · securite-limiter-dissolution-associations
- **Énoncé :** Le pouvoir du gouvernement de dissoudre des associations par décret doit être limité.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « seront systématiquement dissoutes »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 prévoit la dissolution systématique de certaines associations islamistes, ce qui va dans le sens contraire d'une limitation de ce pouvoir sans l'aborder explicitement.

### P0824 · marine-le-pen · securite-presomption-legitime-defense
- **Énoncé :** Les policiers doivent bénéficier d'une présomption de légitime défense lorsqu'ils font usage de leur arme.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instituer une présomption de légi- time défense pour les forces de l'ordre. »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent une présomption de légitime défense pour les forces de l'ordre.

### P0825 · marine-le-pen · societe-gpa-interdite-v2
- **Énoncé :** La gestation pour autrui doit être interdite en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « la gestion pour autrui, GPA, dont l'interdiction pourra être renforcée »
- **Source :** M la France : mon programme présidentiel (mlafrance.fr, campagne 2022, PDF) — livre_plateforme, 2022-03-28 — https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf
- **Justification :** Le programme de 2022 maintient l'interdiction de la GPA et envisage de la renforcer, ce qui correspond à l'énoncé.

### P0826 · marine-le-pen · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « l'instauration d'un uniforme au primaire et au collège »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 instaurent l'uniforme au primaire et au collège, sans le lycée, d'où 1.

### P0827 · marine-le-pen · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renationaliser les autoroutes pour baisser de 15% les péages »
- **Source :** 22 mesures pour 2022 (mlafrance.fr, PDF) — livre_plateforme, 2022-02-08 — https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf
- **Justification :** Les 22 mesures de 2022 proposent de renationaliser les autoroutes, contraire explicite du maintien de leur exploitation en concession privée.

### P0828 · marine-le-pen · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Elle défend désormais un départ à 62 ans, avec des aménagements pour les personnes ayant commencé à travailler tôt. »
- **Source :** Entre défense du pouvoir d'achat et séduction des entreprises, Marine Le Pen entretient une ligne parfois difficile à concilier (franceinfo) — declaration_vote, 2026-07-08 — https://www.franceinfo.fr/replay-radio/le-decryptage-eco/entre-defense-du-pouvoir-d-achat-et-seduction-des-entreprises-marine-le-pen-entretient-une-ligne-parfois-difficile-a-concilier_8065598.html
- **Justification :** Selon ce compte rendu de 2026, la candidate défend un départ à 62 ans ; en 2022 elle proposait un départ à 60 ans pour les carrières commencées avant 20 ans.

### P0829 · marine-le-pen · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Elle défend désormais un départ à 62 ans, avec des aménagements pour les personnes ayant commencé à travailler tôt. »
- **Source :** Entre défense du pouvoir d'achat et séduction des entreprises, Marine Le Pen entretient une ligne parfois difficile à concilier (franceinfo) — declaration_vote, 2026-07-08 — https://www.franceinfo.fr/replay-radio/le-decryptage-eco/entre-defense-du-pouvoir-d-achat-et-seduction-des-entreprises-marine-le-pen-entretient-une-ligne-parfois-difficile-a-concilier_8065598.html
- **Justification :** Selon ce compte rendu de 2026, la candidate défend un départ à 62 ans, comme en 2022 où elle refusait tout allongement ; le même article note qu'elle ne tranche pas sur une nouvelle réforme.

## Marine Tondelier (Les Écologistes) — 170 positions

### P0830 · marine-tondelier · agriculture-alleger-normes-agricoles
- **Énoncé :** Les normes environnementales imposées aux agriculteurs français doivent être allégées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Adopter une véritable Loi d'Orientation Agricole et abroger la loi Duplomb. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose d'abroger la loi Duplomb, qui assouplissait des contraintes environnementales agricoles, sans prendre position en termes généraux sur l'ensemble des normes.

### P0831 · marine-tondelier · agriculture-autoriser-nouvelles-techniques-genomiques
- **Énoncé :** La culture de plantes issues des nouvelles techniques génomiques doit être autorisée en France.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Interdire les " nouveaux OGM " (Nouvelles Techniques Génomiques ou NGT). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose d'interdire les plantes issues des nouvelles techniques génomiques, soit le contraire explicite de l'énoncé.

### P0832 · marine-tondelier · agriculture-bio-restauration-collective-v2
- **Énoncé :** Les produits issus de l'agriculture biologique doivent représenter au moins 30 % des achats alimentaires de la restauration collective publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mobiliser la commande publique comme un levier de transformation en atteignant 100 % de bio dans la restauration collective d'ici 2040. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme vise 100 % de produits bio dans la restauration collective d'ici 2040, au-delà du seuil de 30 % des achats de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0833 · marine-tondelier · agriculture-chalut-aires-protegees
- **Énoncé :** La pêche au chalut de fond doit être interdite dans les aires marines protégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Accélérer l'interdiction du chalutage de fond dans les Aires Maritimes Protégées. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme demande l'interdiction du chalutage de fond dans les aires marines protégées.

### P0834 · marine-tondelier · agriculture-derogations-neonicotinoides
- **Énoncé :** Les agriculteurs doivent pouvoir obtenir des dérogations pour utiliser des insecticides néonicotinoïdes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Empêcher toute tentative de réintroduction des néonicotinoïdes. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme s'oppose à toute réintroduction des néonicotinoïdes, ce qui exclut les dérogations prévues par l'énoncé.

### P0835 · marine-tondelier · agriculture-encadrer-prix-terres
- **Énoncé :** Le prix de vente des terres agricoles doit être encadré par l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Encadrer systématiquement les prix de vente du foncier en rapport à la moyenne des prix sur la zone. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose d'encadrer systématiquement le prix de vente du foncier agricole, ce qui correspond à la mesure de l'énoncé.

### P0836 · marine-tondelier · agriculture-interdire-poules-cage
- **Énoncé :** L'élevage de poules pondeuses en cage doit être interdit.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les fermes usines et l'élevage en cage. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose d'interdire l'élevage en cage, ce qui inclut les poules pondeuses.

### P0837 · marine-tondelier · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Planifier une sortie progressive des pesticides de synthèse et des engrais azotés à l'horizon 2050. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit une sortie progressive des pesticides de synthèse d'ici 2050, ce qui va dans le sens de l'énoncé sans reprendre l'objectif d'une réduction de moitié en 2030.

### P0838 · marine-tondelier · agriculture-plafonner-aides-pac
- **Énoncé :** Les aides de la politique agricole commune versées à une même exploitation doivent être plafonnées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fonder les subventions sur le nombre d'actifs plutôt qu'à l'hectare avec un plafonnement plus strict des aides aux grandes exploitations. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme demande un plafonnement plus strict des aides de la PAC aux grandes exploitations.

### P0839 · marine-tondelier · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Assurer une transparence et un juste partage de la valeur ajoutée en adoptant des prix planchers »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose explicitement l'adoption de prix planchers pour les productions agricoles.

### P0840 · marine-tondelier · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Décréter un moratoire sur tous les projets de méga- bassines. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme demande un moratoire sur les méga-bassines et conditionne les autres retenues à une réduction des prélèvements, soit l'inverse d'une facilitation.

### P0841 · marine-tondelier · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fournir du matériel militaire, y compris de capacités de frappe à longue portée et des moyens de défense antiaérienne pour protéger le ciel ukrainien. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de fournir du matériel militaire à l'Ukraine, y compris des capacités de frappe à longue portée.

### P0842 · marine-tondelier · defense-cesser-ventes-armes-conflits
- **Énoncé :** La France doit cesser de vendre des armes aux États engagés dans un conflit armé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdire strictement les exportations d'armes vers des pays dont les interventions militaires violent le droit international humanitaire. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme interdit les ventes d'armes aux pays dont les interventions violent le droit humanitaire, version plus restreinte que l'arrêt pour tout État en conflit.

### P0843 · marine-tondelier · defense-controle-exportations-armes
- **Énoncé :** Les exportations d'armes françaises doivent être soumises à un contrôle parlementaire préalable.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en créant un Office de contrôle parlementaire doté de moyens propres et validant les exportations vers des pays tiers hors UE et OTAN »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée un office parlementaire validant les exportations d'armes, mais seulement vers les pays tiers hors UE et OTAN.

### P0844 · marine-tondelier · defense-defense-europeenne-emprunt
- **Énoncé :** Une défense européenne commune doit être financée par un emprunt de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'impôt et l'emprunt commun doivent être mobilisés. »
- **Source :** Carnet de doctrine international : face aux impérialismes, l'Europe comme puissance écologique (campagne de Marine Tondelier, PDF) — livre_plateforme, 2026-02 — https://marinetondelier.fr/s/CARNET-DE-DOCTRINE-INTERNATIONAL.pdf
- **Justification :** Le carnet international associe l'emprunt commun et l'impôt au financement de l'effort de défense européen, sans faire de l'emprunt l'unique mode de financement.

### P0845 · marine-tondelier · defense-dissuasion-protection-europe-v2
- **Énoncé :** La France doit étendre explicitement sa doctrine de dissuasion nucléaire à la protection de ses partenaires européens.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « envisager l'extension de la garantie de sécurité nucléaire française à d'autres pays européens dans une optique de non- prolifération »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose seulement d'envisager l'extension de la garantie nucléaire française aux autres pays européens, sans s'engager fermement à étendre la doctrine, d'où 1 plutôt que 2.

### P0846 · marine-tondelier · defense-priorite-depenses-sociales
- **Énoncé :** Les dépenses sociales doivent passer avant les dépenses militaires dans le budget de l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « On ne peut sacrifier l'hôpital public pour acheter des armes. »
- **Source :** Carnet de doctrine international : face aux impérialismes, l'Europe comme puissance écologique (campagne de Marine Tondelier, PDF) — livre_plateforme, 2026-02 — https://marinetondelier.fr/s/CARNET-DE-DOCTRINE-INTERNATIONAL.pdf
- **Justification :** Le carnet refuse que l'effort de défense se fasse au détriment de la protection sociale, sans établir de hiérarchie budgétaire générale.

### P0847 · marine-tondelier · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Si l'objectif d'un accroissement significatif des ressources dédiés à l'effort de défense est souhaitable, il ne peut se faire au détriment de la transition écologique et de la protection sociale. »
- **Source :** Carnet de doctrine international : face aux impérialismes, l'Europe comme puissance écologique (campagne de Marine Tondelier, PDF) — livre_plateforme, 2026-02 — https://marinetondelier.fr/s/CARNET-DE-DOCTRINE-INTERNATIONAL.pdf
- **Justification :** Le carnet juge souhaitable une hausse significative des moyens de défense, sous condition de préserver la protection sociale, ce qui s'oppose à une réduction.

### P0848 · marine-tondelier · defense-traite-interdiction-armes-nucleaires
- **Énoncé :** La France doit signer le traité sur l'interdiction des armes nucléaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rejoindre en parallèle le Traité sur l'Interdiction des Armes Nucléaires (TIAN) en tant que membre observateur, sans s'engager à un désarmement unilatéral. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de rejoindre le traité comme membre observateur, ce qui va dans le sens de l'énoncé sans aller jusqu'à sa signature.

### P0849 · marine-tondelier · defense-troupes-ukraine-cessez-le-feu-v2
- **Énoncé :** La France doit être prête à déployer des militaires en Ukraine dans le cadre d'un accord de cessez-le-feu.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Des garanties de sécurité durables doivent être mises en place, en travaillant à son intégration dans l'Union Européenne et en déployant des troupes européennes, à ses frontières ou sur son territoire, dans une posture dissuasive. »
- **Source :** Carnet de doctrine international : face aux impérialismes, l'Europe comme puissance écologique (campagne de Marine Tondelier, PDF) — livre_plateforme, 2026-02 — https://marinetondelier.fr/s/CARNET-DE-DOCTRINE-INTERNATIONAL.pdf
- **Justification :** Le carnet de doctrine prévoit le déploiement de troupes européennes en Ukraine ou à ses frontières comme garantie de sécurité dans le cadre d'une négociation, sans viser explicitement des militaires français ni un accord de cessez-le-feu, d'où 1 plutôt que 2.

### P0850 · marine-tondelier · democratie-budget-participatif-communes
- **Énoncé :** Chaque commune de plus de 10 000 habitants doit consacrer une part de son budget à des projets choisis par les habitants.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Développer des budgets participatifs sur le fonctionnement des collectivités territoriales. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut développer les budgets participatifs, sans les rendre obligatoires ni fixer de seuil de population.

### P0851 · marine-tondelier · democratie-conventions-citoyennes
- **Énoncé :** Des conventions citoyennes tirées au sort doivent être consultées avant les grandes réformes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mieux prendre en compte les citoyen·nes à travers une convention citoyenne permanente au sein d'un CESE transformé. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée une convention citoyenne permanente, sans préciser qu'elle soit consultée avant chaque grande réforme.

### P0852 · marine-tondelier · democratie-petition-debat-parlement
- **Énoncé :** Une pétition signée par un million de personnes doit obligatoirement être débattue en séance au Parlement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Améliorer le droit d'interpellation par voie de pétition en rendant obligatoire un vote à l'Assemblée Nationale si 500 000 signatures dans 30 départements sont collectées. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme rend obligatoire un vote à l'Assemblée à partir de 500 000 signatures, seuil plus bas que celui de l'énoncé.

### P0853 · marine-tondelier · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Renforcer la démocratie directe par la mise en œuvre du Référendum d'Initiative Citoyenne (RIC) propositionnel ou abrogatif »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** En instaurant un référendum d'initiative citoyenne, le programme s'écarte d'un usage exceptionnel du référendum, sans se prononcer sur sa fréquence.

### P0854 · marine-tondelier · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renforcer la démocratie directe par la mise en œuvre du Référendum d'Initiative Citoyenne (RIC) propositionnel ou abrogatif »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose la mise en œuvre du référendum d'initiative citoyenne.

### P0855 · marine-tondelier · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renforcer la démocratie directe par la mise en œuvre du Référendum d'Initiative Citoyenne (RIC) propositionnel ou abrogatif »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le référendum d'initiative citoyenne proposé permet aux citoyens de déclencher eux-mêmes un référendum, ce qui contredit une compétence réservée au président de la République ou au Parlement.

### P0856 · marine-tondelier · democratie-supprimer-cese
- **Énoncé :** Le Conseil économique, social et environnemental doit être supprimé.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Mieux prendre en compte les citoyen·nes à travers une convention citoyenne permanente au sein d'un CESE transformé. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit de transformer le CESE et non de le supprimer.

### P0857 · marine-tondelier · democratie-vote-16-ans
- **Énoncé :** Le droit de vote doit être accordé dès 16 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ouvrir le droit de vote à 16 ans avec une formation civique. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose explicitement le droit de vote à 16 ans.

### P0858 · marine-tondelier · democratie-vote-blanc-exprime
- **Énoncé :** Le vote blanc doit être pris en compte dans les suffrages exprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Reconnaître le vote blanc en attribuant le taux équivalent à des citoyen·nes tirés au sort sur les listes électorales pour les élections territoriales. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme reconnaît le vote blanc par un mécanisme de sièges tirés au sort aux élections territoriales, variante partielle de sa prise en compte dans les suffrages exprimés.

### P0859 · marine-tondelier · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Ne pas ratifier les accords européens en attente qui affectent le climat et la biodiversité notamment les traités avec le Canada (CETA) le Vietnam, Singapour, le Chili, le Mexique, le Mercosur, l'Indonésie et le Japon. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme refuse de ratifier les accords de libre-échange en attente, soit l'inverse de la conclusion de nouveaux accords.

### P0860 · marine-tondelier · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Prévoir des clauses de remboursement en cas de délocalisation. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme assortit les aides industrielles de clauses de remboursement en cas de délocalisation, version partielle d'un conditionnement au maintien de l'emploi.

### P0861 · marine-tondelier · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renforcer les outils juridiques comme le décret Montebourg permettant d'intervenir dans la reprise des entreprises. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut renforcer le décret Montebourg, outil de contrôle des investissements étrangers dans les entreprises françaises.

### P0862 · marine-tondelier · economie-eau-operateurs-publics
- **Énoncé :** La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rendre applicable le droit à l'eau potable en imposant aux collectivités territoriales l'adoption de régies publiques de l'eau »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme impose aux collectivités des régies publiques de l'eau, soit une distribution assurée uniquement par des opérateurs publics.

### P0863 · marine-tondelier · economie-encadrer-marges-distribution
- **Énoncé :** Les marges de la grande distribution doivent être encadrées par la loi.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Envisager différentes alternatives afin de concilier la préservation des entreprises françaises et européennes et la protection des conditions de vie de la population (prix unique, encadrement des marges, limitation des augmentations…). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme cite l'encadrement des marges parmi des options envisagées, sans l'arrêter comme mesure ferme.

### P0864 · marine-tondelier · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « En cas de nécessité, passer sous gestion publique exceptionnelle. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Pour les entreprises industrielles stratégiques, le programme prévoit un passage sous gestion publique en cas de nécessité, sans prise de participation systématique.

### P0865 · marine-tondelier · economie-plafonnement-loyers-zones-tendues
- **Énoncé :** Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Assurer le droit au logement par la généralisation, l'amélioration et la pérennisation de l'encadrement des loyers. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme généralise l'encadrement des loyers, au-delà des seules zones tendues et sans l'accord des élus locaux. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0866 · marine-tondelier · economie-plafonner-prix-alimentaires
- **Énoncé :** Les prix des produits alimentaires de première nécessité doivent être plafonnés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Envisager le blocage des prix sur certains produits alimentaires qui souffriraient d'une inflation anormale. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme envisage un blocage des prix alimentaires seulement en cas d'inflation anormale.

### P0867 · marine-tondelier · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Soutenir fiscalement et réglementairement ces entreprises de la fabrication des composants à la maintenance dans les secteurs stratégiques des parcs éoliens offshore et terrestre »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme soutient la filière de l'éolien terrestre et l'essor des renouvelables, sans formuler d'objectif explicite d'accélération des implantations.

### P0868 · marine-tondelier · energie-fonds-publics-renouvelables
- **Énoncé :** Les fonds publics consacrés à l'énergie doivent aller en priorité aux énergies renouvelables plutôt qu'au nucléaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Modifier les objectifs et les moyens financiers de la troisième Planification Pluriannuelle de l'Énergie (PPE3) pour que la part des ENR atteigne 44 % de la consommation finale brute d'électricité en 2030. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme réoriente les moyens de la PPE vers les renouvelables et met fin aux nouveaux programmes nucléaires, sans formuler de règle générale de priorité des fonds publics.

### P0869 · marine-tondelier · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin aux nouveaux programmes EPR-2 et SMR extrêmement dispendieux. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme met fin au programme EPR2 lui-même, ce qui exclut tout réacteur supplémentaire.

### P0870 · marine-tondelier · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin aux nouveaux programmes EPR-2 et SMR extrêmement dispendieux. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme met fin aux programmes de petits réacteurs modulaires (SMR).

### P0871 · marine-tondelier · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** 0 (position intermédiaire explicite)
- **Citation :** « Conduire les études pour évaluer les possibilités de prolongation de certaines d'entre elles sous condition stricte de sûreté afin d'éviter l'effet falaise »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme planifie l'arrêt du parc mais envisage la prolongation de certains réacteurs sous condition de sûreté, position intermédiaire.

### P0872 · marine-tondelier · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Planifier l'arrêt progressif du parc constitué de centrales vieillissantes dont la mise hors service doit être étalée sur une vingtaine d'années. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme planifie la sortie progressive du nucléaire, ce qui implique une réduction progressive de sa part.

### P0873 · marine-tondelier · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Proposer un prêt à taux zéro de la Caisse des Dépôts et Consignations pour les nouveaux projets individuels et collectifs à hauteur de 60 % des devis. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme ajoute des soutiens publics aux projets renouvelables, soit l'inverse d'une suppression des aides.

### P0874 · marine-tondelier · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Structurer et amplifier les filières françaises et européennes de production d'énergies renouvelables. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut amplifier les filières renouvelables dont l'éolien, ce qui s'oppose à une suspension, tout en excluant les parcs des zones protégées.

### P0875 · marine-tondelier · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renforcer la trajectoire de la Zéro Artificialisation Nette (ZAN) pour préserver les sols »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de renforcer la trajectoire ZAN, soit le contraire d'un assouplissement.

### P0876 · marine-tondelier · environnement-calendrier-logements-mal-isoles
- **Énoncé :** L'interdiction de louer les logements les moins bien isolés doit être appliquée selon le calendrier prévu.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Maintenir l'interdiction de la remise en location des logements classés F en 2028 et E en 2034 »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme maintient le calendrier d'interdiction de location des logements classés F et E.

### P0877 · marine-tondelier · environnement-chasse-dimanche
- **Énoncé :** La chasse doit rester autorisée le dimanche.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Adopter une journée sans chasse un jour par semaine et pendant des jours fériés et les vacances scolaires pour mieux partager l'accès à la nature. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme instaure une journée hebdomadaire sans chasse sans préciser qu'il s'agit du dimanche.

### P0878 · marine-tondelier · environnement-ecocide-crime
- **Énoncé :** L'écocide doit être reconnu comme un crime dans le Code pénal.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Intégrer le crime d'écocide à son corpus pour juger les responsables des atteintes les plus graves »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme reconnaît le crime d'écocide au niveau d'une cour pénale internationale de l'environnement, et non dans le Code pénal français.

### P0879 · marine-tondelier · environnement-exploitation-hydrocarbures
- **Énoncé :** L'exploitation de nouveaux gisements d'hydrocarbures doit être autorisée sur le territoire français.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Soutenir la négociation d'un Traité de non-prolifération des énergies fossiles qui empêche l'expansion des exploitations »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme soutient un traité international empêchant l'expansion des exploitations fossiles, ce qui s'oppose à de nouveaux gisements sans viser explicitement le territoire français.

### P0880 · marine-tondelier · environnement-fin-thermique-2035
- **Énoncé :** La vente de voitures neuves à moteur thermique doit être interdite dès 2035.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Maintenir l'objectif de 100 % de véhicules zéro émission en 2035 pour les ventes de véhicules neufs. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme maintient l'objectif de ventes de véhicules neufs 100 % zéro émission en 2035.

### P0881 · marine-tondelier · environnement-interdire-vols-interieurs
- **Énoncé :** Les vols intérieurs doivent être interdits lorsqu'une alternative en train de moins de quatre heures existe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdire les vols intra-européens lorsqu'une alternative de moins de 4h30 en train existe. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme interdit les vols intra-européens dès qu'une alternative en train de moins de 4h30 existe, ce qui couvre et dépasse la mesure de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0882 · marine-tondelier · environnement-limiter-recours-projets-v2
- **Énoncé :** Les possibilités de recours juridictionnel contre les autorisations de projets industriels doivent être limitées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Redéployer des mécanismes de participa- tion du public (effet suspensif des référés, recours à la double juridiction…). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut rétablir l'effet suspensif des référés et le double degré de juridiction en matière environnementale, ce qui va à l'encontre d'une limitation des recours sans viser spécifiquement les autorisations de projets industriels, d'où -1.

### P0883 · marine-tondelier · environnement-pause-normes-europeennes
- **Énoncé :** L'Union européenne doit suspendre l'adoption de nouvelles normes environnementales pendant plusieurs années.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « S'opposer à la dérégulation en cours au niveau européen, contenue dans les dispositifs dits " Omnibus ". »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme s'oppose aux textes européens de dérégulation environnementale, ce qui va contre une pause des normes sans viser exactement cette mesure.

### P0884 · marine-tondelier · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Sortir du plastique à usage unique en 2040 avec une trajectoire de réduction de la production et de la consommation. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit la sortie du plastique à usage unique en 2040, dix ans après l'échéance de l'énoncé.

### P0885 · marine-tondelier · environnement-publicite-vehicules-emetteurs
- **Énoncé :** La publicité pour les véhicules les plus émetteurs de CO2 doit être interdite.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire la publicité toxique pour les produits fossiles (aviation, voitures thermiques…) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme interdit la publicité pour les voitures thermiques, ce qui couvre les véhicules les plus émetteurs.

### P0886 · marine-tondelier · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Améliorer la qualité de l'air en modifiant les conditions des ZFE (Zones à Faibles Émissions). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de modifier les conditions des ZFE plutôt que de les supprimer.

### P0887 · marine-tondelier · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Étendre le périmètre et accélérer la mise en œuvre du Mécanisme d'ajustement carbone aux frontières (MACF). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut étendre et accélérer le mécanisme d'ajustement carbone aux frontières, qui taxe les émissions des importations.

### P0888 · marine-tondelier · environnement-taxer-kerosene-vols-interieurs
- **Énoncé :** Le kérosène des vols intérieurs doit être taxé comme les autres carburants.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Diminuer les niches fiscales fossiles en transformant les taux réduits sur les produits fossiles en aides forfaitaires (biocarburants, kérosène sur les vols intérieurs…). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme supprime le taux réduit sur le kérosène des vols intérieurs en le transformant en aide forfaitaire, sans affirmer un alignement complet sur les autres carburants.

### P0889 · marine-tondelier · environnement-trajectoire-emissions-entreprises
- **Énoncé :** Les grandes entreprises doivent être tenues de réduire leurs émissions selon une trajectoire fixée par la loi.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Subordonner les aides aux entreprises de plus de 250 salarié·es au respect de plans de transition. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme conditionne les aides aux grandes entreprises à des plans de transition, sans fixer de trajectoire d'émissions par la loi.

### P0890 · marine-tondelier · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « C'est pourquoi nous proposons une stratégie alternative visant une croissance des recettes fiscales permettant de financer un haut niveau de services publics et les investissements nécessaires à la transition écologique. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme vise une croissance des recettes fiscales, ce qui s'oppose à une baisse des prélèvements, sans objectif chiffré en part de PIB.

### P0891 · marine-tondelier · fiscalite-capital-aligne-travail
- **Énoncé :** Le taux d'imposition des revenus du capital doit être aligné sur celui des revenus du travail.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Taxer plus fortement le capital que le travail. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut taxer le capital plus fortement que le travail, ce qui va au-delà d'un simple alignement. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0892 · marine-tondelier · fiscalite-csg-progressive-v2
- **Énoncé :** Le taux de la contribution sociale généralisée (CSG) doit augmenter avec le revenu.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer le déficit de l'assurance-maladie sans pénaliser ni les soignant·es ni les malades en rendant progressive la Contribution Sociale Généralisée (CSG) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de rendre la CSG progressive, c'est-à-dire un taux qui augmente avec le revenu, soit exactement l'énoncé.

### P0893 · marine-tondelier · fiscalite-exit-tax-conservation-15-ans
- **Énoncé :** Quand une personne quitte la France avec plus de 800 000 € d'actions, l'impôt sur ses plus-values déjà acquises au départ ne doit être effacé que si elle les garde 15 ans, contre 2 ou 5 aujourd'hui.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Étendre les conditions de l'exit tax afin de maintenir une contribution fiscale des émigrés fiscaux établissant leur domicile fiscal hors de France. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut durcir l'exit tax sans préciser la durée de conservation de 15 ans, d'où 1 plutôt que 2.

### P0894 · marine-tondelier · fiscalite-hausse-taxe-transactions-financieres
- **Énoncé :** Le taux de la taxe sur les transactions financières doit être relevé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Augmenter la taxe sur les transactions financières à 0,7 %. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme relève le taux de la taxe sur les transactions financières.

### P0895 · marine-tondelier · fiscalite-heures-sup-sans-plafond
- **Énoncé :** Les heures supplémentaires doivent être exonérées d'impôt sur le revenu sans plafond.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Supprimer les exonérations de cotisations inutiles car supérieures à 1,6 smic ou concernant les heures supplémentaires. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme supprime les exonérations de cotisations sur les heures supplémentaires, ce qui va contre leur défiscalisation, sans viser l'impôt sur le revenu.

### P0896 · marine-tondelier · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablir l'Impôt sur la Fortune (ISF) en lui ajoutant une composante climatique pour orienter le patrimoine vers des actifs verts. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de rétablir l'ISF.

### P0897 · marine-tondelier · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mettre en place une taxe Zucman de 2 % au-delà de 100 millions d'euros de patrimoine. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme reprend exactement le prélèvement minimal de 2 % sur les patrimoines de plus de 100 millions d'euros.

### P0898 · marine-tondelier · fiscalite-reduire-allegements-cotisations
- **Énoncé :** Les allègements de cotisations sociales accordés aux employeurs sur les salaires doivent être réduits.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer les exonérations de cotisations inutiles car supérieures à 1,6 smic ou concernant les heures supplémentaires. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme supprime les exonérations de cotisations au-delà de 1,6 smic et sur les heures supplémentaires, ce qui réduit explicitement les allègements accordés aux employeurs. Version partielle (au-delà d'un seuil de salaire) : 1, harmonisé entre candidats.

### P0899 · marine-tondelier · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Plafonner le montant total des niches fiscales par foyer. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme plafonne les niches fiscales par foyer, sans objectif de réduction de moitié de leur montant total.

### P0900 · marine-tondelier · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Mettre en place un barème de taxation progressif unique en ajoutant deux tranches pour les ménages faisant partie du 1 % le plus riche au-delà de 4 millions d'euros »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme alourdit les droits de succession sur les plus grosses transmissions, sans se prononcer sur les transmissions familiales courantes.

### P0901 · marine-tondelier · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Adopter une taxe exceptionnelle sur les superprofits de l'industrie pétrogazière et du commerce maritime. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme taxe les superprofits de deux secteurs seulement, version partielle de l'énoncé.

### P0902 · marine-tondelier · fiscalite-tranche-hauts-revenus
- **Énoncé :** Les plus hauts revenus doivent être soumis à une tranche d'impôt supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer une nouvelle tranche à 60 % au-delà de 250 000€ annuels. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée une tranche supplémentaire d'impôt sur le revenu pour les plus hauts revenus.

### P0903 · marine-tondelier · immigration-ame-soins-urgents
- **Énoncé :** L'aide médicale d'État doit être limitée aux soins urgents.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Garantir les droits fondamentaux des personnes exilées : scolarisation de tous les enfants, accès à l'AME et PUMA, suppression des délais de carence »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme garantit l'accès à l'AME et supprime les délais de carence, à l'opposé d'une limitation aux soins urgents.

### P0904 · marine-tondelier · immigration-asile-droit-travail
- **Énoncé :** Les demandeurs d'asile doivent être autorisés à travailler dès le dépôt de leur demande.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Automatiser le droit au travail dès la délivrance de l'attestation de demande d'asile sans délai et sans autorisation de travail. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme ouvre le droit au travail des demandeurs d'asile dès le dépôt de leur demande.

### P0905 · marine-tondelier · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Toutes les demandes d'asile déposées en Europe doivent faire l'objet d'un examen en Europe. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme exige que les demandes d'asile déposées en Europe y soient examinées, soit le contraire explicite d'un examen hors du territoire de l'Union.

### P0906 · marine-tondelier · immigration-reduire-duree-naturalisation
- **Énoncé :** La durée de résidence exigée pour demander la naturalisation doit être réduite.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faciliter l'obtention de la nationalité française. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut faciliter l'accès à la nationalité sans préciser une réduction de la durée de résidence exigée.

### P0907 · marine-tondelier · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Rendre effectif le droit au regroupement familial par une révision des conditions d'octroi des titres de séjour en adoptant un renouvellement automatique et pluriannuel »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut faciliter le regroupement familial, ce qui s'oppose à un durcissement, sans viser explicitement les conditions de ressources.

### P0908 · marine-tondelier · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régulariser les travailleur·ses, les étudiant·es et les parents d'enfants scolarisés sur la base de critères objectifs (durée de résidence, effectivité du lien familial, durée ou promesse d'activité professionnelle). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme retient la durée de résidence comme critère de régularisation, sans fixer le seuil de cinq ans ni l'appliquer à toute personne sans titre.

### P0909 · marine-tondelier · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Régulariser les travailleur·ses, les étudiant·es et les parents d'enfants scolarisés sur la base de critères objectifs (durée de résidence, effectivité du lien familial, durée ou promesse d'activité professionnelle). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit la régularisation des travailleurs sans titre, y compris ceux des métiers en tension.

### P0910 · marine-tondelier · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Garantir l'application du droit du sol pour les enfants nés en France indépendamment de la situation des parents. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme garantit le droit du sol, soit le contraire de sa suppression.

### P0911 · marine-tondelier · immigration-titre-sejour-longue-duree
- **Énoncé :** Les étrangers en situation régulière doivent obtenir plus facilement un titre de séjour de longue durée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Adopter une présomption d'accord pour le renouvellement des cartes de séjour de longue durée et des titres étudiants pour faciliter le maintien au travail et aux études. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme facilite le renouvellement des titres de longue durée et les 21 priorités demandent des titres pluriannuels automatiquement renouvelables, sans viser explicitement leur première obtention.

### P0912 · marine-tondelier · immigration-voies-legales-travail-ue
- **Énoncé :** L'Union européenne doit ouvrir davantage de voies d'immigration légale pour le travail.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Créer des voies légales et sécurisées d'immigration par une révision du Pacte européen sur la migration et l'asile. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme demande des voies légales d'immigration au niveau européen, sans les cibler spécifiquement sur le travail.

### P0913 · marine-tondelier · immigration-vote-local-etrangers-v2
- **Énoncé :** Les étrangers non ressortissants de l'Union européenne résidant en France depuis plusieurs années doivent pouvoir voter aux élections locales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Étendre le droit de vote aux étranger·es extra-communautaires pour les élections locales (municipales, intercommunales, départementales et régionales) après cinq années de résidence en France. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme accorde le droit de vote aux élections locales aux étrangers non ressortissants de l'Union après cinq ans de résidence, soit exactement l'énoncé.

### P0914 · marine-tondelier · institutions-adaptation-lois-regions
- **Énoncé :** Les régions doivent obtenir un pouvoir d'adaptation des lois à leur territoire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Défendre une transformation de notre République pour qu'elle soit fondée sur le principe du fédéralisme différencié. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme défend un fédéralisme différencié et un pouvoir réglementaire local, sans mentionner explicitement l'adaptation des lois par les régions.

### P0915 · marine-tondelier · institutions-autonomie-fiscale-collectivites
- **Énoncé :** Les collectivités locales doivent disposer d'une plus grande autonomie fiscale.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Faire de la France une République fortement décentralisée en confiant un pouvoir réglementaire et des leviers fiscaux autonomes aux collectivités territoriales. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme confie des leviers fiscaux autonomes aux collectivités.

### P0916 · marine-tondelier · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Revenir sur le mouvement de recentralisation en cours. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme demande d'inverser la recentralisation en cours et d'élargir les compétences des collectivités, soit le contraire explicite d'un transfert de compétences vers l'État.

### P0917 · marine-tondelier · institutions-investiture-premier-ministre
- **Énoncé :** Le Premier ministre doit obtenir un vote de confiance de l'Assemblée nationale après sa nomination.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Organiser une audition préalable des ministres par les deux chambres du Parlement. La composition finale est confirmée par un vote. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme soumet la composition du gouvernement à un vote du Parlement, variante proche d'un vote de confiance au Premier ministre après sa nomination.

### P0918 · marine-tondelier · institutions-maintenir-article-40
- **Énoncé :** Les députés et sénateurs doivent rester empêchés de proposer une mesure qui crée ou augmente une charge pour les finances publiques.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Renforcer le pouvoir d'initiative et le droit d'amendement en assouplissant les règles de la recevabilité financière (actuel article 40). »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme assouplit les règles de l'article 40 sans les supprimer, ce qui s'écarte partiellement du maintien de l'interdiction, d'où -1.

### P0919 · marine-tondelier · institutions-mandat-presidentiel-sept-ans
- **Énoncé :** Le mandat présidentiel doit être porté à sept ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Etablir un septennat unique. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose un mandat présidentiel unique de sept ans.

### P0920 · marine-tondelier · institutions-ordre-du-jour-parlement
- **Énoncé :** Le Parlement doit fixer seul son ordre du jour, sans priorité accordée au gouvernement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Définir de manière autonome son ordre du jour. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit que le Parlement fixe de manière autonome son ordre du jour.

### P0921 · marine-tondelier · institutions-pouvoirs-commissions-enquete
- **Énoncé :** Les commissions d'enquête parlementaires doivent disposer de pouvoirs d'investigation élargis.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mieux contrôler le gouvernement par le renforcement des commissions parlementaires permanentes et d'enquête. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme renforce les commissions d'enquête sans détailler un élargissement de leurs pouvoirs d'investigation.

### P0922 · marine-tondelier · institutions-pouvoirs-prefet-renforces
- **Énoncé :** Le préfet doit disposer de pouvoirs renforcés sur les collectivités locales.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les préfets doivent faire appliquer la loi plutôt que d'intervenir directement sur certains projets locaux ou d'infrastructures au détriment des maires. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut limiter l'intervention des préfets dans les projets locaux, ce qui s'oppose à un renforcement de leurs pouvoirs.

### P0923 · marine-tondelier · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer la proportionnelle intégrale sans prime majoritaire aux élections législatives »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose l'élection des députés à la proportionnelle intégrale.

### P0924 · marine-tondelier · institutions-supprimer-49-3
- **Énoncé :** Le recours à l'article 49.3 de la Constitution doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Assurer que le Parlement dispose d'un meilleur contrôle de son ordre du jour et ne soit plus limité par les actuels articles 34 ou par l'article 49-3. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut que le Parlement ne soit plus contraint par l'article 49-3, ce qui revient à en supprimer l'usage.

### P0925 · marine-tondelier · institutions-supprimer-senat
- **Énoncé :** Le Sénat doit être supprimé.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Démocratiser le Sénat pour qu'il représente mieux les territoires sur une base régionale. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme maintient un Parlement bicaméral et réforme le Sénat au lieu de le supprimer.

### P0926 · marine-tondelier · international-adhesion-ukraine-ue
- **Énoncé :** L'Ukraine doit pouvoir adhérer à l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Soutenir l'adhésion graduelle à l'Union Européenne en particulier pour l'Islande, les Etats des Balkans occidentaux, la Moldavie et l'Ukraine. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme soutient l'adhésion de l'Ukraine à l'Union européenne.

### P0927 · marine-tondelier · international-aide-developpement-0-7
- **Énoncé :** L'aide publique au développement doit atteindre 0,7 % du revenu national brut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Retrouver une trajectoire correspondant à nos engagements internationaux (0,7 % du PNB) et améliorer la coordination européenne. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme reprend l'objectif de 0,7 % du revenu national pour l'aide au développement.

### P0928 · marine-tondelier · international-emprunt-commun-ue
- **Énoncé :** L'Union européenne doit pouvoir emprunter en commun pour financer des investissements.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer un emprunt commun pour des investissements de long terme »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose un emprunt commun européen pour financer des investissements.

### P0929 · marine-tondelier · international-impots-propres-ue
- **Énoncé :** L'Union européenne doit disposer de nouveaux impôts qui lui sont propres.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Augmenter les ressources fiscales propres dédiées au budget communautaire via un renforcement du mécanisme d'ajustement carbone aux frontières (MACF), une taxation des grandes entreprises technologiques »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme dote l'Union de nouvelles ressources fiscales propres.

### P0930 · marine-tondelier · international-initiative-parlement-europeen
- **Énoncé :** Le Parlement européen doit obtenir le droit d'initiative législative.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer un droit d'initiative parlementaire. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de donner au Parlement européen un droit d'initiative.

### P0931 · marine-tondelier · international-listes-transnationales
- **Énoncé :** Une partie des députés européens doit être élue sur des listes transnationales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Élire le Parlement européen sur la base de listes transnationales. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose l'élection du Parlement européen sur listes transnationales.

### P0932 · marine-tondelier · international-majorite-qualifiee-ue
- **Énoncé :** La France doit accepter que davantage de décisions soient prises à la majorité qualifiée au sein de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Remplacer les droits de veto nationaux par une majorité qualifiée en matière de protection des droits fondamentaux, de protection sociale et d'intégration fiscale européenne et la politique étrangère et de sécurité commune. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme étend la majorité qualifiée à plusieurs domaines aujourd'hui soumis à l'unanimité.

### P0933 · marine-tondelier · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous ne pouvons pas nous priver de l'Alliance atlantique à court terme, mais elle n'est plus acquise dans sa forme historique. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme refuse de se priver de l'Alliance atlantique à court terme tout en visant un pilier européen autonome, sans se prononcer explicitement sur le commandement intégré.

### P0934 · marine-tondelier · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Partager plus de domaines de compétence entre les Etats et l'Union Européenne. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut un saut fédéral et davantage de compétences partagées avec l'Union, soit l'inverse d'un retour des compétences aux États.

### P0935 · marine-tondelier · international-renforcer-sanctions-russie
- **Énoncé :** L'Union européenne doit renforcer ses sanctions contre la Russie.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Soutenir économiquement l'Ukraine en arrêtant immédiatement toute importation de gaz, d'uranium et d'engrais russe et biélorusse. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme arrête toutes les importations de gaz, d'uranium et d'engrais russes et vise les contournements des sanctions, ce qui renforce les sanctions.

### P0936 · marine-tondelier · justice-accompagnement-emploi-detenus
- **Énoncé :** Les détenus doivent bénéficier d'un accompagnement vers l'emploi pendant toute leur détention.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Développer l'accompagnement des personnes pendant leur détention et après leur libération. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme développe l'accompagnement et le travail en détention, sans préciser un accompagnement vers l'emploi sur toute la détention.

### P0937 · marine-tondelier · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Adopter un moratoire sur la construction de nouvelles places de prison en dehors de celles destinées à remplacer les prisons insalubres. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose un moratoire sur les nouvelles places de prison.

### P0938 · marine-tondelier · justice-comparution-immediate-mineurs
- **Énoncé :** Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Limiter au maximum les procédures de jugement rapide et de comparutions immédiates notamment pour les mineurs. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut limiter au maximum les comparutions immédiates des mineurs, à l'opposé de l'énoncé.

### P0939 · marine-tondelier · justice-imprescriptibilite-crimes-sexuels-mineurs
- **Énoncé :** Les crimes sexuels commis sur des mineurs doivent être imprescriptibles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Inscrire dans la loi l'imprescriptibilité des crimes sur les mineurs. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme rend imprescriptibles les crimes commis sur les mineurs, ce qui inclut les crimes sexuels.

### P0940 · marine-tondelier · justice-juridictions-mineurs-specialisees-v2
- **Énoncé :** Les mineurs doivent être jugés par des juridictions distinctes de celles des majeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Conserver la double compétence civile et pénale du Juge des Enfants et des services de la Protection Judiciaire de la Jeunesse. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme conserve la compétence pénale du juge des enfants, donc une juridiction distincte de celle des majeurs pour juger les mineurs.

### P0941 · marine-tondelier · justice-justice-restaurative-systematique
- **Énoncé :** La justice restaurative doit être proposée systématiquement aux victimes et aux auteurs d'infractions.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Développer le recours aux mécanismes de justice restaurative en s'assurant de la protection des victimes. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme développe la justice restaurative sans la rendre systématique.

### P0942 · marine-tondelier · justice-majorite-penale-16-ans
- **Énoncé :** La majorité pénale doit être abaissée à 16 ans.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Porter l'âge de la responsabilité pénale à 14 ans, sans dérogation possible et en préservant l'excuse de minorité ainsi que le principe constitutionnel d'une justice adaptée aux enfants. »
- **Source :** Livret thématique : pour un pays à hauteur d'enfants (campagne de Marine Tondelier, PDF) — livre_plateforme, 2026-09 — https://marinetondelier.fr/s/livret-enfance-vf.pdf
- **Justification :** Le livret enfance préserve l'excuse de minorité et une justice adaptée aux mineurs, ce qui s'oppose à un abaissement de la majorité pénale sans le viser explicitement.

### P0943 · marine-tondelier · justice-plafonner-detenus-places
- **Énoncé :** Le nombre de détenus doit être plafonné au nombre de places de prison disponibles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Limiter la surpopulation carcérale par un numerus clausus »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme instaure un numerus clausus limitant les détenus aux places disponibles.

### P0944 · marine-tondelier · justice-tig-delits-sans-violence
- **Énoncé :** Le travail d'intérêt général doit être préféré à la prison pour les délits commis sans violence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Renforcer la possibilité d'effecteur des Travaux d'Intérêts Généraux en multipliant les partenariats avec les entreprises, les administrations et les associations. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme développe le travail d'intérêt général sans le préférer explicitement à la prison pour les délits non violents.

### P0945 · marine-tondelier · justice-visites-familiales-prisons
- **Énoncé :** Toutes les prisons doivent permettre des visites familiales prolongées sans surveillance directe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Appliquer de façon effective la loi pénitentiaire par la mise en place d'unités de vie familiale dans l'ensemble des établissements. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme généralise les unités de vie familiale à toutes les prisons.

### P0946 · marine-tondelier · numerique-alleger-moderation
- **Énoncé :** Les obligations de modération imposées aux réseaux sociaux doivent être allégées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Contraindre les plateformes et les réseaux sociaux à vraiment réguler et modérer les contenus négationnistes et racistes. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme renforce les obligations de modération des plateformes.

### P0947 · marine-tondelier · numerique-assouplir-consentement-traceurs
- **Énoncé :** Les règles de consentement aux traceurs publicitaires sur internet doivent être assouplies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Élargir le champ des données personnelles interdites au partage, à la revente et au ciblage publicitaire basé sur la surveillance comportementale. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme restreint le ciblage publicitaire, ce qui s'oppose à un assouplissement sans viser les règles de consentement.

### P0948 · marine-tondelier · numerique-assouplir-regles-ia
- **Énoncé :** Les règles européennes encadrant l'intelligence artificielle doivent être assouplies.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Améliorer la régulation des systèmes à haut risque et des modèles de grande taille »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose une nouvelle législation européenne renforçant la régulation de l'IA, soit le contraire d'un assouplissement.

### P0949 · marine-tondelier · numerique-donnees-sante-hebergeurs-europeens
- **Énoncé :** Les données de santé des Français doivent être hébergées exclusivement par des entreprises européennes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Appliquer l'hébergement des données sensibles sur des data centers situés en France détenus et gérés par des acteurs européens. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme impose un hébergement européen pour les données sensibles, catégorie plus large où les données de santé ne sont pas nommées.

### P0950 · marine-tondelier · numerique-faciliter-centres-donnees
- **Énoncé :** L'implantation de centres de données doit bénéficier de procédures administratives accélérées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Supprimer la possibilité de labelliser des data centers " projet d'intérêt national majeur " (PINM) les exonérant d'études d'impact. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme supprime le régime d'exception des centres de données et encadre leur implantation, à l'inverse d'une accélération.

### P0951 · marine-tondelier · numerique-ia-remuneration-auteurs
- **Énoncé :** Les entreprises d'intelligence artificielle doivent rémunérer les auteurs dont les œuvres servent à entraîner leurs modèles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rémunérer les œuvres protégées par le droit d'auteur qui ont été utilisées pour constituer les bases d'entraînement des IA. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme impose la rémunération des œuvres utilisées pour entraîner les IA.

### P0952 · marine-tondelier · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Généraliser l'usage des logiciels libres et open source dans les administrations publiques »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme généralise les logiciels libres dans les administrations.

### P0953 · marine-tondelier · numerique-responsabilite-plateformes-limitee-v2
- **Énoncé :** La responsabilité juridique des plateformes pour les contenus publiés par leurs utilisateurs doit être limitée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Étendre le statut d'éditeur à toutes les grandes plateformes pour les rendre responsables de l'ensemble du contenu qu'elles produisent. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut appliquer le statut d'éditeur aux grandes plateformes pour les rendre responsables de l'ensemble des contenus, soit le contraire d'une responsabilité limitée.

### P0954 · marine-tondelier · numerique-taxe-plateformes
- **Énoncé :** Les grandes plateformes numériques doivent payer un impôt sur le chiffre d'affaires réalisé en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Relever la taxe sur les services numériques (TSN) de 3 à 5 % »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme relève la taxe sur le chiffre d'affaires numérique des grandes plateformes.

### P0955 · marine-tondelier · sante-centres-sante-publics
- **Énoncé :** Chaque département doit disposer de centres de santé publics employant des médecins salariés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Créer 2 000 nouveaux centres de santé d'ici 2030, notamment dans les zones rurales et les quartiers prioritaires. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée 2 000 centres de santé sans préciser qu'ils soient publics ni répartis dans chaque département.

### P0956 · marine-tondelier · sante-depassements-honoraires-libres
- **Énoncé :** Les médecins doivent rester libres de pratiquer des dépassements d'honoraires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Encadrer les dépassements d'honoraires chez les spécialistes en limitant les dépassements d'honoraires à 50 % du tarif de la Sécurité Sociale »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme plafonne les dépassements d'honoraires, à l'opposé de leur liberté.

### P0957 · marine-tondelier · sante-hausse-franchises-medicales
- **Énoncé :** Les franchises médicales payées par les patients doivent être augmentées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Supprimer les franchises. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme supprime les franchises médicales.

### P0958 · marine-tondelier · sante-mutuelles-part-accrue-v2
- **Énoncé :** Les complémentaires santé doivent prendre en charge une part plus importante des dépenses actuellement remboursées par l'Assurance maladie.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Concentrer la couverture par les mutuelles aux seuls soins optionnels. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme cantonne les complémentaires santé aux seuls soins optionnels, à l'opposé d'un transfert vers elles de dépenses remboursées par l'Assurance maladie.

### P0959 · marine-tondelier · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Développer le pôle public du médicament en élargissant la production de l'établissement pharmaceutique de l'Agence générale des équipements et produits de santé (Ageps) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme confie à un établissement public la production des médicaments majeurs en rupture d'approvisionnement.

### P0960 · marine-tondelier · sante-regulation-installation-medecins
- **Énoncé :** L'installation des médecins doit être régulée dans les zones déjà bien dotées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réguler l'installation des médecins libéraux par une autorisation d'installation des médecins délivrée par l'Agence Régionale de Santé »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme soumet l'installation des médecins à autorisation hors zones sous-dotées.

### P0961 · marine-tondelier · sante-taxer-boissons-sucrees
- **Énoncé :** La taxe sur les boissons sucrées doit être augmentée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Augmenter d'un centime la taxe sur les boissons avec sucre ajouté pour l'affecter à la lutte contre la malnutrition infantile. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme augmente la taxe sur les boissons sucrées.

### P0962 · marine-tondelier · securite-enquetes-policiers-independantes
- **Énoncé :** Les enquêtes visant des policiers doivent être confiées à un organisme indépendant du ministère de l'Intérieur.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Remplacer l'Inspection Générale de la Police Nationale (IGPN) et l'Inspection Générale de la Gendarmerie Nationale (IGGN) par un nouvel organisme indépendant rattaché à la Défenseure des droits. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme confie les enquêtes sur les forces de l'ordre à un organisme indépendant du ministère de l'Intérieur.

### P0963 · marine-tondelier · securite-interdire-lbd-manifestations
- **Énoncé :** L'usage des lanceurs de balles de défense doit être interdit lors des manifestations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les lanceurs de balles de défense (LBD40) et les grenades mutilantes. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme interdit les lanceurs de balles de défense.

### P0964 · marine-tondelier · securite-limiter-dissolution-associations
- **Énoncé :** Le pouvoir du gouvernement de dissoudre des associations par décret doit être limité.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les mesures de surveillance en dehors d'un suivi judiciaire, ou encore la dissolution d'associations visant la défense de l'environnement »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme veut abroger la dissolution administrative des associations environnementales, version partielle d'une limitation générale de ce pouvoir.

### P0965 · marine-tondelier · securite-recepisse-controles-identite
- **Énoncé :** Les contrôles d'identité doivent donner lieu à la remise d'un récépissé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer un récépissé attestant des motifs du contrôle. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme instaure un récépissé lors des contrôles d'identité.

### P0966 · marine-tondelier · securite-reconnaissance-faciale-police
- **Énoncé :** La reconnaissance faciale en temps réel doit être autorisée dans l'espace public pour la police.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Encadrer la vidéosurveillance et renforcer la présence humaine. Interdire la reconnaissance faciale »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme interdit la reconnaissance faciale.

### P0967 · marine-tondelier · securite-restreindre-tirs-refus-obtemperer
- **Énoncé :** Les règles d'usage des armes à feu par les policiers lors des refus d'obtempérer doivent être restreintes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abroger les dispositions de la loi Cazeneuve sur l'ouverture du feu pour que cessent les morts pour refus d'obtempérer »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme abroge les règles de 2017 sur l'ouverture du feu pour restreindre les tirs lors des refus d'obtempérer.

### P0968 · marine-tondelier · securite-surveillance-antiterroriste-prolongee
- **Énoncé :** Les mesures individuelles de surveillance antiterroriste doivent pouvoir durer plus d'un an.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Abroger les perquisitions administratives, les restrictions administratives à la liberté d'aller et venir, les mesures de surveillance en dehors d'un suivi judiciaire »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme abroge les mesures administratives de surveillance hors contrôle judiciaire, ce qui s'oppose à leur prolongation sans viser nommément l'antiterrorisme.

### P0969 · marine-tondelier · societe-aide-active-a-mourir
- **Énoncé :** L'aide active à mourir doit être autorisée pour les adultes atteints d'une maladie incurable.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « légaliser l'aide active à mourir en conservant l'équilibre des textes votés en 1re lecture »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme propose de légaliser l'aide active à mourir.

### P0970 · marine-tondelier · societe-cannabis-legalisation
- **Énoncé :** La consommation de cannabis par les adultes doit être légalisée et encadrée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Légaliser et encadrer la production, la vente et la consommation de cannabis. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme légalise et encadre la consommation de cannabis.

### P0971 · marine-tondelier · societe-conge-second-parent
- **Énoncé :** Le congé de naissance du second parent doit avoir la même durée que celui de la mère.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rendre obligatoire et aligner la durée du congé d'accueil de l'enfant entre la mère et le second parent avec 16 semaines rémunérées à 100 % du salaire mensuel de base. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme aligne la durée du congé du second parent sur celle de la mère.

### P0972 · marine-tondelier · societe-salles-consommation-drogue-v2
- **Énoncé :** Les salles de consommation de drogue supervisées doivent être généralisées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmenter les moyens de la prévention autour des toxicomanies en particulier les " haltes soins addictions " »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme renforce les moyens des haltes soins addictions (salles de consommation supervisées) sans prévoir explicitement leur généralisation, d'où 1 plutôt que 2.

### P0973 · marine-tondelier · societe-signes-religieux-sorties-scolaires
- **Énoncé :** Le port de signes religieux doit être interdit aux accompagnateurs de sorties scolaires.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La laïcité impose la neutralité au service public et à ses agent·es, pas à ses usagers ni aux habitant·es. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme limite l'obligation de neutralité aux agents publics, ce qui s'oppose à une interdiction visant les accompagnateurs sans les nommer.

### P0974 · marine-tondelier · societe-signes-religieux-universite
- **Énoncé :** Le port de signes religieux ostensibles doit être interdit aux étudiants à l'université.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La laïcité impose la neutralité au service public et à ses agent·es, pas à ses usagers ni aux habitant·es. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme exclut la neutralité religieuse pour les usagers du service public, catégorie qui inclut les étudiants sans les nommer.

### P0975 · marine-tondelier · societe-simplifier-changement-sexe-etat-civil
- **Énoncé :** La procédure de changement de la mention du sexe à l'état civil doit être simplifiée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rendre le changement de mention de sexe à l'état civil libre, gratuit et simple, sans passer devant un juge. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme simplifie le changement de la mention du sexe à l'état civil.

### P0976 · marine-tondelier · transport-abandonner-nouvelles-lgv
- **Énoncé :** La construction de nouvelles lignes à grande vitesse doit être abandonnée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Adopter un moratoire sur les grands projets inutiles et imposés comme le canal Seine-Nord Europe, l'autoroute A69, le TGV Lyon-Turin et les extensions d'aéroport. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme suspend le projet de TGV Lyon-Turin sans renoncer à toute nouvelle ligne à grande vitesse.

### P0977 · marine-tondelier · transport-abonnement-national-unique
- **Énoncé :** Un abonnement national unique donnant accès aux trains régionaux et aux transports urbains doit être créé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « par un ticket climat mensuel avec un tarif unique permettant de garantir des tarifs accessibles »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée un ticket climat mensuel à tarif unique pour l'ensemble des transports en commun hors TGV.

### P0978 · marine-tondelier · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renationaliser progressi- vement les autoroutes afin d'investir dans les infrastructures de transport »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme renationalise les autoroutes, à l'opposé du maintien de leur exploitation en concession par des sociétés privées.

### P0979 · marine-tondelier · transport-baisser-taxe-billets-avion
- **Énoncé :** La taxe sur les billets d'avion doit être réduite.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Augmenter la fiscalité sur les billets d'avion (Taxe sur les Billets d'Avion ou TSBA et taux de TVA) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme augmente la taxe sur les billets d'avion, à l'opposé de l'énoncé.

### P0980 · marine-tondelier · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Suspendre les obligations de mise en concurrence des compagnies ferroviaires. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme suspend la mise en concurrence ferroviaire, à l'opposé de l'énoncé.

### P0981 · marine-tondelier · transport-gratuite-transports-urbains
- **Énoncé :** Les transports en commun urbains doivent être gratuits pour les usagers.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « des mesures de gratuité ciblées aux jeunes et aux ménages précaires pour l'ensemble des transports en commun hors TGV »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit une gratuité ciblée sur les jeunes et les ménages précaires, version partielle d'une gratuité générale.

### P0982 · marine-tondelier · transport-milliard-amenagements-cyclables
- **Énoncé :** L'État doit consacrer au moins un milliard d'euros par an aux aménagements cyclables.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Doubler le kilométrage de voies cyclables continues en 3 ans pour atteindre 120 000 km en 2032 »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme vise un doublement des voies cyclables sans chiffrer un budget annuel d'un milliard d'euros.

### P0983 · marine-tondelier · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régénérer et moderniser le réseau existant (réseau structurant et "petites " lignes desservant les territoires ruraux) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme régénère les petites lignes sans préciser leur maintien quelle que soit leur fréquentation.

### P0984 · marine-tondelier · transport-taxe-kilometrique-poids-lourds
- **Énoncé :** Les poids lourds doivent payer une taxe kilométrique sur le réseau routier.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « éco-redevance poids lourds sur le réseau routier non-concédé »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme prévoit une éco-redevance kilométrique des poids lourds sur le réseau routier non concédé.

### P0985 · marine-tondelier · transport-trains-de-nuit
- **Énoncé :** L'État doit financer l'ouverture de nouvelles lignes de trains de nuit.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer des lignes de train de nuit en particulier les transversales Bordeaux-Lyon ou Bordeaux-Nice. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme crée de nouvelles lignes de trains de nuit.

### P0986 · marine-tondelier · transport-voitures-centres-villes-libres
- **Énoncé :** L'accès des voitures aux centres-villes doit rester libre.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Développer les Zones à Trafic Limité. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme développe les zones à trafic limité, ce qui restreint l'accès des voitures sans viser tous les centres-villes.

### P0987 · marine-tondelier · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Abroger les réformes régressives adoptées lors des deux derniers quinquennats notamment celle sur le calcul de l'Allocation de Retour à l'Emploi. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme abroge les durcissements de l'assurance chômage, à l'opposé de l'énoncé.

### P0988 · marine-tondelier · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Rétablir le principe de faveur qui voit la loi primer sur la convention collective. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme rétablit la primauté de la loi sur les accords collectifs, ce qui s'oppose à une durée fixée par accord d'entreprise sans viser la durée du travail.

### P0989 · marine-tondelier · travail-elargir-penibilite-retraite
- **Énoncé :** Les critères de pénibilité ouvrant droit à un départ anticipé à la retraite doivent être élargis.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réintroduire les 4 critères ouvrant le droit à une retraite anticipée qui ont été supprimés en 2017 »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme réintroduit quatre critères de pénibilité ouvrant droit à une retraite anticipée.

### P0990 · marine-tondelier · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmenter le SMIC et mettre en place une indexation des bas salaires sur l'inflation »
- **Source :** 21 priorités communes qui devraient pouvoir nous rassembler (site de Marine Tondelier) — livre_plateforme, 2026-04-17 — https://marinetondelier.fr/blog/21-priorites-gouverner-ensemble-demain
- **Justification :** Les 21 priorités prévoient une indexation des seuls bas salaires sur l'inflation.

### P0991 · marine-tondelier · travail-plafonner-ecart-salaires
- **Énoncé :** L'écart entre les salaires les plus élevés et les plus bas d'une même entreprise doit être plafonné par la loi.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Réduire les écarts de rémunération pour atteindre un écart de 1 à 20 dans les entreprises entre le salaire de dirigeants et le salaire médian dans l'entreprise en conditionnant toute aide publique à cet objectif. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme vise un écart de 1 à 20 par la conditionnalité des aides publiques, sans plafond fixé par la loi.

### P0992 · marine-tondelier · travail-plateformes-presomption-salariat
- **Énoncé :** Les travailleurs des plateformes numériques doivent être présumés salariés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Transposer dans la loi française la directive européenne sur la présomption de salariat pour les travailleur·ses des plateformes. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme instaure une présomption de salariat pour les travailleurs des plateformes.

### P0993 · marine-tondelier · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Abroger l'âge légal de départ à la retraite à 64 ans (réforme Borne) pour revenir immédiatement à un âge minimum à 62 ans »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme ramène immédiatement l'âge légal de départ à 62 ans.

### P0994 · marine-tondelier · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Abroger l'âge légal de départ à la retraite à 64 ans (réforme Borne) pour revenir immédiatement à un âge minimum à 62 ans »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme abaisse l'âge légal à 62 ans, à l'opposé d'un report au-delà de 64 ans.

### P0995 · marine-tondelier · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Refuser toute forme d'évolution vers une retraite par capitalisation »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme refuse toute évolution vers la capitalisation.

### P0996 · marine-tondelier · travail-salaries-conseils-administration
- **Énoncé :** Les salariés doivent occuper au moins un tiers des sièges des conseils d'administration des grandes entreprises.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « attribuant des postes de droit dans les Conseils d'administration ou de surveillance des entreprises (2 postes dans les entreprises de +250 salariés ; un tiers pour celles de +1000 ; la moitié celles +5000) »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme attribue au moins un tiers des sièges aux salariés dans les entreprises de plus de 1 000 salariés.

### P0997 · marine-tondelier · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Passer aux 32 heures sans perte de salaire dans les métiers pénibles ou de nuit en y conditionnant les aides aux entreprises. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme limite le passage aux 32 heures aux métiers pénibles ou de nuit.

### P0998 · marine-tondelier · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Passer le salaire minimum à 2000€ brut par mois dès 2027. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme porte le SMIC à 2 000 euros bruts dès 2027, hausse supérieure à l'inflation.

### P0999 · marine-tondelier · travail-statut-fonction-publique-regalien
- **Énoncé :** Le statut de fonctionnaire doit être réservé aux missions régaliennes de l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Adopter un plan de titularisation des agents publics embauchés sur des contrats de droit privé. »
- **Source :** Pour une prospérité écologique : le nouveau programme des Écologistes (Les Écologistes, PDF, copie Wayback Machine) — programme, 2026-07 — https://web.archive.org/web/20260825202751if_/https://lesecologistes.fr/document/3N4JsAEmq6vsx42IITGNZa/vdef-programme-1.pdf
- **Justification :** Le programme étend la titularisation des agents publics, ce qui s'oppose à un statut réservé au régalien sans le viser explicitement.

## Nathalie Arthaud (Lutte ouvrière) — 8 positions

### P1000 · nathalie-arthaud · defense-troupes-ukraine-cessez-le-feu-v2
- **Énoncé :** La France doit être prête à déployer des militaires en Ukraine dans le cadre d'un accord de cessez-le-feu.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Qu'il faut construire une armée européenne, rétablir le service militaire, envoyer nos soldats en Ukraine. C'est-à-dire, comme l'a dit le général Mandon, être prêt à sacrifier nos enfants dans une nouvelle guerre. »
- **Source :** Meeting du 14 février 2026 : discours de Nathalie Arthaud (Lutte ouvrière) — declaration_vote, 2026-02-14 — https://www.lutte-ouvriere.org/portail/brochures/meeting-14-fevrier-2026-discours-nathalie-arthaud-191591.html
- **Justification :** La candidate dénonce l'idée d'envoyer des soldats en Ukraine comme du « bourrage de crâne », rejet général qui ne vise pas spécifiquement un déploiement dans le cadre d'un cessez-le-feu, d'où -1.

### P1001 · nathalie-arthaud · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Confiscation des bénéfices de ces profiteurs de guerre »
- **Source :** Fête annuelle de Lutte ouvrière, mai 2026 : Nathalie Arthaud, présidentielle 2027 (Lutte ouvrière, PDF) — livre_plateforme, 2026-05 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/06/brochure-ete-2026.pdf
- **Justification :** La brochure demande la confiscation des bénéfices des entreprises qualifiées de profiteurs de guerre, une mesure voisine d'une taxe sur les bénéfices exceptionnels mais limitée à ces entreprises et de nature différente, d'où 1.

### P1002 · nathalie-arthaud · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régularisation de tous les sans-papiers »
- **Source :** Fête annuelle de Lutte ouvrière, mai 2026 : Nathalie Arthaud, présidentielle 2027 (Lutte ouvrière, PDF) — livre_plateforme, 2026-05 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/06/brochure-ete-2026.pdf
- **Justification :** La brochure et le discours de la fête demandent la régularisation de tous les sans-papiers, ce qui inclut ceux présents depuis plus de cinq ans, sans condition de durée. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P1003 · nathalie-arthaud · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régularisation de tous les sans-papiers »
- **Source :** Fête annuelle de Lutte ouvrière, mai 2026 : Nathalie Arthaud, présidentielle 2027 (Lutte ouvrière, PDF) — livre_plateforme, 2026-05 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/06/brochure-ete-2026.pdf
- **Justification :** La brochure et le discours de la fête demandent la régularisation de tous les sans-papiers, ce qui inclut les travailleurs employés dans des métiers en tension, sans condition de métier. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P1004 · nathalie-arthaud · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Exigeons L'AUGMENTATION des salaires, des retraites et des pensions, le SMIC à 2 200 € et leur INDEXATION sur l'inflation. »
- **Source :** Le camp des travailleurs : dépliant de campagne de Nathalie Arthaud (Lutte ouvrière, PDF) — programme, 2026-11-03 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/11/Depliant-NA-3nov.pdf
- **Justification :** Le dépliant de campagne demande explicitement l'indexation des salaires sur l'inflation, que la brochure formule aussi comme une indexation sur la hausse des prix.

### P1005 · nathalie-arthaud · travail-limiter-licenciements-beneficiaires-v2
- **Énoncé :** Les entreprises qui réalisent des bénéfices doivent être limitées dans leur recours aux licenciements économiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « prône notamment l'interdiction des licenciements »
- **Source :** Nathalie Arthaud annonce sa candidature pour Lutte ouvrière (ICI) — declaration_vote, 2025-12-08 — https://www.ici.fr/auvergne-rhone-alpes/drome-26/presidentielle-2027-nathalie-arthaud-annonce-sa-candidature-pour-lutte-ouvriere-8888318
- **Justification :** L'article rapporte que Lutte ouvrière prône l'interdiction des licenciements, mesure qui inclut la limitation des licenciements dans les entreprises qui réalisent des bénéfices ; la formule est celle du journaliste. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P1006 · nathalie-arthaud · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il faut baisser le temps et la charge de travail sans perte de salaire pour permettre à tous de vivre. »
- **Source :** Fête annuelle de Lutte ouvrière, mai 2026 : Nathalie Arthaud, présidentielle 2027 (Lutte ouvrière, PDF) — livre_plateforme, 2026-05 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/06/brochure-ete-2026.pdf
- **Justification :** La brochure demande une baisse du temps de travail sans perte de salaire, sans fixer de durée légale de 32 heures, d'où 1.

### P1007 · nathalie-arthaud · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Exigeons L'AUGMENTATION des salaires, des retraites et des pensions, le SMIC à 2 200 € et leur INDEXATION sur l'inflation. »
- **Source :** Le camp des travailleurs : dépliant de campagne de Nathalie Arthaud (Lutte ouvrière, PDF) — programme, 2026-11-03 — https://www.lutte-ouvriere.org/medias/document/fichiers/2026/11/Depliant-NA-3nov.pdf
- **Justification :** Le dépliant demande de porter le SMIC à 2 200 euros, soit une augmentation nettement supérieure à l'inflation, en plus de son indexation sur les prix.

## Nicolas Dupont-Aignan (Debout la France) — 13 positions

### P1008 · nicolas-dupont-aignan · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous voulons remettre le citoyen au centre des décisions, en instaurant un référendum d'initiative citoyenne pour la loi et la Constitution »
- **Source :** Projet : refonder et moraliser notre démocratie (Debout la France) — programme, 2026-06-09 — https://www.debout-la-france.fr/projet/refonder-et-moraliser-notre-democratie/
- **Justification :** Le projet propose un référendum d'initiative citoyenne pour la loi et la Constitution, ce qui va dans le sens d'un recours plus fréquent au référendum sans se prononcer explicitement sur son caractère exceptionnel.

### P1009 · nicolas-dupont-aignan · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en instaurant un référendum d'initiative citoyenne pour la loi et la Constitution »
- **Source :** Projet : refonder et moraliser notre démocratie (Debout la France) — programme, 2026-06-09 — https://www.debout-la-france.fr/projet/refonder-et-moraliser-notre-democratie/
- **Justification :** Le projet propose explicitement d'instaurer un référendum d'initiative citoyenne, pour la loi comme pour la Constitution.

### P1010 · nicolas-dupont-aignan · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « en instaurant un référendum d'initiative citoyenne pour la loi et la Constitution »
- **Source :** Projet : refonder et moraliser notre démocratie (Debout la France) — programme, 2026-06-09 — https://www.debout-la-france.fr/projet/refonder-et-moraliser-notre-democratie/
- **Justification :** Le projet propose un référendum d'initiative citoyenne pour la loi et la Constitution, qui ouvrirait aux citoyens le déclenchement d'un référendum national, contrairement à une compétence réservée au président de la République ou au Parlement.

### P1011 · nicolas-dupont-aignan · democratie-referendum-revocatoire
- **Énoncé :** Les électeurs doivent pouvoir révoquer un élu en cours de mandat par référendum.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en conditionnant la révocation ou la reconduction des mandats à la confiance populaire »
- **Source :** Projet : refonder et moraliser notre démocratie (Debout la France) — programme, 2026-06-09 — https://www.debout-la-france.fr/projet/refonder-et-moraliser-notre-democratie/
- **Justification :** Le projet prévoit de conditionner la révocation des mandats à la confiance populaire, sans préciser qu'il s'agit d'un référendum en cours de mandat ; la valeur est donc 1.

### P1012 · nicolas-dupont-aignan · environnement-fin-thermique-2035
- **Énoncé :** La vente de voitures neuves à moteur thermique doit être interdite dès 2035.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous protégerons notre agriculture et notre industrie contre la concurrence sauvage et les délires bureaucratiques imposés par les technocrates bruxellois (fin du moteur thermique »
- **Source :** Projet : affaires européennes (Debout la France) — programme, 2026-10-05 — https://www.debout-la-france.fr/projet/affaires-europeennes/
- **Justification :** Le projet range la fin du moteur thermique parmi les mesures européennes contre lesquelles il s'engage à protéger l'industrie, ce qui constitue un rejet explicite de l'interdiction.

### P1013 · nicolas-dupont-aignan · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il faut construire 40 000 places de prison et expulser les délinquants étrangers. »
- **Source :** Nicolas Dupont-Aignan : « Les règles de l'UE sont devenues une prison pour la France ! » (Sud Radio) — declaration_vote, 2026-05-18 — https://www.sudradio.fr/linvite-politique/nicolas-dupont-aignan-les-regles-de-lue-sont-devenues-une-prison-pour-la-france
- **Justification :** Le candidat propose d'expulser les délinquants étrangers, mesure voisine du retrait du titre de séjour des condamnés à de la prison ferme, sans en reprendre les termes ; la valeur est donc 1.

### P1014 · nicolas-dupont-aignan · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la fin des aides sociales non contributives aux étrangers »
- **Source :** Projet : immigration et assimilation (Debout la France) — programme, 2026-03-03 — https://www.debout-la-france.fr/projet/immigration-et-assimilation/
- **Justification :** Le projet propose de supprimer les aides sociales non contributives aux étrangers, mesure plus restrictive qu'une condition de cinq ans de résidence et différente dans sa forme ; la valeur est donc 1.

### P1015 · nicolas-dupont-aignan · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la suspension du regroupement familial »
- **Source :** Projet : immigration et assimilation (Debout la France) — programme, 2026-03-03 — https://www.debout-la-france.fr/projet/immigration-et-assimilation/
- **Justification :** Le projet propose de suspendre le regroupement familial, ce qui va dans le sens d'un durcissement sans porter sur des conditions de ressources ; la valeur est donc 1.

### P1016 · nicolas-dupont-aignan · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous proposons, par conséquent, la suppression du droit du sol »
- **Source :** Projet : immigration et assimilation (Debout la France) — programme, 2026-03-03 — https://www.debout-la-france.fr/projet/immigration-et-assimilation/
- **Justification :** Le projet propose explicitement la suppression du droit du sol.

### P1017 · nicolas-dupont-aignan · international-controles-frontieres-schengen
- **Énoncé :** La France doit rétablir durablement des contrôles à toutes ses frontières intérieures de l'espace Schengen.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous rétablirons immédiatement nos frontières nationales et abandonnerons l'espace Schengen »
- **Source :** Projet : affaires européennes (Debout la France) — programme, 2026-10-05 — https://www.debout-la-france.fr/projet/affaires-europeennes/
- **Justification :** Le projet prévoit de rétablir immédiatement les frontières nationales et de quitter l'espace Schengen, ce qui inclut le contrôle durable à toutes les frontières.

### P1018 · nicolas-dupont-aignan · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous rétablirons la primauté du droit national sur le droit européen »
- **Source :** Projet : affaires européennes (Debout la France) — programme, 2026-10-05 — https://www.debout-la-france.fr/projet/affaires-europeennes/
- **Justification :** Le projet propose explicitement de rétablir la primauté du droit national sur le droit européen, ce qui permet d'appliquer la loi nationale en cas de conflit avec une règle de l'Union.

### P1019 · nicolas-dupont-aignan · international-referendum-maintien-ue
- **Énoncé :** La France doit organiser un référendum sur son maintien dans l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous organiserons un référendum sur l'appartenance à l'Union européenne. »
- **Source :** Projet : affaires européennes (Debout la France) — programme, 2026-10-05 — https://www.debout-la-france.fr/projet/affaires-europeennes/
- **Justification :** Le projet s'engage explicitement à organiser un référendum sur l'appartenance de la France à l'Union européenne.

### P1020 · nicolas-dupont-aignan · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Il faut construire 40 000 places de prison »
- **Source :** Nicolas Dupont-Aignan : « Les règles de l'UE sont devenues une prison pour la France ! » (Sud Radio) — declaration_vote, 2026-05-18 — https://www.sudradio.fr/linvite-politique/nicolas-dupont-aignan-les-regles-de-lue-sont-devenues-une-prison-pour-la-france
- **Justification :** Le candidat propose de construire 40 000 places de prison, mesure inverse de l'arrêt des constructions.

