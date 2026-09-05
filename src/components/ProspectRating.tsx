import { Star } from "lucide-react";
import LockButton from "./LockButton.tsx";
import { safeNumber } from "../lib/player-types.ts";

type ProspectRatingProps = {
  label: string;
  value: unknown;
  /** Player-level caption only, e.g. "4-star prospect". Omit otherwise. */
  caption?: string;
  locked: boolean;
  onToggle: () => void;
  tone?: "turf" | "blueprint";
  hint?: string;
};

const STAR_SLOTS = [0, 1, 2, 3, 4];

export default function ProspectRating({
  label,
  value,
  caption,
  locked,
  onToggle,
  tone = "turf",
  hint,
}: ProspectRatingProps) {
  // Stale or missing values must never reach toFixed().
  const rating = Math.min(10, Math.max(0, safeNumber(value, 0)));
  const percent = Math.round(rating * 10);
  const fillColor = tone === "turf" ? "text-turf" : "text-blueprint";

  return (
    <div className="border-b-2 border-hairline py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="micro-label text-graphite">{label}</div>
        <LockButton
          locked={locked}
          label={label}
          onToggle={onToggle}
          hint={hint}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
        <div className="relative h-5 w-max">
          <div className="flex gap-1">
            {STAR_SLOTS.map((slot) => (
              <Star
                key={"empty-" + slot}
                size={18}
                strokeWidth={2}
                className="text-hairline"
              />
            ))}
          </div>
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: percent + "%" }}
            aria-hidden="true"
          >
            <div className="flex w-max gap-1">
              {STAR_SLOTS.map((slot) => (
                <Star
                  key={"full-" + slot}
                  size={18}
                  strokeWidth={2}
                  className={fillColor}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight tabular-nums">
            {rating.toFixed(1)}
          </span>
          <span className="micro-label text-graphite">/ 10.0</span>
          <span
            className={
              "border-2 border-ink px-1.5 py-0.5 text-[0.7rem] font-black tabular-nums text-paper " +
              (tone === "turf" ? "bg-turf" : "bg-blueprint")
            }
          >
            {percent}%
          </span>
        </div>
      </div>

      {caption ? <div className="micro-label mt-2 text-ink">{caption}</div> : null}
    </div>
  );
}
