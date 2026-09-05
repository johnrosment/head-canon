import type { ReactNode } from "react";
import LockButton from "./LockButton.tsx";

type FieldProps = {
  label: string;
  value: ReactNode;
  locked: boolean;
  onToggle: () => void;
  icon?: ReactNode;
  emphasis?: boolean;
  /** What this lock holds in place. Goes to the lock tooltip, not the page. */
  hint?: string;
  /** Secondary line under the value. Only for detail about the player himself. */
  note?: string;
  /** Short single-line values get a shorter row. */
  compact?: boolean;
};

/**
 * Fixed row height on purpose: generated values vary in length, and a page that
 * reflows on every roll is unusable when you are rolling repeatedly. Rows are
 * sized to the longest value the generator can produce, so nothing is cut off.
 */
export default function Field({
  label,
  value,
  locked,
  onToggle,
  icon,
  emphasis = false,
  hint,
  note,
  compact = false,
}: FieldProps) {
  const valueClass = emphasis
    ? "text-xl leading-tight font-black tracking-tight sm:text-2xl"
    : "text-sm leading-snug font-semibold";

  const height = compact ? "h-[6rem]" : "h-[8.5rem]";

  return (
    <div
      className={
        "flex items-start justify-between gap-2 border-b-2 border-hairline py-2.5 " + height
      }
    >
      <div className="flex h-full min-w-0 flex-col">
        <div className="micro-label flex items-center gap-1.5 text-graphite">
          {icon}
          <span>{label}</span>
        </div>
        <div className="fade-pane mt-1 min-h-0 flex-1">
          <div className={"break-words text-ink " + valueClass}>{value}</div>
          {note ? (
            <p className="mt-1 text-[0.7rem] leading-snug font-semibold text-graphite">
              {note}
            </p>
          ) : null}
        </div>
      </div>
      <LockButton
        locked={locked}
        label={label}
        onToggle={onToggle}
        hint={hint}
      />
    </div>
  );
}
