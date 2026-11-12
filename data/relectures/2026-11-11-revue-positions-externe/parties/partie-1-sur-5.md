# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** part 1 of 5 — 246 positions (Anasse Kazib, Bruno Retailleau, David Lisnard, Delphine Batho, Édouard Philippe, Éric Zemmour). The other parts are reviewed separately; references (P0001…) are global.

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
*246 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

## Anasse Kazib (Révolution permanente) — 26 positions

### P0001 · anasse-kazib · defense-budget-armees-3-pib
- **Énoncé :** Le budget des armées doit atteindre 3 % du PIB.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Pas un euro pour la guerre, démantèlement de la machine de guerre française »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme refuse tout financement de la guerre et demande le démantèlement de l'appareil militaire, ce qui est l'inverse explicite d'une hausse du budget des armées, d'où -2.

### P0002 · anasse-kazib · defense-cesser-ventes-armes-conflits
- **Énoncé :** La France doit cesser de vendre des armes aux États engagés dans un conflit armé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « En démantelant l'industrie de l'armement et l'ensemble des marchands de morts, complices du génocide à Gaza »
- **Source :** Présidentielle 2027 : Anasse Kazib veut faire entendre la voix de la nouvelle classe ouvrière (Révolution permanente) — declaration_vote, 2026-06-01 — https://www.revolutionpermanente.fr/Presidentielle-2027-Anasse-Kazib-veut-faire-entendre-la-voix-de-la-nouvelle-classe-ouvriere
- **Justification :** Le texte de campagne propose de démanteler l'industrie de l'armement en la liant au conflit à Gaza, sans formuler une interdiction des ventes aux États en conflit, d'où 1 plutôt que 2.

### P0003 · anasse-kazib · defense-fermer-bases-afrique
- **Énoncé :** La France doit fermer ses bases militaires en Afrique.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « En exigeant la fermeture de l'ensemble des bases militaires, le retrait de toutes les troupes françaises et la fin de toutes les opérations de l'armée à l'étranger »
- **Source :** Présidentielle 2027 : Anasse Kazib veut faire entendre la voix de la nouvelle classe ouvrière (Révolution permanente) — declaration_vote, 2026-06-01 — https://www.revolutionpermanente.fr/Presidentielle-2027-Anasse-Kazib-veut-faire-entendre-la-voix-de-la-nouvelle-classe-ouvriere
- **Justification :** Le texte de campagne demande la fermeture de l'ensemble des bases militaires françaises à l'étranger, ce qui inclut celles situées en Afrique, d'où 2.

### P0004 · anasse-kazib · defense-priorite-depenses-sociales
- **Énoncé :** Les dépenses sociales doivent passer avant les dépenses militaires dans le budget de l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'argent de la guerre doit servir à financer massivement les services publics »
- **Source :** Présidentielle 2027 : Anasse Kazib veut faire entendre la voix de la nouvelle classe ouvrière (Révolution permanente) — declaration_vote, 2026-06-01 — https://www.revolutionpermanente.fr/Presidentielle-2027-Anasse-Kazib-veut-faire-entendre-la-voix-de-la-nouvelle-classe-ouvriere
- **Justification :** Le texte de campagne demande de réaffecter les crédits militaires aux services publics, et non explicitement aux dépenses sociales, d'où 1 plutôt que 2.

### P0005 · anasse-kazib · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Pas un euro pour la guerre, démantèlement de la machine de guerre française, 2ème exportateur d'armes mondial. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme refuse tout financement de la guerre et propose le démantèlement de l'appareil militaire français, ce qui va au-delà d'une réduction du budget des armées. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0006 · anasse-kazib · defense-reduire-presence-etranger
- **Énoncé :** La France doit réduire sa présence militaire à l'étranger.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Retrait des troupes françaises à l'étranger. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande le retrait des troupes françaises stationnées à l'étranger, ce qui réduit explicitement la présence militaire extérieure, d'où 2.

### P0007 · anasse-kazib · democratie-referendum-revocatoire
- **Énoncé :** Les électeurs doivent pouvoir révoquer un élu en cours de mandat par référendum.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ses membres devraient être élus pour deux ans, révocables et payés au salaire médian »
- **Source :** Présidentielle 2027 : Anasse Kazib veut faire entendre la voix de la nouvelle classe ouvrière (Révolution permanente) — declaration_vote, 2026-06-01 — https://www.revolutionpermanente.fr/Presidentielle-2027-Anasse-Kazib-veut-faire-entendre-la-voix-de-la-nouvelle-classe-ouvriere
- **Justification :** Le texte de campagne prévoit des élus révocables pour la future assemblée unique, sans préciser que la révocation passe par un référendum des électeurs, d'où 1 plutôt que 2.

### P0008 · anasse-kazib · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Investissements massifs dans les services publics, qui doivent être placés sous le contrôle des travailleur·ses. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme propose des investissements massifs dans les services publics, ce qui va dans le sens contraire d'une baisse de la dépense publique, sans se prononcer sur son niveau global rapporté au PIB, d'où -1.

### P0009 · anasse-kazib · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Expropriation des secteurs stratégiques (énergie, transports, banques, santé, …) et placement sous contrôle des travailleur·ses. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme propose d'exproprier les secteurs stratégiques et de les placer sous contrôle des travailleurs, ce qui diffère d'une prise de participations de l'État, d'où 1 plutôt que 2.

### P0010 · anasse-kazib · economie-plafonnement-loyers-zones-tendues
- **Énoncé :** Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Expropriation des logements vides, plafonnement et gel des loyers. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande le plafonnement et le gel des loyers sans les limiter aux zones tendues ni les subordonner à la demande des élus locaux. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0011 · anasse-kazib · immigration-plafond-annuel-admissions
- **Énoncé :** Le Parlement doit fixer chaque année un plafond du nombre d'étrangers admis au séjour.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Régularisation de tous les sans-papiers, liberté de circulation et d'installation. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande la liberté de circulation et d'installation, ce qui est l'inverse explicite d'un plafond annuel d'admissions au séjour, d'où -2.

### P0012 · anasse-kazib · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régularisation de tous les sans-papiers, liberté de circulation et d'installation. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande la régularisation de tous les sans-papiers, ce qui inclut ceux présents depuis plus de cinq ans. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0013 · anasse-kazib · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Régularisation de tous les sans-papiers, liberté de circulation et d'installation. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande la régularisation de tous les sans-papiers, ce qui inclut les travailleurs employés dans les métiers en tension. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0014 · anasse-kazib · institutions-supprimer-senat
- **Énoncé :** Le Sénat doit être supprimé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fin de la Ve République, du Sénat et de la figure présidentielle. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande explicitement la fin du Sénat, d'où 2.

### P0015 · anasse-kazib · societe-service-national-obligatoire
- **Énoncé :** Le service national doit devenir obligatoire pour tous les jeunes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Non au SNU et à la militarisation de nos écoles et de nos facs. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme rejette explicitement le service national universel, ce qui s'oppose à le rendre obligatoire, d'où -2.

### P0016 · anasse-kazib · societe-signes-religieux-sorties-scolaires
- **Énoncé :** Le port de signes religieux doit être interdit aux accompagnateurs de sorties scolaires.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Abrogation de toutes les lois sécuritaires, racistes et islamophobes, à commencer par la loi de 2004. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande l'abrogation de la loi de 2004 sur les signes religieux à l'école, ce qui va dans le sens contraire d'une extension de l'interdiction aux accompagnateurs de sorties scolaires, sans viser ce cas précis, d'où -1.

### P0017 · anasse-kazib · societe-signes-religieux-universite
- **Énoncé :** Le port de signes religieux ostensibles doit être interdit aux étudiants à l'université.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Abrogation de toutes les lois sécuritaires, racistes et islamophobes, à commencer par la loi de 2004. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande l'abrogation de la loi de 2004 sur les signes religieux à l'école, ce qui va dans le sens contraire d'une extension de l'interdiction à l'université, sans viser ce cas précis, d'où -1.

### P0018 · anasse-kazib · societe-simplifier-changement-sexe-etat-civil
- **Énoncé :** La procédure de changement de la mention du sexe à l'état civil doit être simplifiée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Avortement, PMA, transitions libres et gratuits. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande que les transitions de genre soient libres et gratuites, sans mentionner explicitement la procédure de changement de sexe à l'état civil, d'où 1 plutôt que 2.

### P0019 · anasse-kazib · transport-gratuite-transports-urbains
- **Énoncé :** Les transports en commun urbains doivent être gratuits pour les usagers.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « qu'il s'agisse de la santé, de l'éducation ou des transports, qui devraient être gratuits »
- **Source :** Présidentielle 2027 : Anasse Kazib veut faire entendre la voix de la nouvelle classe ouvrière (Révolution permanente) — declaration_vote, 2026-06-01 — https://www.revolutionpermanente.fr/Presidentielle-2027-Anasse-Kazib-veut-faire-entendre-la-voix-de-la-nouvelle-classe-ouvriere
- **Justification :** Le texte de campagne demande la gratuité des transports publics, ce qui inclut les transports en commun urbains, d'où 2.

### P0020 · anasse-kazib · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « SMIC à 2000 € net, revalorisation de toutes les allocations, augmentation des salaires de 500 €, indexation sur l'inflation. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande l'indexation des salaires sur l'inflation, d'où 2.

### P0021 · anasse-kazib · travail-limiter-licenciements-beneficiaires-v2
- **Énoncé :** Les entreprises qui réalisent des bénéfices doivent être limitées dans leur recours aux licenciements économiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdiction des licenciements. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande l'interdiction de tous les licenciements, ce qui inclut et dépasse la limitation des licenciements économiques dans les entreprises qui réalisent des bénéfices. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0022 · anasse-kazib · travail-plateformes-presomption-salariat
- **Énoncé :** Les travailleurs des plateformes numériques doivent être présumés salariés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Fin de la sous-traitance et CDI pour tous·tes. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande un CDI pour tous les travailleurs, sans viser explicitement les travailleurs des plateformes ni une présomption de salariat, d'où 1 plutôt que 2.

### P0023 · anasse-kazib · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Retraite à 60 ans et 55 ans pour les métiers pénibles, sans conditions d'annuité. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande la retraite à 60 ans, soit un abaissement plus important que le retour à 62 ans de l'énoncé, d'où 1 plutôt que 2.

### P0024 · anasse-kazib · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Retraite à 60 ans et 55 ans pour les métiers pénibles, sans conditions d'annuité. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande la retraite à 60 ans, ce qui est l'inverse explicite d'un report au-delà de 64 ans, d'où -2.

### P0025 · anasse-kazib · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Répartition du travail pour une semaine de 28h sans baisse de salaire. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme propose une semaine de 28 heures, soit une réduction plus forte que les 32 heures de l'énoncé, d'où 1 plutôt que 2.

### P0026 · anasse-kazib · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « SMIC à 2000 € net, revalorisation de toutes les allocations, augmentation des salaires de 500 €, indexation sur l'inflation. »
- **Source :** Programme : Anasse Kazib 2027 (anasse2027.fr) — programme, 2026 — https://anasse2027.fr/programme
- **Justification :** Le programme demande de porter le SMIC à 2000 euros net, soit une hausse nettement supérieure à l'inflation, d'où 2.

## Bruno Retailleau (Les Républicains) — 31 positions

### P0027 · bruno-retailleau · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Suppression des PTGE et déclaration des retenues d'eau agricoles comme étant d'Intérêt général majeur »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de supprimer les projets de territoire pour la gestion de l'eau et de déclarer les retenues d'eau agricoles d'intérêt général majeur, mesures qui facilitent directement leur construction.

### P0028 · bruno-retailleau · democratie-champ-referendum-inchange
- **Énoncé :** Le référendum sur un texte de loi doit rester limité à ses sujets actuels (notamment institutions, politique économique, sociale ou environnementale), sans être étendu à tous les domaines de la loi.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « le peuple français doit pouvoir décider, par référendum, de toute question législative »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat veut élargir l'article 11 pour que toute question législative puisse être soumise à référendum, contraire explicite du maintien du champ actuel.

### P0029 · bruno-retailleau · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « le peuple français doit pouvoir décider, par référendum, de toute question législative »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat propose d'ouvrir le référendum à toute question législative, ce qui va à l'encontre d'un usage exceptionnel, sans se prononcer sur la fréquence de son recours.

### P0030 · bruno-retailleau · democratie-seuil-rip-maintenu-v2
- **Énoncé :** Le seuil de soutien d'un dixième des électeurs inscrits doit être maintenu pour déclencher un référendum d'initiative partagée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « alléger les contraintes nécessaires à l'organisation d'un référendum d'initiative partagée : plutôt que 5 millions de signatures, il en faudrait moitié moins »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat veut diviser par deux le nombre de soutiens requis pour un référendum d'initiative partagée, contraire explicite du maintien du seuil d'un dixième des inscrits.

### P0031 · bruno-retailleau · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer, dès le lendemain de l'élection, les 50 règles qui paralysent le plus nos entreprises »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose explicitement de supprimer cinquante règles pesant sur les entreprises dès le début du quinquennat, puis de poursuivre la déréglementation.

### P0032 · bruno-retailleau · economie-assouplir-seuils-effectifs
- **Énoncé :** Les obligations liées aux seuils d'effectifs des entreprises doivent être assouplies.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Seuil de 50 salariés Relèvement du seuil à 100 salariés pour toutes les obligations »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de relever de 50 à 100 salariés le seuil déclenchant les obligations, ce qui assouplit directement les obligations liées aux seuils d'effectifs.

### P0033 · bruno-retailleau · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous mettrons fin aux soutiens publics aux nouvelles capacités solaires et éoliennes »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret prévoit la fin des soutiens publics aux nouvelles capacités éoliennes, ce qui va dans le sens contraire d'une accélération, sans viser spécifiquement l'éolien terrestre.

### P0034 · bruno-retailleau · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « La prolongation de l'exploitation des réacteurs jusqu'à quatre-vingts ans, lorsque les conditions de sûreté le permettront »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de prolonger les réacteurs existants jusqu'à quatre-vingts ans sous réserve de sûreté, ce qui correspond à la mesure de l'énoncé.

### P0035 · bruno-retailleau · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous mettrons fin aux soutiens publics aux nouvelles capacités solaires et éoliennes »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret prévoit la fin des soutiens publics aux nouvelles capacités solaires et éoliennes, sans viser les aides déjà accordées aux installations existantes.

### P0036 · bruno-retailleau · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « reporterons les projets déjà autorisés lorsque la situation de surcapacité l'exigera »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret prévoit de reporter les projets solaires et éoliens déjà autorisés en cas de surcapacité, soit une suspension conditionnelle et non générale.

### P0037 · bruno-retailleau · environnement-limiter-recours-projets-v2
- **Énoncé :** Les possibilités de recours juridictionnel contre les autorisations de projets industriels doivent être limitées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « ouvrant la voie à des procédures simplifiées et sécurisées, tout en limitant strictement les recours dilatoires »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret veut limiter strictement les recours dilatoires contre la remise en service des friches industrielles, version partielle (friches, recours dilatoires) de la limitation des recours contre les autorisations de projets industriels.

### P0038 · bruno-retailleau · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Loi anti-gaspillage pour une économie circulaire (AGEC) et interdiction plastiques/PFAS Moratoire immédiat sur toute interdiction allant au-delà des règlements européens »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose un moratoire sur les interdictions de plastiques allant au-delà du droit européen, ce qui va contre de nouvelles interdictions nationales sans viser explicitement l'échéance de 2030.

### P0039 · bruno-retailleau · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « le mécanisme d'ajustement carbone aux frontières sera renforcé et étendu aux produits transformés »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de renforcer et d'étendre le mécanisme d'ajustement carbone aux frontières, qui fait payer les émissions des produits importés.

### P0040 · bruno-retailleau · fiscalite-baisse-cotisations-salaries
- **Énoncé :** Les cotisations sociales payées par les salariés doivent baisser.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Au-delà, les heures travaillées sont exonérées de cotisations sociales, salariales comme patronales. »
- **Source :** Nos propositions pour la France : travail gagnant (Les Républicains, PDF) — livre_plateforme, 2026-01 — https://republicains.fr/wp-content/uploads/2026/01/51705_LesRepublicains_Brochures_A5-40P_DEF.pdf
- **Justification :** Le livret propose d'exonérer de cotisations salariales les heures travaillées au-delà de 1 623 heures par an, une baisse limitée à ces heures et non générale.

### P0041 · bruno-retailleau · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réduire franchement les prélèvements obligatoires »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret fait de la réduction des prélèvements obligatoires une proposition explicite, chiffrée à environ 40 milliards d'euros.

### P0042 · bruno-retailleau · fiscalite-reduire-allegements-cotisations
- **Énoncé :** Les allègements de cotisations sociales accordés aux employeurs sur les salaires doivent être réduits.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Plus de 25 milliards d'euros d'allègements porteront sur le coût du travail, en combinant la mise en place du seuil " zéro cotisation ", tel que présenté dans Travail gagnant, et une baisse directe des cotisations patronales non contributives. »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret prévoit plus de 25 milliards d'euros d'allègements supplémentaires de cotisations patronales, contraire explicite d'une réduction de ces allègements.

### P0043 · bruno-retailleau · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « tant qu'il n'y a pas de cession, il n'y a pas d'imposition »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de différer l'exigibilité des droits de mutation sur les entreprises transmises tant qu'elles ne sont pas cédées, une mesure limitée au capital productif.

### P0044 · bruno-retailleau · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « un allègement ciblé de près de 15 milliards d'euros de la fiscalité de production »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de supprimer la C3S et la CVAE et d'alléger d'environ 15 milliards d'euros des impôts de production évalués à 95 milliards, soit une suppression partielle.

### P0045 · bruno-retailleau · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la fin des aides sociales automatiques pour les étrangers, qui avait été votée par le Parlement mais censurée par le Conseil constitutionnel, serait appliquée aujourd'hui »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat souhaite appliquer la fin des aides sociales automatiques pour les étrangers votée puis censurée, sans préciser dans l'entretien la durée de résidence exigée.

### P0046 · bruno-retailleau · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « abolir le droit du sol »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat propose explicitement d'abolir le droit du sol.

### P0047 · bruno-retailleau · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Des compétences nouvelles seront transférées aux collectivités, qui connaissent mieux que personne leurs besoins. »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret veut transférer de nouvelles compétences éducatives aux collectivités, mouvement inverse d'un transfert vers l'État, mais dans le seul domaine de l'éducation, d'où -1.

### P0048 · bruno-retailleau · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « je propose qu'une loi organique puisse revenir sur une jurisprudence européenne si elle est contraire à nos intérêts fondamentaux »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat, citant les arrêts de la CEDH sur les expulsions, propose qu'une loi organique puisse écarter une jurisprudence européenne, donc ne pas exécuter certains arrêts.

### P0049 · bruno-retailleau · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Je veux donc préciser à l'article 88 de notre Constitution que le droit européen ne sera supérieur à la loi qu'à deux conditions. »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat veut que le droit de l'Union ne prime la loi que s'il respecte la Constitution et la répartition des compétences, tout en écartant un « Frexit juridique », position conditionnée d'où 1.

### P0050 · bruno-retailleau · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « si aujourd'hui les peines minimales existent, leur application dépend du juge. Je veux qu'elles soient désormais obligatoires »
- **Source :** « En France, la seule cour suprême, c'est le peuple. Je lui donnerai le dernier mot » (entretien au Figaro, Les Républicains) — declaration_vote, 2026-09-02 — https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/
- **Justification :** Le candidat veut rendre les peines minimales obligatoires, sans mentionner spécifiquement les récidivistes.

### P0051 · bruno-retailleau · justice-sanction-financiere-parents
- **Énoncé :** Les parents de mineurs délinquants doivent pouvoir être sanctionnés financièrement.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les parents des élèves violents ou durablement absentéistes seront responsabilisés, accompagnés au sein des conseils des droits et devoirs des familles, rendus obligatoires dans les communes de plus de 5 000 habitants, jusqu'à, s'il le faut, réduire ou suspendre les allocations »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret prévoit de pouvoir réduire ou suspendre les allocations des parents d'élèves violents ou absentéistes, une variante voisine qui ne vise pas la délinquance des mineurs en général.

### P0052 · bruno-retailleau · numerique-telephone-interdit-lycees
- **Énoncé :** L'usage du téléphone portable doit être interdit dans l'enceinte des lycées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « le téléphone interdit dans l'enceinte des établissements jusqu'à la fin du lycée »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret propose explicitement d'interdire le téléphone dans l'enceinte des établissements jusqu'à la fin du lycée.

### P0053 · bruno-retailleau · societe-instruction-famille-autorisation
- **Énoncé :** L'instruction en famille doit rester soumise à une autorisation préalable.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « nous rendrons aux parents qui le souhaitent la liberté d'instruire leur enfant en famille jusqu'à six ans »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret propose de rétablir la liberté d'instruction en famille, mais seulement jusqu'à six ans, ce qui s'oppose partiellement au régime d'autorisation préalable.

### P0054 · bruno-retailleau · societe-signes-religieux-sorties-scolaires
- **Énoncé :** Le port de signes religieux doit être interdit aux accompagnateurs de sorties scolaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « La neutralité de la loi de 2004 sera étendue aux accompagnateurs des sorties scolaires »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret propose d'étendre aux accompagnateurs de sorties scolaires l'interdiction des signes religieux prévue par la loi de 2004.

### P0055 · bruno-retailleau · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « le port de l'uniforme encouragé »
- **Source :** Nos propositions pour la France : éducation (Les Républicains, PDF) — livre_plateforme, 2026-08 — https://republicains.fr/wp-content/uploads/2026/09/LR_Ecole_vF.pdf
- **Justification :** Le livret propose d'encourager le port de l'uniforme sans le rendre obligatoire, une version plus faible de l'énoncé.

### P0056 · bruno-retailleau · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « réformer l'assurance chômage, en resserrant les conditions d'indemnisation »
- **Source :** Nos propositions pour la France : travail gagnant (Les Républicains, PDF) — livre_plateforme, 2026-01 — https://republicains.fr/wp-content/uploads/2026/01/51705_LesRepublicains_Brochures_A5-40P_DEF.pdf
- **Justification :** Le livret propose explicitement de resserrer les conditions d'indemnisation du chômage, notamment la durée maximale et l'indemnisation des ruptures conventionnelles.

### P0057 · bruno-retailleau · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « créer un étage de retraite par capitalisation pour tous »
- **Source :** Nos propositions pour la France : produire plus pour vivre mieux (Les Républicains, PDF) — livre_plateforme, 2026-02 — https://republicains.fr/wp-content/uploads/2026/02/LR_Produire_Plus_LIVRET.pdf
- **Justification :** Le livret propose de créer un étage de retraite par capitalisation, complémentaire et volontaire, venant s'ajouter à la répartition.

## David Lisnard (Nouvelle Énergie) — 42 positions

### P0058 · david-lisnard · democratie-champ-referendum-inchange
- **Énoncé :** Le référendum sur un texte de loi doit rester limité à ses sujets actuels (notamment institutions, politique économique, sociale ou environnementale), sans être étendu à tous les domaines de la loi.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « L'article 11 sera libéré de ses limites thématiques : tout sujet pourra être soumis au pays - l'immigration, l'école, la justice, la dépense publique. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours veut supprimer les limites thématiques de l'article 11 pour que tout sujet puisse être soumis à référendum, soit le contraire explicite du maintien du champ actuel.

### P0059 · david-lisnard · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le référendum d'initiative populaire sera vraiment institué et rendu praticable, avec un seuil de signatures atteignable et, au terme du délai, un vote garanti. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours annonce l'institution d'un référendum d'initiative populaire déclenché par un seuil de signatures, ce qui correspond à la mesure de l'énoncé.

### P0060 · david-lisnard · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Le référendum d'initiative populaire sera vraiment institué et rendu praticable, avec un seuil de signatures atteignable et, au terme du délai, un vote garanti. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours prévoit un référendum déclenché par les citoyens avec vote garanti, ce qui retire au président et au Parlement l'exclusivité du déclenchement d'un référendum national.

### P0061 · david-lisnard · democratie-seuil-rip-maintenu-v2
- **Énoncé :** Le seuil de soutien d'un dixième des électeurs inscrits doit être maintenu pour déclencher un référendum d'initiative partagée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Le référendum d'initiative populaire sera vraiment institué et rendu praticable, avec un seuil de signatures atteignable et, au terme du délai, un vote garanti. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours réclame un seuil de signatures « atteignable » pour le référendum d'initiative populaire, sans nommer le RIP ni chiffrer le seuil, d'où -1 plutôt que -2.

### P0062 · david-lisnard · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « diviser par deux les contraintes administratives imposées aux entreprises et aux citoyens. »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme fixe l'objectif de diviser par deux les contraintes administratives imposées aux entreprises, ce qui correspond à l'allègement de l'énoncé.

### P0063 · david-lisnard · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Comme l'ont montré les exemples de la Suède et de l'Allemagne il est possible de les réduire de 8 points de PIB en 10 ans et de les maintenir en-deçà de 50%. »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme présente comme atteignable une baisse des dépenses publiques de 8 points de PIB en 10 ans, sans engagement chiffré sur la durée d'un quinquennat, d'où 1 plutôt que 2.

### P0064 · david-lisnard · economie-regle-equilibre-constitution
- **Énoncé :** Une règle d'équilibre des comptes publics doit être inscrite dans la Constitution.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la France doit désormais s'astreindre à une règle institutionnelle de limitation des déficits publics »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme propose une « règle d'or » institutionnelle limitée aux dépenses de fonctionnement, sans préciser son inscription dans la Constitution, d'où 1 plutôt que 2.

### P0065 · david-lisnard · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Les agences redondantes seront supprimées. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours annonce la suppression des agences redondantes de l'État, ce qui correspond à la mesure de l'énoncé.

### P0066 · david-lisnard · energie-fonds-publics-renouvelables
- **Énoncé :** Les fonds publics consacrés à l'énergie doivent aller en priorité aux énergies renouvelables plutôt qu'au nucléaire.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Il faut mettre un terme à cette gabegie en faisant rentrer ces projets dans le droit commun et réinvestir les sommes ainsi économisées dans des projets d'avenir, en particulier les nouvelles technologies nucléaires »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme propose de réorienter vers les nouvelles technologies nucléaires les sommes consacrées aux énergies renouvelables, soit la priorité inverse de celle de l'énoncé.

### P0067 · david-lisnard · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « construction d'EPR de nouvelle génération, déploiement de mini-réacteurs nucléaires »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme prévoit le déploiement de mini-réacteurs nucléaires financé par les sommes réinvesties dans les nouvelles technologies nucléaires, ce qui correspond à la mesure de l'énoncé.

### P0068 · david-lisnard · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Il est plus que temps de sortir de l'ambiguïté et de l'hypocrisie sur le nucléaire et affirmer sa priorité. »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme affirme la priorité du nucléaire dans la production d'énergie décarbonée sans se prononcer explicitement sur sa part dans le mix électrique, d'où -1 plutôt que -2.

### P0069 · david-lisnard · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il faut mettre un terme à cette gabegie en faisant rentrer ces projets dans le droit commun »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme veut faire rentrer dans le droit commun les projets renouvelables « dérogatoires aux prix du marché », ce qui revient à mettre fin à leur soutien tarifaire sans parler explicitement de suppression des aides, d'où 1 plutôt que 2.

### P0070 · david-lisnard · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « l'objectif vital de baisse de la part des Prélèvements Obligatoires par rapport au PIB »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme qualifie d'objectif vital la baisse de la part des prélèvements obligatoires dans le PIB, ce qui correspond à l'énoncé.

### P0071 · david-lisnard · fiscalite-quotient-familial-credit-enfant
- **Énoncé :** Le quotient familial doit être remplacé par un crédit d'impôt du même montant pour chaque enfant, quel que soit le revenu des parents.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « la France doit relancer sa politique familiale dans ses trois dimensions : des allocations financières, notamment par le déplafonnement du quotient familial »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme veut déplafonner le quotient familial, ce qui le renforce au lieu de le remplacer par un crédit d'impôt uniforme par enfant, sans rejeter nommément ce remplacement, d'où -1.

### P0072 · david-lisnard · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'allègement de la fiscalité des entreprises doit se poursuivre par la diminution des impôts de production à travers la suppression de plusieurs contributions (C3S, CVAE…) ainsi que la réforme des droits de succession sur les entreprises. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme inscrit une réforme des droits de succession sur les entreprises dans l'allègement de leur fiscalité, sans viser l'ensemble des transmissions familiales ni chiffrer la baisse, d'où 1 plutôt que 2.

### P0073 · david-lisnard · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « soit au total une diminution de moitié des impôts de production, de 2% à 1% du PIB »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme propose de diviser par deux les impôts de production en supprimant certaines contributions (C3S, CVAE), et non de les supprimer tous, d'où 1 plutôt que 2.

### P0074 · david-lisnard · immigration-ame-soins-urgents
- **Énoncé :** L'aide médicale d'État doit être limitée aux soins urgents.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer l'Aide Médicale d'État (AME) et la remplacer par une aide d'urgence »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme propose de remplacer l'AME par une aide d'urgence, ce qui correspond à la limitation aux soins urgents de l'énoncé.

### P0075 · david-lisnard · immigration-amende-sejour-irregulier
- **Énoncé :** Le séjour irrégulier en France doit être sanctionné par une amende.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablir le délit de séjour irrégulier »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme propose de rétablir le délit de séjour irrégulier sans préciser la peine encourue, d'où 1 plutôt que 2 face à une sanction par amende.

### P0076 · david-lisnard · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Traiter les demandes d'asiles au sein de nos consulats à l'étranger »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme veut instruire les demandes d'asile dans les consulats à l'étranger, variante voisine de centres situés hors de l'Union européenne, d'où 1 plutôt que 2.

### P0077 · david-lisnard · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Expulser systématiquement les étrangers condamnés pour délits graves et les fichés S étrangers »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme prévoit l'expulsion systématique des étrangers condamnés pour délits graves, ce qui est voisin mais ne vise pas toute peine de prison ferme, d'où 1 plutôt que 2.

### P0078 · david-lisnard · immigration-plafond-annuel-admissions
- **Énoncé :** Le Parlement doit fixer chaque année un plafond du nombre d'étrangers admis au séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Pour l'immigration légale des quotas d'immigration doivent désormais être instaurés en fonction des stricts besoins économiques des secteurs " sous tension " limitativement définis. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme propose des quotas d'immigration légale liés aux besoins économiques, sans préciser un plafond annuel global fixé par le Parlement, d'où 1 plutôt que 2.

### P0079 · david-lisnard · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Conditionner les prestations sociales non contributives aux étrangers résidant régulièrement sur le territoire national depuis au moins cinq ans »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme propose de réserver les prestations sociales non contributives aux étrangers résidant régulièrement en France depuis au moins cinq ans, ce qui correspond à l'énoncé.

### P0080 · david-lisnard · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « conditionner le regroupement familial à des critères de ressources et des tests d'intégration »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme propose de conditionner le regroupement familial à des critères de ressources, ce qui correspond au durcissement de l'énoncé.

### P0081 · david-lisnard · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « supprimer toute possibilité d'être régularisé après être entré clandestinement sur le territoire. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme exclut toute régularisation des personnes entrées clandestinement, ce qui s'oppose à l'énoncé pour cette catégorie sans viser les autres étrangers sans titre, d'où -1 plutôt que -2.

### P0082 · david-lisnard · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « supprimer toute possibilité d'être régularisé après être entré clandestinement sur le territoire. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme exclut toute régularisation des personnes entrées clandestinement, y compris par le travail, sans viser les autres étrangers sans titre, d'où -1 plutôt que -2.

### P0083 · david-lisnard · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin à l'automaticité du droit du sol »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme propose de mettre fin à l'automaticité du droit du sol, version partielle de sa suppression, d'où 1 plutôt que 2.

### P0084 · david-lisnard · institutions-adaptation-lois-regions
- **Énoncé :** Les régions doivent obtenir un pouvoir d'adaptation des lois à leur territoire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « transférer le pouvoir normatif d'application de la loi (celle-ci restant par définition nationale dans notre pays, qui n'est pas et ne doit pas être un Etat fédéral) aux collectivités territoriales »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme transfère aux collectivités le pouvoir réglementaire d'application de la loi, la loi restant nationale, d'où 1 ; le discours de Bayeux exclut des lois différentes selon les territoires, ce qui va en sens contraire.

### P0085 · david-lisnard · institutions-autonomie-fiscale-collectivites
- **Énoncé :** Les collectivités locales doivent disposer d'une plus grande autonomie fiscale.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les recettes fiscales et autres ressources propres doivent redevenir " une part déterminante de l'ensemble de leurs ressources ". »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme veut que les ressources propres des collectivités redeviennent déterminantes, tout en envisageant un partage de recettes fiscales nationales plutôt qu'un pouvoir fiscal propre, d'où 1 plutôt que 2.

### P0086 · david-lisnard · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Le principe de base de la nouvelle décentralisation serait de transférer aux collectivités territoriales, outre l'essentiel des compétences aujourd'hui exercées par l'Etat »
- **Source :** Programme 2027, axe 3 : « Générer un renouveau civique » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/generer-un-renouveau-civique/
- **Justification :** Le programme veut transférer aux collectivités l'essentiel des compétences de l'État, soit le mouvement inverse d'un transfert de compétences des collectivités vers l'État.

### P0087 · david-lisnard · institutions-mandat-presidentiel-sept-ans
- **Énoncé :** Le mandat présidentiel doit être porté à sept ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le septennat sera rétabli. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours annonce le rétablissement du septennat, ce qui correspond à la mesure de l'énoncé.

### P0088 · david-lisnard · institutions-referendum-revision-constitution
- **Énoncé :** Le président de la République doit pouvoir soumettre directement au référendum une révision de la Constitution.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « La Constitution doit pouvoir, à terme, être révisée directement par référendum : c'est la voie que de Gaulle a ouverte en 1962. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours propose que la Constitution puisse être révisée directement par référendum, sur le modèle de 1962, ce qui correspond à l'énoncé.

### P0089 · david-lisnard · institutions-supprimer-senat
- **Énoncé :** Le Sénat doit être supprimé.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Et le Sénat retrouvera une mission essentielle que l'on a laissé glisser vers la Cour des comptes et les juridictions : évaluer les politiques publiques. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours assigne au Sénat une mission d'évaluation des politiques publiques, ce qui suppose son maintien sans rejet explicite de sa suppression, d'où -1 plutôt que -2.

### P0090 · david-lisnard · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Inscrire la primauté du droit national en matière migratoire dans la Constitution afin de rendre inapplicables les décisions de la CJUE et de la CEDH contraires à l'intérêt national »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme veut rendre inapplicables les décisions de la CEDH contraires à l'intérêt national, c'est-à-dire pouvoir ne pas exécuter certains de ses arrêts.

### P0091 · david-lisnard · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Inscrire la primauté du droit national en matière migratoire dans la Constitution afin de rendre inapplicables les décisions de la CJUE et de la CEDH contraires à l'intérêt national »
- **Source :** Programme 2027 : immigration (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/immigration/
- **Justification :** Le programme affirme la primauté du droit national sur les décisions de la CJUE, mais en matière migratoire seulement, d'où 1 plutôt que 2.

### P0092 · david-lisnard · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il importe donc de redéfinir les compétences indispensables à la plus-value européenne, pour lesquelles l'Europe doit agir en pleine capacité et les compétences qui doivent rester de niveau national ou régional. »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme propose de redéfinir le partage des compétences entre l'Europe et les États, sans mentionner explicitement une renégociation des traités, d'où 1 plutôt que 2.

### P0093 · david-lisnard · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « par l'augmentation des places de prison »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme prévoit d'augmenter le nombre de places de prison, soit la mesure inverse de l'énoncé.

### P0094 · david-lisnard · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il y aurait un paradoxe à reprendre le contrôle de notre Constitution, de nos lois et de nos frontières, pour livrer nos données et nos systèmes à des serveurs que nous ne maîtrisons pas. »
- **Source :** Discours de David Lisnard à Bayeux, 17 juin 2026 (Nouvelle Énergie, PDF) — declaration_vote, 2026-06-17 — https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf
- **Justification :** Le discours refuse que l'intelligence artificielle publique repose sur des serveurs non maîtrisés, sans évoquer les logiciels libres ni un hébergement européen, d'où 1 plutôt que 2.

### P0095 · david-lisnard · securite-pouvoirs-polices-municipales
- **Énoncé :** Les polices municipales doivent recevoir les mêmes pouvoirs d'enquête que la police nationale.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « l'attribution de la qualité d'officiers et d'agents de police judiciaire aux polices territoriales décentralisées. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme attribue aux polices territoriales la qualité d'officiers et d'agents de police judiciaire, ce qui leur donne les pouvoirs d'enquête de la police nationale.

### P0096 · david-lisnard · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « la norme de l'âge légal de 65 ans est un impératif national urgent »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme fixe l'âge légal à 65 ans, ce qui est contraire au retour à 62 ans.

### P0097 · david-lisnard · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « la norme de l'âge légal de 65 ans est un impératif national urgent »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme fixe l'âge légal de départ à 65 ans, au-delà de 64 ans.

### P0098 · david-lisnard · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « faire évoluer tous les autres régimes vers la capitalisation, à partir des cotisations obligatoires des salariés et des employeurs. »
- **Source :** Programme 2027, axe 2 : « Réussir une nouvelle ambition française » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/
- **Justification :** Le programme prévoit de faire évoluer vers la capitalisation tous les régimes au-delà d'un socle minimal par répartition, soit environ 40 % des retraites.

### P0099 · david-lisnard · travail-statut-fonction-publique-regalien
- **Énoncé :** Le statut de fonctionnaire doit être réservé aux missions régaliennes de l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « réformer les trois fonctions publiques, pour développer une fonction publique de métier et systématiser le contrat dans les fonctions non-régaliennes »
- **Source :** Programme 2027, axe 1 : « Être maître de notre destin » (Nouvelle Énergie) — programme, 2026 — https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/
- **Justification :** Le programme propose de systématiser le contrat dans les fonctions non régaliennes, ce qui réserve de fait le statut aux missions régaliennes.

## Delphine Batho (Génération Écologie) — 10 positions

### P0100 · delphine-batho · agriculture-alleger-normes-agricoles
- **Énoncé :** Les normes environnementales imposées aux agriculteurs français doivent être allégées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « La loi no 2025-794 du 11 août 2025 visant à lever les contraintes à l'exercice du métier d'agriculteur est abrogée. »
- **Source :** Proposition de loi n° 1842 visant à abroger la loi n° 2025-794 du 11 août 2025, dite loi Duplomb, à rendre définitive l’interdiction des néonicotinoïdes en France, à tenir compte du dernier état des connaissances scientifiques et à lutter contre la concurrence déloyale en matière de pesticides (Assemblée nationale) — declaration_vote, 2025-09-16 — https://www.assemblee-nationale.fr/dyn/17/textes/l17b1842_proposition-loi.pdf
- **Justification :** La proposition de loi déposée par la candidate abroge la loi Duplomb, qui allégeait plusieurs règles environnementales applicables aux agriculteurs (pesticides, élevage, eau, police de l'environnement), soit le rejet explicite d'un allègement de ces normes, d'où -2.

### P0101 · delphine-batho · agriculture-derogations-neonicotinoides
- **Énoncé :** Les agriculteurs doivent pouvoir obtenir des dérogations pour utiliser des insecticides néonicotinoïdes.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « les néonicotinoïdes doivent être définitivement et strictement interdits. »
- **Source :** Proposition de loi n° 1842 visant à abroger la loi n° 2025-794 du 11 août 2025, dite loi Duplomb, à rendre définitive l’interdiction des néonicotinoïdes en France, à tenir compte du dernier état des connaissances scientifiques et à lutter contre la concurrence déloyale en matière de pesticides (Assemblée nationale) — declaration_vote, 2025-09-16 — https://www.assemblee-nationale.fr/dyn/17/textes/l17b1842_proposition-loi.pdf
- **Justification :** La proposition de loi déposée par la candidate rétablit l'interdiction pleine et entière des néonicotinoïdes et supprime le mécanisme de dérogation, soit le contraire explicite de l'énoncé, d'où -2.

### P0102 · delphine-batho · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous devons accomplir en cinq ans le passage de l'ensemble de l'agriculture française à l'agriculture biologique et à l'agroécologie »
- **Source :** Delphine Batho : « Je ne multiplie pas les candidatures à gauche, je suis la seule candidate de l’écologie » (Reporterre) — declaration_vote, 2026-10-16 — https://reporterre.net/Delphine-Batho-Je-ne-multiplie-pas-les-candidatures-a-gauche-je-suis-la-seule-candidate-de-l-ecologie
- **Justification :** La candidate propose de convertir toute l'agriculture à l'agriculture biologique en cinq ans, ce qui va au-delà d'une réduction de moitié des pesticides de synthèse mais sans objectif chiffré de réduction ni échéance 2030, d'où 1 plutôt que 2.

### P0103 · delphine-batho · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « C'est pourquoi il est nécessaire d'instaurer un moratoire sur la construction d'ouvrages de stockage de l'eau à usage d'irrigation agricole »
- **Source :** Proposition de loi n° 199 instaurant un moratoire sur la construction d’ouvrages de stockage de l’eau à usage d’irrigation agricole et réformant le code de l’environnement concernant l’usage de l’eau en agriculture (Assemblée nationale) — declaration_vote, 2024-09-17 — https://www.assemblee-nationale.fr/dyn/17/textes/l17b0199_proposition-loi.pdf
- **Justification :** La proposition de loi déposée par la candidate instaure un moratoire sur les autorisations de nouvelles retenues d'eau pour l'irrigation et interdit leur financement par les agences de l'eau, soit le contraire explicite de l'énoncé, d'où -2.

### P0104 · delphine-batho · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Aucun accord de libre-échange ne peut être conclu sans la mise en place de mesures miroirs »
- **Source :** Proposition de loi n° 1842 visant à abroger la loi n° 2025-794 du 11 août 2025, dite loi Duplomb, à rendre définitive l’interdiction des néonicotinoïdes en France, à tenir compte du dernier état des connaissances scientifiques et à lutter contre la concurrence déloyale en matière de pesticides (Assemblée nationale) — declaration_vote, 2025-09-16 — https://www.assemblee-nationale.fr/dyn/17/textes/l17b1842_proposition-loi.pdf
- **Justification :** La proposition de loi déposée par la candidate subordonne la conclusion de tout accord de libre-échange à des mesures miroirs sur les pesticides, ce qui restreint ces accords sans s'opposer à leur principe, d'où -1 plutôt que -2.

### P0105 · delphine-batho · energie-consommation-moitie-2050
- **Énoncé :** La consommation d'énergie finale de la France doit baisser de moitié d'ici 2050.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous devons réduire notre consommation d'énergie et lutter contre le gaspillage. »
- **Source :** La sécurité climatique et la paix (site de Delphine Batho) — programme, 2026-11 — https://delphinebatho.fr/priorites/la-securite-climatique-et-la-paix/
- **Justification :** Le programme demande de réduire la consommation d'énergie sans fixer d'objectif chiffré ni d'échéance, d'où 1 plutôt que 2.

### P0106 · delphine-batho · environnement-faciliter-derogation-especes
- **Énoncé :** Un projet industriel ou d'aménagement doit pouvoir obtenir plus facilement une dérogation à l'interdiction de détruire des espèces protégées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « en accordant de façon systématique à ces ouvrages le bénéfice de la raison impérative d'intérêt public majeur, porte atteinte à la protection des espèces protégées et de leurs habitats. »
- **Source :** Proposition de loi n° 1842 visant à abroger la loi n° 2025-794 du 11 août 2025, dite loi Duplomb, à rendre définitive l’interdiction des néonicotinoïdes en France, à tenir compte du dernier état des connaissances scientifiques et à lutter contre la concurrence déloyale en matière de pesticides (Assemblée nationale) — declaration_vote, 2025-09-16 — https://www.assemblee-nationale.fr/dyn/17/textes/l17b1842_proposition-loi.pdf
- **Justification :** La proposition de loi déposée par la candidate abroge la présomption de raison impérative d'intérêt public majeur accordée aux retenues d'eau, qui facilitait les dérogations espèces protégées, mais pour ce seul type d'ouvrage, d'où -1.

### P0107 · delphine-batho · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les superprofits sur les énergies fossiles sont les premiers à devoir être mis à contribution. »
- **Source :** Pour un État-Résilience, contribution au plan national d’adaptation au changement climatique (Génération Écologie) — livre_plateforme, 2024-12-27 — https://www.generationecologie.fr/2024/12/27/pour-un-etat-resilience/
- **Justification :** La contribution de Génération Écologie demande de mettre à contribution les superprofits des énergies fossiles pour financer une branche climatique de la sécurité sociale, ce qui vise un seul secteur sans préciser la forme d'une taxe, d'où 1 plutôt que 2.

### P0108 · delphine-batho · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « C'est pourquoi je plaide pour une réorganisation des pouvoirs en France, en donnant beaucoup plus de pouvoir au local. »
- **Source :** Delphine Batho : « Je ne multiplie pas les candidatures à gauche, je suis la seule candidate de l’écologie » (Reporterre) — declaration_vote, 2026-10-16 — https://reporterre.net/Delphine-Batho-Je-ne-multiplie-pas-les-candidatures-a-gauche-je-suis-la-seule-candidate-de-l-ecologie
- **Justification :** La candidate veut donner beaucoup plus de pouvoir au niveau local, à l'inverse d'un transfert de compétences vers l'État, sans se prononcer précisément sur la répartition des compétences, d'où -1.

### P0109 · delphine-batho · numerique-assouplir-regles-ia
- **Énoncé :** Les règles européennes encadrant l'intelligence artificielle doivent être assouplies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Sans attendre, elle doit mettre en œuvre tout ce que permet déjà la réglementation européenne pour stopper le pillage des œuvres d'art et des productions intellectuelles »
- **Source :** La beauté pour vivre mieux (site de Delphine Batho) — programme, 2026-11 — https://delphinebatho.fr/priorites/la-beaute-pour-vivre-mieux/
- **Justification :** Le programme demande d'appliquer pleinement la réglementation européenne existante et de réguler l'intelligence artificielle, sans se prononcer explicitement contre un assouplissement des règles européennes, d'où -1 plutôt que -2.

## Édouard Philippe (Horizons) — 49 positions

### P0110 · edouard-philippe · agriculture-alleger-normes-agricoles
- **Énoncé :** Les normes environnementales imposées aux agriculteurs français doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Renforcer la compétitivité de notre agriculture : zéro surtransposition agricole »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme exclut toute surtransposition des normes agricoles, ce qui limite les normes nationales sans annoncer d'allègement général des normes environnementales existantes.

### P0111 · edouard-philippe · agriculture-retenues-eau-irrigation
- **Énoncé :** La construction de retenues d'eau pour l'irrigation doit être facilitée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Accélérer le stockage de l'eau agricole en plaçant " la protection avant la procédure " »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme propose d'accélérer le stockage de l'eau agricole en allégeant la procédure, ce qui correspond à faciliter les retenues pour l'irrigation.

### P0112 · edouard-philippe · defense-doubler-reservistes
- **Énoncé :** Le nombre de réservistes opérationnels des armées doit être doublé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Porter le nombre de réservistes de 45 000 à 250 000 »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme prévoit de faire passer les réservistes de 45 000 à 250 000, soit plus qu'un doublement.

### P0113 · edouard-philippe · defense-effectifs-armees-hausse
- **Énoncé :** Les effectifs des armées doivent augmenter d'au moins 10 % d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Lancer une nouvelle LPM (Loi de programmation militaire) de la massification, au-delà de la LPM actuelle qui épaissit les armées sans les étendre. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme annonce une loi de programmation visant à étendre les armées, sans chiffrer la hausse des effectifs d'active ni l'échéance de 2030.

### P0114 · edouard-philippe · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Libérer nos entreprises du poids des impôts et de la bureaucratie »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme vise à libérer les entreprises de la bureaucratie et le discours de Reims annonce une ordonnance de suppression des complexités qu'elles subissent.

### P0115 · edouard-philippe · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Mettre en place une stratégie de sauvetage des dépenses publiques avec 50 % de l'effort sur les dépenses sociales et un quart sur l'État et les collectivités et un quart grâce à la croissance. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme organise la réduction du déficit principalement par la baisse des dépenses sociales, de l'État et des collectivités, et le discours de l'Adidas Arena privilégie la baisse de la dépense à la hausse des impôts.

### P0116 · edouard-philippe · economie-reduire-nombre-fonctionnaires
- **Énoncé :** Le nombre de fonctionnaires doit diminuer au cours du prochain quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer un tiers des fonctionnaires partant à la retraite, soit plus de 250 000 postes sur le quinquennat. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme prévoit la suppression de plus de 250 000 postes de fonctionnaires sur le quinquennat.

### P0117 · edouard-philippe · economie-regle-equilibre-constitution
- **Énoncé :** Une règle d'équilibre des comptes publics doit être inscrite dans la Constitution.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Inscrire dans la Constitution une règle d'or de maîtrise des déficits via un référendum »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme propose d'inscrire une règle d'or budgétaire dans la Constitution ; elle porte sur la maîtrise des déficits plutôt que sur un équilibre strict.

### P0118 · edouard-philippe · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Fusionner et supprimer des dizaines d'opérateurs, d'agences et de comités publics. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme prévoit explicitement la fusion et la suppression de dizaines d'agences et d'opérateurs.

### P0119 · edouard-philippe · energie-centres-donnees-pres-centrales
- **Énoncé :** Les centres de données doivent bénéficier d'un accès prioritaire à l'électricité des centrales nucléaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ouvrir un accès préférentiel à notre énergie décarbonée pour les acteurs nationaux et européens »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Dans le volet sur l'intelligence artificielle, le programme propose un accès préférentiel à l'énergie décarbonée, sans viser nommément les centres de données ni la seule électricité nucléaire.

### P0120 · edouard-philippe · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « lancement de 8 EPR supplémentaires en plus des 6 déjà prévus »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme prévoit huit EPR supplémentaires en plus des six déjà prévus.

### P0121 · edouard-philippe · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Assurer notre souveraineté énergétique en relançant le nucléaire »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme relance le nucléaire tout en développant les renouvelables, ce qui va contre une réduction de la part du nucléaire sans se prononcer explicitement sur cette part.

### P0122 · edouard-philippe · environnement-pause-normes-europeennes
- **Énoncé :** L'Union européenne doit suspendre l'adoption de nouvelles normes environnementales pendant plusieurs années.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Sceller un moratoire normatif et fiscal : pas de nouvelle norme et de nouvel impôt sur le quinquennat. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme propose un moratoire sur toute nouvelle norme pendant le quinquennat, au niveau national et sans viser spécifiquement les normes environnementales européennes.

### P0123 · edouard-philippe · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer un prix du carbone aux frontières européennes »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme propose un prix du carbone aux frontières européennes, c'est-à-dire une taxation des émissions liées aux importations.

### P0124 · edouard-philippe · fiscalite-baisse-cotisations-salaries
- **Énoncé :** Les cotisations sociales payées par les salariés doivent baisser.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rééquilibrer le financement du modèle social pour qu'il ne repose plus uniquement sur le travail et augmenter le salaire net des actifs. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme vise à alléger le financement du modèle social reposant sur le travail pour augmenter le salaire net, sans mentionner explicitement une baisse des cotisations salariales.

### P0125 · edouard-philippe · fiscalite-heures-sup-sans-plafond
- **Énoncé :** Les heures supplémentaires doivent être exonérées d'impôt sur le revenu sans plafond.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « exonérer ces heures de cotisations sociales et d'impôt sur le revenu »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme exonère d'impôt sur le revenu les heures de travail supplémentaires décidées dans l'entreprise, sans préciser l'absence de plafond.

### P0126 · edouard-philippe · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Sceller un moratoire normatif et fiscal : pas de nouvelle norme et de nouvel impôt sur le quinquennat. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme exclut tout nouvel impôt pendant le quinquennat, ce qui s'oppose au rétablissement d'un impôt sur la fortune sans le mentionner nommément.

### P0127 · edouard-philippe · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Sceller un moratoire normatif et fiscal : pas de nouvelle norme et de nouvel impôt sur le quinquennat. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme exclut tout nouvel impôt pendant le quinquennat, ce qui écarte un prélèvement minimal sur les grandes fortunes sans le viser nommément. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0128 · edouard-philippe · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il faut baisser les dépenses sociales, supprimer les niches fiscales, avant de songer à augmenter les impôts de ceux qui travaillent »
- **Source :** Discours d'Édouard Philippe lors de son grand meeting à l'Adidas Arena, 5 juillet 2026 (Horizons) — declaration_vote, 2026-07-05 — https://horizonsleparti.fr/discours-dedouard-philippe-lors-de-son-grand-meeting-a-ladidas-arena-5-juillet-2026/
- **Justification :** Le candidat propose de supprimer des niches fiscales, sans fixer l'ampleur d'une réduction de moitié.

### P0129 · edouard-philippe · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « 50 Md€ de baisses d'impôts de production contre 50 Md€ d'aides publiques improductives en moins »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme prévoit une baisse de 50 Md€ des impôts de production, et non leur suppression totale.

### P0130 · edouard-philippe · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Je ne taxerai pas davantage les entreprises qui payent déjà trop d'impôts. »
- **Source :** Discours d'Édouard Philippe lors de son grand meeting à l'Adidas Arena, 5 juillet 2026 (Horizons) — declaration_vote, 2026-07-05 — https://horizonsleparti.fr/discours-dedouard-philippe-lors-de-son-grand-meeting-a-ladidas-arena-5-juillet-2026/
- **Justification :** Le candidat refuse d'alourdir la fiscalité des entreprises et le programme exclut tout nouvel impôt, sans viser nommément une taxe sur les bénéfices exceptionnels.

### P0131 · edouard-philippe · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Être intraitable avec les étrangers délinquants : expulsion immédiate et fin des aides sociales. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme prévoit l'expulsion immédiate des étrangers délinquants, sans préciser le critère d'une condamnation à de la prison ferme ni la perte du titre de séjour.

### P0132 · edouard-philippe · immigration-frais-etudiants-etrangers
- **Énoncé :** Les étudiants étrangers hors Union européenne doivent payer les mêmes frais d'inscription que les étudiants français.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « appliquer réellement la hausse des droits d'inscription des étudiants extra-européens »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme veut appliquer la hausse des droits d'inscription des étudiants extra-européens, soit l'inverse d'un alignement sur les frais des étudiants français.

### P0133 · edouard-philippe · immigration-plafond-annuel-admissions
- **Énoncé :** Le Parlement doit fixer chaque année un plafond du nombre d'étrangers admis au séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre en place une politique de quotas migratoires permettant de choisir notre immigration économique. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme propose des quotas migratoires pour l'immigration économique, sans préciser un plafond global voté chaque année par le Parlement.

### P0134 · edouard-philippe · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Aligner les aides sociales versées aux étrangers sur la moyenne européenne »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme restreint les aides sociales versées aux étrangers par un alignement sur la moyenne européenne, et non par une condition de cinq ans de résidence.

### P0135 · edouard-philippe · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Suspendre le regroupement familial pour la durée du quinquennat. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme propose de suspendre le regroupement familial, mesure plus restrictive mais différente d'un durcissement des conditions de ressources.

### P0136 · edouard-philippe · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Suspendre le droit du sol à Mayotte. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme propose de suspendre le droit du sol à Mayotte uniquement, pas sur l'ensemble du territoire.

### P0137 · edouard-philippe · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « ils ne sont pas sortis de la Convention Européenne des Droits de l'Homme »
- **Source :** Discours d'Édouard Philippe lors de son grand meeting à l'Adidas Arena, 5 juillet 2026 (Horizons) — declaration_vote, 2026-07-05 — https://horizonsleparti.fr/discours-dedouard-philippe-lors-de-son-grand-meeting-a-ladidas-arena-5-juillet-2026/
- **Justification :** Le candidat veut maîtriser l'immigration comme d'autres pays européens, sans réviser la Constitution ni sortir de la CEDH, sans se prononcer explicitement sur la non-exécution de certains arrêts, d'où -1.

### P0138 · edouard-philippe · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Une Europe que nous devons approfondir pour rester libres ! »
- **Source :** Discours d'Édouard Philippe lors de son grand meeting à l'Adidas Arena, 5 juillet 2026 (Horizons) — declaration_vote, 2026-07-05 — https://horizonsleparti.fr/discours-dedouard-philippe-lors-de-son-grand-meeting-a-ladidas-arena-5-juillet-2026/
- **Justification :** Le candidat prône l'approfondissement de l'Union européenne, ce qui va à l'opposé d'un retour de compétences aux États, sans évoquer explicitement la renégociation des traités.

### P0139 · edouard-philippe · justice-comparution-immediate-mineurs
- **Énoncé :** Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « créer la comparution immédiate des mineurs pour ces infractions »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme crée la comparution immédiate des mineurs, limitée aux infractions liées au narcotrafic.

### P0140 · edouard-philippe · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre en place des courtes peines, en s'inspirant des pays du Nord qui condamnent dès la première infraction à une peine courte et dissuasive »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme veut des peines de prison courtes dès la première infraction, soit l'inverse de leur remplacement par des peines alternatives.

### P0141 · edouard-philippe · justice-imprescriptibilite-crimes-sexuels-mineurs
- **Énoncé :** Les crimes sexuels commis sur des mineurs doivent être imprescriptibles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre en place l'imprescriptibilité pour les crimes sur mineur »
- **Source :** Pour une France plus attentive à ses enfants (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-attentive-a-ses-enfants
- **Justification :** Le programme propose l'imprescriptibilité de tous les crimes sur mineur, ce qui inclut les crimes sexuels. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0142 · edouard-philippe · justice-majorite-penale-16-ans
- **Énoncé :** La majorité pénale doit être abaissée à 16 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Lever l'excuse de minorité pour les faits en lien avec le narcotrafic »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme lève l'excuse de minorité pour les seuls faits liés au narcotrafic, sans abaisser la majorité pénale de façon générale.

### P0143 · edouard-philippe · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre en place des peines planchers pour les infractions les plus graves »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme prévoit des peines planchers pour les infractions les plus graves, sans viser spécifiquement la récidive.

### P0144 · edouard-philippe · justice-sanction-financiere-parents
- **Énoncé :** Les parents de mineurs délinquants doivent pouvoir être sanctionnés financièrement.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Créer une " amende de responsabilisation scolaire ", inspirée du modèle britannique, pour les parents d'enfants harceleurs, perturbateurs ou absentéistes »
- **Source :** Pour une France plus attentive à ses enfants (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-attentive-a-ses-enfants
- **Justification :** Le programme crée une amende pour les parents d'enfants harceleurs, perturbateurs ou absentéistes, dans le cadre scolaire plutôt que pour la délinquance des mineurs.

### P0145 · edouard-philippe · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer le juge d'application des peines afin de garantir que ce qu'un juge a décidé ne soit pas défait par un autre que lui. »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme vise à ce que la peine prononcée ne soit pas modifiée après coup, par la suppression du juge d'application des peines plutôt que par celle des réductions automatiques.

### P0146 · edouard-philippe · numerique-assouplir-regles-ia
- **Énoncé :** Les règles européennes encadrant l'intelligence artificielle doivent être assouplies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Simplifier le cadre juridique européen applicable à l'IA, sans renoncer à une régulation éthique et protectrice des enfants. »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme propose de simplifier les règles européennes sur l'intelligence artificielle tout en conservant une régulation éthique, ce qui conditionne l'assouplissement.

### P0147 · edouard-philippe · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Peser à l'échelle européenne avec un " Buy European Tech Act " et des achats technologiques groupés entre États membres. »
- **Source :** Pour une France plus conquérante (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-conquerante
- **Justification :** Le programme propose une préférence européenne dans les achats technologiques publics, sans viser spécifiquement les logiciels utilisés par les administrations.

### P0148 · edouard-philippe · sante-depenses-assurance-maladie-inflation
- **Énoncé :** La croissance des dépenses de l'Assurance maladie doit être limitée à l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Stabiliser les dépenses de santé en dépensant mieux, en misant sur la prévention et les transformations technologiques plutôt que sur la seule hausse des moyens. »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme vise à stabiliser les dépenses de santé sans les indexer explicitement sur l'inflation ; le discours de Reims évoque par ailleurs un investissement massif dans le système de santé.

### P0149 · edouard-philippe · securite-reconnaissance-faciale-police
- **Énoncé :** La reconnaissance faciale en temps réel doit être autorisée dans l'espace public pour la police.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « allant jusqu'à l'utilisation ciblée de la reconnaissance faciale »
- **Source :** Pour une France plus sûre (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-sure
- **Justification :** Le programme autorise une utilisation ciblée de la reconnaissance faciale dans le cadre d'un état d'urgence limité dans le temps et l'espace, et non de façon générale.

### P0150 · edouard-philippe · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** 0 (position intermédiaire explicite)
- **Citation :** « Faire des chefs d'établissements les véritables patrons de l'école : liberté d'adapter les méthodes et les horaires, d'imposer l'uniforme »
- **Source :** Pour une France plus attentive à ses enfants (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-attentive-a-ses-enfants
- **Justification :** Le programme laisse à chaque établissement la liberté d'imposer ou non l'uniforme, sans le rendre obligatoire partout ni l'exclure.

### P0151 · edouard-philippe · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous devrons mettre en oeuvre un grand plan fret ferroviaire pour faire disparaître des millions de camions de nos routes »
- **Source :** Discours d'Édouard Philippe lors de son grand meeting à l'Adidas Arena, 5 juillet 2026 (Horizons) — declaration_vote, 2026-07-05 — https://horizonsleparti.fr/discours-dedouard-philippe-lors-de-son-grand-meeting-a-ladidas-arena-5-juillet-2026/
- **Justification :** Le candidat annonce un grand plan pour le fret ferroviaire face au transport routier, sans préciser qu'il prend la forme d'une subvention.

### P0152 · edouard-philippe · travail-augmenter-jours-carence
- **Énoncé :** Le nombre de jours de carence en cas d'arrêt maladie doit être augmenté.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « 3 jours de carence pour tout le monde, dans le privé comme le public »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme porte à trois jours la carence pour tous, ce qui augmente le nombre de jours dans le public mais le laisse inchangé dans le privé.

### P0153 · edouard-philippe · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réduire à 12 mois maximum la durée d'indemnisation chômage pour les moins de 50 ans, contre 18 mois aujourd'hui »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme réduit la durée maximale d'indemnisation de 18 à 12 mois pour les moins de 50 ans.

### P0154 · edouard-philippe · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Permettre aux entreprises de fixer librement le temps de travail pour sortir des 35h »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme laisse les entreprises fixer leur temps de travail au-delà de 35 heures, après discussion interne.

### P0155 · edouard-philippe · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « porter progressivement l'âge de départ à 65 ans et la durée de cotisation à 45 ans »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme porte l'âge de départ à 65 ans, à l'opposé d'un retour à 62 ans.

### P0156 · edouard-philippe · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « porter progressivement l'âge de départ à 65 ans et la durée de cotisation à 45 ans »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme porte progressivement l'âge de départ à 65 ans.

### P0157 · edouard-philippe · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Généraliser à tous les salariés la retraite par capitalisation collective »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme généralise la retraite par capitalisation collective à tous les salariés.

### P0158 · edouard-philippe · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Permettre aux entreprises de fixer librement le temps de travail pour sortir des 35h »
- **Source :** Pour une France plus prospère (Avec Édouard 2027) — programme, 2026-07 — https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere
- **Justification :** Le programme vise à sortir des 35 heures pour travailler davantage, ce qui va à l'opposé d'une réduction à 32 heures sans la mentionner explicitement.

## Éric Zemmour (Reconquête) — 88 positions

### P0159 · eric-zemmour · agriculture-alleger-normes-agricoles
- **Énoncé :** Les normes environnementales imposées aux agriculteurs français doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Je mettrai également fin à l'excès de normes et de contraintes, pour que les agriculteurs puissent produire mieux sans être pénalisés par la concurrence déloyale étrangère »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 annonce la fin de l'excès de normes et de contraintes pesant sur les agriculteurs, sans viser spécifiquement les normes environnementales, d'où 1 plutôt que 2.

### P0160 · eric-zemmour · defense-budget-armees-3-pib
- **Énoncé :** Le budget des armées doit atteindre 3 % du PIB.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Augmenter annuellement le budget de la défense jusqu'à 70 milliards d'euros en 2030 »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit de porter le budget de la défense à 70 milliards d'euros en 2030, une hausse nette qui n'est pas exprimée comme un objectif de 3 % du PIB, d'où 1 plutôt que 2.

### P0161 · eric-zemmour · defense-defense-europeenne-emprunt
- **Énoncé :** Une défense européenne commune doit être financée par un emprunt de l'Union européenne.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Cela veut dire prendre nos distances avec l'OTAN et cesser l'intégration européenne en matière de défense »
- **Source :** Présentation du programme Défense - Éric Zemmour 2022 (ericzemmour.fr, archive Wayback Machine) — declaration_vote, 2022-02 — https://web.archive.org/web/20220526163618/https://www.ericzemmour.fr/presentation-du-programme-defense
- **Justification :** Le discours de 2022 demande de cesser l'intégration européenne en matière de défense, ce qui s'oppose à une défense européenne commune sans se prononcer sur son financement par emprunt, d'où -1 plutôt que -2.

### P0162 · eric-zemmour · defense-doubler-reservistes
- **Énoncé :** Le nombre de réservistes opérationnels des armées doit être doublé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Renforcer le rôle et les moyens de la réserve opérationnelle dans la défense du territoire »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit de renforcer le rôle et les moyens de la réserve opérationnelle, sans objectif chiffré de doublement des effectifs, d'où 1 plutôt que 2.

### P0163 · eric-zemmour · defense-effectifs-armees-hausse
- **Énoncé :** Les effectifs des armées doivent augmenter d'au moins 10 % d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Pour l'armée de Terre : porter la force opérationnelle terrestre à 100 000 hommes d'ici 2027 »
- **Source :** Présentation du programme Défense - Éric Zemmour 2022 (ericzemmour.fr, archive Wayback Machine) — declaration_vote, 2022-02 — https://web.archive.org/web/20220526163618/https://www.ericzemmour.fr/presentation-du-programme-defense
- **Justification :** Le discours de 2022 prévoit de porter la force opérationnelle terrestre à 100 000 hommes d'ici 2027, une hausse qui ne concerne que l'armée de Terre, d'où 1 plutôt que 2.

### P0164 · eric-zemmour · defense-fermer-bases-afrique
- **Énoncé :** La France doit fermer ses bases militaires en Afrique.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Revoir notre stratégie au Sahel et en Afrique en renforçant nos bases de réaction rapide dans la zone »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit de renforcer les bases militaires françaises en Afrique, soit l'inverse de leur fermeture, d'où -2.

### P0165 · eric-zemmour · defense-priorite-depenses-sociales
- **Énoncé :** Les dépenses sociales doivent passer avant les dépenses militaires dans le budget de l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « nous dépensons trop dans la protection sociale et l'assistance, notamment avec un dévoiement complet de l'idée de solidarité nationale qui est en fait ouverte au monde entier, et trop peu dans la sphère régalienne (armées, police, gendarmerie, justice) »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 juge les dépenses sociales trop élevées et les dépenses régaliennes, dont les armées, insuffisantes, sans formuler une règle de priorité budgétaire, d'où -1 plutôt que -2.

### P0166 · eric-zemmour · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Augmenter annuellement le budget de la défense jusqu'à 70 milliards d'euros en 2030 »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit une hausse annuelle du budget de la défense jusqu'à 70 milliards d'euros en 2030, soit l'inverse d'une réduction, d'où -2.

### P0167 · eric-zemmour · defense-reduire-presence-etranger
- **Énoncé :** La France doit réduire sa présence militaire à l'étranger.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Muscler nos capacités de défense et d'intervention en doublant d'ici 2027 les forces prépositionnées en Outre-mer et à l'étranger »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit de doubler d'ici 2027 les forces prépositionnées à l'étranger, soit l'inverse d'une réduction de la présence militaire, d'où -2.

### P0168 · eric-zemmour · defense-renoncer-modernisation-dissuasion
- **Énoncé :** La France doit renoncer à moderniser sa dissuasion nucléaire.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Je sauvegarderai ces atouts en modernisant nos moyens de dissuasion »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 s'engage à moderniser les moyens de dissuasion, soit l'inverse d'un renoncement, d'où -2.

### P0169 · eric-zemmour · defense-second-porte-avions
- **Énoncé :** La France doit se doter d'un second porte-avions.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Posséder à terme deux porte-avions, vingt frégates, huit sous-marins nucléaires d'attaque et trois cents avions de chasse »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit explicitement de posséder à terme deux porte-avions, d'où 2.

### P0170 · eric-zemmour · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Favoriser l'usage du référendum afin de faire adopter directement par le peuple français les mesures les plus importantes qui intéressent la vie de la Nation »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut favoriser l'usage du référendum pour les mesures les plus importantes, ce qui va dans le sens contraire d'un recours exceptionnel sans en faire un mode habituel de décision, d'où -1 plutôt que -2.

### P0171 · eric-zemmour · democratie-revision-par-congres
- **Énoncé :** Une révision de la Constitution doit pouvoir continuer à être adoptée par le Parlement réuni en Congrès, sans référendum.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Instaurer un référendum obligatoire pour toute proposition de révision de la Constitution »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 rend le référendum obligatoire pour toute révision de la Constitution, ce qui exclut une adoption par le Congrès sans référendum.

### P0172 · eric-zemmour · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Opposer le veto de la France à toute négociation actuelle et future de traité de libre-échange pour défendre nos entreprises et nos agriculteurs »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit un veto de la France à toute négociation de traité de libre-échange, soit le rejet explicite de nouveaux accords, d'où -2.

### P0173 · eric-zemmour · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Exiger le remboursement intégral des aides publiques reçues par les entreprises qui délocalisent »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 conditionne les aides publiques à l'absence de délocalisation par une obligation de remboursement, sans viser le maintien de l'emploi en général, d'où 1 plutôt que 2.

### P0174 · eric-zemmour · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous ferons de la France le pays européen où il est le plus facile de créer une entreprise d'intelligence artificielle. Suppression massive des réglementations européennes et françaises qui étouffent nos ingénieurs »
- **Source :** [Paroles de candidats] - Zemmour, le pourfendeur de la modernité qui parlait d'IA (Institut Montaigne) — declaration_vote, 2026-09-29 — https://www.institutmontaigne.org/expressions/paroles-de-candidats-zemmour-le-pourfendeur-de-la-modernite-qui-parlait-dia
- **Justification :** Dans ce discours de 2026 cité par l'Institut Montaigne, il annonce une suppression massive des réglementations pour faciliter la création d'entreprises, présentée pour le secteur de l'intelligence artificielle, d'où 1 plutôt que 2.

### P0175 · eric-zemmour · economie-assouplir-seuils-effectifs
- **Énoncé :** Les obligations liées aux seuils d'effectifs des entreprises doivent être assouplies.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Relever le seuil de 50 à 250 salariés pour l'obligation de consultation du Comité social et économique (CSE) »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de relever un seuil d'effectifs déclenchant une obligation des entreprises, ce qui correspond à la mesure de l'énoncé, d'où 2.

### P0176 · eric-zemmour · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « L'argent magique n'existe pas et l'esprit de responsabilité impose de réduire simultanément les prélèvements obligatoires et la dépense publique »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 s'engage explicitement à réduire la dépense publique, d'où 2.

### P0177 · eric-zemmour · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Protéger nos entreprises stratégiques en créant un comité dédié chargé de contrôler tous les investisse- ments étrangers »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose un comité chargé de contrôler tous les investissements étrangers pour protéger les entreprises stratégiques, soit un contrôle renforcé, d'où 2.

### P0178 · eric-zemmour · economie-edf-entierement-publique
- **Énoncé :** EDF doit rester une entreprise entièrement détenue par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin au projet Hercule visant au démantèlement d'EDF et garantir l'intégrité de ce fleuron national »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 s'oppose au démantèlement d'EDF et veut garantir son intégrité, sans préciser qu'elle doit être entièrement détenue par l'État, d'où 1 plutôt que 2.

### P0179 · eric-zemmour · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Faire de l'Agence des Participations de l'État un véritable fonds souverain qui investira en priorité dans les entreprises stratégiques françaises »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit que l'État investisse via un fonds souverain dans les entreprises stratégiques françaises, d'où 2.

### P0180 · eric-zemmour · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en remplaçant le dispositif ARENH, qui oblige EDF à vendre un quart de son électricité nucléaire à ses concurrents à un prix ne permettant pas de couvrir tous ses coûts, par un nouveau tarif régulé pour l'électricité nucléaire »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose un tarif régulé pour l'électricité nucléaire, ce qui ne couvre qu'une partie des prix de l'énergie des ménages, d'où 1 plutôt que 2.

### P0181 · eric-zemmour · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer les ARS, organismes purement comptables et technocratiques, et transférer leurs missions aux préfets »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de supprimer les agences régionales de santé, soit une catégorie d'agences de l'État seulement, d'où 1 plutôt que 2.

### P0182 · eric-zemmour · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin à tous les projets d'éoliennes actuels et futurs, sur terre comme sur mer »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de mettre fin à tous les projets d'éoliennes, y compris terrestres, soit l'inverse d'une accélération, d'où -2.

### P0183 · eric-zemmour · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « lançant un programme de construction d'au moins 14 nouveaux réacteurs nucléaires EPR2 à horizon 2050 »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit au moins 14 nouveaux réacteurs EPR2, soit au-delà des six prévus, d'où 2.

### P0184 · eric-zemmour · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Soutenir le développement des réacteurs de petite taille SMR (Small Modular Reactors) afin de disposer d'un modèle prêt à construire d'ici la fin du quinquennat »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement de soutenir le développement des petits réacteurs modulaires, d'où 2.

### P0185 · eric-zemmour · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « allonger la durée de vie du parc existant à 60 ans au moins »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit d'allonger la durée de vie des réacteurs à 60 ans au moins, sans viser explicitement une prolongation au-delà de 60 ans, d'où 1 plutôt que 2.

### P0186 · eric-zemmour · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Supprimer l'objectif de réduire à 50 % la part du nucléaire dans notre mix électrique en 2035 »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de supprimer l'objectif de réduction de la part du nucléaire, soit le rejet explicite de l'énoncé, d'où -2.

### P0187 · eric-zemmour · energie-supprimer-aides-solaire-eolien
- **Énoncé :** Les aides publiques à la production d'électricité solaire et éolienne doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rediriger le soutien public à l'éolien vers la géothermie, le bois-énergie, les réseaux de chaleur ou les pompes à chaleur »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de retirer le soutien public à l'éolien pour le rediriger vers d'autres filières, sans viser le solaire, d'où 1 plutôt que 2.

### P0188 · eric-zemmour · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre fin à tous les projets d'éoliennes actuels et futurs, sur terre comme sur mer »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de mettre fin à tous les projets d'éoliennes actuels et futurs, ce qui va jusqu'à l'arrêt de toute nouvelle installation. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0189 · eric-zemmour · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ne pas empêcher des millions de Français de circuler dans leur propre agglomération en mettant fin à toute interdiction pour certains véhicules de circuler en ville (ZFE-m, Zones à faibles Émissions mobilité) »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement de mettre fin aux zones à faibles émissions, d'où 2.

### P0190 · eric-zemmour · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Pénaliser les importations de produits qui ne respectent pas nos normes environnementales en exigeant la mise en place rapide au niveau européen de la taxe carbone aux frontières »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 demande la mise en place rapide d'une taxe carbone aux frontières sur les importations, d'où 2.

### P0191 · eric-zemmour · fiscalite-baisse-cotisations-salaries
- **Énoncé :** Les cotisations sociales payées par les salariés doivent baisser.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en permettant de toucher l'équivalent d'un 13ème mois par la baisse de la Contribution Sociale Généralisée (CSG) s'appliquant de manière dégressive pour tous les salaires allant du SMIC à 2 000 euros »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de baisser la CSG sur les salaires du SMIC à 2 000 euros, un prélèvement social sur les salariés autre que les cotisations et limité à ces salaires, d'où 1 plutôt que 2.

### P0192 · eric-zemmour · fiscalite-baisse-impot-societes
- **Énoncé :** Le taux de l'impôt sur les sociétés doit être abaissé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Baisser le taux d'impôt sur les sociétés à 15 % pour les petites et moyennes entreprises, artisans, commerçants et agriculteurs jusqu'à 300 000 euros de bénéfices »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'abaisser le taux de l'impôt sur les sociétés à 15 % pour les PME jusqu'à 300 000 euros de bénéfices, et non pour toutes les entreprises, d'où 1 plutôt que 2.

### P0193 · eric-zemmour · fiscalite-baisse-ir-tranches-intermediaires
- **Énoncé :** L'impôt sur le revenu doit baisser pour les tranches intermédiaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « La baisse des impôts pesant sur les travailleurs modestes, sur les classes moyennes comme sur les entreprises qui produisent en France est indispensable »
- **Source :** Priorités (ericzemmour.fr, campagne 2022) — livre_plateforme, 2022 — https://www.ericzemmour.fr/priorites
- **Justification :** La plateforme de 2022 demande une baisse des impôts pesant sur les classes moyennes, sans préciser qu'il s'agit de l'impôt sur le revenu, d'où 1 plutôt que 2.

### P0194 · eric-zemmour · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Dès 2022, je mettrai donc la France sur le chemin d'un cycle vertueux où la baisse des dépenses publiques permettra la baisse des prélèvements obligatoires »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 s'engage explicitement à baisser les prélèvements obligatoires, d'où 2.

### P0195 · eric-zemmour · fiscalite-csg-progressive-v2
- **Énoncé :** Le taux de la contribution sociale généralisée (CSG) doit augmenter avec le revenu.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « par la baisse de la Contribution Sociale Généralisée (CSG) s'appliquant de manière dégressive pour tous les salaires allant du SMIC à 2 000 euros »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose une baisse dégressive de la CSG sur les salaires du SMIC à 2 000 euros, ce qui rend le taux croissant avec le revenu sur cette seule tranche, d'où 1.

### P0196 · eric-zemmour · fiscalite-heures-sup-sans-plafond
- **Énoncé :** Les heures supplémentaires doivent être exonérées d'impôt sur le revenu sans plafond.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en exonérant totalement d'impôts et de charges sociales les heures supplémentaires »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'exonérer totalement d'impôts les heures supplémentaires, sans plafond, d'où 2.

### P0197 · eric-zemmour · fiscalite-quotient-familial-credit-enfant
- **Énoncé :** Le quotient familial doit être remplacé par un crédit d'impôt du même montant pour chaque enfant, quel que soit le revenu des parents.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Doubler le plafond du quotient familial de 1 592 à 3 000 euros »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de renforcer le quotient familial en doublant son plafond, ce qui va à l'inverse de son remplacement par un crédit d'impôt uniforme sans le rejeter explicitement, d'où -1.

### P0198 · eric-zemmour · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Exonérer 95 % des familles françaises de droits de succession en mettant en place une franchise de 200 000 euros par enfant au décès de leurs parents »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose une franchise de 200 000 euros par enfant sur les successions, soit une réduction explicite des droits sur les transmissions familiales, d'où 2.

### P0199 · eric-zemmour · fiscalite-supprimer-ifi
- **Énoncé :** L'impôt sur la fortune immobilière doit être supprimé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « favoriser l'enracinement en sortant la résidence principale du calcul de l'Impôt sur la Fortune Immobilière »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'exclure la résidence principale de l'impôt sur la fortune immobilière, ce qui l'allège sans le supprimer, d'où 1 plutôt que 2.

### P0200 · eric-zemmour · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Baisser massivement les impôts de production à hauteur de 30 milliards d'euros supplémentaires par an, en supprimant en priorité la Contribution Sociale de Solidarité des Sociétés (C3S), la Cotisation sur la Valeur Ajoutée des Entreprises (CVAE) »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose une baisse massive des impôts de production en supprimant en priorité plusieurs d'entre eux, sans annoncer la suppression de tous, d'où 1 plutôt que 2.

### P0201 · eric-zemmour · immigration-ame-soins-urgents
- **Énoncé :** L'aide médicale d'État doit être limitée aux soins urgents.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer les soins gratuits pour les étrangers clandestins (Aide Médicale de l'État) pour ne conserver qu'une aide médicale d'urgence »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de remplacer l'aide médicale d'État par une aide médicale d'urgence, ce qui correspond à l'énoncé, d'où 2.

### P0202 · eric-zemmour · immigration-amende-sejour-irregulier
- **Énoncé :** Le séjour irrégulier en France doit être sanctionné par une amende.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « réinstaurer le délit de séjour irrégulier supprimé en 2012 afin de pouvoir juridiquement sanctionner et renvoyer dans leur pays tout étranger entré illégalement sur le territoire »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de rétablir le délit de séjour irrégulier pour le sanctionner pénalement, ce qui correspond à l'énoncé, d'où 2.

### P0203 · eric-zemmour · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « exiger que les demandes d'asile soient déposées en dehors du territoire national, dans nos consulats »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 exige que les demandes d'asile soient déposées hors du territoire national, dans les consulats, et non examinées dans des centres situés hors de l'Union européenne, d'où 1 plutôt que 2.

### P0204 · eric-zemmour · immigration-asile-examen-sans-transfert
- **Énoncé :** Un demandeur d'asile présent en France doit pouvoir y faire examiner sa demande, au lieu d'être renvoyé vers le pays européen responsable selon les règles de l'Union.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « exiger que les demandes d'asile soient déposées en dehors du territoire national, dans nos consulats »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut que les demandes d'asile ne soient plus déposées en France mais dans les consulats, ce qui exclut un examen en France sans viser les règles de transfert européennes. Mesure plus large que l'énoncé, dans le sens contraire : -1 par convention.

### P0205 · eric-zemmour · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il faut renvoyer tous les délinquants étrangers, même ceux qui ne sont pas en prison »
- **Source :** Zemmour confirme qu'il sera candidat, durcit encore son discours sur l'immigration (La Gazette France / AFP) — declaration_vote, 2026-09-18 — https://www.lagazettefrance.fr/article/zemmour-confirme-qu-il-sera-candidat-durcit-encore-son-discours-sur-l-immigration
- **Justification :** Dans cet entretien de septembre 2026 rapporté par l'AFP, il demande le renvoi de tous les délinquants étrangers, ce qui implique la perte du droit au séjour et va au-delà de l'énoncé ; le programme de 2022 prévoyait déjà leur expulsion dès la condamnation. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0206 · eric-zemmour · immigration-frais-etudiants-etrangers
- **Énoncé :** Les étudiants étrangers hors Union européenne doivent payer les mêmes frais d'inscription que les étudiants français.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Augmenter sensiblement les droits d'inscription pour les étudiants étrangers car l'enseignement supérieur public est financé par les impôts des Français »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'augmenter les droits d'inscription des étudiants étrangers, soit l'inverse d'un alignement sur ceux des étudiants français, d'où -2.

### P0207 · eric-zemmour · immigration-prestations-duree-residence
- **Énoncé :** L'accès des étrangers aux prestations sociales non contributives doit être soumis à cinq ans de résidence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer les aides sociales non-contributives (allocations familiales, aides au logement, RSA, minimum vieillesse…) pour les étrangers extra-européens »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de supprimer les prestations non contributives pour les étrangers extra-européens, une restriction plus forte et différente d'une condition de cinq ans de résidence, d'où 1 plutôt que 2.

### P0208 · eric-zemmour · immigration-reduire-duree-naturalisation
- **Énoncé :** La durée de résidence exigée pour demander la naturalisation doit être réduite.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Durcir les conditions de naturalisation, en augmentant la durée minimale de résidence en France de 5 à 10 ans »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de porter la durée de résidence exigée de 5 à 10 ans, soit l'inverse d'une réduction, d'où -2.

### P0209 · eric-zemmour · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer le droit au regroupement familial et tous les droits automatiques liés à l'immigration familiale »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de supprimer le regroupement familial, une mesure plus radicale que des conditions de ressources plus strictes, d'où 1 plutôt que 2.

### P0210 · eric-zemmour · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Interdire définitivement la régularisation de tout étranger entré illégalement sur le territoire français »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'interdire toute régularisation des étrangers entrés illégalement, quelle que soit leur durée de présence, d'où -2.

### P0211 · eric-zemmour · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Interdire définitivement la régularisation de tout étranger entré illégalement sur le territoire français »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'interdire toute régularisation des étrangers entrés illégalement, y compris ceux employés dans des métiers en tension, d'où -2.

### P0212 · eric-zemmour · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Supprimer le droit du sol, ainsi un enfant dont les deux parents sont étrangers ne pourra devenir français qu'après naturalisation, sans aucune automaticité »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement de supprimer le droit du sol, d'où 2.

### P0213 · eric-zemmour · immigration-titre-sejour-longue-duree
- **Énoncé :** Les étrangers en situation régulière doivent obtenir plus facilement un titre de séjour de longue durée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Mettre fin au renouvellement quasi-systématique des titres de séjour afin de pouvoir évaluer de manière régulière la pertinence de la présence de chaque étranger sur le sol français »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut rendre le renouvellement des titres de séjour moins systématique, ce qui va dans le sens contraire sans viser explicitement les titres de longue durée, d'où -1 plutôt que -2.

### P0214 · eric-zemmour · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Réaffirmer le rôle premier des communes et de l'État en redistribuant à leur profit certaines compétences des intercommunalités, des départements et des régions »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de redistribuer au profit de l'État et des communes certaines compétences des collectivités, ce qui correspond à l'énoncé, d'où 2.

### P0215 · eric-zemmour · international-adhesion-ukraine-ue
- **Énoncé :** L'Ukraine doit pouvoir adhérer à l'Union européenne.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Refuser tout nouvel élargissement et demander à mettre définitivement fin au processus d'adhésion de la Turquie »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 refuse tout nouvel élargissement de l'Union européenne, ce qui exclut l'adhésion de l'Ukraine sans la nommer, d'où -2.

### P0216 · eric-zemmour · international-aide-developpement-0-7
- **Énoncé :** L'aide publique au développement doit atteindre 0,7 % du revenu national brut.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Réduction de moitié de l'aide publique au développement »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit de réduire de moitié l'aide publique au développement, soit l'inverse d'une hausse à 0,7 % du revenu national brut, d'où -2.

### P0217 · eric-zemmour · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer la supériorité des nouvelles lois nationales sur tout texte international antérieur et sur tout acte dérivé qui en résulte en modifiant l'article 55 de la Constitution »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de faire prévaloir les nouvelles lois nationales sur les traités antérieurs et le droit dérivé, dont celui de l'Union européenne, ce qui correspond à l'énoncé, d'où 2.

### P0218 · eric-zemmour · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Sortir du commandement militaire intégré de l'OTAN pour retrouver une voix indépendante, tout en demeurant au sein de l'Alliance atlantique »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement de quitter le commandement militaire intégré de l'OTAN, d'où 2.

### P0219 · eric-zemmour · international-referendum-traites-europeens
- **Énoncé :** Tout nouveau traité européen doit être soumis à référendum en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Instaurer un référendum obligatoire pour toute proposition de révision de la Constitution, ratification de traité européen ou élargissement de l'Union européenne »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose un référendum obligatoire pour toute ratification de traité européen, d'où 2.

### P0220 · eric-zemmour · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « je demanderai la renégociation des règles européennes en matière d'immigration pour redonner aux États le contrôle de leurs frontières »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 demande une renégociation des règles européennes pour rendre aux États la maîtrise de l'immigration, sans viser une renégociation générale des compétences, d'où 1 plutôt que 2.

### P0221 · eric-zemmour · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Construire 10 000 places de prison supplémentaires sur le mandat en simplifiant le processus administratif »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit 10 000 places de prison supplémentaires, soit l'inverse d'un arrêt des constructions, d'où -2.

### P0222 · eric-zemmour · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Appliquer réellement les condamnations en mettant fin aux aménagements de peine »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut mettre fin aux aménagements de peine, ce qui va dans le sens contraire du remplacement des courtes peines sans viser ces peines en particulier, d'où -1 plutôt que -2.

### P0223 · eric-zemmour · justice-juridictions-mineurs-specialisees-v2
- **Énoncé :** Les mineurs doivent être jugés par des juridictions distinctes de celles des majeurs.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « abaissant l'âge de la majorité pénale de 18 à 16 ans pour responsabiliser les mineurs »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 abaisse la majorité pénale à 16 ans, ce qui ferait juger les 16-17 ans comme des majeurs sans remettre en cause des juridictions distinctes pour les plus jeunes, d'où -1.

### P0224 · eric-zemmour · justice-majorite-penale-16-ans
- **Énoncé :** La majorité pénale doit être abaissée à 16 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « abaissant l'âge de la majorité pénale de 18 à 16 ans pour responsabiliser les mineurs »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement d'abaisser la majorité pénale à 16 ans, d'où 2.

### P0225 · eric-zemmour · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Obliger les juges à sanctionner tous les délinquants et criminels en introduisant des peines planchers pour tous les crimes et délits »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose des peines planchers pour tous les crimes et délits, ce qui inclut les récidivistes et va au-delà de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0226 · eric-zemmour · justice-perpetuite-reelle-etendue
- **Énoncé :** La réclusion à perpétuité sans possibilité de libération doit s'appliquer à davantage de crimes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Mettre hors d'état de nuire les criminels les plus dangereux et les terroristes en rétablissant une peine de perpétuité réelle non-compressible »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose une perpétuité réelle pour les criminels les plus dangereux et les terroristes, sans préciser la liste des crimes concernés, d'où 1 plutôt que 2.

### P0227 · eric-zemmour · justice-sanction-financiere-parents
- **Énoncé :** Les parents de mineurs délinquants doivent pouvoir être sanctionnés financièrement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « supprimant les aides sociales des parents de mineurs délinquants récidivistes pour responsabiliser les familles »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de supprimer les aides sociales des parents de mineurs délinquants récidivistes, soit une sanction financière des parents, d'où 2.

### P0228 · eric-zemmour · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Appliquer réellement les condamnations en mettant fin aux aménagements de peine »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut mettre fin aux aménagements de peine, ce qui va dans le sens de l'énoncé sans viser nommément les réductions automatiques de peine, d'où 1 plutôt que 2.

### P0229 · eric-zemmour · numerique-assouplir-regles-ia
- **Énoncé :** Les règles européennes encadrant l'intelligence artificielle doivent être assouplies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous ferons de la France le pays européen où il est le plus facile de créer une entreprise d'intelligence artificielle. Suppression massive des réglementations européennes et françaises qui étouffent nos ingénieurs »
- **Source :** [Paroles de candidats] - Zemmour, le pourfendeur de la modernité qui parlait d'IA (Institut Montaigne) — declaration_vote, 2026-09-29 — https://www.institutmontaigne.org/expressions/paroles-de-candidats-zemmour-le-pourfendeur-de-la-modernite-qui-parlait-dia
- **Justification :** Dans ce discours de 2026 cité par l'Institut Montaigne, il annonce une suppression massive des réglementations européennes pour les entreprises d'intelligence artificielle, sans nommer le règlement européen sur l'IA, d'où 1 plutôt que 2.

### P0230 · eric-zemmour · numerique-donnees-sante-hebergeurs-europeens
- **Énoncé :** Les données de santé des Français doivent être hébergées exclusivement par des entreprises européennes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Imposer par la loi que les données sensibles des Français ainsi que les données stratégiques de l'État et du secteur privé soient hébergées et sécurisées en France sur des solutions souveraines »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 impose l'hébergement en France des données sensibles des Français, ce qui va dans le sens de l'énoncé sans viser nommément les données de santé, d'où 1 plutôt que 2.

### P0231 · eric-zemmour · numerique-reseaux-sociaux-moins-15-ans
- **Énoncé :** L'accès aux réseaux sociaux doit être interdit aux moins de 15 ans.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La France, la France, elle, vient de voter l'interdiction des réseaux sociaux aux moins de 15 ans, prétendument pour protéger les enfants, mais en réalité pour installer le principe qu'un État peut décider qui a le droit de parler. »
- **Source :** [Paroles de candidats] - Zemmour, le pourfendeur de la modernité qui parlait d'IA (Institut Montaigne) — declaration_vote, 2026-09-29 — https://www.institutmontaigne.org/expressions/paroles-de-candidats-zemmour-le-pourfendeur-de-la-modernite-qui-parlait-dia
- **Justification :** Dans ce discours de 2026 cité entre guillemets par l'Institut Montaigne, il conteste l'interdiction des réseaux sociaux aux moins de 15 ans qui vient d'être votée, sans proposer explicitement son abrogation, d'où -1 plutôt que -2.

### P0232 · eric-zemmour · sante-centres-sante-publics
- **Énoncé :** Chaque département doit disposer de centres de santé publics employant des médecins salariés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Recruter 1 000 médecins salariés par l'État sur 5 ans pour soigner dans les déserts médicaux »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 prévoit des médecins salariés par l'État dans les déserts médicaux, sans prévoir de centres de santé publics dans chaque département, d'où 1 plutôt que 2.

### P0233 · eric-zemmour · sante-doubler-etudiants-medecine
- **Énoncé :** Le nombre d'étudiants admis en deuxième année de médecine doit être doublé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Doubler les capacités de formation des médecins et des professionnels de santé en 5 ans »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de doubler les capacités de formation des médecins, d'où 2.

### P0234 · eric-zemmour · securite-armer-polices-municipales
- **Énoncé :** Les policiers municipaux doivent être armés dans toutes les communes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ramener la paix dans nos villes en généralisant progressivement l'armement obligatoire des polices municipales »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de généraliser l'armement obligatoire des polices municipales, d'où 2.

### P0235 · eric-zemmour · securite-presomption-legitime-defense
- **Énoncé :** Les policiers doivent bénéficier d'une présomption de légitime défense lorsqu'ils font usage de leur arme.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Accorder aux policiers et aux gendarmes une présomption de légitime défense en cas d'usage de leurs armes »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose explicitement une présomption de légitime défense pour les policiers et gendarmes, d'où 2.

### P0236 · eric-zemmour · societe-gpa-interdite-v2
- **Énoncé :** La gestation pour autrui doit être interdite en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdire réellement la gestation pour autrui (GPA) en réprimant judiciairement le recours aux GPA à l'étranger »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut interdire réellement la GPA, y compris en réprimant le recours à l'étranger, d'où 2.

### P0237 · eric-zemmour · societe-interdire-ecriture-inclusive
- **Énoncé :** L'écriture inclusive doit être interdite dans les documents administratifs.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Faire scrupuleusement respecter l'interdiction de l'écriture inclusive jusque dans l'enseignement supérieur »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 soutient l'interdiction de l'écriture inclusive dans l'enseignement, sans viser les documents administratifs, d'où 1 plutôt que 2.

### P0238 · eric-zemmour · societe-signes-religieux-sorties-scolaires
- **Énoncé :** Le port de signes religieux doit être interdit aux accompagnateurs de sorties scolaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdire le port du voile islamique dans l'espace public, afin de faire respecter le principe de discrétion de la pratique religieuse »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'interdire le voile islamique dans tout l'espace public, ce qui inclut les accompagnatrices de sorties scolaires mais ne vise qu'un signe religieux, d'où 1 plutôt que 2.

### P0239 · eric-zemmour · societe-signes-religieux-universite
- **Énoncé :** Le port de signes religieux ostensibles doit être interdit aux étudiants à l'université.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Interdire le port du voile islamique dans l'espace public, afin de faire respecter le principe de discrétion de la pratique religieuse »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose d'interdire le voile islamique dans tout l'espace public, ce qui inclut l'université mais ne vise qu'un signe religieux, d'où 1 plutôt que 2.

### P0240 · eric-zemmour · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Lutter contre le harcèlement scolaire, le communautarisme et les inégalités sociales en rendant le port de la blouse obligatoire à l'école primaire »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose la blouse obligatoire à l'école primaire seulement, d'où 1 plutôt que 2.

### P0241 · eric-zemmour · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Refaire des lignes de trains " de proximité " la priorité budgétaire de la SNCF »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 fait des lignes ferroviaires de proximité une priorité budgétaire, sans s'engager sur le maintien des lignes peu fréquentées, d'où 1 plutôt que 2.

### P0242 · eric-zemmour · transport-routes-90-kmh
- **Énoncé :** La limitation de vitesse sur les routes secondaires doit être relevée à 90 km/h partout.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Restaurer la limitation de vitesse de 90 km/h sur les routes nationales et départementales »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de rétablir le 90 km/h sur les routes nationales et départementales, d'où 2.

### P0243 · eric-zemmour · transport-supprimer-controle-technique-motos-v2
- **Énoncé :** Le contrôle technique périodique obligatoire des deux-roues motorisés doit être supprimé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Allonger la durée de validité du contrôle technique à 3 ans au lieu de 2 ans et ne pas l'élargir aux deux- roues »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 refusait d'étendre le contrôle technique aux deux-roues, alors inexistant, sans proposer de supprimer un contrôle périodique en place, d'où 1 plutôt que 2.

### P0244 · eric-zemmour · transport-voitures-centres-villes-libres
- **Énoncé :** L'accès des voitures aux centres-villes doit rester libre.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ne pas empêcher des millions de Français de circuler dans leur propre agglomération en mettant fin à toute interdiction pour certains véhicules de circuler en ville (ZFE-m, Zones à faibles Émissions mobilité) »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 veut supprimer les restrictions de circulation visant certains véhicules en ville, sans se prononcer sur l'accès des voitures aux centres-villes en général, d'où 1 plutôt que 2.

### P0245 · eric-zemmour · travail-augmenter-jours-carence
- **Énoncé :** Le nombre de jours de carence en cas d'arrêt maladie doit être augmenté.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Restaurer l'égalité entre fonctionnaires et salariés du secteur privé en revenant aux trois jours de carence pour les arrêts maladie des agents de la fonction publique »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 propose de porter à trois les jours de carence des seuls agents publics, d'où 1 plutôt que 2.

### P0246 · eric-zemmour · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Porter à 64 ans l'âge légal de départ à la retraite à horizon 2030 »
- **Source :** Pour que la France reste la France — Mon programme (Éric Zemmour, PDF hébergé par la FHF, ambitionsanté2022.fhf.fr) — livre_plateforme, 2022-03-16 — https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf
- **Justification :** Le programme de 2022 proposait de porter l'âge légal à 64 ans, soit l'inverse d'un retour à 62 ans, d'où -2 ; aucune source de 2026 ne revient sur ce point.

