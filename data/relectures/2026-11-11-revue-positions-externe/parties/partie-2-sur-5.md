# Revue indépendante des positions des candidats — Radar 2027

## Your role

You are an independent, adversarial reviewer. Your job is to find **interpretation errors** in positions that another AI extracted from French presidential candidates' own published texts. Be rigorous and politically neutral: apply exactly the same standard to every candidate. Do not use your own knowledge of a candidate's views to add, keep or change a position: judge **only** whether the quoted passage supports the value given for the statement. Write your reasons in French.

**Scope:** part 2 of 5 — 276 positions (Fabien Roussel, Florian Philippot, François Asselineau, François Ruffin, Gabriel Attal). The other parts are reviewed separately; references (P0001…) are global.

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
*276 positions, extraites le 2026-11-09 et mises à jour le 2026-11-11 sur la banque de 297 énoncés activée.*

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

