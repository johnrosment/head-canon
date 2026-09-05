import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import LockButton from "./LockButton.tsx";

type ScoutingReportProps = {
  label: string;
  pros: string[] | undefined;
  cons: string[] | undefined;
  locked: boolean;
  onToggle: () => void;
  icon?: ReactNode;
};

function Column({
  heading,
  items,
  positive,
  emptyLabel,
}: {
  heading: string;
  items: string[];
  positive: boolean;
  emptyLabel: string;
}) {
  const Icon = positive ? Plus : Minus;
  const accent = positive ? "text-turf" : "text-blueprint";

  return (
    <div className="min-w-0">
      <h4 className={"micro-label border-b-2 border-hairline pb-1.5 " + accent}>
        {heading}
      </h4>
      <ul className="pt-2.5">
        {items.length === 0 ? (
          <li className="text-[0.8rem] leading-relaxed font-semibold text-graphite">
            {emptyLabel}
          </li>
        ) : (
          items.map((item, index) => (
            <li
              key={heading + "-" + index}
              className="flex gap-2 pb-2.5 last:pb-0"
            >
              <Icon
                size={11}
                strokeWidth={3}
                className={"mt-1 shrink-0 " + accent}
              />
              <span className="text-[0.82rem] leading-relaxed font-medium">{item}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function ScoutingReport({
  label,
  pros,
  cons,
  locked,
  onToggle,
  icon,
}: ScoutingReportProps) {
  const proList = Array.isArray(pros) ? pros : [];
  const conList = Array.isArray(cons) ? cons : [];

  return (
    <section className="flex h-[31rem] flex-col border-2 border-ink bg-paper p-3 offset-shadow-sm sm:p-4 md:h-[19.25rem]">
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

      <div className="prose-pane mt-3 grid min-h-0 flex-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <Column
          heading="Strengths"
          items={proList}
          positive
          emptyLabel="Nothing on file. Roll again to build a report."
        />
        <Column
          heading="Concerns"
          items={conList}
          positive={false}
          emptyLabel="Nothing meaningful on tape."
        />
      </div>
    </section>
  );
}
