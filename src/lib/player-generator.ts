import type {
  FieldKey,
  GeneratedPlayer,
  HighSchoolPosition,
  Locks,
  Position,
  Race,
  ScholarshipOffer,
} from "./player-types";
import { safeNumber } from "./player-types";
import type { DevelopmentArc, ParsedBuild, PositionRule, School } from "./player-data";
import {
  ATHLETE_POSITIONS,
  DEVELOPMENT_ARCS,
  HOMETOWNS,
  HS_SAINT_NAMES,
  HS_SUFFIXES,
  MASCOTS,
  NAME_POOLS,
  POSITION_RULES,
  POSITION_WEIGHTS,
  QB_COMMON_FIRST_NAMES,
  SCHOOLS,
  arcByLabel,
  arcFromDelta,
  chance,
  clamp,
  formatBuild,
  parseBuild,
  pick,
  pickMany,
  randFloat,
  randInt,
  raceWeightsFor,
  regionForState,
  schoolByName,
  weightedPick,
} from "./player-data";
import type { NarrativeContext, RatingBand } from "./narrative-banks";
import {
  ARC_BEATS,
  COLLEGE_ACCOLADE_BANKS,
  COLLEGE_ACCOLADE_ELITE_UNIVERSAL,
  COLLEGE_ACCOLADE_POSITION_ELITE,
  COLLEGE_ACCOLADE_POSITION_EXTRAS,
  COLLEGE_BEATS,
  COLLEGE_CLOSINGS,
  COLLEGE_CLOSINGS_DOWN,
  COLLEGE_OPENINGS,
  COLLEGE_PRODUCTION_BEATS,
  COLLEGE_STAT_TEMPLATES,
  COLLEGE_TRANSFER_OPENINGS,
  HS_ACCOLADE_BANKS,
  HS_ACCOLADE_POSITION_EXTRAS,
  HS_BEATS,
  HS_CLOSINGS,
  HS_OPENINGS,
  HS_STAT_TEMPLATES,
  RECRUITING_BANKS,
  TRANSFER_REASONS,
  bandFromRating,
  fill,
} from "./narrative-banks";
import type { Comp } from "./player-comps";
import { COLLEGE_COMPS, NFL_COMPS, findComp, formatComp } from "./player-comps";
import type { ScoutingLine } from "./scouting-banks";
import {
  HS_CONTEXT_CONS,
  HS_CONTEXT_PROS,
  NFL_CONTEXT_CONS,
  NFL_CONTEXT_PROS,
  POSITION_CONS,
  POSITION_PROS,
  lineFits,
} from "./scouting-banks";

/* ------------------------------------------------------------------ */
/* Ratings                                                             */
/* ------------------------------------------------------------------ */

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** 0.0 - 10.0 college prospect rating, weighted toward the middle of the pool. */
export function rollProspectRating(): number {
  const roll = Math.random();

  if (roll < 0.05) {
    return round1(randFloat(9.0, 10.0));
  }

  if (roll < 0.22) {
    return round1(randFloat(7.2, 8.99));
  }

  if (roll < 0.58) {
    return round1(randFloat(5.2, 7.19));
  }

  if (roll < 0.85) {
    return round1(randFloat(3.2, 5.19));
  }

  if (roll < 0.97) {
    return round1(randFloat(1.5, 3.19));
  }

  return round1(randFloat(0.4, 1.49));
}

export function starsFromRating(rating: number): number {
  const value = safeNumber(rating, 0);

  if (value >= 9.0) return 5;
  if (value >= 7.2) return 4;
  if (value >= 5.2) return 3;
  if (value >= 3.2) return 2;
  if (value >= 1.5) return 1;

  return 0;
}

/**
 * The grade a recruit would earn if college went exactly to plan. The
 * development arc is what moves him off it in either direction.
 */
export function baselineGradeFromRating(rating: number): number {
  return round1(clamp(safeNumber(rating, 5) * 0.9 + 0.95, 0.3, 10));
}

export function rollDevelopmentArc(): DevelopmentArc {
  return weightedPick(
    DEVELOPMENT_ARCS.map((arc) => ({ value: arc, weight: arc.weight })),
    DEVELOPMENT_ARCS[3] as DevelopmentArc,
  );
}

export function draftFromGrade(grade: number): string {
  const value = safeNumber(grade, 0);

  if (value >= 9.8) {
    return "First overall pick";
  }

  if (value >= 9.4) {
    return pick(["First overall pick", "Top-five pick"], "Top-five pick");
  }

  if (value >= 9.0) {
    return pick(["Top-five pick", "Top 10 pick"], "Top 10 pick");
  }

  if (value >= 8.2) {
    return pick(["Mid-first-round pick", "Late first-round pick"], "Mid-first-round pick");
  }

  if (value >= 7.2) {
    return pick(["Late first-round pick", "Early second-round pick"], "Late first-round pick");
  }

  if (value >= 6.2) {
    return pick(["Early second-round pick", "Mid-second-round pick"], "Mid-second-round pick");
  }

  if (value >= 5.2) {
    return pick(["Late second-round pick", "Early third-round pick"], "Late second-round pick");
  }

  if (value >= 4.5) {
    return pick(["Mid-third-round pick", "Late third-round pick"], "Mid-third-round pick");
  }

  if (value >= 3.8) {
    return pick(["Fourth-round pick", "Early day three pick"], "Fourth-round pick");
  }

  if (value >= 3.1) {
    return pick(["Fifth-round pick", "Mid day three pick"], "Fifth-round pick");
  }

  if (value >= 2.4) {
    return pick(["Sixth-round pick", "Late day three pick"], "Sixth-round pick");
  }

  if (value >= 1.8) {
    return pick(
      ["Seventh-round pick", "Undrafted / priority free agent"],
      "Seventh-round pick",
    );
  }

  return "Undrafted / priority free agent";
}

/** The grade window a draft projection came from — shown in the lock context panel. */
export function draftBandLabel(grade: number): string {
  const value = safeNumber(grade, 0);

  if (value >= 9.8) return "9.8 – 10.0";
  if (value >= 9.4) return "9.4 – 9.79";
  if (value >= 9.0) return "9.0 – 9.39";
  if (value >= 8.2) return "8.2 – 8.99";
  if (value >= 7.2) return "7.2 – 8.19";
  if (value >= 6.2) return "6.2 – 7.19";
  if (value >= 5.2) return "5.2 – 6.19";
  if (value >= 4.5) return "4.5 – 5.19";
  if (value >= 3.8) return "3.8 – 4.49";
  if (value >= 3.1) return "3.1 – 3.79";
  if (value >= 2.4) return "2.4 – 3.09";
  if (value >= 1.8) return "1.8 – 2.39";

  return "below 1.8";
}

/* ------------------------------------------------------------------ */
/* Physical profile                                                    */
/* ------------------------------------------------------------------ */

function rollNumber(position: Position): string {
  const rule = POSITION_RULES[position];
  const candidates: number[] = [];

  for (const range of rule.numbers) {
    for (let value = range.min; value <= range.max; value += 1) {
      if (!rule.excludeNumbers.includes(value)) {
        candidates.push(value);
      }
    }
  }

  return String(pick(candidates, 1));
}

function rollHighSchoolBuild(rule: PositionRule): ParsedBuild {
  let inches = randInt(rule.heightMin, rule.heightMax);

  if (rule.rareShort && chance(rule.rareShort.chance)) {
    inches = rule.rareShort.inches;
  } else if (rule.rareTall && chance(rule.rareTall.chance)) {
    inches = rule.rareTall.inches;
  }

  const pounds = randInt(rule.weightMin, rule.weightMax);

  return {
    inches: clamp(inches, rule.heightMin - 1, rule.heightCap),
    pounds,
  };
}

/** High-school frame -> developed frame. Some players barely change. */
function developBuild(highSchool: ParsedBuild, rule: PositionRule): ParsedBuild {
  const barelyChanges = chance(0.2);
  const inchGain = barelyChanges ? 0 : randInt(1, 2);
  const poundGain = barelyChanges ? randInt(0, 6) : randInt(10, 20);

  return {
    inches: clamp(highSchool.inches + inchGain, highSchool.inches, rule.heightCap),
    pounds: clamp(highSchool.pounds + poundGain, highSchool.pounds, rule.weightCap),
  };
}

/** Developed frame -> plausible high-school frame, used when only `build` is locked. */
function regressBuild(developed: ParsedBuild, rule: PositionRule): ParsedBuild {
  const inches = clamp(developed.inches - randInt(0, 2), rule.heightMin - 1, rule.heightCap);
  const pounds = clamp(developed.pounds - randInt(8, 20), rule.weightMin - 10, rule.weightMax);

  return { inches, pounds };
}

/* ------------------------------------------------------------------ */
/* Scholarship offers                                                  */
/* ------------------------------------------------------------------ */

const MAX_PRESTIGE_BY_STARS: number[] = [2.0, 2.4, 2.9, 3.8, 4.7, 5.0];
const MIN_PRESTIGE_BY_STARS: number[] = [1.3, 1.4, 1.5, 1.9, 3.2, 4.2];

function offerQuality(school: School, stars: number, isLocal: boolean): number {
  const raw =
    26 + school.prestige * 12.5 + stars * 2.4 + (isLocal ? 3 : 0) + randFloat(-2.5, 2.5);

  return Math.round(clamp(raw, 18, 99));
}

/**
 * Local-first for everybody, not just one state: a two-star from Ohio gets the
 * MAC, a two-star from Florida gets FAU and FIU, a two-star from Texas gets the
 * Sun Belt schools in his own backyard.
 */
export function buildOffers(rating: number, hometownState: string): ScholarshipOffer[] {
  const stars = starsFromRating(rating);
  const maxPrestige = MAX_PRESTIGE_BY_STARS[stars] ?? 3.0;
  const minPrestige = MIN_PRESTIGE_BY_STARS[stars] ?? 1.4;

  const eligible = SCHOOLS.filter(
    (entry) => entry.prestige <= maxPrestige + 0.001 && entry.prestige >= minPrestige - 0.001,
  );

  const region = regionForState(hometownState);
  const local = eligible.filter((entry) => entry.state === hometownState);
  const regional = eligible.filter(
    (entry) => entry.state !== hometownState && regionForState(entry.state) === region,
  );
  const national = eligible.filter(
    (entry) => entry.state !== hometownState && regionForState(entry.state) !== region,
  );

  const chosen: School[] = [];

  const take = (pool: School[], count: number): void => {
    const remaining = pool.filter((entry) => !chosen.includes(entry));

    for (const entry of pickMany(remaining, count)) {
      if (chosen.length < 3) {
        chosen.push(entry);
      }
    }
  };

  if (stars <= 3) {
    // Low and mid recruits are recruited by their own backyard first.
    take(local, randInt(1, 2));
    take(regional, 2);
    take(national, 3);
  } else if (stars === 4) {
    take(
      local.filter((entry) => entry.prestige >= 3.2),
      1,
    );
    take(regional, 1);
    take(national, 3);
  } else {
    // Five stars only stay home when the home school is genuinely elite.
    take(
      local.filter((entry) => entry.prestige >= 4.4),
      1,
    );
    take(
      national.filter((entry) => entry.prestige >= 4.4),
      3,
    );
    take(regional, 3);
  }

  take(eligible, 3);
  // Last-resort fallback only, and still capped at the star bracket's ceiling
  // — without this a thin board could otherwise hand a one-star recruit an
  // offer from a program he would never realistically hear from.
  take(
    SCHOOLS.filter((entry) => entry.prestige <= maxPrestige + 0.001),
    3,
  );

  const sorted = chosen.slice(0, 3).sort((a, b) => b.prestige - a.prestige);

  const board = sorted.map((entry) => ({
    school: entry.school,
    quality: offerQuality(entry, stars, entry.state === hometownState),
  }));

  // The board is ranked by prestige, so the quality bars must never climb as
  // they go down the list — a local-state bonus can otherwise invert them.
  for (let index = 1; index < board.length; index += 1) {
    const previous = board[index - 1] as ScholarshipOffer;
    const current = board[index] as ScholarshipOffer;

    if (current.quality >= previous.quality) {
      current.quality = Math.max(18, previous.quality - randInt(1, 3));
    }
  }

  return board;
}

type CollegeChoice = { college: string; transfer: string; transferFrom: string };

function chooseCollege(offers: ScholarshipOffer[], grade: number): CollegeChoice {
  const names = offers.map((offer) => offer.school);
  const fallback = names[0] ?? "Toledo";
  // Flatter than a straight "best offer wins" split: the board is sorted by
  // prestige, and weighting the top spot this hard buried the smaller,
  // lower-prestige offers that were already on the board.
  const weights = [44, 33, 23];

  const signedName = weightedPick(
    names.map((name, index) => ({ value: name, weight: weights[index] ?? 10 })),
    fallback,
  );

  const signed = schoolByName(signedName);

  // Transfers are common in the portal era — a little under two in five
  // eligible players move at least once.
  if (!signed || !chance(0.37)) {
    return { college: signedName, transfer: "", transferFrom: "" };
  }

  const ceiling = clamp(2.6 + safeNumber(grade, 5) * 0.28, 2.6, 5.0);
  const upgrades = SCHOOLS.filter(
    (entry) =>
      entry.school !== signed.school &&
      entry.prestige >= signed.prestige + 0.3 &&
      entry.prestige <= ceiling,
  );

  if (upgrades.length === 0) {
    return { college: signedName, transfer: "", transferFrom: "" };
  }

  const destination = pick(upgrades, upgrades[0] as School);
  const reason = pick(TRANSFER_REASONS, "after a coaching change");

  // `transfer` is the full sentence used in the exported text and to gate the
  // narrative opening. `transferFrom` is just the origin school, used for the
  // short on-page note so that row can stay a fixed compact height.
  const transfer =
    "Signed with " +
    signed.school +
    ", transferred to " +
    destination.school +
    " " +
    reason;

  return { college: destination.school, transfer, transferFrom: signed.school };
}

/* ------------------------------------------------------------------ */
/* Stat lines                                                          */
/* ------------------------------------------------------------------ */

/** 0 -> floor of the position's production, 1 -> ceiling. */
function tierValue(low: number, high: number, tier: number): number {
  const base = low + (high - low) * clamp(tier, 0, 1);
  const spread = Math.abs(high - low) * 0.12;

  return Math.round(base + randFloat(-spread, spread));
}

function statNumbers(position: Position, tier: number, isCollege: boolean): NarrativeContext {
  const scale = isCollege ? 1 : 0.92;
  const value = (low: number, high: number): number =>
    Math.max(0, Math.round(tierValue(low, high, tier) * scale));

  const context: NarrativeContext = {
    games: value(7, 13),
    snaps: value(280, 780),
    grade: value(70, 96),
    pancakes: value(18, 110),
  };

  switch (position) {
    case "QB":
      context.pyds = isCollege ? value(1400, 4300) : value(1100, 3800);
      context.ptd = value(7, 44);
      context.int = tierValue(16, 3, tier);
      context.comp = value(50, 71);
      context.ryds = value(60, 1200);
      break;
    case "RB":
      context.ryds = isCollege ? value(420, 2000) : value(700, 2600);
      context.carries = value(95, 275);
      context.rtd = value(4, 30);
      context.rec = value(4, 46);
      context.recyds = value(30, 520);
      context.ypc = round1(randFloat(3.8, 4.4) + tier * 2.2);
      break;
    case "WR":
      context.rec = value(16, 96);
      context.recyds = isCollege ? value(240, 1550) : value(300, 1900);
      context.rectd = value(2, 22);
      context.ryds = value(0, 260);
      context.ypr = round1(randFloat(9.5, 12) + tier * 6);
      break;
    case "TE":
      context.rec = value(10, 68);
      context.recyds = value(120, 980);
      context.rectd = value(1, 14);
      break;
    case "OL":
      context.sacksAllowed = tierValue(11, 0, tier);
      context.pressures = tierValue(38, 4, tier);
      break;
    case "Edge Defender":
      context.tkl = value(24, 92);
      context.sacks = value(2, 20);
      context.tfl = value(5, 32);
      context.ff = value(0, 6);
      context.qbh = value(4, 30);
      context.pressures = value(9, 68);
      break;
    case "DT":
      context.tkl = value(20, 84);
      context.sacks = value(1, 14);
      context.tfl = value(4, 26);
      context.ff = value(0, 4);
      context.qbh = value(2, 22);
      context.pressures = value(6, 52);
      break;
    case "Linebacker":
      context.tkl = value(42, 165);
      context.tfl = value(4, 28);
      context.sacks = value(0, 11);
      context.ints = value(0, 5);
      context.ff = value(0, 5);
      context.pbu = value(0, 9);
      break;
    case "Cornerback":
      context.ints = value(0, 9);
      context.pbu = value(2, 20);
      context.tkl = value(18, 68);
      context.targets = tierValue(78, 24, tier);
      context.comp = tierValue(64, 33, tier);
      break;
    case "Safety":
      context.tkl = value(32, 128);
      context.ints = value(0, 8);
      context.pbu = value(1, 15);
      context.tfl = value(1, 12);
      context.ff = value(0, 4);
      break;
    case "Kicker/Punter": {
      const made = value(4, 24);
      context.fg = made;
      context.fga = made + randInt(1, 5);
      context.long = value(36, 58);
      context.touchbacks = value(4, 62);
      context.punts = value(16, 58);
      context.punt = round1(randFloat(33, 38) + tier * 8);
      context.inside20 = value(3, 28);
      break;
    }
  }

  return context;
}

/* ------------------------------------------------------------------ */
/* Pre-draft testing                                                   */
/* ------------------------------------------------------------------ */

/** [slowest at tier 0, fastest at tier 1], in seconds. Kickers/punters don't run one. */
const FORTY_RANGE: Partial<Record<Position, [number, number]>> = {
  QB: [5.05, 4.55],
  RB: [4.7, 4.33],
  WR: [4.65, 4.3],
  TE: [4.9, 4.53],
  OL: [5.45, 4.85],
  "Edge Defender": [4.95, 4.48],
  DT: [5.35, 4.85],
  Linebacker: [4.8, 4.45],
  Cornerback: [4.6, 4.28],
  Safety: [4.7, 4.35],
};

/** Second drill shown alongside the 40 — vertical for skill/space positions, bench for the trenches. */
const SECOND_DRILL: Partial<Record<Position, { label: string; unit: string; range: [number, number] }>> = {
  QB: { label: "vertical", unit: '"', range: [26, 34] },
  RB: { label: "vertical", unit: '"', range: [28, 40] },
  WR: { label: "vertical", unit: '"', range: [30, 42] },
  TE: { label: "bench", unit: " reps", range: [12, 24] },
  OL: { label: "bench", unit: " reps", range: [16, 32] },
  "Edge Defender": { label: "bench", unit: " reps", range: [14, 28] },
  DT: { label: "bench", unit: " reps", range: [18, 34] },
  Linebacker: { label: "vertical", unit: '"', range: [27, 38] },
  Cornerback: { label: "vertical", unit: '"', range: [30, 42] },
  Safety: { label: "vertical", unit: '"', range: [29, 40] },
};

function interpolate(range: [number, number], tier: number): number {
  return range[0] + (range[1] - range[0]) * clamp(tier, 0, 1);
}

/** A short pre-draft testing line. Empty string for kickers/punters, who don't work out these drills. */
function rollCombineLine(position: Position, tier: number): string {
  const fortyRange = FORTY_RANGE[position];

  if (!fortyRange) {
    return "";
  }

  const forty = (interpolate(fortyRange, tier) + randFloat(-0.05, 0.05)).toFixed(2);
  const parts = [forty + "s forty"];

  const second = SECOND_DRILL[position];

  if (second) {
    const value = interpolate(second.range, tier) + randFloat(-1, 1);
    const rounded = second.unit === " reps" ? Math.round(value) : round1(value);

    parts.push(rounded + second.unit + " " + second.label);
  }

  return parts.join(" · ");
}

/* ------------------------------------------------------------------ */
/* Accolades and scouting                                              */
/* ------------------------------------------------------------------ */

/**
 * Gates the actual award win, as opposed to the finalist/semifinalist line.
 * Kept separate from `band` because "high" spans 8.2-10.0 — wide enough that
 * gating the win on the raw grade is the only way to keep it rare.
 */
type EliteAccoladeGate = {
  tierValue: number;
  threshold: number;
  chance: number;
  extras: Partial<Record<Position, string[]>>;
  universal: string[];
};

type AccoladeResult = {
  /** All honours, unchanged from before — still the atomic unit locks and copy-to-text rely on. */
  text: string;
  /** The single named-award entry, if this roll produced one — shown on its own, apart from the chip list. */
  highlight: string;
};

function buildAccolades(
  bank: Record<RatingBand, string[]>,
  extras: Partial<Record<Position, string[]>>,
  band: RatingBand,
  position: Position,
  context: NarrativeContext,
  elite?: EliteAccoladeGate,
): AccoladeResult {
  // Three at most: the honours list is a glance, not a paragraph.
  const entries = pickMany(bank[band], 2);
  const positionExtras = extras[position] ?? [];
  let highlightRaw = "";

  if (band === "high" && positionExtras.length > 0) {
    const wonElite = elite && elite.tierValue >= elite.threshold && chance(elite.chance);
    const elitePool = wonElite
      ? ((elite as EliteAccoladeGate).extras[position]?.length
          ? (elite as EliteAccoladeGate).extras[position]
          : (elite as EliteAccoladeGate).universal)
      : undefined;

    highlightRaw = elitePool
      ? pick(elitePool, elitePool[0] as string)
      : pick(positionExtras, positionExtras[0] as string);
    entries.push(highlightRaw);
  } else if (band === "mid" && positionExtras.length > 0 && chance(0.35)) {
    highlightRaw = pick(positionExtras, positionExtras[0] as string);
    entries.push(highlightRaw);
  } else if (band !== "low") {
    entries.push(...pickMany(bank[band].filter((e) => !entries.includes(e)), 1));
  }

  return {
    text: entries.map((entry) => fill(entry, context)).join(" · "),
    highlight: highlightRaw ? fill(highlightRaw, context) : "",
  };
}

/**
 * How many strengths and concerns a report carries. Elite players get short
 * concern lists — a 9.4 prospect with three red flags is not a 9.4 prospect.
 */
export function scoutingCounts(tier: number): { pros: number; cons: number } {
  if (tier >= 9.4) {
    return { pros: 3, cons: chance(0.45) ? 0 : 1 };
  }

  if (tier >= 8.5) {
    return { pros: 3, cons: randInt(1, 2) };
  }

  if (tier >= 7.0) {
    return { pros: 3, cons: 2 };
  }

  if (tier >= 4.0) {
    return { pros: 3, cons: 3 };
  }

  return { pros: 2, cons: 3 };
}

function buildScoutingSide(
  positionBank: ScoutingLine[],
  contextBank: ScoutingLine[],
  height: number,
  weight: number,
  tier: number,
  context: NarrativeContext,
  count: number,
): string[] {
  if (count <= 0) {
    return [];
  }

  const positionPool = positionBank.filter((line) => lineFits(line, height, weight, tier));
  const contextPool = contextBank.filter((line) => lineFits(line, height, weight, tier));

  const fromPosition = Math.max(1, count - 1);
  const entries = [...pickMany(positionPool, fromPosition), ...pickMany(contextPool, 1)];

  if (entries.length < count) {
    const filler = pickMany(
      [...positionPool, ...contextPool].filter((line) => !entries.includes(line)),
      count - entries.length,
    );

    entries.push(...filler);
  }

  return entries.slice(0, count).map((line) => fill(line.text, context));
}

/* ------------------------------------------------------------------ */
/* Player assembly                                                     */
/* ------------------------------------------------------------------ */

export type CreatePlayerOptions = {
  lockedPlayer?: GeneratedPlayer | null;
  locks?: Partial<Locks> | null;
};

function keep<T>(isLocked: boolean, previous: T | undefined, generate: () => T): T {
  if (isLocked && previous !== undefined && previous !== null) {
    return previous;
  }

  return generate();
}

function stateFromHometown(hometown: string): string {
  const parts = hometown.split(",");
  const state = (parts[parts.length - 1] ?? "").trim().toUpperCase();

  return /^[A-Z]{2}$/.test(state) ? state : "OH";
}

function cityFromHometown(hometown: string): string {
  const parts = hometown.split(",");

  return (parts[0] ?? hometown).trim();
}

function highSchoolName(city: string): string {
  if (chance(0.2)) {
    return pick(HS_SAINT_NAMES, "St. Xavier");
  }

  return city + " " + pick(HS_SUFFIXES, "Central");
}

export function createPlayer(options: CreatePlayerOptions = {}): GeneratedPlayer {
  const previous = options.lockedPlayer ?? null;
  const locks = options.locks ?? null;

  const locked = (key: FieldKey): boolean => Boolean(previous && locks && locks[key]);

  /* 1. Position and high-school role -------------------------------- */

  const lockedHighSchoolRole: HighSchoolPosition | null = locked("highSchoolPosition")
    ? (previous?.highSchoolPosition ?? null)
    : null;

  const wantsAthlete = lockedHighSchoolRole === null && chance(0.18);

  let position: Position;

  if (locked("position") && previous) {
    position = previous.position;
  } else if (lockedHighSchoolRole && lockedHighSchoolRole !== "Athlete") {
    position = lockedHighSchoolRole;
  } else if (lockedHighSchoolRole === "Athlete" || wantsAthlete) {
    position = pick(ATHLETE_POSITIONS, "WR");
  } else {
    position = weightedPick(POSITION_WEIGHTS, "WR");
  }

  const highSchoolPosition: HighSchoolPosition =
    lockedHighSchoolRole ??
    (wantsAthlete && ATHLETE_POSITIONS.includes(position) ? "Athlete" : position);

  const rule = POSITION_RULES[position];

  /* 2. Race and name ------------------------------------------------ */

  const race: Race = keep(locked("race"), previous?.race, () =>
    weightedPick(raceWeightsFor(position), "Black"),
  );

  const namePool = NAME_POOLS[race] ?? NAME_POOLS.Black;

  const name = keep(locked("name"), previous?.name, () => {
    // QBs get compared to real draft boards more than any other spot, so a
    // small slice of them draw from a more conventional first-name pool.
    const first =
      position === "QB" && chance(0.05)
        ? pick(QB_COMMON_FIRST_NAMES, "Jake")
        : pick(namePool.first, "Jamari");
    const last = pick(namePool.last, "Whitfield");

    return first + " " + last;
  });

  /* 3. Hometown ----------------------------------------------------- */

  const hometown = keep(locked("hometown"), previous?.hometown, () => {
    const town = weightedPick(
      HOMETOWNS.map((entry) => ({ value: entry, weight: entry.weight })),
      HOMETOWNS[0],
    );

    return town.city + ", " + town.state;
  });

  const state = stateFromHometown(hometown);
  const city = cityFromHometown(hometown);

  /* 4. Rating, development arc, NFL grade ---------------------------- */

  const ratingLocked = locked("prospectRating");
  const gradeLocked = locked("nflProspectGrade");
  const arcLocked = locked("developmentArc");

  const lockedArc = arcLocked ? arcByLabel(previous?.developmentArc ?? "") : undefined;

  let prospectRating: number;

  if (ratingLocked) {
    prospectRating = safeNumber(previous?.prospectRating, rollProspectRating());
  } else if (gradeLocked) {
    // Work backwards through the arc so the recruiting profile still explains
    // the locked draft grade.
    const grade = safeNumber(previous?.nflProspectGrade, 5);
    const arc = lockedArc ?? arcFromDelta(grade - baselineGradeFromRating(5));
    const impliedDelta = (arc.minDelta + arc.maxDelta) / 2;

    prospectRating = round1(clamp((grade - impliedDelta - 0.95) / 0.9, 0, 10));
  } else {
    prospectRating = rollProspectRating();
  }

  const gradeBaseline = baselineGradeFromRating(prospectRating);

  let arc: DevelopmentArc;
  let nflProspectGrade: number;

  if (gradeLocked) {
    nflProspectGrade = round1(clamp(safeNumber(previous?.nflProspectGrade, gradeBaseline), 0, 10));
    // Both endpoints are pinned, so the arc is whatever explains the gap.
    arc = lockedArc ?? arcFromDelta(nflProspectGrade - gradeBaseline);
  } else {
    arc = lockedArc ?? rollDevelopmentArc();
    const delta = randFloat(arc.minDelta, arc.maxDelta);
    nflProspectGrade = round1(clamp(gradeBaseline + delta + randFloat(-0.12, 0.12), 0.3, 10));
  }

  // Both get nudged again once the program is known below — kept mutable so
  // that adjustment can still add up to the final NFL grade cleanly.
  let arcDelta = round1(nflProspectGrade - gradeBaseline);
  const developmentArc = arc.label;

  const band = bandFromRating(prospectRating);
  const ratingTier = clamp(prospectRating / 10, 0, 1);
  let gradeTier = clamp(nflProspectGrade / 10, 0, 1);

  /* 5. Number and builds -------------------------------------------- */

  const number = keep(locked("number"), previous?.number, () => rollNumber(position));

  const lockedHighSchoolBuild = locked("highSchoolBuild") ? previous?.highSchoolBuild : undefined;
  const lockedBuild = locked("build") ? previous?.build : undefined;

  let highSchoolFrame: ParsedBuild;

  if (lockedHighSchoolBuild) {
    highSchoolFrame = parseBuild(lockedHighSchoolBuild) ?? rollHighSchoolBuild(rule);
  } else if (lockedBuild) {
    const developed = parseBuild(lockedBuild);
    highSchoolFrame = developed ? regressBuild(developed, rule) : rollHighSchoolBuild(rule);
  } else {
    highSchoolFrame = rollHighSchoolBuild(rule);
  }

  const developedFrame: ParsedBuild = lockedBuild
    ? (parseBuild(lockedBuild) ?? developBuild(highSchoolFrame, rule))
    : developBuild(highSchoolFrame, rule);

  const highSchoolBuild =
    lockedHighSchoolBuild ?? formatBuild(highSchoolFrame.inches, highSchoolFrame.pounds);
  const build = lockedBuild ?? formatBuild(developedFrame.inches, developedFrame.pounds);

  /* 6. Scholarship offers (atomic) ----------------------------------- */

  const previousOffers = previous?.offers;
  const hasUsableOffers = Array.isArray(previousOffers) && previousOffers.length > 0;

  const offers: ScholarshipOffer[] = keep(
    locked("offers") && hasUsableOffers,
    previousOffers,
    () => buildOffers(prospectRating, state),
  );

  /* 7. College destination and transfer ------------------------------ */

  const destination = locked("college")
    ? {
        college: previous?.college ?? "Toledo",
        transfer: previous?.transfer ?? "",
        transferFrom: previous?.transferFrom ?? "",
      }
    : chooseCollege(offers, nflProspectGrade);

  const college = destination.college;
  const transfer = destination.transfer;
  const transferFrom = destination.transferFrom;

  /* 7b. Program strength nudges the grade, not just the destination --- */

  // A blue-blood program tends to nudge a grade up a touch; a small G5/FCS/
  // Division-II program adds real variance in both directions instead of a
  // flat penalty — some of these guys are exactly who they looked like, and
  // some of them were a level higher than their competition ever tested.
  if (!gradeLocked) {
    const programPrestige = schoolByName(college)?.prestige ?? 3.0;
    let programNudge = 0;

    if (programPrestige >= 4.3) {
      programNudge = round1(randFloat(0, 0.3));
    } else if (programPrestige <= 2.2) {
      programNudge = round1(randFloat(-0.6, 0.9));
    }

    if (programNudge !== 0) {
      nflProspectGrade = round1(clamp(nflProspectGrade + programNudge, 0.3, 10));
      // Re-derived from the final (possibly clamped) grade rather than added
      // to independently, so baseline + arc delta always reconciles to the
      // grade exactly — the clamp can otherwise eat part of the nudge.
      arcDelta = round1(nflProspectGrade - gradeBaseline);
      gradeTier = clamp(nflProspectGrade / 10, 0, 1);
    }
  }

  /* 8. Narrative context --------------------------------------------- */

  const context: NarrativeContext = {
    name,
    first: name.split(" ")[0] ?? name,
    last: name.split(" ").slice(1).join(" ") || name,
    pos: position,
    hsPos: highSchoolPosition,
    city,
    state,
    hs: highSchoolName(city),
    mascot: pick(MASCOTS, "Tigers"),
    college,
    topOffer: offers[0]?.school ?? college,
    arc: developmentArc,
  };

  /* 9. Player comparisons -------------------------------------------- */

  const collegeComp = keep(locked("collegeComp"), previous?.collegeComp, () => {
    const comp: Comp | null = findComp(
      COLLEGE_COMPS[position],
      highSchoolFrame.inches,
      highSchoolFrame.pounds,
      prospectRating,
      pick,
    );

    return formatComp(comp);
  });

  const nflCompResult =
    locked("nflComp") && previous
      ? { text: previous.nflComp, retro: previous.nflCompRetro ?? "" }
      : (() => {
          const comp: Comp | null = findComp(
            NFL_COMPS[position],
            developedFrame.inches,
            developedFrame.pounds,
            nflProspectGrade,
            pick,
          );

          return { text: formatComp(comp), retro: comp?.retro ?? "" };
        })();

  const nflComp = nflCompResult.text;
  const nflCompRetro = nflCompResult.retro;

  /* 10. Scouting reports (each side is atomic) ----------------------- */

  const scoutingHighSchoolLocked = locked("highSchoolScouting");
  const highSchoolCounts = scoutingCounts(prospectRating);

  const highSchoolPros = keep(scoutingHighSchoolLocked, previous?.highSchoolPros, () =>
    buildScoutingSide(
      POSITION_PROS[position],
      HS_CONTEXT_PROS,
      highSchoolFrame.inches,
      highSchoolFrame.pounds,
      prospectRating,
      context,
      highSchoolCounts.pros,
    ),
  );

  const highSchoolCons = keep(scoutingHighSchoolLocked, previous?.highSchoolCons, () =>
    buildScoutingSide(
      POSITION_CONS[position],
      HS_CONTEXT_CONS,
      highSchoolFrame.inches,
      highSchoolFrame.pounds,
      prospectRating,
      context,
      highSchoolCounts.cons,
    ),
  );

  const scoutingNflLocked = locked("nflScouting");
  const nflCounts = scoutingCounts(nflProspectGrade);

  const nflPros = keep(scoutingNflLocked, previous?.nflPros, () =>
    buildScoutingSide(
      POSITION_PROS[position],
      NFL_CONTEXT_PROS,
      developedFrame.inches,
      developedFrame.pounds,
      nflProspectGrade,
      context,
      nflCounts.pros,
    ),
  );

  const nflCons = keep(scoutingNflLocked, previous?.nflCons, () =>
    buildScoutingSide(
      POSITION_CONS[position],
      NFL_CONTEXT_CONS,
      developedFrame.inches,
      developedFrame.pounds,
      nflProspectGrade,
      context,
      nflCounts.cons,
    ),
  );

  /* 11. Accolades and stats ------------------------------------------ */

  const highSchoolAccoladeResult = keep(
    locked("highSchoolAccolades"),
    previous
      ? { text: previous.highSchoolAccolades, highlight: previous.highSchoolAwardHighlight ?? "" }
      : undefined,
    () => buildAccolades(HS_ACCOLADE_BANKS, HS_ACCOLADE_POSITION_EXTRAS, band, position, context),
  );

  const highSchoolAccolades = highSchoolAccoladeResult.text;
  const highSchoolAwardHighlight = highSchoolAccoladeResult.highlight;

  const accoladeResult = keep(
    locked("accolades"),
    previous ? { text: previous.accolades, highlight: previous.awardHighlight ?? "" } : undefined,
    () =>
      buildAccolades(
        COLLEGE_ACCOLADE_BANKS,
        COLLEGE_ACCOLADE_POSITION_EXTRAS,
        bandFromRating(nflProspectGrade),
        position,
        context,
        {
          tierValue: nflProspectGrade,
          threshold: 9.4,
          chance: 0.18,
          extras: COLLEGE_ACCOLADE_POSITION_ELITE,
          universal: COLLEGE_ACCOLADE_ELITE_UNIVERSAL,
        },
      ),
  );

  const accolades = accoladeResult.text;
  const awardHighlight = accoladeResult.highlight;

  const combine = keep(locked("combine"), previous?.combine, () =>
    rollCombineLine(position, gradeTier),
  );

  const highSchoolStats = keep(locked("highSchoolStats"), previous?.highSchoolStats, () => {
    const numbers = statNumbers(position, ratingTier, false);
    const template = pick(HS_STAT_TEMPLATES[position], "Three-year starter");

    return fill(template, { ...context, ...numbers });
  });

  // A stat line is only numbers. No commentary hangs off it.
  const stats = keep(locked("stats"), previous?.stats, () => {
    const numbers = statNumbers(position, gradeTier, true);
    const template = pick(COLLEGE_STAT_TEMPLATES[position], "Full-time starter");

    return fill(template, { ...context, ...numbers });
  });

  /* 12. Narratives ---------------------------------------------------- */

  // Three beats per paragraph, not four. Long enough to be a story, short
  // enough to actually read on every roll.
  const recruiting = keep(locked("recruiting"), previous?.recruiting, () => {
    const bank = RECRUITING_BANKS[band];

    // Three sentences drawn from four angles — which angle sits out changes
    // roll to roll, so the shape of the story varies as much as the wording.
    const slots = [bank.found, bank.rise, bank.pitch, bank.scope];
    const skip = randInt(0, slots.length - 1);

    return slots
      .filter((_, index) => index !== skip)
      .map((slot) => fill(pick(slot, ""), context))
      .filter((part) => part.length > 0)
      .join(" ");
  });

  const highSchool = keep(locked("highSchool"), previous?.highSchool, () => {
    const parts = [pick(HS_OPENINGS, ""), ...pickMany(HS_BEATS, 1), pick(HS_CLOSINGS, "")];

    return parts
      .filter((part) => part.length > 0)
      .map((part) => fill(part, context))
      .join(" ");
  });

  const collegeCareer = keep(locked("collegeCareer"), previous?.collegeCareer, () => {
    // The transfer itself is already shown as its own field, so the narrative
    // gets a transfer-aware opening rather than a repeat of that sentence.
    const opening =
      transfer.length > 0
        ? pick(COLLEGE_TRANSFER_OPENINGS, "")
        : pick(COLLEGE_OPENINGS, "");

    const arcBeat = pick(ARC_BEATS[arc.key] ?? [], "");

    // A career that went backwards should not close on a glowing line.
    const closing =
      arcDelta <= -1.2 ? pick(COLLEGE_CLOSINGS_DOWN, "") : pick(COLLEGE_CLOSINGS, "");

    const middle = chance(0.5)
      ? pick(COLLEGE_BEATS, "")
      : pick(COLLEGE_PRODUCTION_BEATS, "");

    const parts = [opening, middle, arcBeat, closing];

    return parts
      .filter((part) => part.length > 0)
      .map((part) => fill(part, context))
      .join(" ");
  });

  /* 13. Draft projection ---------------------------------------------- */

  const draft = keep(locked("draft"), previous?.draft, () => draftFromGrade(nflProspectGrade));

  return {
    name,
    position,
    highSchoolPosition,
    race,
    number,
    build,
    highSchoolBuild,
    hometown,
    college,
    transfer,
    transferFrom,
    highSchoolAccolades,
    highSchoolAwardHighlight,
    highSchoolStats,
    recruiting,
    prospectRating: round1(prospectRating),
    nflProspectGrade: round1(nflProspectGrade),
    offers,
    accolades,
    awardHighlight,
    highSchool,
    collegeCareer,
    stats,
    draft,
    combine,
    developmentArc,
    arcDelta,
    gradeBaseline,
    collegeComp,
    nflComp,
    nflCompRetro,
    highSchoolPros,
    highSchoolCons,
    nflPros,
    nflCons,
  };
}

/* ------------------------------------------------------------------ */
/* Constrained generation (the build-a-prospect tab)                   */
/* ------------------------------------------------------------------ */

export type PlayerSeed = {
  prospectRating?: number;
  nflProspectGrade?: number;
  position?: Position;
  highSchoolPosition?: HighSchoolPosition;
  race?: Race;
  state?: string;
  developmentArc?: string;
};

/**
 * Builds a player around explicit constraints — "a 10.0 high-school prospect",
 * "a 5'10\" quarterback out of Texas who never developed" — and reports which
 * fields were pinned so the caller can carry them forward as locks.
 */
export function createPlayerFromSeed(seed: PlayerSeed): {
  player: GeneratedPlayer;
  lockedKeys: FieldKey[];
} {
  const base = createPlayer();
  const lockedKeys: FieldKey[] = [];
  const scaffold: GeneratedPlayer = { ...base };

  if (typeof seed.prospectRating === "number" && Number.isFinite(seed.prospectRating)) {
    scaffold.prospectRating = clamp(seed.prospectRating, 0, 10);
    lockedKeys.push("prospectRating");
  }

  if (typeof seed.nflProspectGrade === "number" && Number.isFinite(seed.nflProspectGrade)) {
    scaffold.nflProspectGrade = clamp(seed.nflProspectGrade, 0, 10);
    lockedKeys.push("nflProspectGrade");
  }

  if (seed.position) {
    scaffold.position = seed.position;
    lockedKeys.push("position");
  }

  if (seed.highSchoolPosition) {
    scaffold.highSchoolPosition = seed.highSchoolPosition;
    lockedKeys.push("highSchoolPosition");
  }

  if (seed.race) {
    scaffold.race = seed.race;
    lockedKeys.push("race");
  }

  if (seed.state) {
    const towns = HOMETOWNS.filter((entry) => entry.state === seed.state);
    const town = weightedPick(
      towns.map((entry) => ({ value: entry, weight: entry.weight })),
      towns[0] ?? HOMETOWNS[0],
    );

    scaffold.hometown = town.city + ", " + town.state;
    lockedKeys.push("hometown");
  }

  if (seed.developmentArc && arcByLabel(seed.developmentArc)) {
    scaffold.developmentArc = seed.developmentArc;
    lockedKeys.push("developmentArc");
  }

  const seedLocks: Partial<Locks> = {};

  for (const key of lockedKeys) {
    seedLocks[key] = true;
  }

  return {
    player: createPlayer({ lockedPlayer: scaffold, locks: seedLocks }),
    lockedKeys,
  };
}

/* ------------------------------------------------------------------ */
/* Draft board (the full-class tab)                                    */
/* ------------------------------------------------------------------ */

/**
 * A full, independently-rolled class, ranked by NFL grade. No team fits and
 * no mock picks — every prospect is generated exactly the way a single roll
 * is, then the whole set is sorted for a big-board view.
 */
/**
 * Independently rolling dozens of players otherwise produces several
 * 9.8-10.0 "first overall" prospects in the same class, which reads as
 * unrealistic — a real draft has at most one or two players in that tier,
 * and only a handful of genuine blue-chip prospects overall. This caps both
 * bands and regenerates any excess at a lower (but still strong) locked
 * grade, so the replacement is still a fully self-consistent player rather
 * than a patched-over one. The cap does not scale with class size: a real
 * draft does not get more elite prospects just because you are looking at
 * seven rounds instead of one.
 */
function shapeDraftClass(players: GeneratedPlayer[]): GeneratedPlayer[] {
  const TOP_TIER = 9.7; // genuine "first overall" caliber
  const BROAD_TIER = 8.8; // blue-chip / top-of-the-class caliber

  // 0 is the most common outcome, 1 is common, 2 is rare, and it never goes higher.
  const topCap = weightedPick(
    [
      { value: 0, weight: 55 },
      { value: 1, weight: 35 },
      { value: 2, weight: 10 },
    ],
    0,
  );

  // Averages 3-4 blue-chip prospects, occasionally as many as 6.
  const broadCap = weightedPick(
    [
      { value: 2, weight: 10 },
      { value: 3, weight: 28 },
      { value: 4, weight: 28 },
      { value: 5, weight: 20 },
      { value: 6, weight: 14 },
    ],
    4,
  );

  const sorted = [...players].sort((a, b) => b.nflProspectGrade - a.nflProspectGrade);
  const shaped: GeneratedPlayer[] = [];
  let topSeen = 0;
  let broadSeen = 0;

  for (const entry of sorted) {
    // A top-tier demotion can still land in the broad tier, so it has to be
    // checked against that cap too — not just added for free.
    let candidate = entry;

    if (candidate.nflProspectGrade >= TOP_TIER) {
      if (topSeen < topCap) {
        topSeen += 1;
      } else {
        candidate = createPlayerFromSeed({
          position: candidate.position,
          nflProspectGrade: round1(randFloat(8.6, 9.4)),
        }).player;
      }
    }

    if (candidate.nflProspectGrade >= BROAD_TIER) {
      if (broadSeen < broadCap) {
        broadSeen += 1;
      } else {
        candidate = createPlayerFromSeed({
          position: candidate.position,
          nflProspectGrade: round1(randFloat(7.4, 8.6)),
        }).player;
      }
    }

    shaped.push(candidate);
  }

  return shaped.sort((a, b) => b.nflProspectGrade - a.nflProspectGrade);
}

export function createDraftClass(size: number): GeneratedPlayer[] {
  const count = Math.max(1, Math.round(size));
  const players: GeneratedPlayer[] = [];

  for (let index = 0; index < count; index += 1) {
    players.push(createPlayer());
  }

  return shapeDraftClass(players);
}

export function starLabel(rating: number): string {
  const value = starsFromRating(rating);

  return value === 1 ? "1-star prospect" : value + "-star prospect";
}

/** Plain-text version of the visible profile, for pasting into notes or drafts. */
export function playerToText(player: GeneratedPlayer, mode: "college" | "nfl"): string {
  const bullets = (items: string[]) => items.map((item) => "  - " + item).join("\n");

  if (mode === "college") {
    return [
      player.name + " — " + player.highSchoolPosition + " #" + player.number,
      player.highSchoolBuild + " · " + player.race + " · " + player.hometown,
      "",
      "PROSPECT RATING: " +
        safeNumber(player.prospectRating, 0).toFixed(1) +
        "/10.0 (" +
        starLabel(player.prospectRating) +
        ")",
      "COMP: " + player.collegeComp,
      "",
      "OFFERS:",
      player.offers.map((o) => "  - " + o.school + " (" + o.quality + "%)").join("\n"),
      "",
      "STRENGTHS:",
      bullets(player.highSchoolPros),
      "CONCERNS:",
      bullets(player.highSchoolCons),
      "",
      "STATS: " + player.highSchoolStats,
      "HONOURS: " + player.highSchoolAccolades,
      "",
      "ORIGIN STORY",
      player.highSchool,
      "",
      "RECRUITING",
      player.recruiting,
    ].join("\n");
  }

  return [
    player.name + " — " + player.position + " #" + player.number,
    player.build + " · " + player.race + " · " + player.hometown,
    "COLLEGE: " + player.college + (player.transfer ? " (" + player.transfer + ")" : ""),
    "",
    "NFL GRADE: " +
      safeNumber(player.nflProspectGrade, 0).toFixed(1) +
      "/10.0 — " +
      player.draft,
    "PATH: " +
      safeNumber(player.prospectRating, 0).toFixed(1) +
      " recruit → " +
      player.developmentArc +
      " (" +
      (player.arcDelta >= 0 ? "+" : "") +
      safeNumber(player.arcDelta, 0).toFixed(1) +
      ")",
    "COMP: " + player.nflComp,
    player.combine ? "TESTING: " + player.combine : "",
    "",
    "STRENGTHS:",
    bullets(player.nflPros),
    "CONCERNS:",
    bullets(player.nflCons),
    "",
    "STATS: " + player.stats,
    "HONOURS: " + player.accolades,
    "",
    "THE LEAP",
    player.collegeCareer,
  ].join("\n");
}
