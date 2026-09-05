import { Trophy } from "lucide-react";
import LockButton from "./LockButton.tsx";
import type { ScholarshipOffer } from "../lib/player-types.ts";
import { safeNumber } from "../lib/player-types.ts";

type OfferListProps = {
  offers: ScholarshipOffer[] | undefined;
  locked: boolean;
  onToggle: () => void;
};

export default function OfferList({ offers, locked, onToggle }: OfferListProps) {
  const list = Array.isArray(offers) ? offers.slice(0, 3) : [];

  return (
    <section className="flex h-[17rem] flex-col border-2 border-ink bg-paper p-3 md:h-[17.5rem] offset-shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-2 border-b-2 border-ink pb-2">
        <div className="micro-label flex items-center gap-1.5 text-ink">
          <Trophy
            size={12}
            strokeWidth={2.5}
          />
          <span>Scholarship offers</span>
        </div>
        <LockButton
          locked={locked}
          label="the scholarship offer board"
          onToggle={onToggle}
          hint="All three offers move together"
        />
      </div>

      {list.length === 0 ? (
        <p className="pt-3 text-sm font-semibold text-graphite">
          No offers on the board yet. Roll again to build an offer sheet.
        </p>
      ) : (
        <ol className="prose-pane min-h-0 flex-1 pt-1">
          {list.map((offer, index) => {
            const quality = Math.min(100, Math.max(0, safeNumber(offer?.quality, 0)));

            return (
              <li
                key={offer.school + "-" + index}
                className="border-b-2 border-hairline py-2.5 last:border-b-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="micro-label w-3 shrink-0 text-graphite tabular-nums">
                      {index + 1}
                    </span>
                    <span className="truncate text-base font-bold tracking-tight">
                      {offer.school}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-black tabular-nums">
                    {Math.round(quality)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 border-2 border-ink bg-canvas">
                  <div
                    className={index === 0 ? "h-full bg-turf" : "h-full bg-ink"}
                    style={{ width: quality + "%" }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
