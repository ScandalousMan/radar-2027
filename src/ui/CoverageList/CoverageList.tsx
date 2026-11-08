import { useTranslations } from 'next-intl';
import { Card } from '../Card';
import { ProgressBar } from '../ProgressBar';

export type CoverageListItem = { id: string; name: string; party: string; coverage: number; href: string };

export type CoverageListProps = {
  items: CoverageListItem[];
  className?: string;
};

/** Liste des candidats inclus avec leur couverture (part des questions à position connue). */
export function CoverageList({ items, className }: CoverageListProps) {
  const t = useTranslations('ui.coverageList');
  return (
    <ul className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const percent = Math.round(Math.min(1, Math.max(0, item.coverage)) * 100);
        return (
          <li key={item.id}>
            <Card interactive href={item.href}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-fg-muted">
                    {item.party}
                    {' · '}
                    {t('status.declared')}
                  </span>
                </div>
                <ProgressBar value={percent} total={100} label={t('coverageLabel', { percent })} />
                <span className="text-sm text-accent">{t('viewPositions')}</span>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
