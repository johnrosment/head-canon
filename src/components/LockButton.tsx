import { Lock, Unlock } from "lucide-react";

type LockButtonProps = {
  locked: boolean;
  label: string;
  onToggle: () => void;
  /** What this lock holds in place. Surfaced on hover, never printed on the page. */
  hint?: string;
};

export default function LockButton({ locked, label, onToggle, hint }: LockButtonProps) {
  const action = locked ? "Unlock " + label : "Lock " + label;
  const title = hint ? action + " — " + hint : action;

  const tone = locked
    ? "bg-turf text-paper border-ink"
    : "bg-transparent text-graphite border-hairline hover:border-ink hover:text-ink";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={locked}
      aria-label={title}
      title={title}
      className={
        "flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors " +
        tone
      }
    >
      {locked ? (
        <Lock
          size={11}
          strokeWidth={2.75}
        />
      ) : (
        <Unlock
          size={11}
          strokeWidth={2.25}
        />
      )}
    </button>
  );
}
