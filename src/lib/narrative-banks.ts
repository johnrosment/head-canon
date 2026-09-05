import type { Position } from "./player-types";

export type NarrativeContext = Record<string, string | number>;

/** Replaces {token} placeholders. Unknown tokens are left untouched. */
export function fill(template: string, context: NarrativeContext): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => {
    const value = context[key];

    return value === undefined ? token : String(value);
  });
}

export type RatingBand = "low" | "mid" | "high";

export function bandFromRating(rating: number): RatingBand {
  if (rating >= 8.2) {
    return "high";
  }

  if (rating >= 5.2) {
    return "mid";
  }

  return "low";
}

/* ------------------------------------------------------------------ */
/* High-school origin story — openings                                 */
/* ------------------------------------------------------------------ */

export const HS_OPENINGS: string[] = [
  "{first} grew up eight minutes from the {hs} field house and knew the {mascot} playbook before he had pads.",
  "{last} showed up at {hs} a skinny freshman with no film and an older brother who never made it.",
  "Everybody in {city} knew the {last} name. {first} is the one who checked every box past eighth grade.",
  "The {hs} staff found {first} in a middle-school gym class and spent four years keeping him in one sport.",
  "{name} took his first varsity snap the night two starters went down in the same quarter.",
  "{city} is a basketball town, which is why {last} spent two years as an afterthought at {hs}.",
  "{first} came up through the {mascot} youth program and never considered playing anywhere else.",
  "{last} transferred into {hs} before his sophomore year and changed what the {mascot} could run.",
  "{name} was the third-string {pos} as a freshman and the only one still on the roster by spring.",
  "There is a photo of {first} at 14 in the {hs} weight room. Nobody believes the before-and-after.",
  "The {mascot} had not won a league title in nineteen years when {last} arrived at 5'6\".",
  "{name} started playing in seventh grade, on a {city} team that went winless.",
  "His mother made him wait for tackle football, so {hs} got him with almost no bad habits.",
  "{last} spent his freshman year on scout team and his sophomore year making the varsity regret it.",
  "{first} was a {city} youth-league legend, which in {state} means the whole county knew the name.",
  "The film that made {name} a name in the {state} recruiting cycle was shot on a phone from the bleachers.",
  "{hs} has sent two players to Division I. {last} spent four years determined to be the third.",
  "{name} showed up to his first {mascot} camp at 152 pounds and left the most explosive player there.",
  "{last} played both lines as a freshman because {hs} did not have the bodies to specialize.",
  "In {city}, Friday nights are the whole economy, and {first} was who people drove in to watch.",
  "{name} was cut from his eighth-grade team. The {hs} staff tells that story to every scout who calls.",
  "The {mascot} moved {last} to {pos} his sophomore spring and never considered moving him back.",
  "{first} grew up two blocks from a Division I campus, sneaking into their spring practices.",
  "{name} is the youngest of four. The other three played at {hs} without a single college look.",
  "{last} came to {hs} from a middle school that did not have a football program at all.",
  "The first evaluator into {hs} for {first} was assumed to be there about someone else.",
  "{name} began as the {mascot}' backup punter and finished the most recruited name in {state}.",
  "There is a version of this where {last} plays mid-major basketball and nobody ever finds out.",
  "{first} was 6'1\" as a freshman, and {city} spent three years waiting on the rest of the frame.",
  "{name} had one offer as a sophomore, from a school that has since fired the coach who made it.",
  "{last} worked summers at a warehouse outside {city} and trained at 5 a.m. before his shifts.",
  "{hs} carries 41 players, which is why {first} played about 90 snaps a night.",
  "The {mascot} were 2-8 before {name} took over and in the state semifinal two years later.",
  "{first} committed to the first school that offered, then spent a year outgrowing that choice.",
  "{name} is the kind of {state} riser who gets found at a 7-on-7 three states from home.",
  "{last} played quarterback, safety and returned kicks because {hs} could not afford to rest him.",
  "The {hs} weight-room record board has {first}'s name on it four times.",
  "{name} did not start until his junior year, which remains the key variable in his projection.",
  "{first} moved to {city} before sophomore year and sat out half a season under transfer rules.",
  "{last} was a 190-pound freshman who told the {hs} staff he would play on Sundays.",
];

/* ------------------------------------------------------------------ */
/* High-school origin story — development beats                        */
/* ------------------------------------------------------------------ */

export const HS_BEATS: string[] = [
  "He moved into the starting lineup midway through his sophomore season and never came off the field again.",
  "A spring growth spurt reshaped his frame, and the staff stopped treating him like a developmental project.",
  "By his junior year the {mascot} were building game plans around one side of the formation.",
  "He spent two summers on the camp circuit before the buzz finally caught up to the tape.",
  "A regional semifinal against the state's top-ranked defense became the tape everyone eventually watched.",
  "The rivalry game his junior year is still the clip that gets passed around {city} group chats.",
  "He added 22 pounds between his sophomore and junior seasons without giving back any short-area burst.",
  "A high-ankle sprain cost him four games as a junior, which is the only reason his junior tape is thin.",
  "The {mascot} moved him everywhere, because leaving him in one spot let defenses key on him.",
  "He tested well enough at a spring camp that two staffs drove out to {city} the following week.",
  "His position coach at {hs} had a decade in the college game and installed a pro-caliber pre-snap routine.",
  "He played through a torn thumb ligament in the playoffs — the kind of detail area scouts write down.",
  "A November quarterfinal in the mud is the game the {hs} staff still shows to freshmen.",
  "He captained the {mascot} as a junior, which the program had not done in over twenty years.",
  "The {hs} staff put him on a strength program in January and he came back in August a different athlete.",
  "He won his flight at a national camp in June and the first Power-conference offer came four days later.",
  "Two years of 7-on-7 in the offseason cleaned up the parts of his game Friday nights never exposed.",
  "He spent his junior offseason working with a private coach in {city} who had trained two NFL players.",
  "The {mascot} lost in the second round three years running, and he is the reason they were even there.",
  "He set the {hs} single-game record in a Week 4 blowout, then apologized for the running clock.",
  "A midseason position change unlocked everything — the production doubled inside five weeks.",
  "The {city} paper ran a full page on him, and the highlight reel found its first 10,000 views.",
  "He played the entire second half of his junior year with a brace on his left knee.",
  "Coordinators started scheming him out of games, and that tape is oddly the most convincing evidence.",
  "He weighed 214 pounds at his junior evaluation and 236 pounds at his senior opener.",
  "The {mascot} played a national schedule his senior year specifically to get him seen.",
  "He was the only underclassman invited to a regional showcase in {state} his sophomore spring.",
  "Winter track was the difference — the testing numbers he posted in February changed how staffs read him.",
  "He was benched for a half as a sophomore for missing a workout and has not missed one since.",
  "A four-touchdown night against the eventual state champion is what put him on the national board.",
  "The {hs} staff started limiting his snaps in blowouts because the score got out of hand so fast.",
  "He learned three positions in one offseason after the {mascot} lost six seniors to graduation.",
  "His senior film opens with a play he finished 40 yards from where he lined up.",
  "Camp evaluators kept writing the same note: the frame has real room left on it.",
  "He committed in July, decommitted in November, and handled both news cycles better than most adults would.",
  "The {mascot} went to overtime three times his senior year and he touched the ball on every snap that mattered.",
  "A hamstring injury in the spring of his junior year cost him the entire camp circuit.",
  "He played both ways in the playoffs because the {hs} staff had no other option left.",
  "By October of his senior year, teams were kicking away from him and running away from his side.",
  "He closed a 12-game senior season without a single missed assignment on the coaching staff's grade sheet.",
  "The {hs} strength coach still uses his squat progression as the program's blueprint.",
  "Two of his teammates drew offers off the back of his film, which is the kind of detail staffs notice.",
  "He was voted team MVP as a junior over a senior who ended up signing at a Power program.",
  "A cross-state showcase in June is where the national recruiting media finally caught up to him.",
  "He spent his last two summers running youth camps in {city} and got noticeably sharper explaining the game.",
  "His junior tape and senior tape read like two different evaluations, which is exactly the point.",
  "The {mascot} ran the same play at him eleven times in the playoff opener and it never worked once.",
  "He is the only player in {hs} history to start on both sides of the ball in a state final.",
  "The staff moved him to a new spot in Week 6, and he graded out as the best player on the field by Week 8.",
  "He played the last month of his senior season at roughly 85 percent and it barely showed on tape.",
  "A viral one-handed catch in September did more for his recruitment than two years of consistent tape.",
  "The {hs} coaching staff still calls his senior year the best individual season they have ever coached.",
  "He never lost a rep in one-on-ones at a national camp, and the clip still circulates.",
  "His last regular-season game ended with the opposing coach crossing the field to shake his hand.",
];

/* ------------------------------------------------------------------ */
/* High-school origin story — closings                                 */
/* ------------------------------------------------------------------ */

export const HS_CLOSINGS: string[] = [
  "He finished his senior year as the most complete player on the field on most Friday nights in {state}.",
  "By signing day, the projection was simple: give him a college weight program and see what is left.",
  "He closed his career at {hs} with a district title and a frame that was clearly not finished growing.",
  "The senior tape was clean enough that questions about talent gave way to questions about scheme fit.",
  "He left {hs} as the program's most decorated player since the early 2000s.",
  "The senior season answered the durability question and raised a much better one about the ceiling.",
  "Evaluators left {city} agreeing on the traits and disagreeing about how fast they translate on Saturdays.",
  "He graduated early to enroll in January, which told everyone how seriously he took the next step.",
  "The last three games of his senior year were the best football anyone in the county had seen in a decade.",
  "He signed in December and was in a college weight room before his classmates finished the semester.",
  "The {mascot} retired his number, which for a program that age is not a small gesture.",
  "He left {city} with the school records and a very short list of people who thought he was finished improving.",
  "Recruiting analysts spent his senior year arguing about his ranking and never once about his tape.",
  "The final evaluation read like a bet on the frame as much as a bet on the production.",
  "He walked out of {hs} with a body that already looked collegiate and a technique base still catching up.",
  "His senior year ended in a state semifinal loss that the {city} paper covered like a wake.",
  "By the end, the only real question was which position a college staff would let him keep.",
  "He committed on a Tuesday in a nearly empty {hs} gym and asked the staff not to make it a ceremony.",
  "The staff's parting evaluation was two words: not finished.",
  "He left as the best player any of those coaches had ever put on a field, and they had coached a long time.",
  "The projection was never complicated — add weight, keep the speed, let him play fast.",
  "He ended his high-school career with more college interest than the previous five {hs} classes combined.",
  "Nobody in {city} was surprised by where he signed. Plenty were surprised by who else was in it.",
  "He finished the year as an all-state selection and the least surprised person in the room about it.",
  "His last game at {hs} drew more college assistants than the {mascot} usually draw fans.",
  "The tape closed the argument. The measurements reopened it, which is how these things always go.",
  "He spent his final semester adding weight on purpose and lost nothing off his timed speed doing it.",
  "By February he was already enrolled, already in the install, and already ahead of his class.",
  "He left {hs} without a single bad season, which is rarer than the highlight reel makes it look.",
  "The last thing his {hs} coach told recruiters was that they were getting the best worker in the building.",
  "He signed with the program that wanted him since his sophomore film, and the loyalty was the whole story.",
  "His senior season was good enough to end the debate and short enough to leave people wanting more.",
  "The {mascot} have not replaced him. Three years later, they are still not close.",
];

/* ------------------------------------------------------------------ */
/* Recruiting / offer-market story                                     */
/* ------------------------------------------------------------------ */

type RecruitingBank = {
  found: string[];
  rise: string[];
  pitch: string[];
  scope: string[];
};

export const RECRUITING_BANKS: Record<RatingBand, RecruitingBank> = {
  low: {
    found: [
      "Area recruiters found him on a junior-varsity cutup a {hs} assistant mailed out unprompted.",
      "His first real contact came from a {topOffer} grad assistant in {state} to see somebody else entirely.",
      "He was a name on a regional board for two years before anybody scheduled a home visit.",
      "The first coach through the door at {hs} was recruiting a teammate and left asking about {last}.",
      "A {topOffer} area scout stopped in {city} on the way back from a bigger evaluation and stayed the practice.",
      "His {hs} coach called in a favor with an old {topOffer} colleague just to get the film watched at all.",
      "He got found the way most players at this level do — a staff needed a body and started asking around.",
      "The first offer came from a program that had signed two players out of {city} in the previous decade.",
      "He filled out a recruiting questionnaire in September and heard back from four schools the same week.",
      "A regional camp in {state} put him on a list, and that list is the only reason anybody called.",
      "His tape sat at 300 views until a {state} analyst posted it in a thread about overlooked seniors.",
      "The {hs} staff sent film to 40 programs. Six responded, and three of those were form letters.",
      "Everybody who eventually offered had driven through {city} before, just never stopped for him specifically.",
      "In a town the size of {city}, word of mouth from the {hs} staff is still how most of this starts.",
      "The nearest FBS staff to {city} is the one that found him first, which is how it usually goes at this level.",
    ],
    rise: [
      "A strong senior October moved him from a preferred-walk-on chat to a real scholarship conversation.",
      "One spring camp performance in front of three staffs did more for his stock than two years of film.",
      "He never had a signature summer, so the offers came late and arrived in a cluster.",
      "The offers landed after Thanksgiving, once staffs finished missing on higher-rated targets.",
      "He grew an inch and a half between June and December, which quietly rewrote his entire evaluation.",
      "Two schools offered inside the same 48 hours in January — a classic sign of a late film cycle.",
      "The rise, such as it was, came from testing numbers rather than the fall tape.",
      "A strong senior-night showing in front of a visiting coordinator changed the tone of his recruitment.",
      "He was a fallback option for two staffs and became a priority for one of them by December.",
      "The board did not really move until he committed and rival schools started calling to check.",
      "His entire recruitment lived in the last eight weeks before signing day.",
      "He landed his best offer the week after a higher-rated prospect at his spot picked somewhere else.",
    ],
    pitch: [
      "Every pitch here is a development pitch: two years in the weight room and a redshirt to finish the frame.",
      "Staffs are selling scheme fit and a defined role rather than stars or national rankings.",
      "The sell is opportunity — he can be on the two-deep as a true freshman at this level.",
      "Coaches like the floor: immediate special-teams value, a starter's body by year three.",
      "One staff is pitching a position change that would take real patience from both sides.",
      "There is no meaningful NIL conversation here, and everybody involved already knows it.",
      "The pitch is proximity — his family can drive to every home game without missing work.",
      "One program is selling a coordinator who has developed three players out of nearly identical profiles.",
      "Coaches keep using the word project, which he has decided to wear as a compliment.",
      "The pitch is opportunity: the position room graduates three seniors after next season.",
      "Staffs are upfront about the redshirt, and he seems to prefer that to being oversold.",
      "The best offer on his board comes with an academic package that matters as much as the football one.",
    ],
    scope: [
      "This is a regional recruitment. The board never left {state} and the two states next to it.",
      "The market stayed local, exactly how the {hs} staff figured it would go.",
      "He is a G5 and FCS target with no realistic Power-conference pressure on the timeline.",
      "The recruitment is quiet, close to home, and likely decided by whichever staff visits last.",
      "Three schools are in it, all within a four-hour drive of {city}.",
      "Nobody outside the region has called, and the {hs} staff stopped expecting them to in October.",
      "His entire recruitment happened over the phone and in one living room in {city}.",
      "It is a two-team race between a G5 program and an FCS program offering a bigger role.",
      "The board is small enough that he knows every assistant on it by first name.",
      "This is the kind of recruitment that gets settled by whichever staff keeps calling in January.",
      "He took two official visits and paid his own way to a third.",
      "The recruitment never generated a single national headline, which suits him just fine.",
      "Everyone involved understands this is a {state} kid who is going to end up at a {state} school.",
      "{city} will get to watch almost every game he plays in college, and that mattered to his family.",
      "This is small-town recruiting — three assistant coaches, one gas station, and a lot of repeat visits.",
    ],
  },
  mid: {
    found: [
      "He built his board the honest way, camping at four schools in one June and drawing offers from three.",
      "A regional recruiting analyst slotted him into a summer top-25 for {state} and the phone started ringing.",
      "Two Power-conference staffs offered inside the same week after his junior film hit the portal of tape.",
      "He had a standing G5 offer since sophomore spring, which gave him leverage to be patient.",
      "The {topOffer} staff offered first and spent the next eight months defending that position on the board.",
      "A coordinator watched him at a satellite camp in {state} and called his {hs} coach from the parking lot.",
      "He showed up unranked to a national camp in June and left with three new offers and real buzz.",
      "His junior tape got passed between two staffs on the same conference call — how these things spread.",
      "A regional analyst wrote 400 words about him in July, and the offer count doubled inside a month.",
      "He was the second-best player on his own team as a sophomore, which is why the discovery took so long.",
      "The first Power-conference coach to see him in person came to {city} for a teammate and left with two names.",
      "A strong showing at a spring showcase in {state} moved him onto boards three states away.",
      "{city} does not produce a Power-conference prospect every year, so this recruitment got noticed locally fast.",
    ],
    rise: [
      "His junior-to-senior jump is the entire story — the rankings had not caught up when the offers started.",
      "A six-catch, three-touchdown regional playoff game rewrote his offer sheet in one night.",
      "He tested in the top tier at a spring camp and the credible programs moved within days.",
      "The rise was steady rather than explosive, which is why his board runs deep instead of top-heavy.",
      "He added a Power-conference offer in each of the last three months of his recruitment.",
      "Two schools that passed in the spring came back in November with real offers.",
      "His stock moved every time he played a ranked opponent, which happened four times.",
      "A late-season position change made him a more interesting evaluation for every staff on his list.",
      "He was a three-star in June and a high three-star with a Power-conference board by December.",
      "The rise came with a decommitment, which is how his recruitment finally turned competitive.",
      "His senior film did most of the heavy lifting — the junior tape had been easy to overlook.",
      "The offer list grew slowly, then all at once, after a nationally televised October game.",
    ],
    pitch: [
      "The pitch from every staff is the same: early rotational snaps, a starting job by year two.",
      "One school is selling a position change; the rest want him exactly where {hs} plays him now.",
      "There is a real NIL package at the top of his board, though nothing life-changing.",
      "Staffs are pitching him on one trait they believe becomes special with college coaching.",
      "Two coordinators have shown him install tape with his name written into the personnel groupings.",
      "The pitch at the top of his board is a two-deep with nobody older than a sophomore at his spot.",
      "One staff is selling development history; another is selling immediate snaps. He is weighing both fairly.",
      "The NIL money is real but modest, and every staff has been upfront about the number.",
      "A position coach with a track record at his exact profile is the entire pitch from the leader in the clubhouse.",
      "He has been promised a package of designed touches, which he has learned to be skeptical of.",
      "Staffs are pitching the conference schedule as hard as the program itself.",
      "The developmental pitch and the playing-time pitch are coming from different schools, and that is the whole decision.",
    ],
    scope: [
      "It is a regional race with one national program hovering on the edge of it.",
      "Three schools are genuinely in it, all within a six-hour drive of {city}.",
      "The recruitment is competitive without turning into a circus, which suits him fine.",
      "He took all five official visits and reported back that two of them were formalities.",
      "The board is mostly regional with one outlier program from the other side of the country.",
      "Two conferences are represented on his final list, and both make geographic sense.",
      "His recruitment drew a modest crowd of local media and exactly zero national attention.",
      "The final four are all programs that have signed a player out of {city} in the last five years.",
      "He is the highest-rated prospect at {hs} in a decade, and the market is treating him accordingly.",
      "The race narrowed to two in November and stayed there through the December signing window.",
      "One staff flew a head coach in for an in-home visit, which settled a lot of it.",
      "The recruitment is regional by choice — he cut two national programs over distance alone.",
      "Staying close to {city} was never a stated priority, but every program on his short list happens to be.",
    ],
  },
  high: {
    found: [
      "National recruiters had him circled by his sophomore spring, before he played a full varsity season at {pos}.",
      "He was a priority target on every board in the region the day his junior film went public.",
      "The first offer came from {topOffer} before he turned 16, and the rest of the country followed within a month.",
      "Elite-camp invitations arrived unsolicited, which is the clearest tell in this whole process.",
      "He had 20 offers before his junior season started and stopped announcing them individually.",
      "Two national recruiting analysts had him in their top 50 before he ever attended a camp.",
      "Head coaches were showing up to {hs} spring practice, which the staff had never seen before.",
      "He was invited to three national events as a sophomore and won all three sessions.",
      "His film was already being dissected on national recruiting shows before his junior season ended.",
      "The {topOffer} staff made him their number-one target at the position in back-to-back cycles.",
      "He was the first player in {hs} history offered by a program in every Power conference.",
      "Recruiting services had him ranked before his own school newspaper had written a word about him.",
    ],
    rise: [
      "He won his session at a national elite camp and the offer count doubled inside a week.",
      "There was no rise to speak of — he has topped the {state} board since the day he arrived at {hs}.",
      "Head coaches, not coordinators, were the ones flying into {city} personally.",
      "He shut his recruitment down early, reopened it in November, and every staff came sprinting back.",
      "He climbed from a top-100 name to a top-15 name over one summer of camp performances.",
      "His senior tape did not move his ranking, because there was nowhere left for it to go.",
      "Two rival staffs both moved on position coaches over how his recruitment was handled internally.",
      "The rise happened inside one nationally televised game in September of his junior year.",
      "He went from a regional priority to a true national one after a single one-on-one rep in July.",
      "A viral camp rep in June put him on every recruiting front page in the country.",
      "By his senior opener, the only real question was which four schools would make the final cut.",
      "He was the consensus top player at his position in the country by the end of the summer circuit.",
    ],
    pitch: [
      "The NIL package at the top of his board is substantial and structured across multiple years.",
      "Every staff is promising day-one snaps, and at least two of them are telling him the truth.",
      "Coordinators are showing him install tape and telling him exactly which packages were built for him.",
      "He is being recruited as a program-changing piece, not as a roster addition.",
      "Two collectives have made competing multi-year offers, and both have leaked publicly.",
      "One head coach told him he would build the offense around him, on the record, in his living room.",
      "The pitch includes a jersey number that has not been issued at that program in fifteen years.",
      "Staffs are pitching him on a two-year college runway and an early draft exit.",
      "He has been promised the starting job in writing, which is as close to a lock as recruiting gets.",
      "A program flew his entire family in for a game-day visit and put them on the field for warmups.",
      "The NIL conversation has been handled by an agent since his junior year.",
      "Every pitch involves a direct comparison to a former player at that school who is now in the league.",
    ],
    scope: [
      "This is a national recruitment. Three time zones, and the in-state school is not the favorite.",
      "He is the highest-rated prospect out of {city} in twenty years, and the market reflects it.",
      "The final list is national, elite, and functionally impossible to fake interest in.",
      "Anyone still saying they are in it after his last official visit is doing public relations.",
      "His commitment will be televised, which tells you everything about the scale of this recruitment.",
      "The final four programs have combined for six national titles — that is the level he is operating at.",
      "Every school on his list has produced a first-round pick at his position in the last decade.",
      "The recruitment has been covered nationally since his sophomore year and has never slowed down.",
      "The in-state program is in it, but only because they are genuinely elite, not because of geography.",
      "He is fielding calls from head coaches on a schedule his family had to formally organize.",
      "Two programs have been recruiting him since middle school, which is legal and still slightly unsettling.",
      "The national recruiting analysts covering his decision have already whiffed on it twice.",
      "The favorite has been chalk since the summer — everyone is just waiting on the paperwork.",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* College career narrative                                            */
/* ------------------------------------------------------------------ */

export const COLLEGE_OPENINGS: string[] = [
  "He enrolled at {college} in January and spent his first spring hearing he was not close to ready.",
  "{college} redshirted him immediately and put him on a 20-pound gain plan.",
  "He played 180 special-teams snaps as a true freshman at {college} and almost nothing else.",
  "The {college} staff moved him within a month of his arrival, and the new spot fit him better.",
  "He was the fourth {pos} on the {college} depth chart in August and the second by the bowl game.",
  "His first season at {college} was mostly a weight-room story; the tape from that spring is unrecognizable now.",
  "{college} threw him into the rotation in week three after an injury, and he never gave the job back.",
  "He arrived at {college} 18 pounds lighter than his listed weight and spent a year fixing that.",
  "The {college} staff told him he would redshirt, then played him in the opener out of necessity.",
  "He spent his first fall at {college} on the scout team, where he reportedly made life miserable for the starters.",
  "{college} signed three players at his position in his class, and he was the third-rated one of the group.",
  "His freshman year at {college} ended with 42 snaps and a very clear plan for the offseason.",
  "He was the only true freshman on the {college} travel roster at his position.",
  "The {college} strength staff still cites his first-year body-composition numbers as a program example.",
  "He came to {college} a quiet kid out of {city} and left the loudest voice in the position room.",
  "A coaching change in his first offseason at {college} nearly sent him into the portal before he ever played.",
  "{college} asked him to add weight, and he showed up in August 24 pounds heavier without losing a step.",
  "He tore a labrum in his first college camp and did not play a snap that season.",
  "The {college} staff put him in the two-deep in August and never seriously considered pulling him.",
  "He started his college career behind a senior who ended up getting drafted, which delayed everything by two years.",
  "{college} played him at three positions in his first two seasons before settling on one.",
  "He was academically ineligible for one game as a freshman and has spoken about it publicly since.",
  "The plan at {college} called for two years of development. He beat that timeline by a full season.",
  "He arrived on campus the highest-rated signee in the class and the least experienced player in the room.",
  "{college} put him on the field immediately because the alternative graded out worse.",
  "His first college start came on the road in a hostile environment, and the staff still brings it up.",
  "He spent his first two seasons at {college} in the room behind two future professionals.",
  "The {college} coaching staff had him in a rotational role by October of his true freshman year.",
];

/** Used instead of a standard opening when the player transferred. */
export const COLLEGE_TRANSFER_OPENINGS: string[] = [
  "He arrived at {college} with two years of starts on tape and was treated like a veteran immediately.",
  "The transfer to {college} is the hinge of his career — the role he was promised is the role he got.",
  "He landed at {college} in the winter portal window and was running with the first unit by the spring game.",
  "{college} recruited him out of the portal harder than most staffs recruit high-school seniors.",
  "The move to {college} put him in a scheme that finally asked him to do what he actually does well.",
  "He entered the portal on a Monday and had a {college} offer by Wednesday.",
  "{college} was the third school to call and the only one offering the job outright.",
  "He transferred up a level and did not look remotely out of place doing it.",
  "The first stop taught him how to practice. {college} is where that habit started producing.",
  "He left a program where he had started eleven games because {college} offered a bigger stage and took it.",
  "The portal move cost him a year of eligibility on paper and bought him two rounds on draft night.",
  "He arrived at {college} in June, learned the install in eight weeks, and started the opener.",
  "Coaches at {college} say the transition was the smoothest they have had with a portal addition.",
  "The transfer was about scheme, not playing time — he was already starting where he came from.",
];

export const COLLEGE_BEATS: string[] = [
  "The jump came between his second and third seasons, when the game visibly slowed down for him.",
  "He took over as a full-time starter in the fall and led the position group in snaps by October.",
  "A new coordinator built a package specifically for him in the spring, and the production followed.",
  "His role expanded every month — situational to rotational to essential inside of one season.",
  "Two conference road games are the reason NFL area scouts started sending in reports on {college} practices.",
  "He played the last five games of the year through a shoulder issue that would have shelved most of the roster.",
  "The technique cleanup is the real story: the traits were always there, the footwork was not.",
  "He handled the full mental load by his third year — protections, checks, and the communication nobody credits.",
  "His best game came against the best defense on the schedule, which is not a small detail on a résumé.",
  "He was voted a team captain, and the {college} staff cites it before they cite any of the production.",
  "A midseason scheme change put him in position to make more plays, and he immediately made them.",
  "He led {college} in snaps at his position for two consecutive seasons.",
  "The staff started using him in packages nobody had drawn up for him a year earlier.",
  "He was the only player on the roster who never came off the field in the fourth quarter.",
  "His production against ranked opponents is materially better than his production against everybody else.",
  "He missed three games with a high-ankle sprain and came back to post his best two performances of the year.",
  "The {college} staff moved him to a new alignment in the spring and the numbers jumped 40 percent.",
  "He spent an offseason working with a private coach and came back with an entirely new technical base.",
  "A conference title game performance is the tape every evaluator opens first.",
  "He graded out as the highest-rated player on the {college} defense in five of twelve games.",
  "The coaching staff trusted him with the green dot in his final two seasons.",
  "He was double-teamed on roughly a third of his snaps as a senior, and the production held up anyway.",
  "His snap count nearly doubled between his sophomore and junior seasons.",
  "He played through a broken hand for a month, which is the story his position coach leads with.",
  "The {college} staff credits a film-study habit that started in his second year on campus.",
  "He never missed a practice in his last two seasons, which at his position is genuinely unusual.",
  "A nationally televised night game in October is where the draft conversation actually started.",
  "He set the {college} single-season record at his position and did it in eleven games.",
  "The improvement in his second full year as a starter is the most convincing thing on his résumé.",
  "He turned down a chance to sit out the bowl game and played 60 snaps in it anyway.",
  "His conditioning became a strength rather than a question somewhere around his third season.",
  "He added a genuine counter move to his game in the offseason, and the sack numbers doubled.",
  "Coaches began using him as the example in position meetings for younger players.",
  "He was the only player at his position to start every game across three seasons.",
  "The staff asked him to play out of position for four games due to injuries, and he did it without complaint.",
  "His third-down usage rate led the roster by a wide margin.",
  "He recorded production in every single game of his final season — the kind of consistency scouts flag.",
  "A rivalry-game performance in November is what pushed him from a day-two name to a day-one conversation.",
  "He made the conference's all-academic team three times, which teams genuinely do notice.",
  "The {college} staff moved a returning starter to accommodate him, which tells you what they thought of him.",
  "He worked his way from special teams to a starting role without ever hitting the portal.",
  "His pass-protection grade improved every year on campus, the least glamorous good sign there is.",
  "He handled a full position change in his final offseason and still graded out as a starter.",
  "Two different coordinators built game plans around the same trait, which is a real signal for evaluators.",
];

export const COLLEGE_CLOSINGS: string[] = [
  "The traits translate cleanly. The question is whether the technique holds up against NFL length.",
  "He leaves {college} with a professional body, a professional routine, and a defined positional identity.",
  "Scouts see a plug-and-play starter inside of two years, with special-teams value in the meantime.",
  "He is being drafted for what he already does well, not for what he might eventually become.",
  "There is real developmental upside left, which is unusual for a prospect this far along mechanically.",
  "The floor is a long-term rotational piece. The ceiling is why people keep re-watching the tape.",
  "He declared with eligibility remaining, and no evaluator in the building argued against the decision.",
  "The medicals are clean and the interviews reportedly went even better than the tape did.",
  "He leaves as one of the most productive players in program history at the position.",
  "The evaluation comes down to whether a staff believes the last twelve games or the first thirty.",
  "He is a scheme-specific fit, and the right room could get a genuine starter out of a mid-round pick.",
  "The consensus is that he sits closer to his ceiling than most prospects in this range of the class.",
  "His pro day answered the speed question the fall tape had left open.",
  "Teams are split on the position he ultimately plays, which is either flexibility or a red flag depending who you ask.",
  "He will land somewhere between where the tape says and where the testing says, as always happens.",
  "The résumé checks every box: production, durability, leadership, and a clean file.",
  "He finished college a far better player than his recruiting ranking ever suggested he would be.",
  "Every team that scouted him came away with the same note about his practice habits.",
  "The tools are obvious. The consistency is the whole conversation in the draft room.",
  "He leaves {college} having outperformed his signing-day expectations by a wide margin.",
  "The final evaluation reads like a bet on the person as much as a bet on the player.",
  "He is the type who becomes somebody's favorite roster spot within two years.",
  "The floor is high enough that a worst-case outcome still looks like a long career as a backup.",
  "Nobody who watched him at {college} believes he is finished improving.",
  "The projection is starter — the only real disagreement in the room is about the timeline.",
  "He is the kind of prospect who tests average, grades well on tape, and outplays his eventual draft slot.",
  "Teams will spend the spring deciding whether the production or the traits are the real evaluation.",
  "He goes into the draft with a defined role, a clean medical file, and no real off-field questions.",
  "He checks a lot of boxes for a program looking for a translatable, plug-in-day-one starter.",
  "The tape is translatable enough that scheme fit barely enters the conversation.",
  "He is a safer selection than most in his range, with a lower ceiling to match the certainty.",
  "The traits alone would make him a wild card on the board; the tape is what settles it.",
];

/** Used when the development arc went the wrong way, so the close matches the story. */
export const COLLEGE_CLOSINGS_DOWN: string[] = [
  "He leaves {college} as a projection rather than a finished product, which is not where anyone expected this to end.",
  "Teams will draft the traits and hope a different building gets more out of them.",
  "The evaluation is a bet that the right coaching staff finds what {college} could not.",
  "He is a developmental pick now, and everyone involved has made peace with that reality.",
  "The floor is a backup and a special-teams contributor. The ceiling is the argument teams will have internally.",
  "Scouts keep going back to the high-school tape, which is rarely a good sign this late in a career.",
  "He will be somebody's fourth-day-of-camp surprise or he will not make a roster at all.",
  "The tools are still in there. Four years of evidence against him is the real problem.",
  "He leaves {college} with more questions than he arrived with, which is the whole story in one line.",
  "The medical file and the missed time will decide where he actually comes off the board.",
  "There is a version of this player who plays a decade. There is a version who never dresses.",
  "He is a project again, at 22, which is a hard sell in the back half of a draft class.",
];

/**
 * Production notes. These live in the college narrative, not underneath the
 * stat line — a stat line should be numbers and nothing else.
 */
export const COLLEGE_PRODUCTION_BEATS: string[] = [
  "He put his numbers up against a schedule with three top-25 defenses on it.",
  "The production came in a run-first system that capped his volume all year.",
  "He posted his best totals while missing two games in the middle of the season.",
  "Almost all of his production came after the coaching change in October.",
  "The efficiency numbers are better than the counting stats, which is his camp's whole argument.",
  "He produced as the clear focal point of every opposing game plan.",
  "His volume was modest by design — he shared a room with another draftable player.",
  "The counting stats undersell him; the per-snap numbers led the conference outright.",
  "He did it behind a line that started six different combinations across the year.",
  "Roughly 40 percent of his production came in the final four games of the season.",
  "He saw double coverage on a third of his routes and the numbers held up anyway.",
  "He was on a snap count for the first month and still led the team in production by December.",
  "His final line is a program record, and the man who held it before him is in the league.",
  "Two of his best games came in the biggest environments on the schedule.",
];

/* ------------------------------------------------------------------ */
/* Development arc flavour                                             */
/* ------------------------------------------------------------------ */

export const ARC_BEATS: Record<string, string[]> = {
  generational: [
    "Nobody recruited him for this. The player he became at {college} bears almost no resemblance to the recruit.",
    "He is the reason coaching staffs keep taking swings on unranked kids with good frames.",
    "The gap between his recruiting profile and his draft profile is the largest in this class.",
    "Three years of development turned an afterthought into the best player on a good team.",
    "His high-school evaluation is now a case study in what film cannot tell you about a 17-year-old.",
  ],
  breakout: [
    "The breakout came a year later than the staff expected and was worth the wait.",
    "He outplayed his recruiting ranking by a full tier, which the {college} staff predicted and nobody else did.",
    "The player who signed at {college} and the player who declared are not the same evaluation at all.",
    "His development curve turned sharply upward in year three and never came back down.",
    "He was a fallback signing who became a priority draft-day name.",
  ],
  riser: [
    "He got a little better every season, which is less dramatic and more reliable than a breakout.",
    "The improvement was incremental and constant — nothing about his rise was sudden.",
    "He signed as a solid prospect and leaves as a clearly better one.",
    "Each offseason added something specific, and the tape reflects every bit of it.",
  ],
  advertised: [
    "He is essentially the player he was projected to be, on schedule and without drama.",
    "The recruiting evaluation held up almost exactly, which happens more often than the internet suggests.",
    "No surprises here — the traits that got him recruited are the traits getting him drafted.",
    "He did what was expected of him, every year, without a single wasted season.",
    "He is close to chalk at this point — the evaluation has not moved in three years.",
  ],
  underwhelmed: [
    "The production never quite matched the billing, and staffs have spent three years explaining why.",
    "He was good. The recruiting profile said great, and that gap follows him into the draft.",
    "The tools showed up in flashes rather than across full games.",
    "He was a starter for three years without ever being the best player on his own field.",
  ],
  injuries: [
    "Two seasons were interrupted by injuries, and the healthy tape is genuinely good.",
    "The medical file is the entire conversation — the player, when available, was excellent.",
    "He missed 14 games across three years, which is the only thing keeping him out of the first round.",
    "Availability became the defining question of his college career through no real fault of his own.",
  ],
  stalled: [
    "The development just never came. He is close to the same player he was as a freshman.",
    "Three coordinators, two position coaches, and no meaningful technical progress to show for it.",
    "The staff kept waiting for the leap and it never arrived.",
    "He plateaued after his second season, and the tape has looked the same since.",
  ],
  bust: [
    "He was one of the highest-rated players in his recruiting class and never started a full season.",
    "Something went wrong between signing day and now, and nobody involved will say what on the record.",
    "The recruiting ranking is now the least useful piece of information in his file.",
    "He lost his job twice, hit the portal once, and finished a rotational player.",
  ],
};

/* ------------------------------------------------------------------ */
/* Stat-line templates                                                 */
/* ------------------------------------------------------------------ */

/**
 * Stat lines read as stat lines, not sentences — quicker to scan and short
 * enough to sit on one row next to everything else.
 */
export const HS_STAT_TEMPLATES: Record<Position, string[]> = {
  QB: [
    "{pyds} pass yds · {ptd} TD · {int} INT · {comp}% · {ryds} rush yds",
    "{comp}% · {pyds} yds · {ptd} TD · {int} INT",
  ],
  RB: [
    "{ryds} rush yds · {carries} car · {rtd} TD · {rec} rec",
    "{ryds} yds · {rtd} TD · {rec} rec, {recyds} yds",
  ],
  WR: [
    "{rec} rec · {recyds} yds · {rectd} TD",
    "{rec} rec · {recyds} yds · {rectd} TD · {ryds} rush yds",
  ],
  TE: [
    "{rec} rec · {recyds} yds · {rectd} TD",
    "{rec} rec · {recyds} yds · {snaps} in-line snaps",
  ],
  OL: [
    "{snaps} snaps · {pancakes} pancakes · {sacksAllowed} sacks allowed",
    "{grade}% grade · {snaps} snaps · {sacksAllowed} sacks allowed",
  ],
  "Edge Defender": [
    "{sacks} sacks · {tfl} TFL · {tkl} tkl · {ff} FF",
    "{sacks} sacks · {tfl} TFL · {qbh} QB hits",
  ],
  DT: [
    "{tkl} tkl · {sacks} sacks · {tfl} TFL · {ff} FF",
    "{tfl} TFL · {sacks} sacks · {qbh} QB hits",
  ],
  Linebacker: [
    "{tkl} tkl · {tfl} TFL · {sacks} sacks · {ints} INT",
    "{tkl} tkl · {tfl} TFL · {ff} FF",
  ],
  Cornerback: [
    "{ints} INT · {pbu} PBU · {tkl} tkl",
    "{ints} INT · {pbu} PBU · {targets} targets",
  ],
  Safety: [
    "{tkl} tkl · {ints} INT · {pbu} PBU · {tfl} TFL",
    "{tkl} tkl · {ints} INT · {ff} FF",
  ],
  "Kicker/Punter": [
    "{fg}/{fga} FG · long {long} · {touchbacks} TB",
    "{fg}/{fga} FG · {punts} punts, {punt} avg",
  ],
};

export const COLLEGE_STAT_TEMPLATES: Record<Position, string[]> = {
  QB: [
    "{pyds} pass yds · {ptd} TD · {int} INT · {comp}% · {ryds} rush yds",
    "{comp}% · {pyds} yds · {ptd} TD · {int} INT · {games} starts",
  ],
  RB: [
    "{ryds} rush yds · {ypc} ypc · {rtd} TD · {rec} rec",
    "{carries} car · {ryds} yds · {rtd} TD · {recyds} rec yds",
  ],
  WR: [
    "{rec} rec · {recyds} yds · {rectd} TD",
    "{rec} rec · {recyds} yds · {ypr} avg · {rectd} TD",
  ],
  TE: [
    "{rec} rec · {recyds} yds · {rectd} TD",
    "{rec} rec · {recyds} yds · {snaps} in-line snaps",
  ],
  OL: [
    "{snaps} snaps · {sacksAllowed} sacks allowed · {pressures} pressures",
    "{games} starts · {grade}% grade · {sacksAllowed} sacks allowed",
  ],
  "Edge Defender": [
    "{sacks} sacks · {tfl} TFL · {tkl} tkl · {qbh} QB hits",
    "{sacks} sacks · {pressures} pressures · {snaps} rush snaps",
  ],
  DT: [
    "{tkl} tkl · {sacks} sacks · {tfl} TFL · {qbh} QB hits",
    "{tfl} TFL · {pressures} pressures · {sacks} sacks",
  ],
  Linebacker: [
    "{tkl} tkl · {tfl} TFL · {sacks} sacks · {pbu} PBU",
    "{tkl} tkl · {tfl} TFL · {ints} INT · {ff} FF",
  ],
  Cornerback: [
    "{ints} INT · {pbu} PBU · {tkl} tkl · {targets} targets",
    "{pbu} PBU · {comp}% allowed · {ints} INT",
  ],
  Safety: [
    "{tkl} tkl · {ints} INT · {pbu} PBU · {tfl} TFL",
    "{tkl} tkl · {ints} INT · {ff} FF",
  ],
  "Kicker/Punter": [
    "{fg}/{fga} FG · long {long} · {touchbacks} TB",
    "{punts} punts · {punt} avg · {inside20} inside 20",
  ],
};

/* ------------------------------------------------------------------ */
/* Accolades                                                           */
/* ------------------------------------------------------------------ */

export const HS_ACCOLADE_BANKS: Record<RatingBand, string[]> = {
  low: [
    "All-league honorable mention",
    "Two-year varsity letterman",
    "Team captain as a senior",
    "All-district second team",
    "{mascot} most improved player",
    "All-county selection",
    "Team MVP as a senior",
    "Academic all-conference",
    "Scout-team player of the year as a sophomore",
    "All-area honorable mention",
    "{hs} iron-man award",
    "Special-teams player of the year",
  ],
  mid: [
    "First-team all-district",
    "All-state second team",
    "Conference player of the year",
    "Two-time all-conference selection",
    "Regional camp MVP",
    "{city} area player of the year",
    "Team captain, two years",
    "All-region first team",
    "District championship game MVP",
    "{state} top-100 recruit",
    "Two-time team MVP",
    "All-metro first team",
  ],
  high: [
    "First-team all-state",
    "{state} player of the year",
    "Under Armour All-America Game selection",
    "All-American Bowl invitation",
    "National elite-camp MVP",
    "Two-time first-team all-state",
    "State champion and title-game MVP",
    "National top-50 recruit",
    "{state} Gatorade Player of the Year",
    "Three-time all-conference selection",
    "Polynesian Bowl invitation",
    "Consensus five-star prospect",
  ],
};

export const HS_ACCOLADE_POSITION_EXTRAS: Partial<Record<Position, string[]>> = {
  QB: [
    "Elite 11 finalist",
    "State record for single-season passing efficiency",
    "Elite 11 regional MVP",
  ],
  RB: ["State record for rushing touchdowns in a season", "All-American Bowl running back of the week"],
  WR: ["National camp one-on-ones champion", "State record for receiving yards in a game"],
  TE: ["Tight end U camp standout", "All-state at two positions"],
  OL: [
    "Lineman of the year, {state}",
    "OL Masterminds camp standout",
    "Trench-warfare camp champion",
  ],
  "Edge Defender": ["Defensive player of the year, {state}", "State record for single-season sacks"],
  DT: ["Big-man camp MVP", "All-state defensive lineman, two years"],
  Linebacker: ["Linebacker of the year, {city} area", "Defensive MVP of the state title game"],
  Cornerback: [
    "Defensive back of the year, {city} area",
    "One-on-ones champion at a national camp",
  ],
  Safety: ["All-state defensive back, two seasons", "Defensive back camp MVP"],
  "Kicker/Punter": [
    "Kohl's national camp top-10 finish",
    "Five-star kicking camp rating",
    "State record for longest field goal",
  ],
};

export const COLLEGE_ACCOLADE_BANKS: Record<RatingBand, string[]> = {
  low: [
    "Two-year starter at {college}",
    "Team special-teams award",
    "Academic all-conference",
    "Honorable mention all-conference",
    "{college} most improved player",
    "Scout-team player of the year",
    "Conference all-academic team",
    "{college} iron-man award",
  ],
  mid: [
    "Second-team all-conference",
    "Two-time all-conference honorable mention",
    "{college} team captain",
    "Bowl game MVP",
    "All-conference third team",
    "{college} defensive player of the year",
    "Conference championship game MVP",
    "Senior Bowl invitation",
  ],
  high: [
    "Consensus All-American",
    "First-team all-conference, two seasons",
    "Conference player of the year",
    "Unanimous All-American as a junior",
    "{college} team captain and conference defensive player of the year",
    "Two-time first-team All-American",
    "Conference championship game MVP",
    "National player of the year finalist",
  ],
};

export const COLLEGE_ACCOLADE_POSITION_EXTRAS: Partial<Record<Position, string[]>> = {
  QB: ["Davey O'Brien Award semifinalist", "Heisman Trophy finalist", "Manning Award finalist"],
  RB: ["Doak Walker Award finalist", "Maxwell Award semifinalist"],
  WR: ["Biletnikoff Award finalist", "Hornung Award semifinalist"],
  TE: ["Mackey Award semifinalist", "Mackey Award finalist"],
  OL: ["Outland Trophy semifinalist", "Rimington Trophy watch list", "Lombardi Award finalist"],
  "Edge Defender": ["Ted Hendricks Award finalist", "Bednarik Award semifinalist"],
  DT: ["Outland Trophy finalist", "Nagurski Trophy semifinalist"],
  Linebacker: ["Butkus Award semifinalist", "Bednarik Award finalist"],
  Cornerback: ["Jim Thorpe Award finalist", "Nagurski Trophy watch list"],
  Safety: ["Jim Thorpe Award semifinalist", "Bednarik Award watch list"],
  "Kicker/Punter": ["Lou Groza Award semifinalist", "Ray Guy Award finalist"],
};

/**
 * The actual win, not just the nomination. Reserved for the very top of the
 * grade range (see the `elite` gate in buildAccolades) so it stays rare —
 * being a finalist is common at 9.4+, actually winning is not.
 */
export const COLLEGE_ACCOLADE_POSITION_ELITE: Partial<Record<Position, string[]>> = {
  QB: ["Heisman Trophy winner", "Davey O'Brien Award winner"],
  RB: ["Doak Walker Award winner", "Heisman Trophy winner"],
  WR: ["Biletnikoff Award winner"],
  TE: ["Mackey Award winner"],
  OL: ["Outland Trophy winner"],
  "Edge Defender": ["Ted Hendricks Award winner"],
  DT: ["Outland Trophy winner"],
  Linebacker: ["Butkus Award winner"],
  Cornerback: ["Jim Thorpe Award winner"],
  Safety: ["Jim Thorpe Award winner"],
  "Kicker/Punter": ["Lou Groza Award winner", "Ray Guy Award winner"],
};

/** Position-agnostic capstone honor, used when a position has no elite award of its own. */
export const COLLEGE_ACCOLADE_ELITE_UNIVERSAL: string[] = [
  "Walter Camp Award winner",
  "Unanimous national player of the year",
  "AP College Football Player of the Year",
];

/* ------------------------------------------------------------------ */
/* Transfer language                                                   */
/* ------------------------------------------------------------------ */

export const TRANSFER_REASONS: string[] = [
  "after a coaching change",
  "after two seasons buried on the depth chart",
  "following a coordinator change in the spring",
  "after starting eleven games as a sophomore",
  "for a bigger role and a bigger stage",
  "after his position coach left for the NFL",
  "in the winter portal window",
  "after a scheme change he did not fit",
  "chasing a defined starting job",
  "after his second season was cut short by injury",
  "when the program signed two players at his position",
  "for a chance to play closer to home",
];
