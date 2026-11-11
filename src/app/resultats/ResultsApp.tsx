'use client';
// Page de résultats côté client (contracts/routes-and-views.md, R1, R2, R5, R6, R7, R12, R13).
// FR-001 à FR-042 : le fragment est lu après montage (rien du résultat dans le HTML statique),
// le calcul suit le flux du cœur (`loadResults`), la fiche et la comparaison sont des vues de la
// même page portées par l'historique sans changer l'adresse.
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { CandidateDetail } from '@/core';
import { loadDetail } from '@/lib/dataset-client';
import { formatPublishedAt, parseDay, type DateParts } from '@/lib/published-date';
import { carryOver, draftFromResultState, needsConfirmation, type CarryResult } from '@/lib/questionnaire/from-result';
import { ROUTES } from '@/lib/questionnaire/guards';
import { setHandoff } from '@/lib/questionnaire/handoff';
import { readDraft, writeDraft } from '@/lib/questionnaire/storage';
import type { Draft } from '@/lib/questionnaire/types';
import { pushView, readView, replaceView } from '@/lib/results/history';
import { loadResults } from '@/lib/results/load';
import { canShareNatively, copyLink, shareNatively } from '@/lib/results/share';
import { MAX_COMPARED, MIN_COMPARED, OTHERS_KEY, type PageState, type ReadyData, type ViewState } from '@/lib/results/types';
import { candidateSheet, comparisonView, resultsView } from '@/lib/results/view-model';
import { Button, buttonClassName } from '@/ui/Button';
import { ComparisonTable } from '@/ui/ComparisonTable';
import { ConfirmDialog } from '@/ui/ConfirmDialog';
import { InsufficientList } from '@/ui/InsufficientList';
import { Notice } from '@/ui/Notice';
import { QuestionDetail } from '@/ui/QuestionDetail';
import { RankingList } from '@/ui/RankingList';
import { ResultsHeader } from '@/ui/ResultsHeader';
import { SharePanel } from '@/ui/SharePanel';
import { ThemeScoreList } from '@/ui/ThemeScoreList';
import { ResumePrompt } from '../ResumePrompt';

const METHODOLOGY = '/methodologie#calcul';
const RANKING: ViewState = { view: 'ranking' };

type DetailState = { key: string; status: 'loading' | 'ready' | 'error'; detail: CandidateDetail | null };

const headingClass = 'rounded-sm text-3xl font-semibold tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const linkClass = 'rounded-sm text-accent underline underline-offset-4';
/** Bouton à libellé long dans un encart étroit : passe à la ligne (320 px, FR-038). */
const wrappingButton = buttonClassName({ size: 'sm' }).replace('whitespace-nowrap', 'whitespace-normal py-2 text-left');

/** Vue valide pour ce résultat ; sinon le classement (data-model § 3). */
function validView(view: ViewState, data: ReadyData): ViewState {
  const ids = new Set([...data.board.ranked, ...data.board.insufficient].map((s) => s.candidate.id));
  if (view.view === 'candidate') return ids.has(view.candidateId) ? view : RANKING;
  if (view.view === 'compare') return view.candidateIds.every((id) => ids.has(id)) ? view : RANKING;
  return view;
}

function Shell({ title, headingRef, children }: { title: string; headingRef?: RefObject<HTMLHeadingElement | null>; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
        {title}
      </h1>
      {children}
    </div>
  );
}

export function ResultsApp({ fetcher }: { fetcher?: typeof fetch }) {
  const t = useTranslations('results');
  const tQuestionnaire = useTranslations('questionnaire');
  const format = useFormatter();
  const router = useRouter();
  const [page, setPage] = useState<PageState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<ViewState>(RANKING);
  const [selected, setSelected] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(null);
  const [storageNotice, setStorageNotice] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** Vue ouverte depuis le classement de cette page : « Retour » revient en arrière dans l'historique. */
  const pushedFromRanking = useRef(false);
  const lastCandidate = useRef<string | null>(null);
  const rankingScroll = useRef(0);
  const firstView = useRef(true);

  // Lecture du fragment après montage, puis à chaque modification manuelle du fragment.
  useEffect(() => {
    let cancelled = false;
    loadResults(window.location.hash, window.location.origin, fetcher).then((next) => {
      if (cancelled) return;
      setPage(next);
      if (next.status === 'ready') setView(validView(readView(window.history.state), next.data));
    });
    return () => {
      cancelled = true;
    };
  }, [fetcher, attempt]);

  useEffect(() => {
    const onHashChange = () => {
      replaceView(RANKING);
      setView(RANKING);
      setSelected([]);
      setDetail(null);
      setPage({ status: 'loading' });
      setAttempt((a) => a + 1);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const data = page.status === 'ready' ? page.data : null;

  useEffect(() => {
    if (!data) return;
    const onPopState = (event: PopStateEvent) => {
      pushedFromRanking.current = false;
      setView(validView(readView(event.state), data));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [data]);

  // Focus et défilement à chaque changement de vue (R12).
  useEffect(() => {
    if (!data) return;
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    if (view.view === 'ranking') {
      window.scrollTo(0, rankingScroll.current);
      const target = lastCandidate.current ? document.querySelector<HTMLElement>(`[data-open-candidate="${lastCandidate.current}"]`) : null;
      (target ?? headingRef.current)?.focus({ preventScroll: true });
      return;
    }
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [view, data]);

  // Fichier de détail chargé à l'ouverture d'une fiche, avec la version du lien (R5, FR-042).
  const detailKey = data && view.view === 'candidate' ? `${data.bank.version}/${view.candidateId}` : null;
  useEffect(() => {
    if (!data || view.view !== 'candidate' || !detailKey) return;
    // Tant que `detail.key` diffère de `detailKey`, la fiche affiche « chargement ».
    let cancelled = false;
    loadDetail(data.bank.version, view.candidateId, fetcher).then(
      (value) => !cancelled && setDetail({ key: detailKey, status: 'ready', detail: value }),
      () => !cancelled && setDetail({ key: detailKey, status: 'error', detail: null }),
    );
    return () => {
      cancelled = true;
    };
    // `view.candidateId` est contenu dans `detailKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailKey, fetcher]);

  const openView = useCallback((next: ViewState) => {
    if (next.view === 'candidate') lastCandidate.current = next.candidateId;
    rankingScroll.current = window.scrollY;
    pushedFromRanking.current = true;
    pushView(next);
    setView(next);
  }, []);

  const backToRanking = useCallback(() => {
    if (pushedFromRanking.current) {
      window.history.back();
      return;
    }
    replaceView(RANKING);
    setView(RANKING);
  }, []);

  const nameOf = useCallback((id: string) => (data ? [...data.board.ranked, ...data.board.insufficient].find((s) => s.candidate.id === id)?.candidate.name ?? id : id), [data]);

  const toggleCompare = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        setAnnouncement(t('compare.removed', { name: nameOf(id) }));
        setSelected(selected.filter((x) => x !== id));
      } else if (selected.length >= MAX_COMPARED) {
        setAnnouncement(t('compare.limit'));
      } else {
        setAnnouncement(t('compare.added', { name: nameOf(id) }));
        setSelected([...selected, id]);
      }
    },
    [selected, nameOf, t],
  );

  // « Modifier mes réponses » et « Refaire le questionnaire » : même flux (R7, data-and-share § 4).
  const goToQuestionnaire = useCallback(
    (draft: Draft) => {
      if (!writeDraft(draft)) {
        setStorageNotice(true);
        setHandoff({ kind: 'draft', draft });
      }
      router.push(ROUTES.questions);
    },
    [router],
  );

  const modify = useCallback(() => {
    if (!data) return;
    const now = new Date().toISOString();
    const result: CarryResult =
      data.state.bankVersion === data.currentBank.version ? { kind: 'draft', draft: draftFromResultState(data.state, data.currentBank, now) } : carryOver(data.state, data.bank, data.currentBank, now);
    if (result.kind === 'choose-themes') {
      setHandoff({ kind: 'preselection', priorities: result.preselected, mode: data.state.mode });
      router.push(ROUTES.themes);
      return;
    }
    if (needsConfirmation(readDraft(), result.draft)) {
      setPendingDraft(result.draft);
      return;
    }
    goToQuestionnaire(result.draft);
  }, [data, goToQuestionnaire, router]);

  const dateFormat = useCallback((date: Date, options: DateParts) => format.dateTime(date, options), [format]);
  const preview = useMemo(() => ({ title: t('meta.title'), description: t('meta.description') }), [t]);
  const share = useMemo(() => {
    if (!data) return null;
    const url = data.shareUrl;
    return {
      url,
      onCopy: () => copyLink(url),
      nativeShare: canShareNatively() ? () => shareNatively({ title: preview.title, text: preview.description, url }) : undefined,
    };
  }, [data, preview]);

  // États sans résultat : aucun nom, pourcentage ni sujet clé (SC-005).
  if (page.status === 'loading') {
    return (
      <Shell title={t('title')}>
        <p role="status" className="text-fg-muted">
          {t('loading')}
        </p>
      </Shell>
    );
  }
  if (page.status === 'no-fragment') {
    return (
      <Shell title={t('empty.title')}>
        <p className="text-lg text-fg-muted">{t('empty.body')}</p>
        <ResumePrompt fetcher={fetcher} />
        <div>
          <Button href={ROUTES.themes}>{t('empty.start')}</Button>
        </div>
      </Shell>
    );
  }
  if (page.status === 'no-version') {
    return (
      <Shell title={t('title')}>
        <Notice tone="info">{tQuestionnaire('noVersion')}</Notice>
        <p>
          <a href={METHODOLOGY} className={linkClass}>
            {t('header.methodology')}
          </a>
        </p>
      </Shell>
    );
  }
  if (page.status === 'invalid') {
    return (
      <Shell title={t('title')}>
        <Notice tone="warning" role="alert" title={t('invalid.title')}>
          {t('invalid.body')}
        </Notice>
        <div>
          <Button href={ROUTES.themes}>{t('invalid.start')}</Button>
        </div>
      </Shell>
    );
  }
  if (page.status === 'unknown-version') {
    return (
      <Shell title={t('title')}>
        <Notice tone="info" title={t('unknownVersion.title')}>
          {t('unknownVersion.body')}
        </Notice>
        <div>
          <Button onClick={() => window.location.reload()}>{t('unknownVersion.reload')}</Button>
        </div>
      </Shell>
    );
  }
  if (page.status === 'error') {
    return (
      <Shell title={t('title')}>
        <Notice tone="warning" role="alert" title={t('error.title')}>
          {t('error.body')}
        </Notice>
        <div>
          <Button
            onClick={() => {
              setPage({ status: 'loading' });
              setAttempt((a) => a + 1);
            }}
          >
            {t('error.retry')}
          </Button>
        </div>
      </Shell>
    );
  }

  const ready = page.data;
  const announcer = (
    <p aria-live="polite" className="sr-only">
      {announcement}
    </p>
  );
  const confirm = (
    <>
      {storageNotice ? <Notice tone="warning">{t('modify.storageUnavailable')}</Notice> : null}
      <ConfirmDialog
        open={pendingDraft !== null}
        title={t('modify.confirm.title')}
        description={t('modify.confirm.description')}
        confirmLabel={t('modify.confirm.confirm')}
        cancelLabel={t('modify.confirm.cancel')}
        destructive
        onCancel={() => setPendingDraft(null)}
        onConfirm={() => {
          const draft = pendingDraft;
          setPendingDraft(null);
          if (draft) goToQuestionnaire(draft);
        }}
      />
    </>
  );
  const sharePanel = share ? (
    <section aria-labelledby="share-title" className="flex flex-col gap-3">
      <h2 id="share-title" className="text-xl font-semibold">
        {t('share.title')}
      </h2>
      <p className="text-sm text-fg-muted">{t('share.explain')}</p>
      <SharePanel url={share.url} preview={preview} onCopy={share.onCopy} nativeShare={share.nativeShare} />
    </section>
  ) : null;

  if (view.view === 'candidate') {
    const sheet = candidateSheet(ready, view.candidateId);
    if (sheet) {
      const detailForSheet = detail?.key === detailKey ? detail : null;
      const detailState = detailForSheet?.status ?? 'loading';
      const evidenceOf = (questionId: string) => {
        const position = detailForSheet?.detail?.positions[questionId];
        if (!position) return { quote: null, source: null };
        const src = detailForSheet!.detail!.sources[position.quoteSource];
        return { quote: position.quote, source: src ? { title: src.title, url: src.url, date: formatPublishedAt(src.publishedAt, dateFormat) } : null };
      };
      const inSelection = selected.includes(sheet.candidateId);
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Button variant="ghost" size="sm" onClick={backToRanking}>
              {t('candidate.back')}
            </Button>
          </div>
          <header className="flex flex-col gap-2">
            <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
              {sheet.name}
            </h1>
            <p className="text-fg-muted">{sheet.party}</p>
            {sheet.withdrawn ? <p className="text-sm font-medium">{t('withdrawn')}</p> : null}
            {sheet.status === 'ranked' ? (
              <p className="text-lg">
                <span className="font-semibold">{t('candidate.rank', { rank: sheet.rank! })}</span>
                {sheet.tied ? (
                  <>
                    {' · '}
                    {t('ranking.tied')}
                  </>
                ) : null}
                {' · '}
                <span className="tabular-nums">{format.number(sheet.percent! / 100, { style: 'percent', maximumFractionDigits: 0 })}</span>
                {' · '}
                <span className="font-medium">{t(`band.${sheet.band!}`)}</span>
              </p>
            ) : (
              <p className="text-lg text-fg-muted">{t('candidate.insufficient')}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" aria-pressed={inSelection} onClick={() => toggleCompare(sheet.candidateId)}>
                {inSelection ? t('candidate.compareRemove') : t('candidate.compare')}
              </Button>
              {selected.length >= MIN_COMPARED ? (
                <Button size="sm" onClick={() => openView({ view: 'compare', candidateIds: [...selected] })}>
                  {t('compare.action', { count: selected.length })}
                </Button>
              ) : null}
            </div>
            {announcer}
          </header>
          <section aria-labelledby="themes-title" className="flex flex-col gap-3">
            <h2 id="themes-title" className="text-xl font-semibold">
              {t('candidate.themes')}
            </h2>
            <ThemeScoreList label={t('candidate.themes')} rows={sheet.themes} />
          </section>
          <section aria-labelledby="questions-title" className="flex flex-col gap-4">
            <h2 id="questions-title" className="text-xl font-semibold">
              {t('candidate.questions')}
            </h2>
            {detailState === 'loading' ? (
              <p role="status" className="text-sm text-fg-muted">
                {t('candidate.detailLoading')}
              </p>
            ) : detailState === 'error' ? (
              <Notice tone="warning">{t('candidate.detailError')}</Notice>
            ) : null}
            {sheet.groups.length === 0 ? <p className="text-fg-muted">{t('candidate.noQuestions')}</p> : null}
            {sheet.groups.map((group) => (
              <section key={group.key} aria-label={group.key === OTHERS_KEY ? undefined : group.label} className="flex flex-col gap-3" data-group={group.key}>
                <h3 className="text-lg font-semibold">{group.key === OTHERS_KEY ? t('candidate.othersGroup') : group.label}</h3>
                <ul className="flex flex-col gap-3">
                  {group.questions.map((q) => (
                    <li key={q.questionId} data-question={q.questionId}>
                      <QuestionDetail text={q.text} themes={q.themeLabels} answer={q.answer} position={q.position} agreement={q.agreement} evidence={q.evidence} detailState={detailState} {...evidenceOf(q.questionId)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </section>
          {sheet.skipped.length > 0 ? (
            <section aria-labelledby="skipped-title" className="flex flex-col gap-3">
              <h2 id="skipped-title" className="text-xl font-semibold">
                {t('candidate.skipped')}
              </h2>
              <ul className="flex flex-col gap-3">
                {sheet.skipped.map((q) => (
                  <li key={q.questionId} data-question={q.questionId}>
                    <QuestionDetail text={q.text} themes={q.themeLabels} answer="skipped" position={q.position} agreement={null} evidence={q.evidence} detailState={detailState} {...evidenceOf(q.questionId)} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {sheet.unansweredCount > 0 ? <p className="text-fg-muted">{t('candidate.unanswered', { count: sheet.unansweredCount })}</p> : null}
          <p>
            <a href={METHODOLOGY} className={linkClass}>
              {t('header.methodology')}
            </a>
          </p>
          <div>
            <Button variant="secondary" onClick={backToRanking}>
              {t('candidate.back')}
            </Button>
          </div>
        </div>
      );
    }
  }

  if (view.view === 'compare') {
    const comparison = comparisonView(ready, view.candidateIds);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Button variant="ghost" size="sm" onClick={backToRanking}>
            {t('compare.back')}
          </Button>
        </div>
        <h1 ref={headingRef} tabIndex={-1} className={headingClass}>
          {t('compare.title')}
        </h1>
        {announcer}
        <ComparisonTable
          columns={comparison.columns.map((c) => ({ id: c.candidateId, name: c.name, slot: c.slot, global: c.global }))}
          rows={comparison.rows}
          onRemove={(id) => {
            const remaining = view.candidateIds.filter((x) => x !== id);
            setSelected(remaining);
            setAnnouncement(t('compare.removed', { name: nameOf(id) }));
            if (remaining.length >= MIN_COMPARED) {
              const next: ViewState = { view: 'compare', candidateIds: remaining };
              replaceView(next);
              setView(next);
            } else {
              backToRanking();
            }
          }}
        />
        <p>
          <a href={METHODOLOGY} className={linkClass}>
            {t('header.methodology')}
          </a>
        </p>
        {sharePanel}
        <div>
          <Button variant="secondary" onClick={backToRanking}>
            {t('compare.back')}
          </Button>
        </div>
      </div>
    );
  }

  // Vue « classement ».
  const results = resultsView(ready);
  return (
    <div className="flex flex-col gap-8">
      <ResultsHeader headingRef={headingRef} priorities={results.header.priorities} mode={results.header.mode} answered={results.header.answeredCount} total={results.header.totalCount} methodologyHref={METHODOLOGY} />
      {results.prior ? (
        <Notice tone="warning" title={t('prior.title')}>
          <div className="flex flex-col gap-3">
            <p>{t('prior.warning', { date: format.dateTime(parseDay(results.prior.publishedAt), { day: '2-digit', month: '2-digit', year: 'numeric' }) })}</p>
            {results.prior.withdrawnCount > 0 ? <p>{t('prior.withdrawn', { count: results.prior.withdrawnCount })}</p> : null}
            <div className="flex flex-col items-start gap-2">
              <button type="button" className={wrappingButton} onClick={modify}>
                {t('prior.redo')}
              </button>
              <a href={METHODOLOGY} className={linkClass}>
                {t('prior.methodology')}
              </a>
            </div>
          </div>
        </Notice>
      ) : null}
      {confirm}
      <section aria-labelledby="ranking-title" className="flex flex-col gap-3">
        <h2 id="ranking-title" className="text-xl font-semibold">
          {t('ranking.title')}
        </h2>
        {results.noneRanked ? (
          <Notice tone="info" title={t('ranking.noneTitle')}>
            <div className="flex flex-col items-start gap-3">
              <p>{t('ranking.noneBody')}</p>
              <button type="button" className={wrappingButton} onClick={modify}>
                {t('ranking.answerMore')}
              </button>
            </div>
          </Notice>
        ) : (
          <RankingList
            rows={results.ranking.map((r) => ({ id: r.candidateId, name: r.name, rank: r.rank, tied: r.tied, percent: r.percent, band: r.band, withdrawn: r.withdrawn }))}
            selected={selected}
            maxSelected={MAX_COMPARED}
            onOpen={(id) => openView({ view: 'candidate', candidateId: id })}
            onToggleCompare={toggleCompare}
          />
        )}
      </section>
      <InsufficientList
        rows={results.insufficient.map((r) => ({ id: r.candidateId, name: r.name, unknown: r.unknown, answered: r.answered, withdrawn: r.withdrawn }))}
        selected={selected}
        maxSelected={MAX_COMPARED}
        onOpen={(id) => openView({ view: 'candidate', candidateId: id })}
        onToggleCompare={toggleCompare}
      />
      <section aria-labelledby="compare-title" className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <h2 id="compare-title" className="text-xl font-semibold">
          {t('compare.title')}
        </h2>
        <p className="text-sm text-fg-muted">{t('compare.intro')}</p>
        <p className="text-sm font-medium">{t('compare.selected', { count: selected.length })}</p>
        {announcer}
        <div>
          <Button disabled={selected.length < MIN_COMPARED} data-compare-open="" onClick={() => openView({ view: 'compare', candidateIds: [...selected] })}>
            {t('compare.action', { count: selected.length })}
          </Button>
        </div>
      </section>
      {sharePanel}
      <div>
        <Button variant="secondary" onClick={modify}>
          {t('modify.action')}
        </Button>
      </div>
    </div>
  );
}
