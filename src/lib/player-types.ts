export type Mode = "college" | "nfl" | "build" | "board";

export type Race =
  | "Black"
  | "White"
  | "Latino"
  | "Asian American"
  | "Mixed";

export type Position =
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "OL"
  | "Edge Defender"
  | "DT"
  | "Linebacker"
  | "Cornerback"
  | "Safety"
  | "Kicker/Punter";

/** A high-school player can be a true position player or a multi-role "Athlete". */
export type HighSchoolPosition = Position | "Athlete";

export type ScholarshipOffer = {
  school: string;
  quality: number;
};

export type GeneratedPlayer = {
  name: string;
  position: Position;
  highSchoolPosition: HighSchoolPosition;
  race: Race;
  number: string;
  build: string;
  highSchoolBuild: string;
  hometown: string;
  college: string;
  /** Empty string when the player never transferred. Travels with the `college` lock. */
  transfer: string;
  /** Origin school for a transfer, or "" — the short form shown on the page. */
  transferFrom: string;
  highSchoolAccolades: string;
  /** The single most notable honour, if any, pulled out of highSchoolAccolades for its own display. */
  highSchoolAwardHighlight: string;
  highSchoolStats: string;
  recruiting: string;
  prospectRating: number;
  nflProspectGrade: number;
  offers: ScholarshipOffer[];
  accolades: string;
  /** The single most notable honour, if any, pulled out of accolades for its own display. */
  awardHighlight: string;
  highSchool: string;
  collegeCareer: string;
  stats: string;
  draft: string;
  /** Pre-draft testing line — 40 time plus one position-relevant drill. Empty for kickers/punters. */
  combine: string;

  /** How the college years moved the player off his recruiting baseline. */
  developmentArc: string;
  /** Grade points the arc added to (or took from) the recruiting baseline. */
  arcDelta: number;
  /** Baseline NFL grade implied by the recruiting rating alone. */
  gradeBaseline: number;

  /** Historical stylistic comparisons, size- and tier-aware. */
  collegeComp: string;
  nflComp: string;
  /** Prototype: "where they ended up" line, populated only for a small sample of NFL comps so far. */
  nflCompRetro: string;

  /** Scouting report, recruiting side. Both halves move together. */
  highSchoolPros: string[];
  highSchoolCons: string[];
  /** Scouting report, pre-draft side. Both halves move together. */
  nflPros: string[];
  nflCons: string[];
};

export const FIELD_KEYS = [
  "name",
  "position",
  "highSchoolPosition",
  "race",
  "number",
  "build",
  "highSchoolBuild",
  "hometown",
  "college",
  "highSchoolAccolades",
  "highSchoolStats",
  "recruiting",
  "prospectRating",
  "nflProspectGrade",
  "offers",
  "accolades",
  "highSchool",
  "collegeCareer",
  "stats",
  "draft",
  "developmentArc",
  "collegeComp",
  "nflComp",
  "highSchoolScouting",
  "nflScouting",
  "combine",
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];

export type Locks = Record<FieldKey, boolean>;

export const LOCK_COUNT = FIELD_KEYS.length;

export function createInitialLocks(): Locks {
  const locks = {} as Locks;

  for (const key of FIELD_KEYS) {
    locks[key] = false;
  }

  return locks;
}

/** Never hand a stale/NaN value to toFixed(). */
export function safeNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

/** Plain-language note about what a lock holds in place, shown when it is on. */
export const LOCK_HINTS: Partial<Record<FieldKey, string>> = {
  position: "Holds his number, size and stats to this spot",
  highSchoolPosition: "Athlete becomes QB, RB, WR, LB, CB or S",
  race: "Names come from this pool",
  hometown: "Sets which schools recruit him",
  prospectRating: "Sets his stars, offers and grade baseline",
  nflProspectGrade: "Sets the draft projection",
  developmentArc: "How far college moved him off his rating",
  offers: "All three offers move together",
  build: "High-school size is worked back from this",
  highSchoolBuild: "Feeds his grown size and both comps",
  combine: "Testing numbers move with the NFL grade",
};
