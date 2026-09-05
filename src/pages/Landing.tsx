import { useCallback, useEffect, useRef, useState } from "react";
import {
  Award,
  Check,
  ClipboardList,
  Copy,
  Dices,
  Flag,
  GitBranch,
  GraduationCap,
  Hash,
  ImageDown,
  ListOrdered,
  MapPin,
  Megaphone,
  Newspaper,
  RotateCcw,
  Ruler,
  Shield,
  Sliders,
  Target,
  TrendingUp,
  Trophy,
  User,
  UserSearch,
  Users,
} from "lucide-react";

import html2canvas from "html2canvas";

import Field from "../components/Field.tsx";
import NarrativeCard from "../components/NarrativeCard.tsx";
import OfferList from "../components/OfferList.tsx";
import ProjectionTrace from "../components/ProjectionTrace.tsx";
import ProspectRating from "../components/ProspectRating.tsx";
import ScoutingReport from "../components/ScoutingReport.tsx";

import type {
  FieldKey,
  GeneratedPlayer,
  Locks,
  Mode,
  Position,
  Race,
} from "../lib/player-types.ts";
import { LOCK_HINTS, createInitialLocks } from "../lib/player-types.ts";
import { DEVELOPMENT_ARCS, HOMETOWN_STATES, POSITIONS } from "../lib/player-data.ts";
import {
  createDraftClass,
  createPlayer,
  createPlayerFromSeed,
  draftBandLabel,
  playerToText,
  starLabel,
} from "../lib/player-generator.ts";
import type { PlayerSeed } from "../lib/player-generator.ts";

const ICON_PROPS = { size: 13, strokeWidth: 2.5 } as const;

const RACES: Race[] = ["Black", "White", "Latino", "Asian American", "Mixed"];

type ViewProps = {
  player: GeneratedPlayer;
  locks: Locks;
  onToggle: (key: FieldKey) => void;
};

/**
 * Clipboard write with a legacy fallback. The async API is denied outright in
 * some browsers and contexts, and a Copy button that silently does nothing is
 * worse than one that admits it failed.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);

      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const area = document.createElement("textarea");

    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";

    document.body.appendChild(area);
    area.select();

    const ok = document.execCommand("copy");

    document.body.removeChild(area);

    return ok;
  } catch {
    return false;
  }
}

/** Splits "Name (Program) — descriptor" into a headline and a subline. */
function splitComp(comp: string): { head: string; note: string } {
  const parts = comp.split(" — ");

  return { head: parts[0] ?? comp, note: parts.slice(1).join(" — ") };
}

/**
 * Honours read as a list of chips rather than one run-on line. A named award
 * — Heisman Trophy winner, an Outland Trophy finalist, that kind of thing —
 * is pulled out of the list and shown as its own line so it doesn't get lost
 * next to "Team captain" and "Academic all-conference".
 */
function Honours({
  value,
  highlight,
  tone = "turf",
}: {
  value: string;
  highlight?: string;
  tone?: "turf" | "blueprint";
}) {
  const items = value.split(" · ").filter((item) => item.length > 0 && item !== highlight);
  const toneClass = tone === "blueprint" ? "bg-blueprint" : "bg-turf";

  return (
    <div className="flex flex-col gap-1.5">
      {highlight ? (
        <span
          className={
            "inline-flex w-fit items-center gap-1.5 border-2 border-ink px-2 py-1 text-[0.7rem] leading-tight font-black tracking-wide text-paper uppercase " +
            toneClass
          }
        >
          <Trophy
            size={12}
            strokeWidth={2.5}
          />
          {highlight}
        </span>
      ) : null}
      {items.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="border-2 border-hairline bg-canvas px-1.5 py-0.5 text-[0.7rem] leading-tight font-bold"
            >
              {item}
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* College recruiting view                                             */
/* ------------------------------------------------------------------ */

function CollegeProfile({ player, locks, onToggle }: ViewProps) {
  const comp = splitComp(player.collegeComp);

  return (
    <div className="space-y-4">
      <div className="grid gap-x-6 md:grid-cols-2">
        <Field
          label="Name"
          value={player.name}
          locked={locks.name}
          onToggle={() => onToggle("name")}
          compact
          icon={<User {...ICON_PROPS} />}
          emphasis
        />
        <Field
          label="Plays"
          value={player.highSchoolPosition}
          locked={locks.highSchoolPosition}
          onToggle={() => onToggle("highSchoolPosition")}
          compact
          icon={<Shield {...ICON_PROPS} />}
          hint={LOCK_HINTS.highSchoolPosition}
          emphasis
        />
        <Field
          label="Size"
          value={player.highSchoolBuild}
          locked={locks.highSchoolBuild}
          onToggle={() => onToggle("highSchoolBuild")}
          compact
          icon={<Ruler {...ICON_PROPS} />}
          hint={LOCK_HINTS.highSchoolBuild}
        />
        <Field
          label="Hometown"
          value={player.hometown}
          locked={locks.hometown}
          onToggle={() => onToggle("hometown")}
          compact
          icon={<MapPin {...ICON_PROPS} />}
          hint={LOCK_HINTS.hometown}
        />
        <Field
          label="Number"
          value={"#" + player.number}
          locked={locks.number}
          onToggle={() => onToggle("number")}
          compact
          icon={<Hash {...ICON_PROPS} />}
        />
        <Field
          label="Race"
          value={player.race}
          locked={locks.race}
          onToggle={() => onToggle("race")}
          compact
          icon={<Users {...ICON_PROPS} />}
          hint={LOCK_HINTS.race}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex h-[15rem] flex-col border-2 border-ink bg-paper p-3 offset-shadow-sm sm:p-4">
          <ProspectRating
            label="Prospect rating"
            value={player.prospectRating}
            caption={starLabel(player.prospectRating)}
            locked={locks.prospectRating}
            onToggle={() => onToggle("prospectRating")}
            tone="turf"
            hint={LOCK_HINTS.prospectRating}
          />
          <div className="prose-pane min-h-0 flex-1">
            <Field
              label="Plays like"
              value={comp.head}
              note={comp.note}
              locked={locks.collegeComp}
              onToggle={() => onToggle("collegeComp")}
              icon={<UserSearch {...ICON_PROPS} />}
              compact
            />
          </div>
        </div>

        <OfferList
          offers={player.offers}
          locked={locks.offers}
          onToggle={() => onToggle("offers")}
        />
      </div>

      <ScoutingReport
        label="Scouting report"
        pros={player.highSchoolPros}
        cons={player.highSchoolCons}
        locked={locks.highSchoolScouting}
        onToggle={() => onToggle("highSchoolScouting")}
        icon={<ClipboardList {...ICON_PROPS} />}
      />

      <div className="grid gap-x-6 md:grid-cols-2">
        <Field
          label="Senior stats"
          value={player.highSchoolStats}
          locked={locks.highSchoolStats}
          onToggle={() => onToggle("highSchoolStats")}
          compact
          icon={<TrendingUp {...ICON_PROPS} />}
        />
        <Field
          label="Honours"
          value={
            <Honours
              value={player.highSchoolAccolades}
              highlight={player.highSchoolAwardHighlight}
              tone="turf"
            />
          }
          locked={locks.highSchoolAccolades}
          onToggle={() => onToggle("highSchoolAccolades")}
          icon={<Award {...ICON_PROPS} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <NarrativeCard
          label="How he got here"
          body={player.highSchool}
          locked={locks.highSchool}
          onToggle={() => onToggle("highSchool")}
          icon={<Flag {...ICON_PROPS} />}
          tone="plain"
        />
        <NarrativeCard
          label="The recruitment"
          body={player.recruiting}
          locked={locks.recruiting}
          onToggle={() => onToggle("recruiting")}
          icon={<Megaphone {...ICON_PROPS} />}
          tone="turf"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NFL pre-draft view                                                  */
/* ------------------------------------------------------------------ */

function NflProfile({ player, locks, onToggle }: ViewProps) {
  const comp = splitComp(player.nflComp);

  return (
    <div className="space-y-4">
      <div className="grid gap-x-6 md:grid-cols-2">
        <Field
          label="Name"
          value={player.name}
          locked={locks.name}
          onToggle={() => onToggle("name")}
          compact
          icon={<User {...ICON_PROPS} />}
          emphasis
        />
        <Field
          label="Position"
          value={player.position}
          locked={locks.position}
          onToggle={() => onToggle("position")}
          compact
          icon={<Shield {...ICON_PROPS} />}
          hint={LOCK_HINTS.position}
          emphasis
        />
        <Field
          label="Size"
          value={player.build}
          locked={locks.build}
          onToggle={() => onToggle("build")}
          compact
          icon={<Ruler {...ICON_PROPS} />}
          hint={LOCK_HINTS.build}
        />
        <Field
          label="College"
          value={player.college}
          note={player.transferFrom.length > 0 ? "Transferred from " + player.transferFrom : undefined}
          locked={locks.college}
          onToggle={() => onToggle("college")}
          compact
          icon={<GraduationCap {...ICON_PROPS} />}
        />
        <Field
          label="Hometown"
          value={player.hometown}
          locked={locks.hometown}
          onToggle={() => onToggle("hometown")}
          compact
          icon={<MapPin {...ICON_PROPS} />}
          hint={LOCK_HINTS.hometown}
        />
        <Field
          label="Number"
          value={"#" + player.number}
          locked={locks.number}
          onToggle={() => onToggle("number")}
          compact
          icon={<Hash {...ICON_PROPS} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex h-[28rem] flex-col border-2 border-ink bg-paper p-3 offset-shadow-sm sm:p-4 lg:h-[26rem]">
          <ProspectRating
            label="NFL grade"
            value={player.nflProspectGrade}
            locked={locks.nflProspectGrade}
            onToggle={() => onToggle("nflProspectGrade")}
            tone="blueprint"
            hint={LOCK_HINTS.nflProspectGrade}
          />
          <div className="prose-pane min-h-0 flex-1">
            <Field
              label="Where he goes"
              value={player.draft}
              locked={locks.draft}
              onToggle={() => onToggle("draft")}
              icon={<Target {...ICON_PROPS} />}
              emphasis
              compact
            />
            <Field
              label="Plays like"
              value={comp.head}
              note={
                player.nflCompRetro
                  ? comp.note + " — where he ended up: " + player.nflCompRetro
                  : comp.note
              }
              locked={locks.nflComp}
              onToggle={() => onToggle("nflComp")}
              icon={<UserSearch {...ICON_PROPS} />}
              compact
            />
            <Field
              label="College years"
              value={player.developmentArc}
              locked={locks.developmentArc}
              onToggle={() => onToggle("developmentArc")}
              icon={<GitBranch {...ICON_PROPS} />}
              hint={LOCK_HINTS.developmentArc}
              compact
            />
          </div>
        </div>

        <ProjectionTrace
          rating={player.prospectRating}
          baseline={player.gradeBaseline}
          arcLabel={player.developmentArc}
          arcDelta={player.arcDelta}
          grade={player.nflProspectGrade}
          bandLabel={draftBandLabel(player.nflProspectGrade)}
          combine={player.combine}
          ratingLocked={locks.prospectRating}
          arcLocked={locks.developmentArc}
          gradeLocked={locks.nflProspectGrade}
          draftLocked={locks.draft}
          combineLocked={locks.combine}
        />
      </div>

      <ScoutingReport
        label="Scouting report"
        pros={player.nflPros}
        cons={player.nflCons}
        locked={locks.nflScouting}
        onToggle={() => onToggle("nflScouting")}
        icon={<ClipboardList {...ICON_PROPS} />}
      />

      <div className="grid gap-x-6 md:grid-cols-2">
        <Field
          label="Final-season stats"
          value={player.stats}
          locked={locks.stats}
          onToggle={() => onToggle("stats")}
          icon={<TrendingUp {...ICON_PROPS} />}
        />
        <Field
          label="Honours"
          value={
            <Honours
              value={player.accolades}
              highlight={player.awardHighlight}
              tone="blueprint"
            />
          }
          locked={locks.accolades}
          onToggle={() => onToggle("accolades")}
          icon={<Award {...ICON_PROPS} />}
        />
      </div>

      <NarrativeCard
        label="The leap"
        body={player.collegeCareer}
        locked={locks.collegeCareer}
        onToggle={() => onToggle("collegeCareer")}
        icon={<Newspaper {...ICON_PROPS} />}
        tone="blueprint"
        size="short"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Build-a-prospect view                                               */
/* ------------------------------------------------------------------ */

type SeedForm = {
  ratingMode: "any" | "set";
  rating: number;
  gradeMode: "any" | "set";
  grade: number;
  position: Position | "any";
  role: "any" | "athlete" | "match";
  race: Race | "any";
  state: string | "any";
  arc: string | "any";
};

const initialSeedForm: SeedForm = {
  ratingMode: "set",
  rating: 10,
  gradeMode: "any",
  grade: 7,
  position: "any",
  role: "any",
  race: "any",
  state: "any",
  arc: "any",
};

const selectClass = "mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-sm font-bold";

type BuildPanelProps = {
  form: SeedForm;
  onChange: (next: SeedForm) => void;
  onGenerate: () => void;
  summary: string[];
};

function AnySetToggle({
  value,
  onChange,
}: {
  value: "any" | "set";
  onChange: (next: "any" | "set") => void;
}) {
  return (
    <div className="flex">
      {(["any", "set"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            "micro-label border-2 border-ink px-2 py-1 " +
            (value === option ? "bg-ink text-paper" : "bg-paper text-graphite")
          }
        >
          {option === "any" ? "Any" : "Set"}
        </button>
      ))}
    </div>
  );
}

function BuildPanel({ form, onChange, onGenerate, summary }: BuildPanelProps) {
  const set = <K extends keyof SeedForm>(key: K, value: SeedForm[K]) => {
    onChange({ ...form, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-ink border-l-8 border-l-turf bg-paper p-3 offset-shadow-sm sm:p-4">
        <h3 className="micro-label flex items-center gap-1.5 text-ink">
          <Sliders {...ICON_PROPS} />
          <span>Start from something you already know</span>
        </h3>
        <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed font-medium">
          Set any part of the story and the rest is built to match. What you set
          here stays locked, so you can roll variations of the same career.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="border-b-2 border-hairline pb-5">
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label text-graphite">Recruiting rating</span>
            <AnySetToggle
              value={form.ratingMode}
              onChange={(next) => set("ratingMode", next)}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={form.rating}
              disabled={form.ratingMode === "any"}
              onChange={(event) => set("rating", Number(event.target.value))}
              className="h-2 w-full appearance-none border-2 border-ink bg-canvas accent-turf disabled:opacity-40"
              aria-label="Recruiting rating"
            />
            <span className="w-12 shrink-0 text-lg font-black tabular-nums">
              {form.ratingMode === "any" ? "—" : form.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <div className="flex items-center justify-between gap-3">
            <span className="micro-label text-graphite">NFL grade</span>
            <AnySetToggle
              value={form.gradeMode}
              onChange={(next) => set("gradeMode", next)}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={form.grade}
              disabled={form.gradeMode === "any"}
              onChange={(event) => set("grade", Number(event.target.value))}
              className="h-2 w-full appearance-none border-2 border-ink bg-canvas accent-blueprint disabled:opacity-40"
              aria-label="NFL grade"
            />
            <span className="w-12 shrink-0 text-lg font-black tabular-nums">
              {form.gradeMode === "any" ? "—" : form.grade.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <label className="micro-label text-graphite">
            How college went
            <select
              value={form.arc}
              onChange={(event) => set("arc", event.target.value)}
              className={selectClass}
            >
              <option value="any">Any</option>
              {DEVELOPMENT_ARCS.map((arc) => (
                <option
                  key={arc.key}
                  value={arc.label}
                >
                  {arc.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <label className="micro-label text-graphite">
            Position
            <select
              value={form.position}
              onChange={(event) => set("position", event.target.value as Position | "any")}
              className={selectClass}
            >
              <option value="any">Any</option>
              {POSITIONS.map((position) => (
                <option
                  key={position}
                  value={position}
                >
                  {position}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <label className="micro-label text-graphite">
            In high school he was
            <select
              value={form.role}
              onChange={(event) => set("role", event.target.value as SeedForm["role"])}
              className={selectClass}
            >
              <option value="any">Any</option>
              <option value="athlete">An all-round athlete</option>
              <option value="match">Already at this position</option>
            </select>
          </label>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <label className="micro-label text-graphite">
            Race
            <select
              value={form.race}
              onChange={(event) => set("race", event.target.value as Race | "any")}
              className={selectClass}
            >
              <option value="any">Any</option>
              {RACES.map((race) => (
                <option
                  key={race}
                  value={race}
                >
                  {race}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="border-b-2 border-hairline pb-5">
          <label className="micro-label text-graphite">
            Home state
            <select
              value={form.state}
              onChange={(event) => set("state", event.target.value)}
              className={selectClass}
            >
              <option value="any">Any</option>
              {HOMETOWN_STATES.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className="border-2 border-ink bg-paper p-4 offset-shadow-sm sm:p-5">
        <h3 className="micro-label text-graphite">Locked in</h3>
        {summary.length === 0 ? (
          <p className="pt-3 text-[0.95rem] font-medium text-graphite">
            Nothing set — this builds a completely random prospect.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2 pt-3">
            {summary.map((entry) => (
              <li
                key={entry}
                className="border-2 border-ink bg-canvas px-2.5 py-1.5 text-xs font-bold"
              >
                {entry}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-turf px-6 py-4 text-sm font-black tracking-widest text-paper uppercase transition-transform offset-shadow-sm hover:-translate-y-0.5"
        >
          <Dices
            size={16}
            strokeWidth={2.5}
          />
          Build this player
        </button>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft board — full-class view                                       */
/* ------------------------------------------------------------------ */

const BOARD_SIZE = 100;

/** Draft-board shorthand for positions whose full names run long in a table cell. */
function boardPositionLabel(position: Position): string {
  switch (position) {
    case "Edge Defender":
      return "EDGE";
    case "Kicker/Punter":
      return "K/P";
    case "Linebacker":
      return "LB";
    case "Cornerback":
      return "CB";
    case "Safety":
      return "S";
    default:
      return position;
  }
}

type BoardPanelProps = {
  players: GeneratedPlayer[];
  onRegenerate: () => void;
  onInspect: (player: GeneratedPlayer) => void;
};

function BoardPanel({ players, onRegenerate, onInspect }: BoardPanelProps) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-ink border-l-8 border-l-blueprint bg-paper p-3 offset-shadow-sm sm:p-4">
        <h3 className="micro-label flex items-center gap-1.5 text-ink">
          <ListOrdered {...ICON_PROPS} />
          <span>Top 100, ranked by grade</span>
        </h3>
        <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed font-medium">
          Every prospect here is rolled independently and sorted by NFL grade —
          no team fits, no mock picks, just the board. Tap a name to open his
          full profile in the NFL pre-draft view.
        </p>
      </div>

      <div className="flex items-center justify-end border-2 border-ink bg-paper p-3 offset-shadow-sm sm:p-4">
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-2 border-2 border-ink bg-blueprint px-5 py-2.5 text-xs font-black tracking-widest text-paper uppercase transition-transform offset-shadow-sm hover:-translate-y-0.5"
        >
          <Dices
            size={14}
            strokeWidth={2.5}
          />
          New class
        </button>
      </div>

      <div className="border-2 border-ink bg-paper offset-shadow-sm">
        <div className="grid grid-cols-[2.25rem_1fr_4.5rem_3.5rem] gap-2 border-b-2 border-ink bg-ink px-3 py-2 text-paper sm:grid-cols-[2.5rem_1fr_8rem_4.5rem_9rem]">
          <span className="micro-label">#</span>
          <span className="micro-label">Name</span>
          <span className="micro-label hidden sm:block">College</span>
          <span className="micro-label">Pos</span>
          <span className="micro-label hidden sm:block">Projection</span>
        </div>
        <ol>
          {players.map((entry, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => onInspect(entry)}
                aria-label={"Open " + entry.name + "'s full profile"}
                className="grid w-full grid-cols-[2.25rem_1fr_4.5rem_3.5rem] items-center gap-2 border-b-2 border-hairline px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-canvas sm:grid-cols-[2.5rem_1fr_8rem_4.5rem_9rem]"
              >
                <span className="micro-label text-graphite tabular-nums">{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{entry.name}</span>
                  <span className="block truncate text-xs font-semibold text-graphite sm:hidden">
                    {entry.college}
                  </span>
                </span>
                <span className="hidden min-w-0 truncate text-xs font-semibold text-graphite sm:block">
                  {entry.college}
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="micro-label text-graphite">{boardPositionLabel(entry.position)}</span>
                  <span className="font-black tabular-nums">{entry.nflProspectGrade.toFixed(1)}</span>
                </span>
                <span className="hidden truncate text-xs font-semibold text-graphite sm:block">
                  {entry.draft}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const [player, setPlayer] = useState<GeneratedPlayer>(() => createPlayer());
  const [locks, setLocks] = useState<Locks>(() => createInitialLocks());
  const [mode, setMode] = useState<Mode>("college");
  const [seedForm, setSeedForm] = useState<SeedForm>(initialSeedForm);
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const [imageState, setImageState] = useState<"idle" | "working" | "done" | "failed">("idle");
  const [boardPlayers, setBoardPlayers] = useState<GeneratedPlayer[]>(() => createDraftClass(BOARD_SIZE));
  const cardRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(() => {
    setPlayer((current) => createPlayer({ lockedPlayer: current, locks }));
  }, [locks]);

  const regenerateBoard = useCallback(() => {
    setBoardPlayers(createDraftClass(BOARD_SIZE));
  }, []);

  const inspectBoardPlayer = useCallback((entry: GeneratedPlayer) => {
    setPlayer(entry);
    setLocks(createInitialLocks());
    setMode("nfl");
  }, []);

  const toggleLock = useCallback((key: FieldKey) => {
    setLocks((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const resetLocks = useCallback(() => {
    setLocks(createInitialLocks());
  }, []);

  const copyPlayer = useCallback(() => {
    const text = playerToText(player, mode === "nfl" ? "nfl" : "college");

    void copyText(text).then((ok) => {
      setCopyState(ok ? "done" : "failed");
    });
  }, [player, mode]);

  // Renders the visible card — minus the sticky footer controls and the
  // decorative rail, neither of which belong in a shareable image — to a PNG
  // and triggers a download.
  const exportImage = useCallback(async () => {
    const node = cardRef.current;

    if (!node) {
      return;
    }

    setImageState("working");

    try {
      const canvas = await html2canvas(node, {
        backgroundColor: "#fbf9f2",
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => element.getAttribute("data-export-ignore") === "true",
      });

      const safeName = player.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "prospect";
      const link = document.createElement("a");

      link.download = "head-canon-" + safeName + "-" + mode + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      setImageState("done");
    } catch {
      setImageState("failed");
    }
  }, [player.name, mode]);

  // "G" rolls another player without reaching for the button.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;

      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      if (event.key === "g" || event.key === "G") {
        event.preventDefault();

        if (mode === "board") {
          regenerateBoard();
        } else {
          generate();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate, mode, regenerateBoard]);

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timer = window.setTimeout(() => setCopyState("idle"), 2400);

    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (imageState === "idle" || imageState === "working") {
      return;
    }

    const timer = window.setTimeout(() => setImageState("idle"), 2400);

    return () => window.clearTimeout(timer);
  }, [imageState]);

  const generateFromSeed = useCallback(() => {
    const seed: PlayerSeed = {};

    if (seedForm.ratingMode === "set") {
      seed.prospectRating = seedForm.rating;
    }

    if (seedForm.gradeMode === "set") {
      seed.nflProspectGrade = seedForm.grade;
    }

    if (seedForm.position !== "any") {
      seed.position = seedForm.position;
    }

    if (seedForm.role === "athlete") {
      seed.highSchoolPosition = "Athlete";
    } else if (seedForm.role === "match" && seedForm.position !== "any") {
      seed.highSchoolPosition = seedForm.position;
    }

    if (seedForm.race !== "any") {
      seed.race = seedForm.race;
    }

    if (seedForm.state !== "any") {
      seed.state = seedForm.state;
    }

    if (seedForm.arc !== "any") {
      seed.developmentArc = seedForm.arc;
    }

    const result = createPlayerFromSeed(seed);
    const nextLocks = createInitialLocks();

    for (const key of result.lockedKeys) {
      nextLocks[key] = true;
    }

    setPlayer(result.player);
    setLocks(nextLocks);
    setMode("college");
  }, [seedForm]);

  const seedSummary: string[] = [];

  if (seedForm.ratingMode === "set") {
    seedSummary.push("Rating " + seedForm.rating.toFixed(1));
  }

  if (seedForm.gradeMode === "set") {
    seedSummary.push("NFL grade " + seedForm.grade.toFixed(1));
  }

  if (seedForm.position !== "any") {
    seedSummary.push(seedForm.position);
  }

  if (seedForm.role === "athlete") {
    seedSummary.push("All-round athlete");
  } else if (seedForm.role === "match" && seedForm.position !== "any") {
    seedSummary.push("Always a " + seedForm.position);
  }

  if (seedForm.race !== "any") {
    seedSummary.push(seedForm.race);
  }

  if (seedForm.state !== "any") {
    seedSummary.push("From " + seedForm.state);
  }

  if (seedForm.arc !== "any") {
    seedSummary.push(seedForm.arc);
  }

  const lockedCount = Object.values(locks).filter(Boolean).length;

  const tabs: Array<{ value: Mode; label: string }> = [
    { value: "college", label: "College recruiting" },
    { value: "nfl", label: "NFL pre-draft" },
    { value: "build", label: "Build a prospect" },
    { value: "board", label: "Draft board" },
  ];

  return (
    <main className="min-h-screen bg-canvas px-3 py-4 sm:px-6 sm:py-8">
      <div
        ref={cardRef}
        className="mx-auto w-full max-w-5xl border-4 border-ink bg-paper offset-shadow"
      >
        {/* Header ---------------------------------------------------- */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-ink px-4 py-4 sm:px-6">
          <div className="flex items-end gap-3">
            <span
              className="mb-1 block h-6 w-2.5 bg-turf sm:h-8"
              aria-hidden="true"
            />
            <div>
              <h1 className="text-2xl leading-none font-black tracking-tighter uppercase sm:text-4xl">
                Head Canon
              </h1>
              <p className="micro-label mt-2 text-graphite">
                Invent a football player, then keep the parts you like
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_7rem]">
          <div className="order-2 min-w-0 lg:order-1">
            <nav
              className="grid grid-cols-2 gap-2 border-b-4 border-ink px-4 py-3 sm:px-6 md:grid-cols-4"
              aria-label="Profile view"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setMode(tab.value)}
                  aria-pressed={mode === tab.value}
                  className={
                    "border-2 border-ink px-2 py-2.5 text-[0.7rem] leading-tight font-black tracking-tight uppercase transition-colors sm:px-4 sm:text-sm " +
                    (mode === tab.value
                      ? "bg-ink text-paper"
                      : "bg-paper text-graphite hover:text-ink")
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="px-4 py-5 sm:px-6">
              {mode === "college" ? (
                <CollegeProfile
                  player={player}
                  locks={locks}
                  onToggle={toggleLock}
                />
              ) : null}
              {mode === "nfl" ? (
                <NflProfile
                  player={player}
                  locks={locks}
                  onToggle={toggleLock}
                />
              ) : null}
              {mode === "build" ? (
                <BuildPanel
                  form={seedForm}
                  onChange={setSeedForm}
                  onGenerate={generateFromSeed}
                  summary={seedSummary}
                />
              ) : null}
              {mode === "board" ? (
                <BoardPanel
                  players={boardPlayers}
                  onRegenerate={regenerateBoard}
                  onInspect={inspectBoardPlayer}
                />
              ) : null}
            </div>
          </div>

          <aside
            data-export-ignore="true"
            className="order-1 flex items-center justify-center border-b-4 border-ink bg-ink px-5 py-4 text-paper lg:order-2 lg:border-b-0 lg:border-l-4 lg:px-0 lg:py-8"
          >
            <p className="text-sm font-black tracking-[0.18em] whitespace-nowrap uppercase sm:text-lg sm:tracking-[0.3em] lg:hidden">
              Roll the tape
            </p>
            <p className="vertical-rail hidden text-2xl font-black tracking-[0.35em] uppercase lg:block">
              Roll the tape
            </p>
          </aside>
        </div>

        {/* Sticky controls — always reachable, never scroll to reroll */}
        <footer
          data-export-ignore="true"
          className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t-4 border-ink bg-paper px-4 py-3 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetLocks}
              disabled={lockedCount === 0}
              className="flex items-center gap-2 border-2 border-ink bg-paper px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:border-hairline disabled:text-hairline disabled:hover:bg-paper disabled:hover:text-hairline"
            >
              <RotateCcw
                size={14}
                strokeWidth={2.5}
              />
              Clear locks
            </button>
            <span className="micro-label text-graphite">
              {lockedCount === 0 ? "Nothing locked" : lockedCount + " locked"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="micro-label hidden text-graphite lg:inline">
              Or press G
            </span>
            {mode !== "board" ? (
              <button
                type="button"
                onClick={copyPlayer}
                title="Copy this profile as plain text"
                className={
                  "flex items-center gap-2 border-2 border-ink px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-colors " +
                  (copyState === "failed"
                    ? "bg-canvas text-ink"
                    : "bg-paper hover:bg-ink hover:text-paper")
                }
              >
                {copyState === "done" ? (
                  <Check
                    size={14}
                    strokeWidth={3}
                  />
                ) : (
                  <Copy
                    size={14}
                    strokeWidth={2.5}
                  />
                )}
                {copyState === "done"
                  ? "Copied"
                  : copyState === "failed"
                    ? "Copy blocked"
                    : "Copy"}
              </button>
            ) : null}
            {mode !== "build" ? (
              <button
                type="button"
                onClick={() => void exportImage()}
                disabled={imageState === "working"}
                title="Save this profile as a PNG image"
                className={
                  "flex items-center gap-2 border-2 border-ink px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-colors disabled:cursor-wait " +
                  (imageState === "failed"
                    ? "bg-canvas text-ink"
                    : "bg-paper hover:bg-ink hover:text-paper")
                }
              >
                {imageState === "done" ? (
                  <Check
                    size={14}
                    strokeWidth={3}
                  />
                ) : (
                  <ImageDown
                    size={14}
                    strokeWidth={2.5}
                  />
                )}
                {imageState === "working"
                  ? "Saving…"
                  : imageState === "done"
                    ? "Saved"
                    : imageState === "failed"
                      ? "Save blocked"
                      : "Save image"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={mode === "board" ? regenerateBoard : generate}
              className="flex items-center gap-2 border-2 border-ink bg-turf px-6 py-2.5 text-sm font-black tracking-widest text-paper uppercase transition-transform offset-shadow-sm hover:-translate-y-0.5"
            >
              <Dices
                size={16}
                strokeWidth={2.5}
              />
              {mode === "board" ? "New class" : "Generate"}
            </button>
          </div>
        </footer>
      </div>

      <p className="micro-label mx-auto mt-4 max-w-5xl text-graphite">
        Every player, school fit and stat line here is fictional. Player
        comparisons are stylistic only.
      </p>
    </main>
  );
}
