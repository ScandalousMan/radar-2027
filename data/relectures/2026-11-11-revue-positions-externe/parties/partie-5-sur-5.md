# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** part 5 of 5 — 82 positions (Raphaël Glucksmann). The other parts are reviewed separately; references (P0001…) are global.

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
*82 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

## Raphaël Glucksmann (Place publique) — 82 positions

### P1021 · raphael-glucksmann · agriculture-bio-restauration-collective-v2
- **Énoncé :** Les produits issus de l'agriculture biologique doivent représenter au moins 30 % des achats alimentaires de la restauration collective publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faire de la cantine le lieu d'accès universel à une alimentation saine, locale et bio »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut faire de la cantine le lieu d'une alimentation saine, locale et bio, sans fixer de part minimale de 30 % des achats, d'où 1.

### P1022 · raphael-glucksmann · agriculture-chalut-aires-protegees
- **Énoncé :** La pêche au chalut de fond doit être interdite dans les aires marines protégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « faire en sorte que les aires marines protégées soient réellement protégées (chalutage) »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut protéger réellement les aires marines protégées en visant le chalutage, sans formuler explicitement une interdiction du chalut de fond.

### P1023 · raphael-glucksmann · agriculture-derogations-neonicotinoides
- **Énoncé :** Les agriculteurs doivent pouvoir obtenir des dérogations pour utiliser des insecticides néonicotinoïdes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Éliminer les produits chimiques dangereux en interdisant les pesticides les plus néfastes, glyphosate, néonicotinoïdes tueurs d'abeilles »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'interdire les néonicotinoïdes, ce qui est l'inverse de dérogations permettant leur usage.

### P1024 · raphael-glucksmann · agriculture-interdire-glyphosate
- **Énoncé :** L'usage du glyphosate doit être interdit en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Éliminer les produits chimiques dangereux en interdisant les pesticides les plus néfastes, glyphosate, néonicotinoïdes tueurs d'abeilles »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement d'interdire le glyphosate.

### P1025 · raphael-glucksmann · agriculture-interdire-poules-cage
- **Énoncé :** L'élevage de poules pondeuses en cage doit être interdit.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « porter au niveau européen la disparition par étape de l'élevage en cage »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut faire disparaître par étapes l'élevage en cage au niveau européen, sans interdiction nationale immédiate ni mention spécifique des poules pondeuses.

### P1026 · raphael-glucksmann · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Réduire massivement les intrants chimiques et soutenir les alternatives durables »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut réduire massivement les intrants chimiques, sans objectif chiffré ni échéance 2030.

### P1027 · raphael-glucksmann · agriculture-plafonner-aides-pac
- **Énoncé :** Les aides de la politique agricole commune versées à une même exploitation doivent être plafonnées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en plafonnant les aides comme en Espagne pour rediriger les fonds vers les petites fermes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement de plafonner les aides de la PAC.

### P1028 · raphael-glucksmann · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Garantir le revenu des agriculteurs par la mise en place de prix planchers rémunérateurs »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement des prix planchers pour garantir le revenu agricole.

### P1029 · raphael-glucksmann · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Refuser les méga-bassines au profit de solutions locales réfléchies avec les agriculteurs »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme refuse les méga-bassines, une catégorie de retenues d'eau, sans se prononcer sur l'ensemble des retenues pour l'irrigation.

### P1030 · raphael-glucksmann · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Augmenter drastiquement l'aide militaire à l'Ukraine qui est notre première ligne de défense »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'augmenter fortement l'aide militaire à l'Ukraine.

### P1031 · raphael-glucksmann · defense-defense-europeenne-emprunt
- **Énoncé :** Une défense européenne commune doit être financée par un emprunt de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Oeuvrer à la mise en place rapide d'un fonds européen de défense de 500 milliards d'euros via un emprunt commun »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un fonds européen de défense financé par un emprunt commun.

### P1032 · raphael-glucksmann · defense-dissuasion-protection-europe-v2
- **Énoncé :** La France doit étendre explicitement sa doctrine de dissuasion nucléaire à la protection de ses partenaires européens.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Proposer à nos partenaires de l'UE d'étendre la dissuasion nucléaire française aux autres pays de l'Union européenne »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'étendre la dissuasion nucléaire française aux autres pays de l'Union européenne, la décision d'emploi restant française.

### P1033 · raphael-glucksmann · defense-doubler-reservistes
- **Énoncé :** Le nombre de réservistes opérationnels des armées doit être doublé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmenter drastiquement la réserve opérationnelle, la mettant au cœur de la défense nationale. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut augmenter fortement la réserve opérationnelle, sans fixer d'objectif de doublement.

### P1034 · raphael-glucksmann · democratie-conventions-citoyennes
- **Énoncé :** Des conventions citoyennes tirées au sort doivent être consultées avant les grandes réformes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « généraliser des conventions citoyennes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut généraliser les conventions citoyennes, sans préciser qu'elles seraient consultées avant chaque grande réforme.

### P1035 · raphael-glucksmann · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Instaurer un droit d'initiative citoyenne, permettant de déclencher des séquences démocratiques avec des référendums à l'échelle locale et nationale »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un droit d'initiative citoyenne pouvant déclencher des référendums nationaux, sans préciser le mécanisme de pétition ni de seuil.

### P1036 · raphael-glucksmann · democratie-referendum-local-initiative
- **Énoncé :** Les habitants d'une commune doivent pouvoir imposer l'organisation d'un référendum local par une pétition.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Instaurer un droit d'initiative citoyenne, permettant de déclencher des séquences démocratiques avec des référendums à l'échelle locale et nationale »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un droit d'initiative citoyenne pouvant déclencher des référendums locaux, sans préciser le mécanisme de pétition.

### P1037 · raphael-glucksmann · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Instaurer un droit d'initiative citoyenne, permettant de déclencher des séquences démocratiques avec des référendums à l'échelle locale et nationale »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut que des citoyens puissent déclencher des référendums nationaux, ce qui s'oppose à un déclenchement réservé au président et au Parlement, mais les modalités restent imprécises, d'où -1.

### P1038 · raphael-glucksmann · democratie-vote-16-ans
- **Énoncé :** Le droit de vote doit être accordé dès 16 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ouvrir le droit de vote à 16 ans et pour les étrangers extra-communautaires aux élections locales »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement le droit de vote à 16 ans.

### P1039 · raphael-glucksmann · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « s'opposer aux traités comme le Mercosur qui placent nos éleveurs dans une situation injuste et intenable »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme s'oppose à des traités comme le Mercosur, sans rejeter en termes généraux tout nouvel accord de libre-échange.

### P1040 · raphael-glucksmann · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « surveiller de près les investissements étrangers dans les secteurs stratégiques »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut surveiller de près les investissements étrangers dans les secteurs stratégiques, sans détailler un renforcement du contrôle des rachats.

### P1041 · raphael-glucksmann · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « création de fonds régionaux conséquents pour permettre aux Régions d'entrer au capital d'entreprises clés »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose que les Régions, et non l'État, entrent au capital d'entreprises clés.

### P1042 · raphael-glucksmann · economie-plafonnement-loyers-zones-tendues
- **Énoncé :** Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Encadrer les loyers dans les zones en grande tension pour garantir l'accès au logement aux ménages modestes. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut encadrer les loyers dans les zones en grande tension, sans dire que cet encadrement s'imposerait à toutes les zones tendues indépendamment des élus locaux, d'où 1.

### P1043 · raphael-glucksmann · economie-plafonner-prix-alimentaires
- **Énoncé :** Les prix des produits alimentaires de première nécessité doivent être plafonnés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Plafonner les prix des biens de première nécessité et des produits essentiels »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose de plafonner les prix des biens de première nécessité, mais seulement dans les Outre-mer.

### P1044 · raphael-glucksmann · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Fixer une partie de la facture des ménages, entreprises, industriels et collectivités sur le coût de production de notre électricité nucléaire et renouvelable »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut indexer une partie de la facture d'électricité sur les coûts de production, une régulation partielle limitée à l'électricité.

### P1045 · raphael-glucksmann · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Conforter le rôle du nucléaire, énergie pilotable et décarbonée, en assurant la sûreté des centrales existantes et la construction à temps de nouvelles unités »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut conforter le rôle du nucléaire et construire de nouvelles unités, sans se prononcer explicitement sur sa part dans le mix.

### P1046 · raphael-glucksmann · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Lancer un grand plan d'investissement pluriannuel dans toutes les énergies renouvelables »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un plan d'investissement dans toutes les énergies renouvelables, sans se prononcer explicitement sur les aides à la production solaire et éolienne.

### P1047 · raphael-glucksmann · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Défendre résolument les objectifs du Zéro Artificialisation Nette des sols (ZAN) »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme défend explicitement les objectifs du ZAN, tout en voulant sortir d'une logique purement comptable dans leur application.

### P1048 · raphael-glucksmann · environnement-interdire-vols-interieurs
- **Énoncé :** Les vols intérieurs doivent être interdits lorsqu'une alternative en train de moins de quatre heures existe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « étendre l'interdiction des vols intérieurs avec alternative ferroviaire viable »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut étendre l'interdiction des vols intérieurs quand une alternative ferroviaire existe, sans fixer le seuil de quatre heures.

### P1049 · raphael-glucksmann · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « fin des plastiques à usage unique d'ici 2030 »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose la fin des plastiques à usage unique d'ici 2030.

### P1050 · raphael-glucksmann · environnement-taxer-kerosene-vols-interieurs
- **Énoncé :** Le kérosène des vols intérieurs doit être taxé comme les autres carburants.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « suppression des exonérations de TVA et de taxe sur le kérosène »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose de supprimer l'exonération de taxe sur le kérosène, ce qui inclut les vols intérieurs.

### P1051 · raphael-glucksmann · fiscalite-capital-aligne-travail
- **Énoncé :** Le taux d'imposition des revenus du capital doit être aligné sur celui des revenus du travail.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rééquilibrage de la fiscalité entre le travail, le capital et l'héritage »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut rééquilibrer la fiscalité entre travail et capital, sans proposer explicitement un alignement des taux.

### P1052 · raphael-glucksmann · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Effort fiscal nouveau, ciblé sur les très hauts patrimoines et les grands groupes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme prévoit un effort fiscal nouveau sur les très hauts patrimoines, sans préciser de prélèvement minimal, de seuil ni de taux, d'où 1.

### P1053 · raphael-glucksmann · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer des niches fiscales inefficaces et inefficientes. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut supprimer des niches fiscales jugées inefficaces, sans objectif de réduction de moitié.

### P1054 · raphael-glucksmann · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « rééquilibrer la répartition de la taxation entre le travail, le capital, l'héritage et les retraites pour sortir de cette impasse injuste qui favorise les héritiers »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme juge que la fiscalité actuelle favorise les héritiers et veut la rééquilibrer, sans proposer explicitement de hausse des droits de succession.

### P1055 · raphael-glucksmann · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mise en place d'un mécanisme automatique de taxation des superprofits des multinationales et des profiteurs de guerre. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement une taxation automatique des superprofits.

### P1056 · raphael-glucksmann · immigration-asile-droit-travail
- **Énoncé :** Les demandeurs d'asile doivent être autorisés à travailler dès le dépôt de leur demande.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « ouvrir le droit au travail, sans autorisation spécifique, dès l'enregistrement de la demande d'asile »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement le droit au travail dès l'enregistrement de la demande d'asile.

### P1057 · raphael-glucksmann · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « refuser l'externalisation de nos politiques migratoires et d'asile »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme refuse explicitement l'externalisation des politiques d'asile, donc l'examen des demandes dans des centres hors de l'Union européenne.

### P1058 · raphael-glucksmann · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faciliter les démarches de régularisation des travailleurs sans papiers »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut faciliter la régularisation des travailleurs sans papiers en général, sans en faire un droit ni viser les métiers en tension.

### P1059 · raphael-glucksmann · immigration-titre-sejour-longue-duree
- **Énoncé :** Les étrangers en situation régulière doivent obtenir plus facilement un titre de séjour de longue durée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Généraliser la carte de séjour pluriannuelle en en faisant le titre de séjour de référence. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut faire de la carte pluriannuelle le titre de référence, une durée intermédiaire plutôt qu'un titre de longue durée.

### P1060 · raphael-glucksmann · immigration-voies-legales-travail-ue
- **Énoncé :** L'Union européenne doit ouvrir davantage de voies d'immigration légale pour le travail.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer des voies légales et sécurisées d'immigration de travail et passer des accords bilatéraux (au niveau français ou européen) »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose de créer des voies légales d'immigration de travail, y compris au niveau européen.

### P1061 · raphael-glucksmann · immigration-vote-local-etrangers-v2
- **Énoncé :** Les étrangers non ressortissants de l'Union européenne résidant en France depuis plusieurs années doivent pouvoir voter aux élections locales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ouvrir le droit de vote à 16 ans et pour les étrangers extra-communautaires aux élections locales »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement le droit de vote des étrangers extra-communautaires aux élections locales.

### P1062 · raphael-glucksmann · institutions-autonomie-fiscale-collectivites
- **Énoncé :** Les collectivités locales doivent disposer d'une plus grande autonomie fiscale.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en renforçant le pouvoir d'imposition des collectivités »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement de renforcer le pouvoir d'imposition des collectivités.

### P1063 · raphael-glucksmann · institutions-investiture-premier-ministre
- **Énoncé :** Le Premier ministre doit obtenir un vote de confiance de l'Assemblée nationale après sa nomination.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Investir le premier ministre par un vote de confiance de l'Assemblée nationale »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement l'investiture du Premier ministre par un vote de confiance de l'Assemblée.

### P1064 · raphael-glucksmann · institutions-maintenir-article-40
- **Énoncé :** Les députés et sénateurs doivent rester empêchés de proposer une mesure qui crée ou augmente une charge pour les finances publiques.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « renforcer le pouvoir d'initiative et d'amendement du Parlement (fin de l'article 40) »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement la fin de l'article 40, qui empêche les parlementaires de créer ou d'aggraver une charge publique.

### P1065 · raphael-glucksmann · institutions-pouvoirs-commissions-enquete
- **Énoncé :** Les commissions d'enquête parlementaires doivent disposer de pouvoirs d'investigation élargis.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Renforcer le contrôle du Parlement sur l'action gouvernementale : transparence sur les décrets d'application, évaluation rigoureuse du budget, droit d'enquête élargi »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un droit d'enquête élargi pour le Parlement.

### P1066 · raphael-glucksmann · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer immédiatement la proportionnelle, de préférence par circonscriptions régionales »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement le scrutin proportionnel pour les législatives.

### P1067 · raphael-glucksmann · institutions-supprimer-49-3
- **Énoncé :** Le recours à l'article 49.3 de la Constitution doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « ce qui permettra de mettre fin au 49.3 »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose une motion de censure constructive présentée comme mettant fin au 49.3.

### P1068 · raphael-glucksmann · international-aide-developpement-0-7
- **Énoncé :** L'aide publique au développement doit atteindre 0,7 % du revenu national brut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « atteindre progressivement 0,7 % du RNB dédié à l'aide publique au développement »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose une programmation pour atteindre progressivement 0,7 % du RNB d'aide au développement.

### P1069 · raphael-glucksmann · international-emprunt-commun-ue
- **Énoncé :** L'Union européenne doit pouvoir emprunter en commun pour financer des investissements.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Oeuvrer à la mise en place rapide d'un fonds européen de défense de 500 milliards d'euros via un emprunt commun »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un emprunt commun européen pour financer des investissements de défense ; le compte rendu de son livre évoque aussi un grand emprunt européen.

### P1070 · raphael-glucksmann · international-impots-propres-ue
- **Énoncé :** L'Union européenne doit disposer de nouveaux impôts qui lui sont propres.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « attribuer à l'Union des ressources propres nouvelles »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut de nouvelles ressources propres pour l'UE, sans préciser qu'il s'agirait d'impôts.

### P1071 · raphael-glucksmann · international-initiative-parlement-europeen
- **Énoncé :** Le Parlement européen doit obtenir le droit d'initiative législative.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « donnant le pouvoir d'initiative législative au Parlement européen »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement le droit d'initiative législative pour le Parlement européen.

### P1072 · raphael-glucksmann · international-majorite-qualifiee-ue
- **Énoncé :** La France doit accepter que davantage de décisions soient prises à la majorité qualifiée au sein de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « passant à la majorité qualifiée au Conseil européen »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose le passage à la majorité qualifiée au Conseil européen.

### P1073 · raphael-glucksmann · international-reduire-contribution-ue
- **Énoncé :** La contribution de la France au budget de l'Union européenne doit être réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Augmenter massivement le budget de l'Union pour lui permettre de lancer des politiques publiques »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut augmenter massivement le budget de l'UE, sans se prononcer explicitement sur la contribution française.

### P1074 · raphael-glucksmann · international-renforcer-sanctions-russie
- **Énoncé :** L'Union européenne doit renforcer ses sanctions contre la Russie.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdire immédiatement toute importation de gaz russe »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'interdire les importations de gaz russe, une mesure ciblée plutôt qu'un renforcement général des sanctions.

### P1075 · raphael-glucksmann · justice-justice-restaurative-systematique
- **Énoncé :** La justice restaurative doit être proposée systématiquement aux victimes et aux auteurs d'infractions.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Déployer massivement la justice restaurative et les travaux d'intérêt général (TIG) »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut déployer massivement la justice restaurative, sans la rendre systématique.

### P1076 · raphael-glucksmann · justice-tig-delits-sans-violence
- **Énoncé :** Le travail d'intérêt général doit être préféré à la prison pour les délits commis sans violence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « délits mineurs et infractions du quotidien doivent pouvoir être traités localement grâce à la médiation, aux travaux d'intérêt général et aux sanctions pédagogiques »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut traiter les délits mineurs notamment par des TIG, sans poser de préférence générale du TIG sur la prison pour les délits sans violence.

### P1077 · raphael-glucksmann · numerique-ia-remuneration-auteurs
- **Énoncé :** Les entreprises d'intelligence artificielle doivent rémunérer les auteurs dont les œuvres servent à entraîner leurs modèles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « développer la protection du droit d'auteur et des créateurs, notamment face aux défis posés par les plateformes d'intelligence artificielle générative »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut protéger le droit d'auteur face à l'IA générative, sans mentionner explicitement une rémunération pour l'entraînement des modèles.

### P1078 · raphael-glucksmann · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « investir dans les alternatives numériques libres et européennes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut investir dans les alternatives numériques libres et européennes, sans viser spécifiquement leur usage prioritaire par les administrations.

### P1079 · raphael-glucksmann · numerique-reseaux-sociaux-moins-15-ans
- **Énoncé :** L'accès aux réseaux sociaux doit être interdit aux moins de 15 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire les réseaux sociaux pour les moins de 15 ans »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement d'interdire les réseaux sociaux aux moins de 15 ans.

### P1080 · raphael-glucksmann · numerique-taxe-plateformes
- **Énoncé :** Les grandes plateformes numériques doivent payer un impôt sur le chiffre d'affaires réalisé en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « une hausse ciblée de la taxe GAFAM »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme prévoit une hausse de la taxe GAFAM, qui porte sur le chiffre d'affaires réalisé en France.

### P1081 · raphael-glucksmann · sante-taxer-boissons-sucrees
- **Énoncé :** La taxe sur les boissons sucrées doit être augmentée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « taxer davantage les boissons trop sucrées »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement de taxer davantage les boissons sucrées.

### P1082 · raphael-glucksmann · securite-pouvoirs-polices-municipales
- **Énoncé :** Les polices municipales doivent recevoir les mêmes pouvoirs d'enquête que la police nationale.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Réaffirmer le rôle de la police municipale, centré sur la proximité et la prévention. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut centrer la police municipale sur la proximité et la prévention, ce qui va à l'opposé d'un alignement de ses pouvoirs d'enquête sur la police nationale, sans rejet explicite.

### P1083 · raphael-glucksmann · securite-recepisse-controles-identite
- **Énoncé :** Les contrôles d'identité doivent donner lieu à la remise d'un récépissé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Généraliser les récépissés de contrôle d'identité. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose explicitement de généraliser les récépissés de contrôle d'identité.

### P1084 · raphael-glucksmann · societe-conge-second-parent
- **Énoncé :** Le congé de naissance du second parent doit avoir la même durée que celui de la mère.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Réformer le congé parental pour plus d'égalité entre les hommes et les femmes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut réformer le congé parental pour plus d'égalité, sans viser explicitement l'alignement du congé de naissance du second parent.

### P1085 · raphael-glucksmann · societe-service-national-obligatoire
- **Énoncé :** Le service national doit devenir obligatoire pour tous les jeunes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Raphaël Glucksmann propose également d'instaurer un service civique obligatoire de dix mois pour toutes les jeunes Français »
- **Source :** Présidentielle : Raphaël Glucksmann dévoile les premières lignes de son possible programme (LCP) — declaration_vote, 2026-05-26 — https://lcp.fr/actualites/presidentielle-raphael-glucksmann-devoile-les-premieres-lignes-de-son-possible-programme
- **Justification :** Selon le compte rendu de son livre, il propose un service civique obligatoire de dix mois pour tous les jeunes, la dimension militaire restant volontaire.

### P1086 · raphael-glucksmann · societe-simplifier-changement-sexe-etat-civil
- **Énoncé :** La procédure de changement de la mention du sexe à l'état civil doit être simplifiée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Respecter les identités et garantir le droit à l'autodétermination de genre »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut garantir l'autodétermination de genre, ce qui va au-delà d'une simple simplification de la procédure. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P1087 · raphael-glucksmann · transport-abandonner-nouvelles-lgv
- **Énoncé :** La construction de nouvelles lignes à grande vitesse doit être abandonnée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Relancer les trains de nuit, accélérer les LGV et les liaisons prioritaires pour faire l'Europe du Rail. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'accélérer les LGV, l'inverse de leur abandon.

### P1088 · raphael-glucksmann · transport-abonnement-national-unique
- **Énoncé :** Un abonnement national unique donnant accès aux trains régionaux et aux transports urbains doit être créé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faire le Ticket climat : un titre de transport unique, à tarif fixe, abordable et valable à l'échelle nationale pour les transports du quotidien, d'abord réservé aux jeunes et aux publics précaires. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose un titre national unique pour les transports du quotidien, d'abord réservé aux jeunes et aux publics précaires.

### P1089 · raphael-glucksmann · transport-doubler-investissement-ferroviaire
- **Énoncé :** Les investissements dans le réseau ferroviaire doivent être doublés sur le quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Lancer un Plan Rail national en lien avec les régions, en démultipliant les aides à SNCF Réseau »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut démultiplier les aides à SNCF Réseau, sans objectif de doublement sur le quinquennat.

### P1090 · raphael-glucksmann · transport-milliard-amenagements-cyclables
- **Énoncé :** L'État doit consacrer au moins un milliard d'euros par an aux aménagements cyclables.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Doubler les déplacements à vélo en 10 ans grâce à un plan de développement d'infrastructures cyclables sûres »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme prévoit un plan d'infrastructures cyclables, sans montant annuel.

### P1091 · raphael-glucksmann · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « développer les trains légers en zones rurales, relancer les Trains d'Équilibre du Territoire »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut développer la desserte ferroviaire rurale, sans s'engager explicitement sur le maintien des lignes peu fréquentées.

### P1092 · raphael-glucksmann · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Soutenir le fret ferroviaire en modernisant les lignes »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut soutenir le fret ferroviaire par la modernisation des lignes, sans subvention explicite à l'exploitation.

### P1093 · raphael-glucksmann · transport-taxe-kilometrique-poids-lourds
- **Énoncé :** Les poids lourds doivent payer une taxe kilométrique sur le réseau routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « taxer les camions européens qui traversent nos territoires sans payer aujourd'hui la moindre taxe »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut taxer les camions européens en transit, sans préciser une taxe kilométrique sur tous les poids lourds.

### P1094 · raphael-glucksmann · transport-trains-de-nuit
- **Énoncé :** L'État doit financer l'ouverture de nouvelles lignes de trains de nuit.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Relancer les trains de nuit, accélérer les LGV et les liaisons prioritaires pour faire l'Europe du Rail. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut relancer les trains de nuit, sans préciser un financement de nouvelles lignes par l'État.

### P1095 · raphael-glucksmann · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Abroger la réforme Macron de l'assurance chômage, injuste et inefficace. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'abroger la réforme de l'assurance chômage, l'inverse d'un durcissement.

### P1096 · raphael-glucksmann · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Protéger les salariés : redonner la priorité aux accords de branches professionnelles par rapport aux accords d'entreprise. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut redonner la priorité aux accords de branche sur les accords d'entreprise, sans viser explicitement la durée du travail.

### P1097 · raphael-glucksmann · travail-elargir-penibilite-retraite
- **Énoncé :** Les critères de pénibilité ouvrant droit à un départ anticipé à la retraite doivent être élargis.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « mieux prendre en compte les carrières pénibles et les parcours hachés »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut mieux prendre en compte les carrières pénibles pour la retraite, sans parler explicitement d'élargir les critères.

### P1098 · raphael-glucksmann · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « indexant leur point d'indice sur l'inflation »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'indexer le point d'indice des fonctionnaires sur l'inflation, et non l'ensemble des salaires.

### P1099 · raphael-glucksmann · travail-plafonner-ecart-salaires
- **Énoncé :** L'écart entre les salaires les plus élevés et les plus bas d'une même entreprise doit être plafonné par la loi.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Travailler à limiter les écarts de salaires dans une même entreprise »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut travailler à limiter les écarts de salaires dans une entreprise, sans plafond légal explicite.

### P1100 · raphael-glucksmann · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Abroger la réforme Macron de 2023. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose d'abroger la réforme de 2023, qui avait porté l'âge légal à 64 ans, tout en voulant cesser la focalisation sur l'âge légal et faire travailler certains plus longtemps.

### P1101 · raphael-glucksmann · travail-salaries-conseils-administration
- **Énoncé :** Les salariés doivent occuper au moins un tiers des sièges des conseils d'administration des grandes entreprises.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Intégrer davantage les représentants des salariés dans les conseils d'administration des entreprises, dès 100 salariés »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme veut davantage de représentants des salariés dans les conseils d'administration, sans fixer la part d'un tiers.

### P1102 · raphael-glucksmann · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Augmenter le SMIC à 1600 euros net dans les deux ans qui suivent notre accession au pouvoir. »
- **Source :** Acte un, notre vision pour la France : les chantiers de Place publique (Place publique, PDF) — livre_plateforme, 2025 — https://place-publique.eu/document/6J8wjk3EW8dBCLwKxa7J96/projet-placepublique-acte1.pdf
- **Justification :** La plateforme propose de porter le SMIC à 1 600 euros net en deux ans, une hausse au-delà de l'inflation.

