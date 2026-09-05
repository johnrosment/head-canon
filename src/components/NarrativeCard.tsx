import type { ReactNode } from "react";
import LockButton from "./LockButton.tsx";

type NarrativeCardProps = {
  label: string;
  body: string;
  locked: boolean;
  onToggle: () => void;
  icon?: ReactNode;
  tone?: "plain" | "turf" | "blueprint";
  /** Tall for half-width columns, short for full-width rows. */
  size?: "tall" | "short";
};

export default function NarrativeCard({
  label,
  body,
  locked,
  onToggle,
  icon,
  tone = "plain",
  size = "tall",
}: NarrativeCardProps) {
  const rule =
    tone === "turf"
      ? "border-l-turf"
      : tone === "blueprint"
        ? "border-l-blueprint"
        : "border-l-ink";

  // Sized to the longest paragraph the banks can produce at each breakpoint, so
  // the text is never cut off. Narrow screens wrap far more, hence the jump.
  const height = size === "tall" ? "h-[22rem] md:h-[15rem]" : "h-[23rem] md:h-[11rem]";

  return (
    <section
      className={
        "flex flex-col border-2 border-ink border-l-8 bg-paper p-3 offset-shadow-sm sm:p-4 " +
        height +
        " " +
        rule
      }
    >
      <div className="flex items-start justify-between gap-2 border-b-2 border-ink pb-2">
        <h3 className="micro-label flex items-center gap-1.5 text-ink">
          {icon}
          <span>{label}</span>
        </h3>
        <LockButton
          locked={locked}
          label={label}
          onToggle={onToggle}
        />
      </div>
      <div className="prose-pane min-h-0 flex-1 pt-2.5">
        <p className="text-[0.85rem] leading-relaxed font-medium text-ink">{body}</p>
      </div>
    </section>
  );
}
