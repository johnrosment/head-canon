import { Info } from "lucide-react";
import { safeNumber } from "../lib/player-types.ts";

type ProjectionTraceProps = {
  rating: number;
  baseline: number;
  arcLabel: string;
  arcDelta: number;
  grade: number;
  bandLabel: string;
  combine: string;
  ratingLocked: boolean;
  arcLocked: boolean;
  gradeLocked: boolean;
  draftLocked: boolean;
  combineLocked: boolean;
};

function Row({
  label,
  value,
  sub,
  locked,
}: {
  label: string;
  value: string;
  sub?: string;
  locked?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b-2 border-hairline py-2.5 last:border-b-0">
      <span className="micro-label text-graphite">{label}</span>
      <span className="flex items-baseline gap-2">
        {sub ? <span className="text-xs font-bold text-graphite">{sub}</span> : null}
        {locked ? (
          <span className="micro-label border-2 border-ink bg-turf px-1 py-0.5 text-paper">
            Locked
          </span>
        ) : null}
        <span className="text-base font-black tracking-tight tabular-nums">{value}</span>
      </span>
    </div>
  );
}

/**
 * The arithmetic behind the draft projection, as data only. It exists so a
 * locked rating that ends in an unexpected round reads as a development story
 * rather than a bug.
 */
export default function ProjectionTrace({
  rating,
  baseline,
  arcLabel,
  arcDelta,
  grade,
  bandLabel,
  combine,
  ratingLocked,
  arcLocked,
  gradeLocked,
  draftLocked,
  combineLocked,
}: ProjectionTraceProps) {
  const delta = safeNumber(arcDelta, 0);
  const deltaText = (delta >= 0 ? "+" : "−") + Math.abs(delta).toFixed(1);

  return (
    <section className="flex h-[21rem] flex-col border-2 border-ink bg-paper p-3 offset-shadow-sm sm:p-4 lg:h-[26rem]">
      <h3 className="micro-label flex items-center gap-1.5 border-b-2 border-ink pb-2 text-ink">
        <Info
          size={12}
          strokeWidth={2.5}
        />
        <span>Grade breakdown</span>
      </h3>

      <div className="prose-pane min-h-0 flex-1 pr-1">
        <Row
          label="Recruiting rating"
          value={safeNumber(rating, 0).toFixed(1)}
          locked={ratingLocked}
        />
        <Row
          label="Grade baseline"
          value={safeNumber(baseline, 0).toFixed(1)}
        />
        <Row
          label="College arc"
          value={deltaText}
          sub={arcLabel}
          locked={arcLocked}
        />
        <Row
          label="NFL grade"
          value={safeNumber(grade, 0).toFixed(1)}
          locked={gradeLocked}
        />
        <Row
          label="Draft band"
          value={bandLabel}
          locked={draftLocked}
        />
        {combine ? (
          <Row
            label="Testing"
            value={combine}
            locked={combineLocked}
          />
        ) : null}
      </div>
    </section>
  );
}
