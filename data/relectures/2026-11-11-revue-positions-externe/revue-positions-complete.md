# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** all 1102 positions of the 18 candidates (P0001 to P1102).

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
*1102 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

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

## Fabien Roussel (Parti communiste français) — 61 positions

### P0247 · fabien-roussel · defense-budget-armees-3-pib
- **Énoncé :** Le budget des armées doit atteindre 3 % du PIB.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « refus de la course à l'arme- ment et du passage du budget de la défense à 5% du PIB »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune refuse le passage du budget de la défense à 5 % du PIB, ce qui va contre une hausse des crédits militaires, sans se prononcer sur le seuil de 3 %.

### P0248 · fabien-roussel · defense-cesser-ventes-armes-conflits
- **Énoncé :** La France doit cesser de vendre des armes aux États engagés dans un conflit armé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en mettant un terme aux relations com- merciales et à la vente d'armes »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande de cesser la vente d'armes à Israël, sans étendre cette exigence à tous les États engagés dans un conflit armé.

### P0249 · fabien-roussel · defense-defense-europeenne-emprunt
- **Énoncé :** Une défense européenne commune doit être financée par un emprunt de l'Union européenne.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Le PCF s'oppose aussi à la militarisation de l'UE, à la prolifération nucléaire en Europe et dans le monde, à l'européanisation de la force nucléaire française, aux pro- jets d'une armée européenne »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune s'oppose à la militarisation de l'UE et à une armée européenne, sans se prononcer sur un financement par emprunt européen.

### P0250 · fabien-roussel · defense-dissuasion-protection-europe-v2
- **Énoncé :** La France doit étendre explicitement sa doctrine de dissuasion nucléaire à la protection de ses partenaires européens.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Le PCF s'oppose aussi à la militarisation de l'UE, à la prolifération nucléaire en Europe et dans le monde, à l'européanisation de la force nucléaire française »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune s'oppose à l'« européanisation » de la force nucléaire française, notion voisine mais pas identique à l'extension de la doctrine de dissuasion à la protection des partenaires européens, d'où -1.

### P0251 · fabien-roussel · defense-fermer-bases-afrique
- **Énoncé :** La France doit fermer ses bases militaires en Afrique.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le PCF défend le retrait des bases militaires »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** Dans le passage consacré au continent africain, la base commune défend explicitement le retrait des bases militaires françaises.

### P0252 · fabien-roussel · defense-priorite-depenses-sociales
- **Énoncé :** Les dépenses sociales doivent passer avant les dépenses militaires dans le budget de l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « l'école avant les dépenses d'armement, l'école avant les aides sans contrepartie »
- **Source :** Plan « Jeunesse 2027-2032 » (fabienroussel2027.fr, PDF) — livre_plateforme, 2026-10-06 — https://assets.nationbuilder.com/pcf/pages/44609/attachments/original/1791282014/Plan_Jeunesse_2027-2032.pdf?1791282014
- **Justification :** Le plan jeunesse fait passer les dépenses d'éducation avant les dépenses d'armement, ce qui concerne l'école et non l'ensemble des dépenses sociales.

### P0253 · fabien-roussel · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « 3,5 Md€ passent du budget de la défense à celui de l'école, une fois les 90 000 postes pourvus »
- **Source :** Plan « Jeunesse 2027-2032 » (fabienroussel2027.fr, PDF) — livre_plateforme, 2026-10-06 — https://assets.nationbuilder.com/pcf/pages/44609/attachments/original/1791282014/Plan_Jeunesse_2027-2032.pdf?1791282014
- **Justification :** Le plan jeunesse finance les postes d'enseignants en retirant 3,5 Md€ au budget de la défense, sans fixer d'objectif de baisse en proportion du PIB.

### P0254 · fabien-roussel · defense-reduire-presence-etranger
- **Énoncé :** La France doit réduire sa présence militaire à l'étranger.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « La moder- nisation et le développement des forces armées doivent être centrés sur la défense du territoire »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune recentre les forces armées sur la défense du territoire et s'oppose aux projections hors mandat de l'ONU, sans demander explicitement une réduction générale de la présence à l'étranger.

### P0255 · fabien-roussel · defense-second-porte-avions
- **Énoncé :** La France doit se doter d'un second porte-avions.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « le PCF s'oppose à la construction du porteavions à propulsion nucléaire de nouvelle génération »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune s'oppose au porte-avions de nouvelle génération ; elle ne parle pas d'un second porte-avions, mais va nettement contre.

### P0256 · fabien-roussel · defense-traite-interdiction-armes-nucleaires
- **Énoncé :** La France doit signer le traité sur l'interdiction des armes nucléaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « La France doit prendre une initiative européenne pour inciter à signer et ratifier le Traité sur l'interdiction des armes nucléaires (TIAN) »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande explicitement que la France promeuve la signature et la ratification du traité sur l'interdiction des armes nucléaires.

### P0257 · fabien-roussel · democratie-conventions-citoyennes
- **Énoncé :** Des conventions citoyennes tirées au sort doivent être consultées avant les grandes réformes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « référendum d'initiative citoyenne encadré et droit de pétition effectif, convention citoyenne suivi d'un projet de loi débattu au Parlement »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune prévoit des conventions citoyennes suivies d'un projet de loi, sans préciser le tirage au sort ni leur consultation systématique avant les grandes réformes.

### P0258 · fabien-roussel · democratie-petition-debat-parlement
- **Énoncé :** Une pétition signée par un million de personnes doit obligatoirement être débattue en séance au Parlement.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « référendum d'initiative citoyenne encadré et droit de pétition effectif, convention citoyenne suivi d'un projet de loi débattu au Parlement »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande un droit de pétition effectif, sans fixer de seuil ni d'obligation de débat en séance.

### P0259 · fabien-roussel · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « référendum d'initiative citoyenne encadré et droit de pétition effectif, convention citoyenne suivi d'un projet de loi débattu au Parlement »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut un référendum d'initiative citoyenne, ce qui va contre un recours au référendum qui resterait exceptionnel.

### P0260 · fabien-roussel · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « référendum d'initiative citoyenne encadré et droit de pétition effectif »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune propose explicitement un référendum d'initiative citoyenne encadré.

### P0261 · fabien-roussel · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « référendum d'initiative citoyenne encadré et droit de pétition effectif »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune propose un référendum d'initiative citoyenne, ce qui retire au président et au Parlement le monopole du déclenchement d'un référendum national (déduction du RIC conservée par convention).

### P0262 · fabien-roussel · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « une remise en cause des règles de fonctionnement et des traités de l'Union européenne libre-échangistes et déloyaux »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune remet en cause les traités européens libre-échangistes, ce qui va contre la conclusion de nouveaux accords sans s'y opposer explicitement.

### P0263 · fabien-roussel · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'argent public versé aux entreprises doit être conditionné et contrôlé »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune conditionne les aides publiques aux entreprises sans préciser que la condition porte sur le maintien de l'emploi en France.

### P0264 · fabien-roussel · economie-eau-operateurs-publics
- **Énoncé :** La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'énergie et les res- sources naturelles comme l'eau sont des biens communs à extraire en priorité des marchés en les plaçant sous contrôle public. »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut extraire l'eau des marchés et la placer sous contrôle public, version voisine mais moins précise qu'une distribution assurée uniquement par des opérateurs publics, d'où 1.

### P0265 · fabien-roussel · economie-edf-entierement-publique
- **Énoncé :** EDF doit rester une entreprise entièrement détenue par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il défend ainsi la constitution d'un pôle public de l'énergie constitué des grandes entreprises concernées (Edf, Engie, Total énergie) »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune intègre EDF dans un pôle public de l'énergie, sans préciser une détention à 100 % par l'État.

### P0266 · fabien-roussel · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Dans cette optique, des nationalisations dans les secteurs prioritaires sont nécessaires »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune juge nécessaires des nationalisations dans les secteurs prioritaires, ce qui va au-delà de prises de participation. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0267 · fabien-roussel · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Le secteur énergétique, stratégique pour le pays, est à extraire des logiques de concurrence pour abolir la précarité énergétique et pour la maîtrise des prix »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut sortir l'énergie de la concurrence pour maîtriser les prix, sans préciser une réglementation par l'État des prix payés par les ménages.

### P0268 · fabien-roussel · economie-reduire-nombre-fonctionnaires
- **Énoncé :** Le nombre de fonctionnaires doit diminuer au cours du prochain quinquennat.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « 90 000 postes d'enseignants seront créés, soit environ 13% de plus dans l'école publique »
- **Source :** Plan « Jeunesse 2027-2032 » (fabienroussel2027.fr, PDF) — livre_plateforme, 2026-10-06 — https://assets.nationbuilder.com/pcf/pages/44609/attachments/original/1791282014/Plan_Jeunesse_2027-2032.pdf?1791282014
- **Justification :** Le plan jeunesse crée 90 000 postes d'enseignants, ce qui va contre une baisse du nombre de fonctionnaires, sans porter sur l'ensemble de la fonction publique.

### P0269 · fabien-roussel · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Notre plan climat articule bien nos propositions entre réindustrialisation et doublement de nos capacités de production d'électricité nucléaire »
- **Source :** Introduction de Fabien Roussel : « Une nouvelle industrialisation pour la France » (PCF, PDF) — declaration_vote, 2025-05-17 — https://assets.nationbuilder.com/pcf/pages/30221/attachments/original/1747822112/Intro_FR_nouvelleind_170525.pdf
- **Justification :** Le discours défend un doublement des capacités nucléaires, ce qui suppose d'autres réacteurs, sans mentionner explicitement des réacteurs au-delà des six EPR2.

### P0270 · fabien-roussel · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Notre plan climat articule bien nos propositions entre réindustrialisation et doublement de nos capacités de production d'électricité nucléaire »
- **Source :** Introduction de Fabien Roussel : « Une nouvelle industrialisation pour la France » (PCF, PDF) — declaration_vote, 2025-05-17 — https://assets.nationbuilder.com/pcf/pages/30221/attachments/original/1747822112/Intro_FR_nouvelleind_170525.pdf
- **Justification :** Le discours défend un doublement des capacités nucléaires, ce qui va contre une réduction progressive de la part du nucléaire, sans se prononcer explicitement sur cette part.

### P0271 · fabien-roussel · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « les communistes combat- tent l'artificialisation des sols »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune combat l'artificialisation des sols, ce qui va contre un assouplissement des objectifs, sans les mentionner explicitement.

### P0272 · fabien-roussel · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « C'est aussi, par exemple, la production de petites voitures électriques citée hier par Jacques Baudrier et notre combat contre les ZFE »
- **Source :** Introduction de Fabien Roussel : « Une nouvelle industrialisation pour la France » (PCF, PDF) — declaration_vote, 2025-05-17 — https://assets.nationbuilder.com/pcf/pages/30221/attachments/original/1747822112/Intro_FR_nouvelleind_170525.pdf
- **Justification :** Le discours revendique un combat contre les zones à faibles émissions, sans demander explicitement leur suppression.

### P0273 · fabien-roussel · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il revendique l'imposition des grosses fortunes, la suppression des exonéra- tions fiscales dont bénéficient les grandes entreprises, la taxation des profits »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune revendique l'imposition des grosses fortunes, sans nommer le rétablissement d'un impôt sur la fortune incluant les actifs financiers.

### P0274 · fabien-roussel · fiscalite-reduire-credits-impot
- **Énoncé :** Le montant total des réductions et crédits d'impôt doit être diminué de moitié.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il revendique l'imposition des grosses fortunes, la suppression des exonéra- tions fiscales dont bénéficient les grandes entreprises, la taxation des profits »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande la suppression des exonérations fiscales des grandes entreprises, ce qui ne porte pas sur l'ensemble des réductions et crédits d'impôt.

### P0275 · fabien-roussel · immigration-asile-examen-hors-europe-v2
- **Énoncé :** Les demandes d'asile doivent être examinées dans des centres situés hors du territoire de l'Union européenne.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les communistes s'opposent à toutes réglementations visant à expulser et à enfermer des migrants dans des cen- tres de rétention quels qu'ils soient, notamment extraterritoriaux »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune s'oppose aux centres de rétention extraterritoriaux prévus par le pacte européen, mesure voisine mais distincte de l'examen des demandes d'asile hors de l'Union, d'où -1.

### P0276 · fabien-roussel · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la régularisation des travailleuses et tra- vailleurs sans papiers comme des familles dont les enfants sont scolari- sés sur le sol français »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune prévoit la régularisation des travailleurs sans papiers et des familles d'enfants scolarisés, sans critère de durée de présence.

### P0277 · fabien-roussel · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « la régularisation des travailleuses et tra- vailleurs sans papiers comme des familles dont les enfants sont scolari- sés sur le sol français »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune prévoit la régularisation des travailleurs sans papiers en général, ce qui inclut ceux des métiers en tension.

### P0278 · fabien-roussel · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Ils refusent la stigmatisation de l'immigration au nom de l'insécu- rité, la remise en cause du droit du sol et du droit d'asile »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune refuse explicitement la remise en cause du droit du sol.

### P0279 · fabien-roussel · immigration-vote-local-etrangers-v2
- **Énoncé :** Les étrangers non ressortissants de l'Union européenne résidant en France depuis plusieurs années doivent pouvoir voter aux élections locales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ils réaffirment également l'exigence du droit de vote et d'éligibilité des étran- gères et étrangers extracommunau- taires aux élections locales »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune réaffirme le droit de vote et d'éligibilité aux élections locales des étrangers extracommunautaires, c'est-à-dire non ressortissants de l'Union.

### P0280 · fabien-roussel · institutions-adaptation-lois-regions
- **Énoncé :** Les régions doivent obtenir un pouvoir d'adaptation des lois à leur territoire.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Une et indi- visible, la République ne peut être morcelée, au nom d'une fausse décentralisation, par un fédéralisme source de concurrences, de fractures et d'inégalités »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune refuse un fédéralisme qui morcellerait la République et rejette l'extension aux régions du modèle corse, sans viser explicitement un pouvoir d'adaptation des lois.

### P0281 · fabien-roussel · institutions-autonomie-corse-constitution-v2
- **Énoncé :** La Constitution doit reconnaître un statut d'autonomie pour la Corse.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « le projet constitutionnel d'autonomie de la Corse est une atteinte grave aux principes et à la conception même de la nation et de la République »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune qualifie le projet constitutionnel d'autonomie de la Corse d'atteinte grave à la République, rejet explicite d'une reconnaissance constitutionnelle de cette autonomie.

### P0282 · fabien-roussel · institutions-ordre-du-jour-parlement
- **Énoncé :** Le Parlement doit fixer seul son ordre du jour, sans priorité accordée au gouvernement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le Parlement doit redevenir le cœur de la vie démocratique, avec des pouvoirs renforcés de contrôle et d'initiative, une véritable capacité d'évaluation et la maîtrise de son ordre du jour »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande explicitement que le Parlement ait la maîtrise de son ordre du jour.

### P0283 · fabien-roussel · institutions-parlement-interventions-militaires
- **Énoncé :** Le Parlement doit approuver toute intervention militaire extérieure avant son déclenchement.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le PCF s'oppose aux forces de projec- tion militaire extérieures en dehors d'un mandat onusien et de l'approba- tion du Parlement français »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune conditionne explicitement toute projection militaire extérieure à l'approbation du Parlement.

### P0284 · fabien-roussel · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « L'instauration d'une pro- portionnelle réelle, assurant à tous les courants une représentation corres- pondant à leur influence électorale, est indispensable »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune juge indispensable l'instauration d'une proportionnelle réelle.

### P0285 · fabien-roussel · international-primaute-loi-nationale-v2
- **Énoncé :** La France doit pouvoir appliquer sa loi nationale lorsqu'elle entre en conflit avec une règle de l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « le PCF propose notamment de ne pas appliquer les directives européennes et de sortir du marché de l'énergie »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune propose de ne pas appliquer les directives européennes dans le domaine de l'énergie, version partielle du principe d'appliquer la loi nationale face à une règle de l'Union, d'où 1.

### P0286 · fabien-roussel · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Par la sortie immédiate de l'OTAN, première étape vers sa dissolution »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande la sortie immédiate de l'OTAN, ce qui inclut la sortie de son commandement intégré.

### P0287 · fabien-roussel · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Par la remise en cause des traités européens et de la logique capitaliste de la construction de l'UE dans la perspective de la construction d'une Europe de peuples et de nations libres, souverains et associés »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune remet en cause les traités européens au profit de nations souveraines, sans parler explicitement de renégociation des compétences.

### P0288 · fabien-roussel · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les peines aménagées doi- vent être favorisées pour les per- sonnes les moins dangereuses »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune favorise les peines aménagées pour les personnes les moins dangereuses, sans viser le remplacement des peines de moins d'un an.

### P0289 · fabien-roussel · justice-plafonner-detenus-places
- **Énoncé :** Le nombre de détenus doit être plafonné au nombre de places de prison disponibles.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il est aussi nécessaire d'en finir avec la surpopulation carcé- rale »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut en finir avec la surpopulation carcérale, sans proposer explicitement un plafonnement du nombre de détenus au nombre de places.

### P0290 · fabien-roussel · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « il est urgent de constituer un pôle public du numé- rique fondé sur le logiciel libre »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune propose un pôle public du numérique fondé sur le logiciel libre, sans viser l'usage prioritaire du logiciel libre par les administrations.

### P0291 · fabien-roussel · sante-assurance-sante-privee-option-v2
- **Énoncé :** Les assurés doivent pouvoir quitter l'Assurance maladie obligatoire au profit d'une assurance santé privée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Son projet de baisse des cotisations sociales et de mise en place d'assurances privées vise à détruire la Sécurité sociale »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune dénonce la mise en place d'assurances privées comme une destruction de la Sécurité sociale, rejet voisin mais non explicite d'une sortie de l'Assurance maladie au profit d'une assurance privée, d'où -1.

### P0292 · fabien-roussel · sante-mutuelles-part-accrue-v2
- **Énoncé :** Les complémentaires santé doivent prendre en charge une part plus importante des dépenses actuellement remboursées par l'Assurance maladie.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « La Sécurité sociale doit répondre aux besoins humains et prendre en charge les soins à 100 % »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut une prise en charge des soins à 100 % par la Sécurité sociale, contraire explicite d'un transfert de dépenses vers les complémentaires santé.

### P0293 · fabien-roussel · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ce projet comporte la création d'un pôle public du médicament afin de réduire nos dépendances »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune propose explicitement un pôle public du médicament pour produire et réduire les dépendances.

### P0294 · fabien-roussel · sante-psychologues-rembourses
- **Énoncé :** Les consultations chez un psychologue doivent être remboursées sans limite de nombre.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « En intégrant pleine- ment la santé mentale à la Sécurité sociale »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune intègre pleinement la santé mentale à la Sécurité sociale, sans mentionner explicitement le remboursement illimité des consultations de psychologue.

### P0295 · fabien-roussel · securite-enquetes-policiers-independantes
- **Énoncé :** Les enquêtes visant des policiers doivent être confiées à un organisme indépendant du ministère de l'Intérieur.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Par ailleurs, une institution indépendante doit per- mettre les recours contre tout abus »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** Dans le passage sur les forces de sécurité, la base commune prévoit une institution indépendante pour les recours contre les abus, sans lui confier explicitement les enquêtes visant des policiers.

### P0296 · fabien-roussel · securite-pouvoirs-polices-municipales
- **Énoncé :** Les polices municipales doivent recevoir les mêmes pouvoirs d'enquête que la police nationale.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La police municipale ne doit pas devenir le supplétif de la police nationale »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune refuse que la police municipale devienne le supplétif de la police nationale, sans viser explicitement ses pouvoirs d'enquête.

### P0297 · fabien-roussel · societe-gpa-interdite-v2
- **Énoncé :** La gestation pour autrui doit être interdite en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « le maintien de l'interdiction de la GPA »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune soutient explicitement le maintien de l'interdiction de la GPA.

### P0298 · fabien-roussel · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « L'avenir du ferro- viaire doit passer par le retour à une entreprise publique unique et intégrée »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune veut revenir à une entreprise ferroviaire publique unique, ce qui va contre l'ouverture à la concurrence sans la rejeter explicitement.

### P0299 · fabien-roussel · transport-gratuite-transports-urbains
- **Énoncé :** Les transports en commun urbains doivent être gratuits pour les usagers.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous inscrirons l'investisse- ment dans des transports publics gratuits, comme nous le faisons dans les communes et les agglomérations »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** Le discours de clôture inscrit au programme l'investissement dans des transports publics gratuits, sans préciser une gratuité généralisée de tous les réseaux urbains.

### P0300 · fabien-roussel · transport-sncf-entreprise-publique-v2
- **Énoncé :** La SNCF doit être détenue intégralement par des entités publiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « L'avenir du ferro- viaire doit passer par le retour à une entreprise publique unique et intégrée »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande le retour à une entreprise ferroviaire publique unique et intégrée, donc détenue intégralement par la puissance publique.

### P0301 · fabien-roussel · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les infrastructures portuaires, ferroviaires ont besoin d'investissements massifs pour favoriser le fret maritime, fluvial et ferroviaire pour faire reculer la part modale du routier »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune prévoit des investissements massifs pour favoriser le fret ferroviaire face à la route, sans parler de subvention directe du fret.

### P0302 · fabien-roussel · travail-limiter-licenciements-beneficiaires-v2
- **Énoncé :** Les entreprises qui réalisent des bénéfices doivent être limitées dans leur recours aux licenciements économiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « la proposition de loi présentée par Yannick Monnet pour interdire les licen- ciements boursiers »
- **Source :** Introduction de Fabien Roussel : « Une nouvelle industrialisation pour la France » (PCF, PDF) — declaration_vote, 2025-05-17 — https://assets.nationbuilder.com/pcf/pages/30221/attachments/original/1747822112/Intro_FR_nouvelleind_170525.pdf
- **Justification :** Le candidat soutient la proposition de loi visant à interdire les licenciements boursiers, c'est-à-dire décidés par des entreprises qui réalisent des bénéfices.

### P0303 · fabien-roussel · travail-plateformes-presomption-salariat
- **Énoncé :** Les travailleurs des plateformes numériques doivent être présumés salariés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous serons à leurs côtés pour leur permettre d'avoir accès à un vrai contrat de travail »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** Le discours de clôture veut donner aux livreurs des plateformes un vrai contrat de travail, sans évoquer une présomption de salariat.

### P0304 · fabien-roussel · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « garantissant une retraite de haut niveau, dès 60 ans à taux plein »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune garantit la retraite dès 60 ans à taux plein, ce qui va au-delà d'un retour à 62 ans. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0305 · fabien-roussel · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « garantissant une retraite de haut niveau, dès 60 ans à taux plein »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune garantit la retraite dès 60 ans à taux plein, à l'opposé d'un report au-delà de 64 ans.

### P0306 · fabien-roussel · travail-semaine-32-heures
- **Énoncé :** La durée légale du travail doit être réduite à 32 heures par semaine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « combinée à une nouvelle étape de réduction du temps de travail »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune prévoit une nouvelle étape de réduction du temps de travail, sans fixer la durée de 32 heures.

### P0307 · fabien-roussel · travail-statut-fonction-publique-regalien
- **Énoncé :** Le statut de fonctionnaire doit être réservé aux missions régaliennes de l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « le renforce- ment du statut de la fonction publique »
- **Source :** CommunisteS n° 1095, 40e congrès du PCF : discours de clôture et base commune (PCF, PDF) — livre_plateforme, 2026-07-15 — https://assets.nationbuilder.com/pcf/pages/42499/attachments/original/1784128307/document_1095_CommunisteS_40e_Congre%CC%80s.pdf
- **Justification :** La base commune demande le renforcement du statut de la fonction publique, ce qui va contre sa restriction aux missions régaliennes.

## Florian Philippot (Les Patriotes) — 57 positions

### P0308 · florian-philippot · agriculture-alleger-normes-agricoles
- **Énoncé :** Les normes environnementales imposées aux agriculteurs français doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Supprimer la PAC, ses normes absurdes (tel que le taux de jachère obligatoire) et ses contraintes administratives. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de supprimer les normes de la PAC, dont la jachère obligatoire, sans viser l'ensemble des normes environnementales imposées aux agriculteurs, d'où 1 plutôt que 2.

### P0309 · florian-philippot · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablir les prix planchers pour assurer un revenu décent pour nos agriculteurs. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement de rétablir des prix planchers agricoles, en le conditionnant à la sortie de l'UE.

### P0310 · florian-philippot · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Cesser d'entretenir la guerre en Ukraine. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret demande de cesser d'entretenir la guerre en Ukraine, en citant les livraisons d'armes parmi les moyens de cet entretien, sans formuler de mesure portant spécifiquement sur les livraisons françaises, d'où -1.

### P0311 · florian-philippot · defense-defense-europeenne-emprunt
- **Énoncé :** Une défense européenne commune doit être financée par un emprunt de l'Union européenne.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Rejeter la création d'une armée européenne. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret rejette la création d'une armée européenne, sans se prononcer directement sur un financement par emprunt de l'UE, d'où -1 plutôt que -2.

### P0312 · florian-philippot · defense-dissuasion-protection-europe-v2
- **Énoncé :** La France doit étendre explicitement sa doctrine de dissuasion nucléaire à la protection de ses partenaires européens.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les déclarations du président Macron se disant prêt à partager notre dissuasion avec l'Europe constituent une trahison sans précédent de nos intérêts nationaux. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret qualifie de trahison le partage de la dissuasion avec l'Europe, refus voisin mais non identique d'une extension explicite de la doctrine à la protection des partenaires européens, d'où -1.

### P0313 · florian-philippot · democratie-champ-referendum-inchange
- **Énoncé :** Le référendum sur un texte de loi doit rester limité à ses sujets actuels (notamment institutions, politique économique, sociale ou environnementale), sans être étendu à tous les domaines de la loi.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Créer le référendum d'initiative citoyenne (RIC) sur tout sujet et l'inscrire dans la Constitution. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un référendum d'initiative citoyenne sur tout sujet, ce qui étend le référendum à tous les domaines par un mécanisme nouveau plutôt que par l'élargissement du référendum législatif existant, d'où -1.

### P0314 · florian-philippot · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Créer le référendum d'initiative citoyenne (RIC) sur tout sujet et l'inscrire dans la Constitution. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un RIC sur tout sujet, ce qui va dans le sens contraire d'un recours exceptionnel au référendum, sans le dire explicitement, d'où -1.

### P0315 · florian-philippot · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Créer le référendum d'initiative citoyenne (RIC) sur tout sujet et l'inscrire dans la Constitution. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement de créer un RIC sur tout sujet inscrit dans la Constitution.

### P0316 · florian-philippot · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Créer le référendum d'initiative citoyenne (RIC) sur tout sujet et l'inscrire dans la Constitution. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un RIC sur tout sujet, qui ouvrirait aux citoyens le déclenchement d'un référendum national, contrairement à une compétence réservée au président de la République ou au Parlement.

### P0317 · florian-philippot · democratie-revision-par-congres
- **Énoncé :** Une révision de la Constitution doit pouvoir continuer à être adoptée par le Parlement réuni en Congrès, sans référendum.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Ne permettre la révision de la Constitution que par référendum et donc supprimer la procédure de révision par le " Congrès ". »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement de supprimer la révision constitutionnelle par le Congrès au profit du seul référendum.

### P0318 · florian-philippot · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin aux accords de libre- échange, qui ruinent nos agriculteurs en les exposant à une concurrence déloyale avec le reste du monde. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de mettre fin aux accords de libre-échange, mesure contraire à la conclusion de nouveaux accords.

### P0319 · florian-philippot · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Soutenir les créateurs en France : artisans, TPE/PME, par une politique sociale et fiscale très avantageuse, par des outils d'incitation au maintien et au retour en France, par une simplification drastique et réelle des procédures administratives. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose une simplification drastique des procédures administratives pour les artisans et TPE/PME, sans viser l'ensemble des entreprises, d'où 1 plutôt que 2.

### P0320 · florian-philippot · economie-edf-entierement-publique
- **Énoncé :** EDF doit rester une entreprise entièrement détenue par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablir le monopole public national d'EDF. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de rétablir le monopole public d'EDF, sans se prononcer explicitement sur la détention intégrale de son capital par l'État, d'où 1 plutôt que 2.

### P0321 · florian-philippot · economie-etat-finance-usines
- **Énoncé :** L'État doit financer directement la construction d'usines dans les secteurs qu'il juge prioritaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « favoriser l'investissement industriel par la mise en place d'une Caisse Nationale pour l'Equipement et la Réindustrialisation (système public de Crédit Productif) »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un système public de crédit à l'investissement industriel, voisin mais distinct d'un financement direct de la construction d'usines par l'État, d'où 1.

### P0322 · florian-philippot · economie-plafonner-prix-alimentaires
- **Énoncé :** Les prix des produits alimentaires de première nécessité doivent être plafonnés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « encadrement plus strict des prix des produits de première nécessité »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un encadrement plus strict des prix des produits de première nécessité dans les Outre-mer uniquement, d'où 1 plutôt que 2.

### P0323 · florian-philippot · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Revenir à des règles nationales permettrait de faire baisser immédiatement le tarif des particuliers et des entreprises. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de quitter le marché européen de l'électricité pour revenir à des règles nationales de tarification, sans détailler une réglementation des prix de l'énergie par l'État, d'où 1.

### P0324 · florian-philippot · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Il faut supprimer les ARS (Agences régionales de santé). »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement la suppression d'agences de l'État, dont les ARS, ainsi que d'autres structures jugées inutiles.

### P0325 · florian-philippot · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « En finir avec les éoliennes sur terre et en mer. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret demande d'en finir avec les éoliennes terrestres et maritimes, mesure contraire à une accélération de l'éolien terrestre.

### P0326 · florian-philippot · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « un plan d'investissement massif dans le nucléaire de nouvelle génération »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un plan d'investissement massif dans le nucléaire de nouvelle génération, sans chiffrer de réacteurs au-delà des six EPR2, d'où 1 plutôt que 2.

### P0327 · florian-philippot · energie-reduire-part-nucleaire
- **Énoncé :** La part du nucléaire dans la production d'électricité doit être progressivement réduite.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Investir massivement dans le nucléaire et choisir notre mix énergétique. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose d'investir massivement dans le nucléaire et conteste l'objectif de baisse de sa part à 50 %, sans fixer explicitement de part cible, d'où -1.

### P0328 · florian-philippot · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Il faut donc un moratoire total et définitif sur cette méthode de production d'électricité »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement un moratoire total et définitif sur l'éolien, complété par un démantèlement des installations existantes.

### P0329 · florian-philippot · environnement-fin-thermique-2035
- **Énoncé :** La vente de voitures neuves à moteur thermique doit être interdite dès 2035.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Préserver la voiture thermique au-delà de 2035. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de préserver la voiture thermique au-delà de 2035, mesure contraire à l'interdiction de la vente des voitures thermiques neuves en 2035.

### P0330 · florian-philippot · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « une moindre taxation des petits héritages »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret retient comme principe une moindre taxation des petits héritages, sans viser l'ensemble des transmissions familiales, d'où 1 plutôt que 2.

### P0331 · florian-philippot · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Construire les dizaines de milliers de places de prison qui manquent et expulser les prisonniers étrangers »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose d'expulser les prisonniers étrangers, mesure voisine mais distincte du retrait du titre de séjour des étrangers condamnés, d'où 1.

### P0332 · florian-philippot · immigration-regularisation-cinq-ans
- **Énoncé :** Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir être régularisés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Renvoyer les clandestins chez eux et appliquer les OQTF (Obligation de Quitter le Territoire). »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de renvoyer les étrangers en situation irrégulière dans leur pays, sans se prononcer explicitement sur leur régularisation après cinq ans de présence, d'où -1.

### P0333 · florian-philippot · immigration-regularisation-metiers-tension
- **Énoncé :** Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Renvoyer les clandestins chez eux et appliquer les OQTF (Obligation de Quitter le Territoire). »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de renvoyer les étrangers en situation irrégulière dans leur pays, sans se prononcer explicitement sur la régularisation des travailleurs des métiers en tension, d'où -1.

### P0334 · florian-philippot · immigration-visas-professions-qualifiees-v2
- **Énoncé :** Les conditions de délivrance des visas de travail aux personnes exerçant des professions qualifiées doivent être assouplies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Mettre fin à l'immigration de travail et à la directive européenne des travailleurs détachés. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret veut mettre fin à toute immigration de travail sans viser spécifiquement les visas des professions qualifiées. Mesure plus large que l'énoncé, dans le sens contraire : -1 par convention.

### P0335 · florian-philippot · immigration-voies-legales-travail-ue
- **Énoncé :** L'Union européenne doit ouvrir davantage de voies d'immigration légale pour le travail.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Mettre fin à l'immigration de travail et à la directive européenne des travailleurs détachés. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de mettre fin à l'immigration de travail, mesure contraire à l'ouverture de voies légales d'immigration de travail.

### P0336 · florian-philippot · institutions-competences-retour-etat-v2
- **Énoncé :** Certaines compétences actuellement exercées par les collectivités territoriales doivent être transférées à l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « qui passe notamment par le retrait de cette compétence aux départements. L'État doit donc reprendre toute sa responsabilité dans la politique de la protection de l'enfance. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de retirer aux départements la compétence de l'aide sociale à l'enfance pour la confier à l'État, soit un transfert explicite de compétence à l'État.

### P0337 · florian-philippot · institutions-referendum-revision-constitution
- **Énoncé :** Le président de la République doit pouvoir soumettre directement au référendum une révision de la Constitution.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ne permettre la révision de la Constitution que par référendum et donc supprimer la procédure de révision par le " Congrès ". »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose que toute révision de la Constitution passe par référendum, sans préciser que le président pourrait la soumettre directement, d'où 1 plutôt que 2.

### P0338 · florian-philippot · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Quitter la CEDH (Cour européenne des droits de l'homme). »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de dénoncer la Convention et de quitter la CEDH, ce qui va au-delà de ne pas exécuter certains de ses arrêts. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0339 · florian-philippot · international-controles-frontieres-schengen
- **Énoncé :** La France doit rétablir durablement des contrôles à toutes ses frontières intérieures de l'espace Schengen.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Retrouver des frontières nationales en quittant l'espace Schengen et l'UE. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de quitter l'espace Schengen pour rétablir des contrôles permanents aux frontières nationales, ce qui va au-delà de la mesure de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0340 · florian-philippot · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Quitter l'OTAN est l'une des conditions de notre indépendance sur la scène internationale. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret et la déclaration de candidature proposent de quitter l'OTAN, ce qui inclut le commandement intégré et va au-delà de la mesure de l'énoncé. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0341 · florian-philippot · international-reduire-contribution-ue
- **Énoncé :** La contribution de la France au budget de l'Union européenne doit être réduite.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Le Frexit signifie la fin de la contribution française à l'UE »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret présente la fin de la contribution française au budget de l'UE, par la sortie de l'Union, comme une source d'économies, ce qui va au-delà d'une réduction. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0342 · florian-philippot · international-referendum-maintien-ue
- **Énoncé :** La France doit organiser un référendum sur son maintien dans l'Union européenne.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « déclencher un référendum constitutionnel »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret cite le référendum constitutionnel comme l'une des trois voies possibles pour sortir de l'UE, à côté d'un vote du Congrès ou d'une nouvelle Constitution, sans en faire une obligation, d'où 1.

### P0343 · florian-philippot · international-renegocier-traites-competences
- **Énoncé :** Les traités européens doivent être renégociés pour rendre des compétences aux États.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Une renégociation conviendrait pour une réforme à la marge des institu- tions européennes, ce qui n'est pas le sens d'un retour complet de notre sou- veraineté nationale. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret rejette explicitement la renégociation des traités au profit d'une sortie de l'UE, tout en partageant l'objectif d'un retour des compétences aux États.

### P0344 · florian-philippot · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Construire les dizaines de milliers de places de prison qui manquent »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de construire des dizaines de milliers de places de prison, mesure contraire à l'arrêt des constructions.

### P0345 · florian-philippot · justice-comparution-immediate-mineurs
- **Énoncé :** Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Chez les mineurs, juger et sanctionner doivent être concomitants pour que la sanction soit comprise et efficace sur le plan éducatif. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret demande que jugement et sanction des mineurs soient concomitants, ce qui va dans le sens d'un jugement rapide sans mentionner la comparution immédiate, d'où 1.

### P0346 · florian-philippot · justice-juridictions-mineurs-specialisees-v2
- **Énoncé :** Les mineurs doivent être jugés par des juridictions distinctes de celles des majeurs.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les actes graves doivent être jugés comme tels : qui tue comme un adulte doit être jugé comme un adulte. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret veut que les mineurs auteurs d'actes graves soient jugés comme des adultes, sans se prononcer sur l'existence de juridictions distinctes pour les autres, d'où -1.

### P0347 · florian-philippot · justice-majorite-penale-16-ans
- **Énoncé :** La majorité pénale doit être abaissée à 16 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il faut également en finir avec l'excuse automatique de minorité. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de supprimer le caractère automatique de l'excuse de minorité, mesure voisine mais distincte d'un abaissement de la majorité pénale à 16 ans, d'où 1.

### P0348 · florian-philippot · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Il convient donc de réinstaurer les peines planchers et de généraliser les sanctions dès la première infraction. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose explicitement de réinstaurer les peines planchers.

### P0349 · florian-philippot · justice-sanction-financiere-parents
- **Énoncé :** Les parents de mineurs délinquants doivent pouvoir être sanctionnés financièrement.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il est donc nécessaire de mettre les parents de mineurs récidivistes face à leurs responsabilités, en conditionnant les prestations sociales. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de conditionner les prestations sociales des parents de mineurs récidivistes, ce qui couvre une partie seulement des mineurs délinquants, d'où 1 plutôt que 2.

### P0350 · florian-philippot · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Réformer la procédure pénale et les réductions automatiques de peine. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de réformer les réductions automatiques de peine, sans parler explicitement de les supprimer, d'où 1 plutôt que 2.

### P0351 · florian-philippot · numerique-alleger-moderation
- **Énoncé :** Les obligations de modération imposées aux réseaux sociaux doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les lois restreignant la liberté d'expression doivent être supprimées. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret demande la suppression des lois restreignant la liberté d'expression, dans un passage consacré au règlement DSA, sans viser explicitement les obligations de modération des réseaux sociaux, d'où 1.

### P0352 · florian-philippot · numerique-donnees-sante-hebergeurs-europeens
- **Énoncé :** Les données de santé des Français doivent être hébergées exclusivement par des entreprises européennes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Toutes les données stratégiques doivent être hébergées sur des serveurs publics ou contrôlés par l'ANSSI. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose d'héberger les données stratégiques de l'État, dont celles de santé, sur des serveurs publics ou contrôlés par l'ANSSI, ce qui est voisin mais distinct d'un hébergement par des entreprises européennes, d'où 1.

### P0353 · florian-philippot · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Le code source des outils publics doit être libre et auditable. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose que le code source des outils publics soit libre, avec une sortie programmée des GAFAM en trois ans, ce qui correspond à la mesure de l'énoncé.

### P0354 · florian-philippot · sante-centres-sante-publics
- **Énoncé :** Chaque département doit disposer de centres de santé publics employant des médecins salariés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il est urgent de renforcer le maillage territorial en créant des centres de santé locaux dotés d'équipements modernes »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de créer des centres de santé locaux, sans préciser qu'ils seraient publics ni qu'ils emploieraient des médecins salariés, d'où 1 plutôt que 2.

### P0355 · florian-philippot · sante-derembourser-faible-service-rendu
- **Énoncé :** Les médicaments dont le service médical rendu est jugé faible doivent être déremboursés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les réformes récentes, exigées par la Commission européenne, visant à raboter les indemnités chômage, à fermer des lits à l'hôpital ou à arrêter le remboursement des médicaments pourront être supprimées. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret indique que les réformes ayant arrêté le remboursement de médicaments pourront être supprimées, formulation conditionnelle qui va dans le sens contraire du déremboursement, d'où -1.

### P0356 · florian-philippot · sante-ratios-soignants-patients
- **Énoncé :** Un nombre minimal de soignants par patient doit être fixé par la loi dans les hôpitaux.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les effectifs hospitaliers doivent être redéployés en priorité vers les postes soignants, avec un ratio personnel/patients adapté aux besoins réels des services. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose un ratio personnel/patients adapté aux besoins des services, sans le faire fixer par la loi, d'où 1 plutôt que 2.

### P0357 · florian-philippot · societe-aide-active-a-mourir
- **Énoncé :** L'aide active à mourir doit être autorisée pour les adultes atteints d'une maladie incurable.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Refuser toute politique d'incitation à l'euthanasie, assumée ou déguisée, des personnes en situation de handicap. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret refuse toute incitation à l'euthanasie des personnes handicapées, sans se prononcer sur l'aide active à mourir pour l'ensemble des adultes atteints d'une maladie incurable, d'où -1.

### P0358 · florian-philippot · societe-instruction-famille-autorisation
- **Énoncé :** L'instruction en famille doit rester soumise à une autorisation préalable.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Revenir sur les restrictions instaurées par Emmanuel Macron contre la possibilité de " faire l'école à la maison ". »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de revenir sur les restrictions de 2021 à l'instruction en famille, dont le régime d'autorisation préalable, mesure contraire à son maintien.

### P0359 · florian-philippot · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Renationaliser les autoroutes. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de renationaliser les autoroutes, contraire explicite d'une exploitation confiée à des sociétés privées concessionnaires.

### P0360 · florian-philippot · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Rétablir les monopoles publics dans le rail et l'énergie. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de rétablir un monopole public dans le rail, mesure contraire à une ouverture accrue à la concurrence.

### P0361 · florian-philippot · transport-sncf-entreprise-publique-v2
- **Énoncé :** La SNCF doit être détenue intégralement par des entités publiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rétablir les monopoles publics dans le rail et l'énergie. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de rétablir un monopole public dans le rail sans se prononcer explicitement sur la détention intégrale de la SNCF par des entités publiques, d'où 1.

### P0362 · florian-philippot · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Les réformes récentes, exigées par la Commission européenne, visant à raboter les indemnités chômage, à fermer des lits à l'hôpital ou à arrêter le remboursement des médicaments pourront être supprimées. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret indique que les réformes ayant réduit les indemnités chômage pourront être supprimées, formulation conditionnelle qui va dans le sens contraire d'un durcissement, d'où -1.

### P0363 · florian-philippot · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Baisser l'âge de départ à la retraite. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de baisser l'âge de départ à la retraite si les Français le désirent, sans fixer d'âge cible, d'où 1 plutôt que 2.

### P0364 · florian-philippot · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Baisser l'âge de départ à la retraite. »
- **Source :** Grandes orientations pour un projet patriote, édition 2026-2027 (Les Patriotes, PDF) — livre_plateforme, 2026-09-03 — https://les-patriotes.fr/wp-content/uploads/2026/09/Projet-pour-la-France-2026-v2.pdf
- **Justification :** Le livret propose de baisser l'âge de départ à la retraite, mesure contraire à son report au-delà de 64 ans.

## François Asselineau (Union populaire républicaine) — 58 positions

### P0365 · francois-asselineau · agriculture-interdire-glyphosate
- **Énoncé :** L'usage du glyphosate doit être interdit en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous interdirons les pesticides dangereux pour la santé humaine et la biodiversité tels le glyphosate »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'interdire les pesticides dangereux en citant nommément le glyphosate, ce qui correspond à la mesure de l'énoncé.

### P0366 · francois-asselineau · agriculture-interdire-poules-cage
- **Énoncé :** L'élevage de poules pondeuses en cage doit être interdit.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous interdirons les élevages en batterie et industriels »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'interdire les élevages en batterie, sans viser explicitement les poules pondeuses ni l'ensemble des cages, d'où 1 plutôt que 2.

### P0367 · francois-asselineau · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Guerre en Ukraine : arrêt immédiat de tout versement d'aides financières et militaires à l'Ukraine dès sa prise de fonction »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026 annonce l'arrêt immédiat de toute aide militaire à l'Ukraine, soit le contraire explicite de livraisons d'armes accrues.

### P0368 · francois-asselineau · defense-budget-armees-3-pib
- **Énoncé :** Le budget des armées doit atteindre 3 % du PIB.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous porterons le budget de la défense à 3% du PIB en fin de quinquennat »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 fixe explicitement l'objectif d'un budget de la défense à 3 % du PIB.

### P0369 · francois-asselineau · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous porterons le budget de la défense à 3% du PIB en fin de quinquennat »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de porter le budget de la défense de 1,9 % à 3 % du PIB, soit une hausse et non une réduction en proportion du PIB.

### P0370 · francois-asselineau · defense-reduire-presence-etranger
- **Énoncé :** La France doit réduire sa présence militaire à l'étranger.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous désengagerons nos forces des interventions menées dans le cadre de l'OTAN »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de retirer les forces des interventions menées dans le cadre de l'OTAN, sans viser l'ensemble de la présence militaire à l'étranger, d'où 1 plutôt que 2.

### P0371 · francois-asselineau · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « instauration du Référendum d'Initiative Citoyenne (RIC) »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026, comme le programme de 2022, propose d'instaurer le référendum d'initiative citoyenne.

### P0372 · francois-asselineau · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Référendum d'Initiative Citoyenne (RIC) »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026 propose un référendum d'initiative citoyenne, qui ouvrirait aux citoyens le déclenchement d'un référendum national, contrairement à une compétence réservée au président de la République ou au Parlement.

### P0373 · francois-asselineau · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « dénoncerons les traités transcontinentaux déjà adoptés tels que le CETA »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de cesser les négociations de traités transcontinentaux et de dénoncer ceux déjà adoptés comme le CETA, soit le contraire explicite de nouveaux accords.

### P0374 · francois-asselineau · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Cette politique s'accompagnera d'un choc de simplification des normes pour favoriser la compétitivité »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 annonce un choc de simplification des normes applicables aux entreprises, sans viser précisément les règles de création et de gestion, d'où 1 plutôt que 2.

### P0375 · francois-asselineau · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Les investissements étrangers en France, pour préserver nos entreprises stratégiques et empêcher la prédation de sociétés par des fonds-vautours »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit, via le contrôle des mouvements de capitaux, de contrôler les investissements étrangers en France pour protéger les entreprises stratégiques.

### P0376 · francois-asselineau · economie-eau-operateurs-publics
- **Énoncé :** La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous renationaliserons ou cesserons le processus de privatisation rampante et de dégradation de la qualité de service de plusieurs grandes entreprises, en particulier : • des sociétés de production et de distribution de gaz ; • des réseaux d'adduction d'eau »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de renationaliser les réseaux d'adduction d'eau, sans dire explicitement que la distribution devra être assurée uniquement par des opérateurs publics, d'où 1.

### P0377 · francois-asselineau · economie-edf-entierement-publique
- **Énoncé :** EDF doit rester une entreprise entièrement détenue par l'État.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous renationaliserons ou cesserons le processus de privatisation rampante et de dégradation de la qualité de service de plusieurs grandes entreprises, en particulier : • des sociétés de production et de distribution de gaz ; • des réseaux d'adduction d'eau ; • d'EDF »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 cite EDF parmi les entreprises à renationaliser ou à soustraire à la privatisation, ce qui correspond à une détention entièrement publique.

### P0378 · francois-asselineau · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « par regroupement d'institutions publiques de recherche et de laboratoires privés totalement ou partiellement nationalisés »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de nationaliser totalement ou partiellement des laboratoires pharmaceutiques privés, sans énoncer de règle générale pour les entreprises industrielles stratégiques, d'où 1 plutôt que 2.

### P0379 · francois-asselineau · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les tarifs de l'électricité et du gaz seront gelés pendant au moins les deux premières années du mandat »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit un gel des tarifs de l'électricité et du gaz pendant au moins deux ans, mesure temporaire plutôt qu'une réglementation durable des prix, d'où 1 plutôt que 2.

### P0380 · francois-asselineau · economie-vendre-participations-etat
- **Énoncé :** L'État doit vendre une partie de ses participations dans les entreprises cotées en bourse.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous renationaliserons ou cesserons le processus de privatisation rampante »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de renationaliser plusieurs grandes entreprises ou d'arrêter leur privatisation, soit le contraire explicite d'une vente de participations de l'État.

### P0381 · francois-asselineau · environnement-assouplir-artificialisation
- **Énoncé :** Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous lutterons enfin contre l'étalement urbain qui participe à l'artificialisation des sols »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de lutter contre l'étalement urbain et l'artificialisation des sols, sans se prononcer sur les objectifs réglementaires eux-mêmes, d'où -1 plutôt que -2.

### P0382 · francois-asselineau · fiscalite-baisse-ir-tranches-intermediaires
- **Énoncé :** L'impôt sur le revenu doit baisser pour les tranches intermédiaires.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les taux d'imposition sur le revenu des tranches moyennes seront revus à la baisse »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une baisse des taux des tranches moyennes de l'impôt sur le revenu, conditionnée aux résultats du plan d'économies, d'où 1 plutôt que 2.

### P0383 · francois-asselineau · fiscalite-baisse-prelevements-obligatoires
- **Énoncé :** Le niveau total des prélèvements obligatoires doit baisser au cours du quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « En nous débarrassant des contraintes de l'Union européenne, nous diminuerons l'impôt tout en améliorant les services publics »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 annonce une baisse de l'impôt, sans chiffrer le niveau total des prélèvements obligatoires et tout en créant de nouvelles tranches pour les très hauts revenus, d'où 1 plutôt que 2.

### P0384 · francois-asselineau · fiscalite-baisse-tva
- **Énoncé :** Le taux normal de la TVA doit être abaissé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la baisse de la TVA sur une large gamme de produits de consommation courante »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une baisse de la TVA sur une large gamme de produits courants, sans viser le taux normal, d'où 1 plutôt que 2.

### P0385 · francois-asselineau · fiscalite-hausse-taxe-transactions-financieres
- **Énoncé :** Le taux de la taxe sur les transactions financières doit être relevé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « une réforme du dispositif de taxe sur les transactions financières pour soumettre à cet impôt l'ensemble des transactions financières spéculatives réalisées en France »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'élargir l'assiette de la taxe sur les transactions financières, sans mentionner une hausse de son taux, d'où 1 plutôt que 2.

### P0386 · francois-asselineau · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « nous diminuerons de 5 points l'ensemble des droits de succession en dessous d'une valeur de 300 000 € par héritier »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une baisse de 5 points des droits de succession sous 300 000 euros par héritier, au nom de la transmission entre générations.

### P0387 · francois-asselineau · fiscalite-tranche-hauts-revenus
- **Énoncé :** Les plus hauts revenus doivent être soumis à une tranche d'impôt supplémentaire.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « la création de deux nouvelles tranches d'imposition pour les très hauts revenus »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit explicitement deux nouvelles tranches d'impôt sur le revenu au-delà de 250 000 et 500 000 euros par an.

### P0388 · francois-asselineau · immigration-condamnes-perte-titre-sejour
- **Énoncé :** Les étrangers condamnés à une peine de prison ferme doivent perdre leur titre de séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Permettre aux préfets de systématiser le prononcé de décisions d'éloignement du territoire français à l'encontre des étrangers reconnus coupables d'infractions criminelles ou délictuelles »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de systématiser l'éloignement des étrangers condamnés pour crime ou délit, mesure voisine mais distincte du retrait du titre de séjour pour toute peine de prison ferme, d'où 1 plutôt que 2.

### P0389 · francois-asselineau · institutions-fusions-communes-obligatoires
- **Énoncé :** Le nombre de communes doit être réduit par des fusions obligatoires.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « en conditionnant les fusions de commune à un référendum »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 subordonne toute fusion de communes à un référendum, ce qui exclut des fusions obligatoires.

### P0390 · francois-asselineau · institutions-mandat-presidentiel-sept-ans
- **Énoncé :** Le mandat présidentiel doit être porté à sept ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Rétablir le septennat pour le mandat du Président de la République »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 propose explicitement de rétablir le septennat présidentiel.

### P0391 · francois-asselineau · institutions-proportionnelle-legislatives
- **Énoncé :** Les députés doivent être élus au scrutin proportionnel.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Introduire un système de proportionnelle partielle aux élections législatives »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 propose une proportionnelle partielle aux législatives, et non une élection de tous les députés à la proportionnelle, d'où 1 plutôt que 2.

### P0392 · francois-asselineau · institutions-reduire-nombre-parlementaires
- **Énoncé :** Le nombre de députés et de sénateurs doit être réduit.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « réduction du nombre de députés et de sénateurs »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026, comme le programme de 2022 (qui chiffre la baisse à 35 %), propose de réduire le nombre de députés et de sénateurs.

### P0393 · francois-asselineau · institutions-referendum-revision-constitution
- **Énoncé :** Le président de la République doit pouvoir soumettre directement au référendum une révision de la Constitution.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Imposer le recours au référendum pour toute future révision de la Constitution »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 propose de soumettre obligatoirement toute révision constitutionnelle au référendum, ce qui va dans le sens de l'énoncé sans porter sur le pouvoir d'initiative du président, d'où 1 plutôt que 2.

### P0394 · francois-asselineau · international-arrets-cedh-derogation-v2
- **Énoncé :** La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous retirerons la France de certains articles de la Convention européenne des Droits de l'Homme (CEDH) pour la même raison. »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de retirer la France de certains articles de la Convention pour ne plus être lié par la jurisprudence en matière migratoire, mécanisme voisin mais distinct du refus d'exécuter certains arrêts, d'où 1.

### P0395 · francois-asselineau · international-controles-frontieres-schengen
- **Énoncé :** La France doit rétablir durablement des contrôles à toutes ses frontières intérieures de l'espace Schengen.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « rétablissement des contrôles frontaliers pour les flux humains, de marchandises et de capitaux »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026 annonce le rétablissement des contrôles aux frontières, et le programme de 2022 prévoit de quitter l'espace Schengen pour contrôler toutes les frontières.

### P0396 · francois-asselineau · international-quitter-commandement-otan
- **Énoncé :** La France doit quitter le commandement intégré de l'OTAN.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Libération de l'OTAN : notification immédiate au Département d'État américain via l'article 13 pour faire sortir la France de l'alliance sous un an »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026, comme le programme de 2022, prévoit la sortie complète de la France de l'OTAN, ce qui inclut et dépasse la sortie du commandement intégré. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0397 · francois-asselineau · international-reduire-contribution-ue
- **Énoncé :** La contribution de la France au budget de l'Union européenne doit être réduite.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Suppression des coûts budgétaires liés à notre appartenance à l'Union européenne (12 milliards d'euros par an d'économies) »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit la suppression des coûts budgétaires liés à l'appartenance à l'Union européenne, donc de la contribution française, dans le cadre de la sortie de l'UE.

### P0398 · francois-asselineau · international-referendum-maintien-ue
- **Énoncé :** La France doit organiser un référendum sur son maintien dans l'Union européenne.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Il refuse l'idée d'un référendum préalable sur le sujet, estimant que son élection vaudra mandat »
- **Source :** Discours de rentrée 2026 de François Asselineau : la Libération nationale ! (UPR) — declaration_vote, 2026-09-30 — https://upr.fr/universites/discours-de-rentree-2026-de-francois-asselineau-la-liberation-nationale
- **Justification :** Le discours de 2026 rejette explicitement un référendum préalable sur la sortie de l'Union européenne, l'élection devant valoir mandat.

### P0399 · francois-asselineau · international-renforcer-sanctions-russie
- **Énoncé :** L'Union européenne doit renforcer ses sanctions contre la Russie.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous mettrons un terme aux politiques actuelles de sanction, dictées par les États-Unis pour des motifs politiques, inefficaces, contreproductives et discriminatoires (Fédération de Russie »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de mettre fin aux sanctions visant notamment la Russie, soit le contraire explicite d'un renforcement.

### P0400 · francois-asselineau · justice-accompagnement-emploi-detenus
- **Énoncé :** Les détenus doivent bénéficier d'un accompagnement vers l'emploi pendant toute leur détention.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous rendrons obligatoire le travail ou le suivi d'une formation en prison »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 rend obligatoires le travail ou la formation en détention, mesure voisine d'un accompagnement vers l'emploi pendant toute la détention, d'où 1 plutôt que 2.

### P0401 · francois-asselineau · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous développerons le recours aux peines d'emprisonnement, même courtes, dès la première atteinte violente aux personnes »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de développer les courtes peines de prison pour les atteintes violentes, tout en systématisant le travail d'intérêt général pour les délits non violents, d'où -1 plutôt que -2.

### P0402 · francois-asselineau · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous rétablirons des peines planchers pour les auteurs récidivistes de ces mêmes infractions, avec des planchers augmentant à chaque nouvelle récidive »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de rétablir des peines planchers pour les récidivistes, mais seulement pour les infractions violentes et assimilées (cambriolages, trafic de stupéfiants), d'où 1 plutôt que 2.

### P0403 · francois-asselineau · justice-perpetuite-reelle-etendue
- **Énoncé :** La réclusion à perpétuité sans possibilité de libération doit s'appliquer à davantage de crimes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous introduirons dans notre droit pénal la peine de perpétuité incompressible pour les auteurs de crimes terroristes »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 propose la perpétuité incompressible pour les crimes terroristes, une catégorie précise de crimes, d'où 1 plutôt que 2.

### P0404 · francois-asselineau · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « supprimerons les crédits automatiques de peines d'emprisonnement pour tous les délits »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de supprimer les crédits automatiques de réduction de peine et de les remplacer par des remises conditionnées.

### P0405 · francois-asselineau · justice-tig-delits-sans-violence
- **Énoncé :** Le travail d'intérêt général doit être préféré à la prison pour les délits commis sans violence.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « nous systématiserons le recours aux peines de travail d'intérêt général, à encadrement civil ou militaire, pour sanctionner et réinsérer les auteurs de délits non-violents »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de systématiser le travail d'intérêt général pour les auteurs de délits non violents.

### P0406 · francois-asselineau · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « en accompagnant les administrations d'État, les services publics et entreprises publiques vers l'utilisation de solutions informatiques françaises ou libres »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'orienter les administrations vers des solutions françaises ou libres, sous forme d'accompagnement plutôt que d'une priorité imposée, d'où 1 plutôt que 2.

### P0407 · francois-asselineau · numerique-taxe-plateformes
- **Énoncé :** Les grandes plateformes numériques doivent payer un impôt sur le chiffre d'affaires réalisé en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous taxerons les multinationales géantes du net (en particulier les GAFAM) sur leurs profits réalisés grâce au marché français »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de taxer les grandes plateformes sur leurs profits réalisés en France, et non sur leur chiffre d'affaires, d'où 1 plutôt que 2.

### P0408 · francois-asselineau · numerique-telephone-interdit-lycees
- **Énoncé :** L'usage du téléphone portable doit être interdit dans l'enceinte des lycées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « l'interdiction des téléphones portables en cours sera scrupuleusement appliquée dans les faits, sous peine de sanctions disciplinaires »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'appliquer strictement l'interdiction des téléphones portables en cours, sans l'étendre à toute l'enceinte des lycées, d'où 1 plutôt que 2.

### P0409 · francois-asselineau · sante-budget-hopital-inflation
- **Énoncé :** Le budget de l'hôpital public doit augmenter plus vite que l'inflation chaque année.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous augmenterons de 15% le budget de l'hôpital public dès le premier budget voté sous le quinquennat »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une hausse ponctuelle de 15 % du budget de l'hôpital public, sans engagement de progression annuelle supérieure à l'inflation, d'où 1 plutôt que 2.

### P0410 · francois-asselineau · sante-derembourser-faible-service-rendu
- **Énoncé :** Les médicaments dont le service médical rendu est jugé faible doivent être déremboursés.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « en consolidant l'Assurance Maladie et mettant fin aux déremboursements »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de mettre fin aux déremboursements, soit le contraire explicite de l'énoncé.

### P0411 · francois-asselineau · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « créerons un grand pôle public et transparent de recherche médicale et de production de médicaments en France »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit un pôle public de production de médicaments visant l'autosuffisance, ce qui couvre et dépasse la production publique en cas de défaut de l'offre privée. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0412 · francois-asselineau · societe-instruction-famille-autorisation
- **Énoncé :** L'instruction en famille doit rester soumise à une autorisation préalable.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous garantirons la liberté éducative en rétablissant le régime déclaratif pour l'instruction en famille »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de rétablir le régime déclaratif pour l'instruction en famille, soit la fin de l'autorisation préalable.

### P0413 · francois-asselineau · societe-uniforme-ecole-publique
- **Énoncé :** Le port d'une tenue uniforme doit être obligatoire à l'école publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Le port de vêtements neutres pour les élèves sera favorisé »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de favoriser des vêtements neutres pour les élèves, sans rendre un uniforme obligatoire, d'où 1 plutôt que 2.

### P0414 · francois-asselineau · transport-autoroutes-concedees-v2
- **Énoncé :** L'exploitation des autoroutes doit continuer à être confiée à des sociétés privées dans le cadre de concessions.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « des concessionnaires d'autoroutes ; • de Télédiffusion de France ; • de la RATP et de la SNCF »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 cite les concessionnaires d'autoroutes parmi les entreprises à renationaliser, soit le contraire explicite d'une exploitation confiée à des sociétés privées concessionnaires.

### P0415 · francois-asselineau · transport-concurrence-ferroviaire
- **Énoncé :** Le transport ferroviaire de voyageurs doit être davantage ouvert à la concurrence.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous mettrons un terme à la politique d'ouverture de nos services publics à la concurrence imposée par la Commission européenne »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit de mettre fin à l'ouverture des services publics à la concurrence, ce qui inclut le transport ferroviaire de voyageurs, sans toutefois le nommer.

### P0416 · francois-asselineau · transport-petites-lignes-maintenues
- **Énoncé :** Les petites lignes ferroviaires doivent être maintenues même lorsqu'elles sont peu fréquentées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Interdisant toute fermeture de petite ligne ferroviaire »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit d'interdire toute fermeture de petite ligne ferroviaire et de réexaminer les lignes fermées pour motifs économiques.

### P0417 · francois-asselineau · transport-sncf-entreprise-publique-v2
- **Énoncé :** La SNCF doit être détenue intégralement par des entités publiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « des concessionnaires d'autoroutes ; • de Télédiffusion de France ; • de la RATP et de la SNCF »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 cite la SNCF parmi les entreprises à renationaliser ou à soustraire à toute privatisation, ce qui correspond à une détention intégralement publique.

### P0418 · francois-asselineau · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Créant un grand plan d'incitations et d'investissement pour favoriser le recours au ferroutage »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit un plan d'incitations et d'investissement en faveur du ferroutage, forme particulière de fret ferroviaire, d'où 1 plutôt que 2.

### P0419 · francois-asselineau · transport-taxe-kilometrique-poids-lourds
- **Énoncé :** Les poids lourds doivent payer une taxe kilométrique sur le réseau routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la création d'une écotaxe imposée aux poids lourds étrangers utilisant les infrastructures nationales »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une écotaxe sur les seuls poids lourds étrangers, et non sur tous les poids lourds, d'où 1 plutôt que 2.

### P0420 · francois-asselineau · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les allocations-chômage pourront être supprimées après deux refus de propositions d'embauche correspondant aux critères géographiques du demandeur d'emploi »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit la suppression des allocations après deux refus d'offre, mais seulement en fin de quinquennat une fois le marché du travail redevenu dynamique, d'où 1 plutôt que 2.

### P0421 · francois-asselineau · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous proposerons ainsi aux Français d'inscrire dans la Constitution le principe selon lequel le régime général de retraites se fait par répartition »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 veut inscrire la répartition dans la Constitution pour le régime général, tout en préservant la capitalisation complémentaire facultative, d'où -1 plutôt que -2.

### P0422 · francois-asselineau · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous augmenterons le SMIC brut de +24% sur le quinquennat »
- **Source :** Programme 2022 : « Notre programme de libération nationale pour 2022 » (UPR) — livre_plateforme, 2022-02 — https://upr.fr/notre-programme/programme-2022
- **Justification :** Le programme de 2022 prévoit une hausse nominale du SMIC de 24 % sur cinq ans, sans la définir par rapport à l'inflation, d'où 1 plutôt que 2.

## François Ruffin (Debout !) — 48 positions

### P0423 · francois-ruffin · agriculture-bio-restauration-collective-v2
- **Énoncé :** Les produits issus de l'agriculture biologique doivent représenter au moins 30 % des achats alimentaires de la restauration collective publique.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « étendra les moyens d'action de l'Agence Bio notamment pour structurer et renforcer les filières de transformation et soutenir la distribution de produits bio en restau- ration collective »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit de soutenir la distribution de produits bio en restauration collective, sans fixer de seuil minimal de 30 % des achats, d'où 1.

### P0424 · francois-ruffin · agriculture-derogations-neonicotinoides
- **Énoncé :** Les agriculteurs doivent pouvoir obtenir des dérogations pour utiliser des insecticides néonicotinoïdes.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « loi Evin affaiblie, réauto- risation des néonicotinoïdes en France, parti pris en faveur d'Uber »
- **Source :** Cahier de campagne n° 2 : pour une loi de séparation de l'argent et de l'État (Ruffin 2027, PDF) — programme, 2026-07-02 — https://nouspresident.fr/wp-content/uploads/2026/07/Debout-Livret-Probite-Web-1.pdf
- **Justification :** Le programme présente la réautorisation des néonicotinoïdes comme une conséquence de l'influence des lobbies, sans formuler de proposition explicite sur les dérogations.

### P0425 · francois-ruffin · agriculture-origine-viandes-restaurants-v2
- **Énoncé :** Les restaurants doivent indiquer l'origine des viandes utilisées dans les plats qu'ils servent.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « RENDRE SYSTÉMATIQUE L'ÉTIQUETAGE CLAIR DES ORIGINES POUR L'ENSEMBLE DES ALIMENTS ET L'ÉTENDRE À D'AUTRES PRODUITS »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme veut rendre systématique l'étiquetage des origines de tous les aliments, mesure voisine qui ne vise pas explicitement les viandes servies en restaurant, d'où 1.

### P0426 · francois-ruffin · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Pour faire avancer la transition et sortir des engrais fossiles et des pesticides de synthèse, la question du travail est centrale. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme fixe l'objectif de sortir des pesticides de synthèse, sans objectif chiffré ni échéance 2030.

### P0427 · francois-ruffin · agriculture-plafonner-aides-pac
- **Énoncé :** Les aides de la politique agricole commune versées à une même exploitation doivent être plafonnées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les aides ne doivent plus être seulement distribuées selon les hectares, mais da- vantage selon le travail humain réellement présent sur les fermes »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose de répartir les aides de la PAC selon le travail plutôt que selon les hectares, mesure voisine d'un plafonnement par exploitation.

### P0428 · francois-ruffin · agriculture-prix-plancher-agricoles
- **Énoncé :** Des prix plancher garantis doivent être fixés pour les principales productions agricoles.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous proposons des prix minimums ga- rantis discutés par les interprofessions représentatives de chaque filière. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose explicitement des prix minimums garantis fixés par filière à partir des coûts de production.

### P0429 · francois-ruffin · democratie-referendum-exceptionnel
- **Énoncé :** Le recours au référendum doit rester exceptionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « nous proposons de soumettre au vote des Français, par référendum, les mesures suivantes portées par la Convention ci- toyenne pour le climat »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose d'organiser plusieurs référendums et d'instaurer le RIC, ce qui va dans le sens contraire d'un recours exceptionnel sans le rejeter en ces termes.

### P0430 · francois-ruffin · democratie-referendum-initiative-citoyenne
- **Énoncé :** Un référendum d'initiative citoyenne doit pouvoir être déclenché par une pétition signée par un nombre fixé d'électeurs.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Les idées de référendum devront aussi et surtout venir des citoyens, avec le Référendum d'initiative citoyenne (RIC), enfin. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose explicitement l'instauration du référendum d'initiative citoyenne.

### P0431 · francois-ruffin · democratie-referendum-reserve-elus-v2
- **Énoncé :** Le déclenchement d'un référendum national doit rester de la compétence du président de la République ou du Parlement.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Les idées de référendum devront aussi et surtout venir des citoyens, avec le Référendum d'initiative citoyenne (RIC), enfin. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme veut que les référendums viennent surtout des citoyens par le RIC, ce qui retire au président et au Parlement le monopole du déclenchement (déduction du RIC conservée par convention).

### P0432 · francois-ruffin · economie-accords-libre-echange
- **Énoncé :** L'Union européenne doit conclure davantage d'accords de libre-échange.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Dès notre arrivée au pouvoir, nous mettrons un terme aux négociations pour les accords de libre-échange avec la Malaisie, la Thaïlande, les Emirats Arabes Unis, ou encore les Philippines. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme propose de mettre fin aux négociations d'accords de libre-échange en cours, soit le contraire explicite de l'énoncé.

### P0433 · francois-ruffin · economie-aides-conditionnees-emploi
- **Énoncé :** Les aides publiques aux entreprises doivent être conditionnées au maintien de l'emploi en France.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Celui qui touche l'argent public garde les emplois, investit dans les usines, forme les salariés, respecte les sous-traitants. Sinon, il rembourse. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme conditionne explicitement les aides publiques au maintien des emplois, avec remboursement à défaut.

### P0434 · francois-ruffin · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Un État stratège doit défendre ses entreprises privées stratégiques face aux ingérences étrangères. »
- **Source :** Cahier de campagne n° 2 : pour une loi de séparation de l'argent et de l'État (Ruffin 2027, PDF) — programme, 2026-07-02 — https://nouspresident.fr/wp-content/uploads/2026/07/Debout-Livret-Probite-Web-1.pdf
- **Justification :** Le programme propose une étude stratégique publique pour chaque rachat d'entreprise stratégique par un investisseur étranger, voire des nationalisations.

### P0435 · francois-ruffin · economie-edf-entierement-publique
- **Énoncé :** EDF doit rester une entreprise entièrement détenue par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Et nous reviendrons progressivement à un modèle 100 % public de production »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit un retour à une production électrique entièrement publique confiée à EDF, sans se prononcer explicitement sur la détention du capital d'EDF.

### P0436 · francois-ruffin · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « privilégier les participations dans les PME- ETI aux aides versées sans conditions aux start-ups ou aux multinationales et prendre le contrôle des entreprises les plus stratégiques »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme propose explicitement des prises de participation publiques dans les entreprises industrielles et le contrôle des plus stratégiques.

### P0437 · francois-ruffin · economie-prix-energie-reglementes
- **Énoncé :** Les prix de l'énergie pour les ménages doivent être réglementés par l'État.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « retour à un service public dont les prix de vente seront basés sur les coûts réels de production »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit des prix de l'électricité fixés sur les coûts de production par un service public, ce qui ne couvre que l'électricité et non l'ensemble de l'énergie.

### P0438 · francois-ruffin · economie-vendre-participations-etat
- **Énoncé :** L'État doit vendre une partie de ses participations dans les entreprises cotées en bourse.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous refusons la logique de privatisation et le déman- tèlement des services publics. »
- **Source :** Cahier de campagne n° 2 : pour une loi de séparation de l'argent et de l'État (Ruffin 2027, PDF) — programme, 2026-07-02 — https://nouspresident.fr/wp-content/uploads/2026/07/Debout-Livret-Probite-Web-1.pdf
- **Justification :** Le programme refuse la logique de privatisation, sans viser explicitement la vente de participations dans des entreprises cotées.

### P0439 · francois-ruffin · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous poursuivrons le développement de l'énergie éolienne, car elle produit davantage en hiver »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit de poursuivre le développement de l'éolien, sans parler d'accélération ni distinguer l'éolien terrestre.

### P0440 · francois-ruffin · energie-consommation-moitie-2050
- **Énoncé :** La consommation d'énergie finale de la France doit baisser de moitié d'ici 2050.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « À l'horizon 2050, nous prévoyons de réduire nos besoins en énergie d'environ 33 %, à 1 050 TWh »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit une baisse de la consommation d'énergie d'environ un tiers d'ici 2050, objectif de même sens mais inférieur à la moitié.

### P0441 · francois-ruffin · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** 0 (position intermédiaire explicite)
- **Citation :** « La décision de construire ou non huit réacteurs EPR2 supplémen- taires sera prise en fonction du devis proposé par EDF »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme confirme les six EPR2 et laisse explicitement ouverte la construction de huit réacteurs supplémentaires selon leur coût.

### P0442 · francois-ruffin · energie-prolonger-reacteurs-60-ans
- **Énoncé :** Les réacteurs nucléaires existants doivent être prolongés au-delà de 60 ans lorsque l'autorité de sûreté l'autorise.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « nous prolongerons la durée de vie des centrales existantes, tant que l'Autorité de sûreté nucléaire et de radioprotection validera leur niveau de sûreté »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose explicitement de prolonger les réacteurs existants tant que l'autorité de sûreté le valide, sans limite d'âge.

### P0443 · francois-ruffin · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « nous poursuivrons le développement de l'énergie éolienne, car elle produit davantage en hiver »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit de poursuivre le développement de l'éolien, soit le contraire explicite d'une suspension.

### P0444 · francois-ruffin · environnement-ecocide-crime
- **Énoncé :** L'écocide doit être reconnu comme un crime dans le Code pénal.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous créerons un délit de faute systémique, pour recon- naître le lien entre la pollution et les décisions budgétaires ou de rentabilité du dirigeant. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose de nouveaux délits environnementaux visant les dirigeants, mesure voisine qui ne reprend pas la qualification de crime d'écocide.

### P0445 · francois-ruffin · environnement-plastique-usage-unique-2030
- **Énoncé :** Les emballages en plastique à usage unique doivent être interdits d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « réduire les quantités de plastique, remettre en place la consigne du verre »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose de réduire le plastique et de rétablir la consigne du verre, sans interdiction des emballages à usage unique ni échéance.

### P0446 · francois-ruffin · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « De plus, le MACF reste un outil facile à contourner - comme reconnu par la Commission européenne elle-même -, il s'agira donc de renforcer les contrôles aux importations. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme soutient le renforcement du mécanisme d'ajustement carbone aux frontières existant, sans proposer de taxe nouvelle sur l'ensemble des importations.

### P0447 · francois-ruffin · fiscalite-impot-fortune-retabli
- **Énoncé :** Un impôt sur la fortune incluant les actifs financiers doit être rétabli.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Il n'a pas rétabli l'impôt de solidarité sur la fortune. »
- **Source :** La convergence des pourrissements : colères et espoirs (francoisruffin.fr) — declaration_vote, 2026-10-22 — https://francoisruffin.fr/la-convergence-des-pourrissements-coleres-et-espoirs/
- **Justification :** La tribune reproche au président de ne pas avoir rétabli l'ISF, sans formuler de proposition explicite.

### P0448 · francois-ruffin · fiscalite-impot-minimum-grandes-fortunes-v2
- **Énoncé :** Les patrimoines nets supérieurs à 100 millions d'euros doivent être soumis à un prélèvement annuel minimal de 2 %.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Gabriel Zucman propose une taxe annuelle de 2 % sur les patrimoines supérieurs à 100 M€, après déduction des impôts déjà acquittés. »
- **Source :** Plan d'action : plan de redressement (Ruffin 2027, PDF) — programme, 2026-10-21 — https://nouspresident.fr/wp-content/uploads/2026/10/Plan-de-redressement-2026-mise-en-page.pdf
- **Justification :** Le programme retient la taxe Zucman, prélèvement annuel de 2 % sur les patrimoines de plus de 100 millions d'euros après déduction des impôts déjà payés, soit exactement un prélèvement minimal.

### P0449 · francois-ruffin · fiscalite-reduire-allegements-cotisations
- **Énoncé :** Les allègements de cotisations sociales accordés aux employeurs sur les salaires doivent être réduits.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Avec des réductions plus lissées complétées par un gel au niveau de 2026, l'économie sera d'au moins 5 Md d'euros dès 2027 »
- **Source :** Plan d'action : plan de redressement (Ruffin 2027, PDF) — programme, 2026-10-21 — https://nouspresident.fr/wp-content/uploads/2026/10/Plan-de-redressement-2026-mise-en-page.pdf
- **Justification :** Le plan prévoit de lisser et de geler les allègements de cotisations patronales pour en économiser au moins 5 milliards, une réduction partielle plutôt qu'une baisse générale, d'où 1.

### P0450 · francois-ruffin · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Imposer les grandes successions à la hauteur du patrimoine accumulé »
- **Source :** Plan d'action : plan de redressement (Ruffin 2027, PDF) — programme, 2026-10-21 — https://nouspresident.fr/wp-content/uploads/2026/10/Plan-de-redressement-2026-mise-en-page.pdf
- **Justification :** Le programme alourdit l'imposition des successions du 1 % le plus aisé tout en doublant l'abattement à 200 000 euros, ce qui va globalement dans le sens contraire.

### P0451 · francois-ruffin · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « L'absence d'efficacité de cette nouvelle baisse d'impôts a été confirmée par l'évaluation de l'IPP de 2025. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme juge inefficace la baisse des impôts de production, sans proposer explicitement de la rétablir ou de la refuser.

### P0452 · francois-ruffin · fiscalite-taxe-benefices-exceptionnels
- **Énoncé :** Les bénéfices exceptionnels des grandes entreprises doivent être soumis à une taxe supplémentaire.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous proposons donc de mettre en place une contribution exceptionnelle sur les surprofits des entreprises pétrolières et du raffinage »
- **Source :** Plan d'action : plan de redressement (Ruffin 2027, PDF) — programme, 2026-10-21 — https://nouspresident.fr/wp-content/uploads/2026/10/Plan-de-redressement-2026-mise-en-page.pdf
- **Justification :** Le programme propose une contribution sur les surprofits limitée au secteur pétrolier et au raffinage.

### P0453 · francois-ruffin · institutions-pouvoirs-commissions-enquete
- **Énoncé :** Les commissions d'enquête parlementaires doivent disposer de pouvoirs d'investigation élargis.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « les assemblées disposeront de moyens techniques, humains et d'expertise renforcés pour exercer pleinement leur mission de contrôle de l'exécutif, évaluer les politiques publiques et enquê- ter sur les dérives du pouvoir »
- **Source :** Cahier de campagne n° 2 : pour une loi de séparation de l'argent et de l'État (Ruffin 2027, PDF) — programme, 2026-07-02 — https://nouspresident.fr/wp-content/uploads/2026/07/Debout-Livret-Probite-Web-1.pdf
- **Justification :** Le programme prévoit des moyens renforcés pour le contrôle parlementaire et les enquêtes, sans préciser d'élargissement des pouvoirs des commissions d'enquête.

### P0454 · francois-ruffin · numerique-donnees-sante-hebergeurs-europeens
- **Énoncé :** Les données de santé des Français doivent être hébergées exclusivement par des entreprises européennes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Édouard Philippe a aggravé cette dépendance en confiant en 2019 la plateforme nationale des données de santé à Microsoft. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme critique l'hébergement des données de santé par Microsoft et prévoit d'étendre au secteur de la santé l'obligation de cloud certifié européen.

### P0455 · francois-ruffin · numerique-faciliter-centres-donnees
- **Énoncé :** L'implantation de centres de données doit bénéficier de procédures administratives accélérées.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Le déploiement des centres de données sera beaucoup plus encadré »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit un encadrement accru des centres de données, ce qui va dans le sens contraire de procédures accélérées.

### P0456 · francois-ruffin · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Afin de réduire la dépendance en logiciel, nous proposons de développer un éco-système basé sur le logiciel libre et les communs numériques. »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme propose explicitement d'appuyer la commande publique informatique sur le logiciel libre et un cloud certifié européen.

### P0457 · francois-ruffin · sante-production-publique-medicaments
- **Énoncé :** Les médicaments essentiels doivent être produits par un établissement public lorsque l'offre privée fait défaut.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « une production publique à court terme pour les produits de base critiques »
- **Source :** Cahier de campagne n° 7 : industrie (Ruffin 2027, PDF) — programme, 2026-10-15 — https://nouspresident.fr/wp-content/uploads/2026/10/Debout-Livret-Campagne-7-Industrie-Vweb.pdf
- **Justification :** Le programme propose explicitement un pôle public du médicament assurant la production de médicaments essentiels.

### P0458 · francois-ruffin · transport-doubler-investissement-ferroviaire
- **Énoncé :** Les investissements dans le réseau ferroviaire doivent être doublés sur le quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Cela supposera notamment des investissements importants dans de nouveaux trains, fabriqués en France, et la modernisation du réseau. »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit des investissements importants dans le ferroviaire, sans chiffrer un doublement.

### P0459 · francois-ruffin · transport-subventionner-fret-ferroviaire
- **Énoncé :** L'État doit subventionner le fret ferroviaire pour qu'il puisse concurrencer le transport routier.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Le renouveau du secteur ferroviaire permettra aussi de tripler la part du fret ferroviaire dans le transport de marchandises »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme vise un triplement de la part du fret ferroviaire, sans mentionner explicitement de subvention.

### P0460 · francois-ruffin · transport-trains-de-nuit
- **Énoncé :** L'État doit financer l'ouverture de nouvelles lignes de trains de nuit.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous développerons aussi les trains de nuit et les liaisons directes vers les grandes villes européennes »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme propose explicitement le développement des trains de nuit par la puissance publique.

### P0461 · francois-ruffin · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « on a durci l'assurance- chômage par décrets »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme critique les durcissements successifs de l'assurance chômage, sans proposition explicite sur les règles d'indemnisation.

### P0462 · francois-ruffin · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « les accords d'entreprise priment désormais sur les accords de branche et a fortiori sur le code du travail pour déterminer les règles applicables dans l'entreprise »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme critique la primauté des accords d'entreprise sur la loi, sans viser explicitement la durée du travail.

### P0463 · francois-ruffin · travail-elargir-penibilite-retraite
- **Énoncé :** Les critères de pénibilité ouvrant droit à un départ anticipé à la retraite doivent être élargis.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « pour quatre trimestres cotisés dans un métier exposé à la pénibilité, un trimestre supplémentaire de retraite sera accordé »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme renforce les droits à retraite anticipée liés à la pénibilité, sans annoncer explicitement d'élargissement des critères.

### P0464 · francois-ruffin · travail-indexation-salaires
- **Énoncé :** Les salaires doivent être indexés automatiquement sur l'inflation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « nous indexerons les salaires sur l'inflation, comme cela a existé jusqu'en 1982 »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme propose explicitement l'indexation des salaires sur l'inflation.

### P0465 · francois-ruffin · travail-plafond-prudhommes-maintenu-v2
- **Énoncé :** Le barème légal plafonnant les indemnités accordées par les prud'hommes en cas de licenciement sans cause réelle et sérieuse doit être maintenu.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « en clair, on plafonne le prix de l'injustice, on normalise l'abus »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme critique le plafonnement des indemnités prud'homales issu des ordonnances de 2017, sans en proposer explicitement la suppression, d'où -1.

### P0466 · francois-ruffin · travail-retraite-62-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être ramené à 62 ans.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Des mesures fortes, concrètes, comme le SMIC à 1 600€ ou la retraite à 60 ans, qui revalorisent le travail. »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme reprend la retraite à 60 ans, ce qui va au-delà d'un retour à 62 ans. Mesure plus large que l'énoncé, dans le même sens : 1 par convention.

### P0467 · francois-ruffin · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Des mesures fortes, concrètes, comme le SMIC à 1 600€ ou la retraite à 60 ans, qui revalorisent le travail. »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme reprend la retraite à 60 ans, soit le contraire explicite d'un report au-delà de 64 ans.

### P0468 · francois-ruffin · travail-salaries-conseils-administration
- **Énoncé :** Les salariés doivent occuper au moins un tiers des sièges des conseils d'administration des grandes entreprises.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Les salariés seront réellement représentés, en nombre, aux conseils d'administration des entreprises »
- **Source :** Cahier de campagne n° 5 : pour un travaillisme écologique (Ruffin 2027, PDF) — programme, 2026-09-09 — https://nouspresident.fr/wp-content/uploads/2026/09/Livret-Campagne-5-Travaillisme-Ecologique-VDEF.pdf
- **Justification :** Le programme prévoit une représentation accrue des salariés aux conseils d'administration, sans fixer la proportion d'un tiers.

### P0469 · francois-ruffin · travail-smic-au-dela-inflation
- **Énoncé :** Le SMIC doit être augmenté au-delà de l'inflation.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Des mesures fortes, concrètes, comme le SMIC à 1 600€ ou la retraite à 60 ans, qui revalorisent le travail. »
- **Source :** Cahier de campagne n° 1 : pour un statut des travailleuses et travailleurs essentiels (Ruffin 2027, PDF) — programme, 2026-04-13 — https://nouspresident.fr/wp-content/uploads/2026/04/Debout-Livret-Campagne_Web.pdf
- **Justification :** Le programme reprend un SMIC à 1 600 euros, hausse ponctuelle au-delà de l'inflation sans règle de revalorisation permanente.

### P0470 · francois-ruffin · travail-statut-fonction-publique-regalien
- **Énoncé :** Le statut de fonctionnaire doit être réservé aux missions régaliennes de l'État.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « En parallèle, nous renforcerons le statut des fonction- naires »
- **Source :** Cahier de campagne n° 2 : pour une loi de séparation de l'argent et de l'État (Ruffin 2027, PDF) — programme, 2026-07-02 — https://nouspresident.fr/wp-content/uploads/2026/07/Debout-Livret-Probite-Web-1.pdf
- **Justification :** Le programme prévoit de renforcer le statut des fonctionnaires, ce qui va dans le sens contraire d'une restriction aux missions régaliennes.

## Gabriel Attal (Renaissance) — 52 positions

### P0471 · gabriel-attal · agriculture-autoriser-nouvelles-techniques-genomiques
- **Énoncé :** La culture de plantes issues des nouvelles techniques génomiques doit être autorisée en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous ne participerons à aucune des guerres idéologiques, qu'elles viennent de la droite contre le bio ou les renouvelables, ou de la gauche contre le nucléaire ou les nouvelles techniques génomiques demandées par les agriculteurs »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance refuse de s'opposer aux nouvelles techniques génomiques demandées par les agriculteurs, sans proposer explicitement d'en autoriser la culture, d'où 1.

### P0472 · gabriel-attal · agriculture-pesticides-moitie-2030
- **Énoncé :** L'usage des pesticides de synthèse doit être réduit de moitié d'ici 2030.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ces contrats de transition agricole tripartites (agriculteurs-industriels-distributeurs) couvrent bien-être animal, réduction de 50 % des pesticides d'ici 2030 »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance inscrit une réduction de 50 % des pesticides d'ici 2030 dans des contrats de transition agricole, sans en faire une obligation générale, d'où 1.

### P0473 · gabriel-attal · defense-armes-ukraine
- **Énoncé :** La France doit livrer davantage d'armes à l'Ukraine.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous allons continuer sans relâche à soutenir l'Ukraine. »
- **Source :** Mes chantiers capitaux : frontières (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/frontieres
- **Justification :** Le programme prévoit de continuer à soutenir l'Ukraine sans mentionner explicitement une hausse des livraisons d'armes, d'où 1.

### P0474 · gabriel-attal · defense-reduire-budget-armees
- **Énoncé :** Le budget des armées doit être réduit en proportion du PIB.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « nous devons continuer à augmenter les moyens de notre défense »
- **Source :** Mes chantiers capitaux : frontières (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/frontieres
- **Justification :** Le programme prévoit d'augmenter les moyens de la défense et d'amplifier le réarmement, soit le contraire d'une réduction du budget des armées.

### P0475 · gabriel-attal · democratie-assemblees-tirees-consultatives-v2
- **Énoncé :** Les assemblées citoyennes tirées au sort doivent avoir un rôle consultatif et non décisionnel.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « convention de 150 jeunes tirés au sort, âgés de 16 à 25 ans, pour les associer directement aux décisions. " Non pas pour consulter. Mais pour décider. »
- **Source :** Gabriel Attal en meeting à Lyon : un pacte pour la jeunesse (attalpresident.fr) — declaration_vote, 2026-10-10 — https://attalpresident.fr/actualites/gabriel-attal-en-meeting-a-lyon-un-pacte-pour-la-jeunesse
- **Justification :** Le candidat annonce une convention de jeunes tirés au sort chargée de décider et non de consulter, ce qui s'oppose à un rôle seulement consultatif, mais pour une seule convention, d'où -1.

### P0476 · gabriel-attal · democratie-conventions-citoyennes
- **Énoncé :** Des conventions citoyennes tirées au sort doivent être consultées avant les grandes réformes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la création d'une convention réunissant 150 jeunes tirés au sort, âgés de 16 à 25 ans »
- **Source :** Gabriel Attal en meeting à Lyon : un pacte pour la jeunesse (attalpresident.fr) — declaration_vote, 2026-10-10 — https://attalpresident.fr/actualites/gabriel-attal-en-meeting-a-lyon-un-pacte-pour-la-jeunesse
- **Justification :** Le candidat annonce une convention de 150 jeunes tirés au sort associée aux décisions qui concernent la jeunesse, version partielle de conventions citoyennes consultées avant les grandes réformes, d'où 1.

### P0477 · gabriel-attal · democratie-raccourcir-consultations-public
- **Énoncé :** Les procédures de consultation du public sur les projets d'aménagement doivent être raccourcies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'enquête publique et le recours contentieux seraient regroupés en un seul bloc procédural, avec un délai plafond de 24 mois pour le solaire et 36 mois pour l'éolien »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose de regrouper enquête publique et recours sous un délai plafond pour les projets solaires et éoliens uniquement, d'où 1.

### P0478 · gabriel-attal · economie-alleger-regles-entreprises
- **Énoncé :** Les règles encadrant la création et la gestion des entreprises doivent être allégées.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Il souhaite également réduire d'un quart la charge administrative des entreprises »
- **Source :** Gabriel Attal présente sa vision économique pour libérer, innover et renforcer l'indépendance de la France (attalpresident.fr) — declaration_vote, 2026-10-28 — https://attalpresident.fr/actualites/gabriel-attal-vision-economique-liberer-innover-independance-france
- **Justification :** Le candidat propose de réduire d'un quart la charge administrative des entreprises, ce qui correspond à l'allègement des règles visé par l'énoncé.

### P0479 · gabriel-attal · economie-baisse-depense-publique
- **Énoncé :** La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « 150 milliards d'euros d'économies sur le quinquennat, dont deux tiers sur les dépenses sociales »
- **Source :** Gabriel Attal : son plan pour les finances publiques (attalpresident.fr) — declaration_vote, 2026-10-15 — https://attalpresident.fr/actualites/gabriel-attal-lettre-aux-francais-plan-finances-publiques
- **Justification :** Le candidat propose 150 milliards d'euros d'économies sur le quinquennat, sans formuler l'objectif en part du PIB, d'où 1.

### P0480 · gabriel-attal · economie-controle-rachats-etrangers
- **Énoncé :** Le contrôle de l'État sur le rachat d'entreprises françaises par des investisseurs étrangers doit être renforcé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « un contrôle strict des investissements chinois dans nos infrastructures les plus sensibles »
- **Source :** Mes chantiers capitaux : frontières (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/frontieres
- **Justification :** Le programme prévoit un contrôle strict des investissements chinois dans les infrastructures sensibles, version limitée d'un renforcement du contrôle des rachats étrangers, d'où 1.

### P0481 · gabriel-attal · economie-participations-etat-industrie
- **Énoncé :** L'État doit prendre des participations dans les entreprises industrielles jugées stratégiques.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « L'État pourrait concentrer ses commandes publiques sur des entreprises stratégiques afin de favoriser l'émergence de champions européens, entrer au capital de certaines entreprises clés »
- **Source :** Gabriel Attal présente sa vision économique pour libérer, innover et renforcer l'indépendance de la France (attalpresident.fr) — declaration_vote, 2026-10-28 — https://attalpresident.fr/actualites/gabriel-attal-vision-economique-liberer-innover-independance-france
- **Justification :** Le candidat prévoit que l'État entre au capital d'entreprises clés des filières stratégiques ; la plateforme Renaissance privilégie aussi les prises de participation aux subventions.

### P0482 · gabriel-attal · economie-reduire-nombre-fonctionnaires
- **Énoncé :** Le nombre de fonctionnaires doit diminuer au cours du prochain quinquennat.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « La suppression de 100 000 postes de fonctionnaires, grâce à un plan de départs volontaires avec prime »
- **Source :** Gabriel Attal : son plan pour les finances publiques (attalpresident.fr) — declaration_vote, 2026-10-15 — https://attalpresident.fr/actualites/gabriel-attal-lettre-aux-francais-plan-finances-publiques
- **Justification :** Le candidat propose la suppression de 100 000 postes de fonctionnaires, ce qui correspond à l'énoncé.

### P0483 · gabriel-attal · economie-regle-equilibre-constitution
- **Énoncé :** Une règle d'équilibre des comptes publics doit être inscrite dans la Constitution.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « l'inscription d'une règle d'or budgétaire dans la Constitution »
- **Source :** Gabriel Attal présente sa vision économique pour libérer, innover et renforcer l'indépendance de la France (attalpresident.fr) — declaration_vote, 2026-10-28 — https://attalpresident.fr/actualites/gabriel-attal-vision-economique-liberer-innover-independance-france
- **Justification :** Le candidat propose d'inscrire une règle d'or budgétaire dans la Constitution, ce qui correspond à l'énoncé.

### P0484 · gabriel-attal · economie-supprimer-agences-etat
- **Énoncé :** Une partie des agences et opérateurs de l'État doit être supprimée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Une revue des entités de régulation sera menée et certaines pourront être supprimées si elles ne répondent pas à nos objectifs de simplification »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance envisage de supprimer certaines entités de régulation après revue, sans engagement ferme sur les agences et opérateurs, d'où 1.

### P0485 · gabriel-attal · energie-accelerer-eolien-terrestre
- **Énoncé :** L'implantation d'éoliennes terrestres doit être accélérée.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « avec un délai plafond de 24 mois pour le solaire et 36 mois pour l'éolien »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose d'accélérer l'instruction des projets éoliens par un délai plafond, sans objectif spécifique d'implantation terrestre, d'où 1.

### P0486 · gabriel-attal · energie-nouveaux-reacteurs-au-dela-epr2
- **Énoncé :** La France doit construire de nouveaux réacteurs nucléaires au-delà des six EPR2 prévus.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « l'accélération du programme de 14 réacteurs EPR2 »
- **Source :** Gabriel Attal présente sa vision économique pour libérer, innover et renforcer l'indépendance de la France (attalpresident.fr) — declaration_vote, 2026-10-28 — https://attalpresident.fr/actualites/gabriel-attal-vision-economique-liberer-innover-independance-france
- **Justification :** Le candidat défend un programme de 14 réacteurs EPR2, soit au-delà des six prévus.

### P0487 · gabriel-attal · energie-petits-reacteurs-modulaires
- **Énoncé :** L'État doit financer le développement de petits réacteurs nucléaires modulaires.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « lancerons un plan d'accélération "SMR 2030" pour mettre les SMR en production industrielle dès 2030 »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose un plan public d'accélération des petits réacteurs modulaires, ce qui correspond à l'énoncé.

### P0488 · gabriel-attal · energie-suspendre-nouvelles-eoliennes
- **Énoncé :** L'installation de nouvelles éoliennes doit être suspendue.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « nous soutiendrons la capacité solaire et réhausserons l'objectif d'éolien offshore »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose de relever l'objectif d'éolien en mer, ce qui va à l'encontre d'une suspension, sans viser l'éolien terrestre, d'où -1.

### P0489 · gabriel-attal · environnement-limiter-recours-projets-v2
- **Énoncé :** Les possibilités de recours juridictionnel contre les autorisations de projets industriels doivent être limitées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « L'enquête publique et le recours contentieux seraient regroupés en un seul bloc procédural, avec un délai plafond de 24 mois pour le solaire et 36 mois pour l'éolien. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance enserre le recours contentieux contre les projets solaires et éoliens dans un bloc procédural à délai plafond, version partielle qui borne les recours sans en restreindre explicitement l'accès, d'où 1.

### P0490 · gabriel-attal · environnement-supprimer-taxe-carbone
- **Énoncé :** La taxe carbone sur les carburants doit être supprimée.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La seconde consisterait à rendre plus progressive la taxe carbone, en fonction des revenus et des lieux de vie. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose de refonder la taxe carbone plutôt que de la supprimer, sous forme de pistes à explorer, d'où -1.

### P0491 · gabriel-attal · environnement-supprimer-zfe
- **Énoncé :** Les zones à faibles émissions dans les grandes villes doivent être supprimées.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « nous avons choisi de nous opposer à la sup- pression des ZFE »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance s'oppose explicitement à la suppression des ZFE et propose de les rétablir pour les collectivités volontaires.

### P0492 · gabriel-attal · environnement-taxe-carbone-importations
- **Énoncé :** Les entreprises doivent payer une taxe sur les émissions de gaz à effet de serre de leurs importations.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Nous proposons de transformer le mécanisme d'ajustement carbone aux frontières en véritable "bouclier industriel" écologique. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose d'étendre le mécanisme d'ajustement carbone aux frontières, qui taxe les émissions des importations.

### P0493 · gabriel-attal · fiscalite-baisse-cotisations-salaries
- **Énoncé :** Les cotisations sociales payées par les salariés doivent baisser.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « en réduisant les charges salariales pour faire monter le salaire net »
- **Source :** Mes chantiers capitaux : travail et salaires (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/travail-salaires
- **Justification :** Le programme propose de réduire les charges salariales pour augmenter le salaire net, ce qui correspond à l'énoncé.

### P0494 · gabriel-attal · fiscalite-reduire-droits-succession
- **Énoncé :** Les droits de succession doivent être réduits pour les transmissions familiales.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « une transmission facilitée du patrimoine entre générations »
- **Source :** Gabriel Attal en meeting à Lyon : un pacte pour la jeunesse (attalpresident.fr) — declaration_vote, 2026-10-10 — https://attalpresident.fr/actualites/gabriel-attal-en-meeting-a-lyon-un-pacte-pour-la-jeunesse
- **Justification :** Le candidat défend une transmission facilitée du patrimoine entre générations sans préciser une baisse des droits de succession, d'où 1.

### P0495 · gabriel-attal · fiscalite-supprimer-impots-production
- **Énoncé :** Les impôts de production payés par les entreprises doivent être supprimés.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Le "bouclier fiscal productif" ramènera les impôts de production sous les 3% de la valeur ajoutée d'une entreprise »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose de baisser les impôts de production, pas de les supprimer, d'où 1.

### P0496 · gabriel-attal · immigration-asile-droit-travail
- **Énoncé :** Les demandeurs d'asile doivent être autorisés à travailler dès le dépôt de leur demande.
- **Valeur :** 0 (position intermédiaire explicite)
- **Citation :** « Suppression du délai d'autorisation de travail (aujourd'hui 6 mois) pour les demandeurs d'asile de pays à très forte présomption de l'asile, allongement de ce délai pour les pays sûrs. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance supprime le délai pour certains demandeurs d'asile et l'allonge pour d'autres, position intermédiaire, d'où 0.

### P0497 · gabriel-attal · immigration-plafond-annuel-admissions
- **Énoncé :** Le Parlement doit fixer chaque année un plafond du nombre d'étrangers admis au séjour.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « définiront avec l'Etat des orientations et quotas qui seront soumises au vote du Parlement »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance prévoit des quotas d'immigration de travail votés par le Parlement, version partielle d'un plafond annuel global, d'où 1.

### P0498 · gabriel-attal · immigration-regroupement-familial-ressources
- **Énoncé :** Le regroupement familial doit être soumis à des conditions de ressources plus strictes.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Durcir les règles du regroupement familial : allongement du délai de présence du conjoint de 18 à 24 mois, renforcement des conditions de maîtrise du français pour les membres de la famille à l'étranger, des conditions de logement et de ressources pour le membre en France. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose de renforcer les conditions de ressources du regroupement familial.

### P0499 · gabriel-attal · immigration-supprimer-droit-du-sol
- **Énoncé :** Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Nous refusons la suppression du droit du sol sur le territoire hexagonal. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance refuse explicitement la suppression du droit du sol, limitée au territoire hexagonal.

### P0500 · gabriel-attal · immigration-visas-professions-qualifiees-v2
- **Énoncé :** Les conditions de délivrance des visas de travail aux personnes exerçant des professions qualifiées doivent être assouplies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « où l'on accueille les compétences, les talents dont nous avons besoin sur la base d'un système à points comme au Canada »
- **Source :** Mes chantiers capitaux : frontières (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/frontieres
- **Justification :** Le programme veut accueillir les compétences et talents dont la France a besoin par un système à points, dans le sens d'un accès facilité des travailleurs qualifiés, sans viser explicitement l'assouplissement des visas de travail, d'où 1.

### P0501 · gabriel-attal · international-emprunt-commun-ue
- **Énoncé :** L'Union européenne doit pouvoir emprunter en commun pour financer des investissements.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Ce renforcement du soutien à l'innovation pourra être financé par de la dette européenne et par une taxe Gafa européenne. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose de financer l'innovation par de la dette européenne, ce qui correspond à l'énoncé.

### P0502 · gabriel-attal · international-impots-propres-ue
- **Énoncé :** L'Union européenne doit disposer de nouveaux impôts qui lui sont propres.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ce renforcement du soutien à l'innovation pourra être financé par de la dette européenne et par une taxe Gafa européenne. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose une taxe européenne sur les grandes plateformes, un impôt européen précis plutôt que de nouveaux impôts propres en général, d'où 1.

### P0503 · gabriel-attal · justice-accompagnement-emploi-detenus
- **Énoncé :** Les détenus doivent bénéficier d'un accompagnement vers l'emploi pendant toute leur détention.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Un accompagnement systématique sera mis en place dans les 3 à 6 mois précédant la fin de la peine, notamment en lien avec France Travail »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance prévoit un accompagnement vers l'emploi dans les derniers mois de détention, pas pendant toute la détention, d'où 1.

### P0504 · gabriel-attal · justice-arret-construction-prisons
- **Énoncé :** La construction de nouvelles places de prison doit être arrêtée.
- **Valeur :** −2 (pas du tout d'accord)
- **Citation :** « Une loi d'urgence pour la construction de prisons et de centres de rétention administrative (CRA) »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose une loi d'urgence pour construire des prisons, soit le contraire de l'énoncé.

### P0505 · gabriel-attal · justice-courtes-peines-alternatives
- **Énoncé :** Les peines de prison de moins d'un an doivent être remplacées par des peines alternatives.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « Nous devons aussi permettre que toutes sortes de peines puissent être prononcées et exécutées rapidement, y compris des peines courtes. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance veut que les peines courtes puissent être prononcées et exécutées, tout en développant les peines alternatives, d'où -1.

### P0506 · gabriel-attal · justice-justice-restaurative-systematique
- **Énoncé :** La justice restaurative doit être proposée systématiquement aux victimes et aux auteurs d'infractions.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Multiplier les démarches de justice restaurative »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose de multiplier la justice restaurative sans la rendre systématique, d'où 1.

### P0507 · gabriel-attal · justice-peines-minimales-recidive
- **Énoncé :** Des peines minimales doivent être rétablies pour les récidivistes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Des seuils minimaux seront établis pour ces peines »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose des seuils minimaux de peine pour toutes les infractions, sans viser spécifiquement les récidivistes, d'où 1.

### P0508 · gabriel-attal · justice-supprimer-reductions-automatiques
- **Énoncé :** Les réductions automatiques de peine doivent être supprimées.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Suppression des aménagements de peine automatiques (libération sous contrainte) pour les multirécidivistes »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance supprime les aménagements de peine automatiques pour les seuls multirécidivistes, d'où 1.

### P0509 · gabriel-attal · justice-tig-delits-sans-violence
- **Énoncé :** Le travail d'intérêt général doit être préféré à la prison pour les délits commis sans violence.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous proposons de renforcer l'usage des TIG »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose de renforcer l'usage des travaux d'intérêt général, sans les préférer explicitement à la prison pour les délits sans violence, d'où 1.

### P0510 · gabriel-attal · numerique-logiciels-libres-administration
- **Énoncé :** Les administrations doivent utiliser en priorité des logiciels libres ou hébergés en Europe.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « la préférence européenne dans les marchés publics et le soutien aux acteurs souverains comme Mistral »
- **Source :** Mes chantiers capitaux : intelligence artificielle (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/intelligence-artificielle
- **Justification :** Le programme prévoit une préférence européenne dans les marchés publics de l'IA, version voisine d'une priorité aux logiciels libres ou hébergés en Europe, d'où 1.

### P0511 · gabriel-attal · numerique-reseaux-sociaux-moins-15-ans
- **Énoncé :** L'accès aux réseaux sociaux doit être interdit aux moins de 15 ans.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « nous irons au bout de leur interdiction pour les moins de 15 ans »
- **Source :** Mes chantiers capitaux : éducation (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/education
- **Justification :** Le programme prévoit l'interdiction des réseaux sociaux aux moins de 15 ans, ce qui correspond à l'énoncé.

### P0512 · gabriel-attal · numerique-taxe-plateformes
- **Énoncé :** Les grandes plateformes numériques doivent payer un impôt sur le chiffre d'affaires réalisé en France.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Ce renforcement du soutien à l'innovation pourra être financé par de la dette européenne et par une taxe Gafa européenne. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose une taxe sur les grandes plateformes à l'échelle européenne plutôt qu'un impôt national sur le chiffre d'affaires réalisé en France, d'où 1.

### P0513 · gabriel-attal · securite-armer-polices-municipales
- **Énoncé :** Les policiers municipaux doivent être armés dans toutes les communes.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Rendre obligatoire l'armement des polices municipales avec un niveau d'équipement minimal qui dépendra de la taille de la commune. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance rend l'armement des polices municipales obligatoire, avec une dérogation possible sur délibération du conseil municipal, d'où 1.

### P0514 · gabriel-attal · securite-interdire-drones-manifestations
- **Énoncé :** L'usage de drones par la police pour surveiller les manifestations doit être interdit.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « L'usage des drones est un outil déterminant pour nos forces de l'ordre, notamment pour le maintien de l'ordre. »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance veut élargir l'usage des drones par les forces de l'ordre, notamment pour le maintien de l'ordre, sans viser explicitement les manifestations, d'où -1.

### P0515 · gabriel-attal · securite-limiter-dissolution-associations
- **Énoncé :** Le pouvoir du gouvernement de dissoudre des associations par décret doit être limité.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « La procédure actuelle de dissolution des associations est particulièrement lente et passe par un décret en conseil des ministres. Nous souhaitons qu'elle puisse être plus rapide »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance veut accélérer la dissolution des associations, ce qui va dans le sens contraire d'une limitation, d'où -1.

### P0516 · gabriel-attal · securite-pouvoirs-polices-municipales
- **Énoncé :** Les polices municipales doivent recevoir les mêmes pouvoirs d'enquête que la police nationale.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Nous proposons que les directeurs de police municipale, sous l'autorité des procureurs et des maires, aient désormais le statut d'officier de police judiciaire »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance étend les compétences judiciaires des polices municipales sans les aligner entièrement sur la police nationale, d'où 1.

### P0517 · gabriel-attal · securite-videosurveillance-algorithmique
- **Énoncé :** La vidéosurveillance algorithmique doit être autorisée de façon permanente dans l'espace public.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « nous proposons de prolonger et d'étendre le champ de cette expérimentation »
- **Source :** Une République ferme, une France apaisée (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-05-26 — https://doc.parti.re/conventions/Restitution-Regalien-Une-Republique-ferme-une-France-apaisee.pdf
- **Justification :** La plateforme Renaissance propose de prolonger et d'étendre l'expérimentation de la vidéoprotection algorithmique, sans autorisation permanente, d'où 1.

### P0518 · gabriel-attal · transport-abonnement-national-unique
- **Énoncé :** Un abonnement national unique donnant accès aux trains régionaux et aux transports urbains doit être créé.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « Généraliser le titre unique de transport à l'échelle régionale »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose un titre unique de transport à l'échelle régionale, pas nationale, d'où 1.

### P0519 · gabriel-attal · travail-durcir-indemnisation-chomage
- **Énoncé :** Les règles d'indemnisation du chômage doivent être durcies.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « je porte une réforme de l'assurance chômage qui incite au travail »
- **Source :** Mes chantiers capitaux : travail et salaires (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/travail-salaires
- **Justification :** Le programme propose une réforme de l'assurance chômage plus incitative au travail, sans en détailler le durcissement, d'où 1.

### P0520 · gabriel-attal · travail-duree-travail-accord-entreprise
- **Énoncé :** La durée légale du travail doit pouvoir être fixée par accord d'entreprise au-delà de 35 heures.
- **Valeur :** +1 (plutôt d'accord)
- **Citation :** « donner ensuite plus de liberté au dialogue social pour fixer l'organisation du travail »
- **Source :** Mes chantiers capitaux : travail et salaires (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/travail-salaires
- **Justification :** Le programme veut laisser davantage le dialogue social fixer l'organisation du travail, sans mentionner la durée légale au-delà de 35 heures, d'où 1.

### P0521 · gabriel-attal · travail-retraite-au-dela-64-ans
- **Énoncé :** L'âge légal de départ à la retraite doit être porté au-delà de 64 ans.
- **Valeur :** −1 (plutôt pas d'accord)
- **Citation :** « l'enjeu ne sera plus l'âge de départ à la retraite, mais la durée de cotisation »
- **Source :** Mes chantiers capitaux : travail et salaires (attalpresident.fr) — programme, 2026-10 — https://attalpresident.fr/programme/travail-salaires
- **Justification :** Le programme écarte l'âge de départ comme levier au profit de la durée de cotisation, sans rejeter explicitement un report au-delà de 64 ans, d'où -1.

### P0522 · gabriel-attal · travail-retraite-capitalisation
- **Énoncé :** Une part des retraites doit être financée par capitalisation.
- **Valeur :** +2 (tout à fait d'accord)
- **Citation :** « Il faut que nous complétions notre système par répartition via une couche de retraites par investissement. »
- **Source :** Pour une nouvelle donne économique et climatique (Renaissance, conventions thématiques, PDF) — livre_plateforme, 2025-07-21 — https://doc.parti.re/Conventions-thematiques_Nouvelle-donne.pdf
- **Justification :** La plateforme Renaissance propose d'ajouter une part de retraite par capitalisation au système par répartition ; le candidat défend aussi le développement de la capitalisation.

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

