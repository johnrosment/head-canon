import type { Position } from "./player-types";

/**
 * Scouting-report lines. Each carries optional frame and grade conditions so a
 * 6'6" tackle never gets a "lacks length" flag and a 9.5 prospect never gets a
 * "developmental project" note.
 */
export type ScoutingLine = {
  text: string;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  minTier?: number;
  maxTier?: number;
};

export function lineFits(
  line: ScoutingLine,
  height: number,
  weight: number,
  tier: number,
): boolean {
  if (line.minHeight !== undefined && height < line.minHeight) return false;
  if (line.maxHeight !== undefined && height > line.maxHeight) return false;
  if (line.minWeight !== undefined && weight < line.minWeight) return false;
  if (line.maxWeight !== undefined && weight > line.maxWeight) return false;
  if (line.minTier !== undefined && tier < line.minTier) return false;
  if (line.maxTier !== undefined && tier > line.maxTier) return false;

  return true;
}

/* ------------------------------------------------------------------ */
/* Position traits — pros                                              */
/* ------------------------------------------------------------------ */

export const POSITION_PROS: Record<Position, ScoutingLine[]> = {
  QB: [
    { text: "Live arm — drives the out-breaker to the far hash without resetting his base." },
    { text: "Throws with real anticipation; the ball is out before the break finishes.", minTier: 6.0 },
    { text: "Compact, translatable release that survives traffic in a phone booth.", maxHeight: 73 },
    { text: "Wins outside of structure — the second-reaction plays are the flashes that grade highest.", maxHeight: 74 },
    { text: "Genuine dual-threat traits; the designed quarterback run is a real part of the package." },
    { text: "Sees the field over the top of the rush without needing a launch point.", minHeight: 76 },
    { text: "Keeps his eyes downfield when the pocket collapses instead of bailing early." },
    { text: "Ball placement on layered throws is well ahead of his experience level.", minTier: 7.0 },
    { text: "Handles protection checks and gets the front sorted before the snap.", minTier: 6.5 },
    { text: "Deep ball is a legitimate chunk-play weapon — hits receivers in stride." },
    { text: "Plays with a short memory; a bad rep does not bleed into the next series." },
    { text: "Bigger frame absorbs contact and finishes throws through the hit.", minWeight: 225 },
    { text: "Checks a lot of boxes for a program looking for a Day 1 starter under center.", minTier: 7.5 },
    { text: "Toughness shows up on tape — takes the hit, delivers the ball, gets up." },
  ],
  RB: [
    { text: "Contact balance is the standout trait — the first defender almost never gets him down." },
    { text: "One-cut decisiveness; hits the crease without dancing behind the line." },
    { text: "Legitimate three-down back — runs a real route tree out of the backfield.", minTier: 5.5 },
    { text: "Pass protection is already usable, which is rare production for this stage." },
    { text: "Low center of gravity makes him a nightmare to square up in a phone booth.", maxHeight: 70 },
    { text: "Size and mass wear defenses down over the course of a full game.", minWeight: 220 },
    { text: "Long speed shows up on the second level — he outruns pursuit angles clean." },
    { text: "Patient behind zone blocks, then accelerates decisively through the second level." },
    { text: "Ball security has never been an issue on tape, a rare clean box to check." },
    { text: "Kick-return value adds a phase most backs in this range do not bring." },
    { text: "A menace once he gets a crease — finishes runs, not just gains yards." },
  ],
  WR: [
    { text: "Separation at the top of the route is the calling card of his tape." },
    { text: "Releases cleanly against press without wasting steps.", minTier: 6.0 },
    { text: "Tracks the deep ball naturally over either shoulder, rare body control." },
    { text: "Catch radius is enormous — high-points everything in the red zone.", minHeight: 74 },
    { text: "Sudden in and out of breaks; quick-game answers come easy against off coverage.", maxHeight: 73 },
    { text: "Yards after catch are a real, translatable part of the production, not schemed touches." },
    { text: "Strong hands — plucks the ball away from his frame consistently." },
    { text: "Willing and effective as a stalk blocker on the perimeter, a coach's-favorite trait." },
    { text: "Body control on the sideline throws already looks pro-caliber.", minTier: 7.0 },
    { text: "Plays faster than his timed speed because he never gears down in the route." },
    { text: "Ready-made slot option who checks a lot of boxes on early downs.", minTier: 6.5 },
  ],
  TE: [
    { text: "Legitimate in-line blocker, not a big receiver playing out of position." },
    { text: "Seam-stretching speed forces safeties to account for him pre-snap." },
    { text: "Enormous catch radius; the back-shoulder throw is close to automatic.", minHeight: 77 },
    { text: "Moves around the formation — flexed, in-line, and out of the backfield." },
    { text: "Hands are reliable in traffic over the middle of the field." },
    { text: "Play strength at the point of attack is ahead of schedule for his experience level.", minWeight: 250 },
    { text: "Understands leverage against zone coverage and finds the soft spot on time." },
    { text: "Red-zone target with a proven, translatable conversion rate.", minTier: 6.0 },
    { text: "Checks a lot of boxes for a scheme-versatile Y who can flex or stay in-line.", minTier: 7.0 },
  ],
  OL: [
    { text: "Anchor holds against power — he does not get walked back into the pocket." },
    { text: "Light feet in the pass set; mirrors speed rushers without lunging or overextending." },
    { text: "Finishes blocks through the whistle with an obvious mean streak." },
    { text: "Length lets him land first and control the rep from the jump.", minHeight: 78 },
    { text: "Athletic enough to pull and reach-block in a wide-zone scheme.", maxWeight: 320 },
    { text: "Positional flexibility — real reps at more than one spot along the line." },
    { text: "Hand placement is consistently inside the frame, a technique trait that translates." },
    { text: "Plays with a low pad level for his height, a rare combination up front.", minHeight: 77 },
    { text: "Communication and line calls are already a strength, not a projection.", minTier: 6.5 },
    { text: "Scheme-versatile — fits zone or gap without a steep technical reset.", minTier: 6.0 },
  ],
  "Edge Defender": [
    { text: "First step is the trait — he is on the tackle's edge before the kick slide finishes." },
    { text: "Bends the corner and flattens to the quarterback without losing speed." },
    { text: "Converts speed to power cleanly on the long-arm bull rush." },
    { text: "Sets a hard edge against the run instead of just rushing upfield unblocked." },
    { text: "Hand usage is unusually developed — real counters off the primary move.", minTier: 6.5 },
    { text: "Length creates problems even when the initial rush stalls.", minHeight: 77 },
    { text: "Motor never comes off; chases plays down from the back side every snap." },
    { text: "Can drop into coverage in a two-point stance if a scheme asks him to.", maxWeight: 255 },
    { text: "A menace with his hand in the dirt — disruptive well beyond the box score.", minTier: 7.0 },
  ],
  DT: [
    { text: "Wins with leverage — the pad level is consistently under the blocker's." },
    { text: "Interior pass-rush production is real, not a product of unblocked snaps." },
    { text: "Commands double teams and keeps the linebackers clean behind him.", minWeight: 315 },
    { text: "Quick first step for his mass; splits gaps before they have a chance to close.", maxWeight: 315 },
    { text: "Heavy hands shock offensive linemen at the point of attack." },
    { text: "Two-gap capable — holds his ground and sheds late in the down." },
    { text: "Plays with an obvious effort level on every single snap." },
    { text: "Rare movement skills for the frame; chases plays outside the tackle box.", minTier: 7.0 },
  ],
  Linebacker: [
    { text: "Diagnoses run fits early and shoots the gap before it has a chance to close." },
    { text: "Sideline-to-sideline range shows up on every cutup of his tape." },
    { text: "Coverage instincts are legitimate — carries verticals and reads route concepts.", minTier: 6.0 },
    { text: "Takes on blocks with real leverage instead of running around them.", minWeight: 235 },
    { text: "Reliable open-field tackler; missed tackles are rare on tape." },
    { text: "Blitz timing is a genuine weapon on third down." },
    { text: "Communicates the front pre-snap and gets everybody lined up correctly." },
    { text: "Athletic profile suggests immediate special-teams value.", maxTier: 6.5 },
    { text: "A three-down every-down profile that checks a lot of boxes for a modern defense.", minTier: 7.0 },
  ],
  Cornerback: [
    { text: "Press technique is advanced — patient hands, no panic at the line of scrimmage." },
    { text: "Mirrors quick releases without losing leverage in phase.", maxHeight: 72 },
    { text: "Length disrupts the catch point even when he is beaten early in the route.", minHeight: 74 },
    { text: "Ball skills are real — plays the football, not just the receiver." },
    { text: "Willing tackler in run support, which is not a given at this position." },
    { text: "Recovery speed erases mistakes downfield before they become explosive plays." },
    { text: "Zone eyes and route recognition are well ahead of schedule.", minTier: 6.5 },
    { text: "Slot flexibility gives a defense a legitimate third alignment option.", maxHeight: 72 },
    { text: "Scheme-versatile — fits press-man or off-zone without a steep learning curve.", minTier: 7.0 },
  ],
  Safety: [
    { text: "Range from the middle of the field is the standout, translatable trait." },
    { text: "Physical downhill trigger against the run, arrives with bad intentions." },
    { text: "Comfortable covering tight ends and backs man-to-man.", minTier: 6.0 },
    { text: "Reads the quarterback's eyes and jumps the intermediate throw on time." },
    { text: "Tackling angles are consistently correct, rarely takes a poor angle." },
    { text: "Size to play in the box on early downs.", minWeight: 210 },
    { text: "Communicates rotations pre-snap and gets the back end aligned." },
    { text: "Special-teams profile is immediately usable on multiple units.", maxTier: 6.5 },
  ],
  "Kicker/Punter": [
    { text: "Leg strength is genuine — touchbacks are not a live question." },
    { text: "Operation time is consistently under the standard NFL benchmark." },
    { text: "Accuracy inside 45 has been near-automatic across multiple seasons." },
    { text: "Cold-weather and wind games have not moved his numbers at all." },
    { text: "Directional punting keeps returners from ever getting started." },
    { text: "Handles both kicking jobs, which saves a roster spot in a pinch." },
  ],
};

/* ------------------------------------------------------------------ */
/* Position traits — cons                                              */
/* ------------------------------------------------------------------ */

export const POSITION_CONS: Record<Position, ScoutingLine[]> = {
  QB: [
    { text: "Under six feet — throwing lanes and batted balls will be a live question at every level.", maxHeight: 71 },
    { text: "Height means he projects best from defined half-field reads and moved pockets.", maxHeight: 72 },
    { text: "Tall build comes with a long release; the ball comes out late on quick-game throws.", minHeight: 78 },
    { text: "Pocket movement is stiff — he drifts backward instead of climbing the pocket.", minHeight: 77 },
    { text: "Footwork gets sloppy the moment the first read is covered." },
    { text: "Ball placement dips badly when he is forced to throw off-platform.", maxTier: 6.5 },
    { text: "Stares down the primary read and lets safeties drive on the route.", maxTier: 6.5 },
    { text: "Takes unnecessary hits; the slide is not yet part of his vocabulary." },
    { text: "Production came in a spread system with a lot of half-field simplification." },
    { text: "Frame is slight for the position and will need a real strength program.", maxWeight: 210 },
    { text: "Arm strength grades adequate rather than special — the deep out is a stretch throw.", maxTier: 7.5 },
    { text: "Turnover-worthy plays spike once the game script gets away from him.", maxTier: 7.0 },
    { text: "Questions about processing speed will follow him into every pre-draft interview.", maxTier: 6.0 },
  ],
  RB: [
    { text: "Frame is small for a true three-down workload; projects as a committee piece.", maxWeight: 200 },
    { text: "Size limits him on early downs — the pass-protection reps are rough watch.", maxWeight: 205 },
    { text: "Runs upright and takes more direct shots than the tape needs to allow.", minHeight: 72 },
    { text: "Long speed is average; gets caught from behind by pursuit on the second level.", maxTier: 7.0 },
    { text: "Vision is inconsistent — leaves real yardage on the field on zone runs.", maxTier: 6.5 },
    { text: "Almost no receiving production on tape to evaluate for the next level." },
    { text: "Heavy usage already; the tread on the tires is a real conversation for teams.", minTier: 6.0 },
    { text: "Pass protection is a genuine liability as things currently stand." },
    { text: "Dances at the line instead of committing decisively to the crease." },
  ],
  WR: [
    { text: "Slight frame — press coverage disrupts his timing at the line.", maxWeight: 190 },
    { text: "Route tree is limited to what the college offense actually asked of him.", maxTier: 7.0 },
    { text: "Long strider who struggles to sink his hips at the top of the route.", minHeight: 75 },
    { text: "Separation quickness grades average; wins more on size than movement.", minHeight: 75 },
    { text: "Concentration drops show up more than once across the cutups." },
    { text: "Almost all of his production came from the slot against soft coverage.", maxTier: 7.0 },
    { text: "Release package against press coverage is still underdeveloped." },
    { text: "Blocking effort on the perimeter is inconsistent at best on tape." },
    { text: "Deep speed is good, not special; will not simply run past NFL corners.", maxTier: 8.0 },
  ],
  TE: [
    { text: "In-line blocking is still a projection, not a current strength.", maxWeight: 250 },
    { text: "Needs another 15 pounds before he can hold up against NFL edge defenders.", maxWeight: 248 },
    { text: "Straight-line athlete who struggles to separate against man coverage.", maxTier: 7.0 },
    { text: "Route detail is unrefined — rounds off breaks that should be sharp." },
    { text: "Hands are inconsistent when he has to adjust away from a well-placed ball." },
    { text: "Was used almost exclusively as a flexed receiver in this system.", maxTier: 7.5 },
    { text: "Play strength at the point of attack sits below the positional standard." },
  ],
  OL: [
    { text: "Arm length is short for tackle; a move inside is the likely long-term projection.", maxHeight: 76 },
    { text: "Height creates real leverage problems against low interior rushers.", minHeight: 80 },
    { text: "Waist-bender — loses his balance when rushers work half his body." },
    { text: "Feet are heavy in space; pulling is not a real part of the current profile.", minWeight: 325 },
    { text: "Anchor gives way against a true bull rush right now.", maxWeight: 300 },
    { text: "Hand placement drifts outside the frame and draws avoidable holding flags." },
    { text: "Faced very little quality pass-rush competition on the schedule.", maxTier: 6.5 },
    { text: "Conditioning shows up late in games, snap count starts to matter." },
    { text: "Pass sets are still a work in progress; he is a run-scheme fit first." },
  ],
  "Edge Defender": [
    { text: "Frame is light for the edge — gets displaced too easily in the run game.", maxWeight: 245 },
    { text: "Will need 20 pounds before he can hold up on early downs at the next level.", maxWeight: 248 },
    { text: "Tight-hipped for the position; does not flatten cleanly to the quarterback.", minHeight: 78 },
    { text: "Wins on effort and length rather than a defined pass-rush plan.", maxTier: 7.0 },
    { text: "One-move rusher — the counter is not there yet on tape." },
    { text: "Run-defense discipline breaks down against misdirection." },
    { text: "Production is heavily front-loaded against lesser competition on the schedule.", maxTier: 6.5 },
    { text: "Pad level rises through contact and he loses the leverage battle." },
  ],
  DT: [
    { text: "Undersized for a true nose; he is a one-scheme, one-position fit.", maxWeight: 300 },
    { text: "Mass comes with a conditioning question — the snap counts are limited.", minWeight: 335 },
    { text: "Pass-rush plan is basic; the bull rush is essentially the entire package." },
    { text: "Gets washed out of gaps whenever he is doubled at the point of attack.", maxWeight: 305 },
    { text: "First step grades average and he rarely plays behind the line of scrimmage.", maxTier: 6.5 },
    { text: "Hand technique is raw for someone with this much playing time already." },
    { text: "Motor runs hot and cold across the course of a full game." },
  ],
  Linebacker: [
    { text: "Undersized to consistently take on guards at the second level.", maxWeight: 228 },
    { text: "Coverage is a real liability right now; a two-down projection at this stage.", maxTier: 6.5 },
    { text: "Takes false steps at the snap and arrives late to the fit." },
    { text: "Stiff in space when asked to redirect and change directions.", minWeight: 250 },
    { text: "Gets caught in the wash and cannot consistently fight through traffic." },
    { text: "Play recognition against play-action is inconsistent on tape." },
    { text: "Tackling technique gets sloppy — leaves his feet far too often." },
    { text: "Blitz timing is close to the only real pass-rush tool he has right now.", maxTier: 7.0 },
  ],
  Cornerback: [
    { text: "Length is short for the position; bigger receivers box him out at the catch point.", maxHeight: 70 },
    { text: "Slight frame raises real durability and run-support questions.", maxWeight: 185 },
    { text: "Long speed is adequate; double moves have beaten him more than once on tape.", maxTier: 7.0 },
    { text: "Hips are tight for a boundary corner — opens early and guesses on routes.", minHeight: 75 },
    { text: "Grabby down the field; will draw flags against tighter NFL officiating.", },
    { text: "Zone eyes wander and he loses track of route distribution.", maxTier: 7.0 },
    { text: "Tackling in run support is avoidance-first rather than physical." },
    { text: "Almost exclusively an off-coverage player at the college level.", maxTier: 7.5 },
  ],
  Safety: [
    { text: "Range is limited; projects as a box-only piece at the next level.", minWeight: 215 },
    { text: "Undersized to play near the line of scrimmage on a full-time basis.", maxWeight: 200 },
    { text: "Takes poor angles in the deep third and gives up the crossing route." },
    { text: "Man coverage against tight ends is a mismatch in the wrong direction.", maxTier: 7.0 },
    { text: "Aggressive to a fault — play-action consistently moves him out of position." },
    { text: "Ball production is thin for someone with this much playing time.", maxTier: 7.0 },
    { text: "Tackling is more collision than technique right now." },
  ],
  "Kicker/Punter": [
    { text: "Range beyond 50 yards is a genuine open question." },
    { text: "Accuracy dipped noticeably during his final season on tape.", maxTier: 6.5 },
    { text: "Small sample of pressure kicks available to evaluate." },
    { text: "Kickoff leg grades average; touchbacks are not automatic." },
    { text: "Operation gets rushed the moment the protection breaks down." },
  ],
};

/* ------------------------------------------------------------------ */
/* Level context — recruiting side                                     */
/* ------------------------------------------------------------------ */

export const HS_CONTEXT_PROS: ScoutingLine[] = [
  { text: "Two-sport athlete — the football-only training age is still very low." },
  { text: "Frame has obvious room for another 20 pounds without losing any movement." },
  { text: "Three-year varsity starter, which is unusual production in this classification." },
  { text: "Played up a classification and never once looked out of place doing it." },
  { text: "Multi-position value gives a college staff more than one plan for the roster." },
  { text: "Best football is clearly still in front of him — the arrow points straight up." },
  { text: "Camp testing backs up what the tape shows, which is not always the case." },
  { text: "Academically qualified and on track to enroll early, a real evaluator plus." },
  { text: "Team captain who visibly sets the tone during warmups.", minTier: 5.0 },
  { text: "Handled double teams and bracket coverage every week and still produced.", minTier: 7.0 },
  { text: "Faced legitimate competition — his region sends players to the league every cycle." },
  { text: "Coach's son; the football IQ shows up in the pre-snap details." },
  { text: "Improved measurably between his junior and senior tape, real trend line." },
  { text: "Durable — has not missed a game in three varsity seasons." },
  { text: "Traits to like across the board; the upside is why he is drawing early buzz.", minTier: 6.5 },
];

export const HS_CONTEXT_CONS: ScoutingLine[] = [
  { text: "Competition level is a genuine question — the region grades out thin.", maxTier: 6.5 },
  { text: "Junior tape is limited by an injury, so the sample is smaller than it looks." },
  { text: "Skinny frame; the college weight program is doing a lot of the projection here.", maxWeight: 205 },
  { text: "Played a position in high school he almost certainly will not play on Saturdays." },
  { text: "Camp performance never matched what the fall tape suggested it would.", maxTier: 6.0 },
  { text: "Late to the position — the technical base is behind his peers in the class." },
  { text: "Basketball-first athlete who may still be splitting his attention." },
  { text: "Testing numbers are unverified outside of his own school's setup." },
  { text: "Motor comes and goes once his team gets comfortably ahead.", maxTier: 7.0 },
  { text: "Rankings have him in a range his actual offer sheet does not support.", maxTier: 6.5 },
  { text: "Development window is tight — he is an older senior in his class." },
  { text: "Will need a redshirt year before he is a realistic game-day option.", maxTier: 6.0 },
  { text: "Missed most of his junior year with a lower-body injury, so evaluators are leaning hard on a thin senior sample." },
  { text: "Played through a shoulder issue for the back half of his senior season that a college medical staff will want to see." },
];

/* ------------------------------------------------------------------ */
/* Level context — pre-draft side                                      */
/* ------------------------------------------------------------------ */

export const NFL_CONTEXT_PROS: ScoutingLine[] = [
  { text: "Three-year starter against a Power-conference schedule, week in and week out." },
  { text: "Production improved every single season, without a single step back." },
  { text: "Team captain, and the staff cites the leadership before they cite the tape." },
  { text: "Clean medical file across his entire college career, a real evaluator plus." },
  { text: "Tested in the top tier at the combine and the workout confirmed the tape.", minTier: 6.5 },
  { text: "Special-teams résumé gives him an immediate roster path on Sundays.", maxTier: 7.5 },
  { text: "Interviews reportedly went even better than the film, which is rare to hear." },
  { text: "Scheme-versatile — the traits do not require one specific system to work.", minTier: 6.0 },
  { text: "Best tape of the season came against the best defense on the schedule." },
  { text: "Declared with eligibility remaining and looked ready to make the jump anyway.", minTier: 7.0 },
  { text: "Position coach has an NFL background and the pro-style install shows on tape." },
  { text: "Handled a transfer and started immediately at the second stop, no lost snaps." },
  { text: "Practice-week reports from the all-star circuit were uniformly strong.", minTier: 6.0 },
  { text: "Age is on his side — he will be one of the younger players in this class.", minTier: 5.5 },
  { text: "Checks a lot of boxes for a program looking for a ready-made, translatable starter.", minTier: 7.5 },
  { text: "A high-floor evaluation with legitimate ceiling still left on the tape.", minTier: 7.0 },
];

export const NFL_CONTEXT_CONS: ScoutingLine[] = [
  { text: "One-year producer; the rest of the résumé grades out thin.", maxTier: 8.5 },
  { text: "Medical file includes a surgery teams will want their own look at before draft day." },
  { text: "Testing numbers came in below the positional standard at the combine.", maxTier: 7.5 },
  { text: "Older prospect — he will turn 24 during his rookie season." },
  { text: "Scheme-specific fit; the wrong system on draft night wastes the pick.", maxTier: 8.0 },
  { text: "Missed the all-star circuit, so the sample against equal talent is small." },
  { text: "Production was heavily schemed — the free releases inflate the raw numbers.", maxTier: 7.5 },
  { text: "Never faced a legitimate NFL-caliber opponent at his position in college.", maxTier: 6.5 },
  { text: "Snap count was managed all season, which raises a real conditioning flag." },
  { text: "Two coordinator changes in four years slowed his technical development." },
  { text: "Off-field questions are the kind teams will do their own homework on.", maxTier: 8.0 },
  { text: "Tape falls off noticeably in the second half of the season.", maxTier: 7.0 },
  { text: "Needs a year on a practice squad before he is a realistic game-day option.", maxTier: 4.5 },
  { text: "A wild card on the board — hard to get a firm read on where he actually goes.", maxTier: 6.5 },
  { text: "Safer evaluation than flashy, and the tape reflects a lower ceiling to match.", maxTier: 6.0 },
  { text: "Carries a lengthy injury history that will draw extra scrutiny in the pre-draft medical exam." },
  { text: "Missed the better part of a season with a lower-body injury, and teams are still waiting on a clean bill of health." },
  { text: "The medical recheck at the combine is the whole ballgame for where he actually gets drafted." },
  { text: "Multiple soft-tissue injuries across his career are the kind of pattern medical staffs flag internally." },
];
