import type { Position, Race } from "./player-types";

/* ------------------------------------------------------------------ */
/* Randomness helpers                                                  */
/* ------------------------------------------------------------------ */

export function randInt(min: number, max: number): number {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));

  return low + Math.floor(Math.random() * (high - low + 1));
}

export function randFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function chance(probability: number): boolean {
  return Math.random() < probability;
}

export function pick<T>(items: readonly T[], fallback: T): T {
  if (items.length === 0) {
    return fallback;
  }

  return items[randInt(0, items.length - 1)] as T;
}

/** Draws `count` distinct entries, in random order. */
export function pickMany<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const drawn: T[] = [];

  while (pool.length > 0 && drawn.length < count) {
    const index = randInt(0, pool.length - 1);
    drawn.push(pool.splice(index, 1)[0] as T);
  }

  return drawn;
}

export type Weighted<T> = { value: T; weight: number };

export function weightedPick<T>(entries: readonly Weighted<T>[], fallback: T): T {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);

  if (total <= 0) {
    return fallback;
  }

  let roll = Math.random() * total;

  for (const entry of entries) {
    roll -= Math.max(0, entry.weight);

    if (roll <= 0) {
      return entry.value;
    }
  }

  return entries[entries.length - 1]?.value ?? fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/* ------------------------------------------------------------------ */
/* Build formatting                                                    */
/* ------------------------------------------------------------------ */

export function formatBuild(inches: number, pounds: number): string {
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;

  return feet + "'" + remainder + '" / ' + pounds + " lb";
}

export type ParsedBuild = { inches: number; pounds: number };

export function parseBuild(build: string): ParsedBuild | null {
  const match = /(\d+)'(\d{1,2})"\s*\/\s*(\d+)/.exec(build ?? "");

  if (!match) {
    return null;
  }

  const feet = Number(match[1]);
  const inches = Number(match[2]);
  const pounds = Number(match[3]);

  if (!Number.isFinite(feet) || !Number.isFinite(inches) || !Number.isFinite(pounds)) {
    return null;
  }

  return { inches: feet * 12 + inches, pounds };
}

/* ------------------------------------------------------------------ */
/* Positions                                                           */
/* ------------------------------------------------------------------ */

export const POSITIONS: Position[] = [
  "QB",
  "RB",
  "WR",
  "TE",
  "OL",
  "Edge Defender",
  "DT",
  "Linebacker",
  "Cornerback",
  "Safety",
  "Kicker/Punter",
];

/** Roster-realistic frequency, so the generator is not uniform across positions. */
export const POSITION_WEIGHTS: Weighted<Position>[] = [
  { value: "QB", weight: 9 },
  { value: "RB", weight: 10 },
  { value: "WR", weight: 15 },
  { value: "TE", weight: 7 },
  { value: "OL", weight: 15 },
  { value: "Edge Defender", weight: 10 },
  { value: "DT", weight: 8 },
  { value: "Linebacker", weight: 10 },
  { value: "Cornerback", weight: 9 },
  { value: "Safety", weight: 6 },
  { value: "Kicker/Punter", weight: 1 },
];

/** A high-school "Athlete" resolves into one of these. */
export const ATHLETE_POSITIONS: Position[] = [
  "QB",
  "RB",
  "WR",
  "Linebacker",
  "Cornerback",
  "Safety",
];

export type NumberRange = { min: number; max: number };

export type PositionRule = {
  numbers: NumberRange[];
  excludeNumbers: number[];
  /** High-school height window, in inches. */
  heightMin: number;
  heightMax: number;
  /** Hard ceiling at any stage of development, in inches. */
  heightCap: number;
  rareShort: { chance: number; inches: number } | null;
  rareTall: { chance: number; inches: number } | null;
  /** High-school weight window, in pounds. */
  weightMin: number;
  weightMax: number;
  weightCap: number;
  raceWeights: Weighted<Race>[];
};

const DEFAULT_RACE_WEIGHTS: Weighted<Race>[] = [
  { value: "Black", weight: 60 },
  { value: "White", weight: 24 },
  { value: "Latino", weight: 6 },
  { value: "Asian American", weight: 2 },
  { value: "Mixed", weight: 8 },
];

export const POSITION_RULES: Record<Position, PositionRule> = {
  QB: {
    numbers: [{ min: 0, max: 19 }],
    excludeNumbers: [],
    heightMin: 71,
    heightMax: 78,
    heightCap: 79,
    rareShort: { chance: 0.04, inches: 70 },
    rareTall: { chance: 0.06, inches: 79 },
    weightMin: 198,
    weightMax: 245,
    weightCap: 265,
    raceWeights: [
      { value: "Black", weight: 46 },
      { value: "White", weight: 38 },
      { value: "Latino", weight: 6 },
      { value: "Asian American", weight: 2 },
      { value: "Mixed", weight: 8 },
    ],
  },
  RB: {
    numbers: [
      { min: 0, max: 6 },
      { min: 20, max: 32 },
    ],
    excludeNumbers: [],
    heightMin: 68,
    heightMax: 73,
    heightCap: 74,
    rareShort: null,
    rareTall: null,
    weightMin: 190,
    weightMax: 230,
    weightCap: 248,
    raceWeights: [
      { value: "Black", weight: 76 },
      { value: "White", weight: 10 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 9 },
    ],
  },
  WR: {
    numbers: [
      { min: 1, max: 19 },
      { min: 80, max: 89 },
    ],
    excludeNumbers: [],
    heightMin: 69,
    heightMax: 76,
    heightCap: 77,
    rareShort: null,
    rareTall: null,
    weightMin: 178,
    weightMax: 220,
    weightCap: 236,
    raceWeights: [
      { value: "Black", weight: 76 },
      { value: "White", weight: 11 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 8 },
    ],
  },
  TE: {
    numbers: [{ min: 80, max: 89 }],
    excludeNumbers: [],
    heightMin: 74,
    heightMax: 80,
    heightCap: 81,
    rareShort: null,
    rareTall: null,
    weightMin: 235,
    weightMax: 270,
    weightCap: 290,
    raceWeights: [
      { value: "Black", weight: 44 },
      { value: "White", weight: 42 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 2 },
      { value: "Mixed", weight: 8 },
    ],
  },
  OL: {
    numbers: [{ min: 50, max: 79 }],
    // 60 and 69 are almost never issued to linemen at either level.
    excludeNumbers: [60, 69],
    heightMin: 74,
    heightMax: 81,
    heightCap: 82,
    rareShort: null,
    rareTall: null,
    weightMin: 285,
    weightMax: 335,
    weightCap: 355,
    raceWeights: [
      { value: "Black", weight: 42 },
      { value: "White", weight: 42 },
      { value: "Latino", weight: 7 },
      { value: "Asian American", weight: 3 },
      { value: "Mixed", weight: 6 },
    ],
  },
  "Edge Defender": {
    numbers: [
      { min: 0, max: 9 },
      { min: 40, max: 48 },
    ],
    excludeNumbers: [],
    heightMin: 74,
    heightMax: 80,
    heightCap: 81,
    rareShort: null,
    rareTall: null,
    weightMin: 235,
    weightMax: 270,
    weightCap: 292,
    raceWeights: [
      { value: "Black", weight: 72 },
      { value: "White", weight: 15 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 8 },
    ],
  },
  DT: {
    numbers: [
      { min: 50, max: 79 },
      { min: 90, max: 99 },
    ],
    excludeNumbers: [60, 69],
    heightMin: 73,
    heightMax: 79,
    heightCap: 80,
    rareShort: null,
    rareTall: null,
    weightMin: 285,
    weightMax: 345,
    weightCap: 365,
    raceWeights: [
      { value: "Black", weight: 72 },
      { value: "White", weight: 16 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 2 },
      { value: "Mixed", weight: 6 },
    ],
  },
  Linebacker: {
    numbers: [
      { min: 0, max: 18 },
      { min: 30, max: 59 },
    ],
    excludeNumbers: [],
    heightMin: 70,
    heightMax: 77,
    heightCap: 78,
    rareShort: null,
    rareTall: null,
    weightMin: 220,
    weightMax: 256,
    weightCap: 272,
    raceWeights: [
      { value: "Black", weight: 68 },
      { value: "White", weight: 20 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 7 },
    ],
  },
  Cornerback: {
    numbers: [{ min: 0, max: 48 }],
    excludeNumbers: [],
    heightMin: 68,
    heightMax: 75,
    heightCap: 76,
    rareShort: null,
    rareTall: null,
    weightMin: 175,
    weightMax: 205,
    weightCap: 218,
    raceWeights: [
      { value: "Black", weight: 90 },
      { value: "White", weight: 3 },
      { value: "Latino", weight: 2 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 4 },
    ],
  },
  Safety: {
    numbers: [{ min: 0, max: 48 }],
    excludeNumbers: [],
    heightMin: 70,
    heightMax: 77,
    heightCap: 78,
    rareShort: null,
    rareTall: null,
    weightMin: 195,
    weightMax: 230,
    weightCap: 244,
    raceWeights: [
      { value: "Black", weight: 74 },
      { value: "White", weight: 14 },
      { value: "Latino", weight: 4 },
      { value: "Asian American", weight: 1 },
      { value: "Mixed", weight: 7 },
    ],
  },
  "Kicker/Punter": {
    numbers: [
      { min: 0, max: 19 },
      { min: 40, max: 48 },
    ],
    excludeNumbers: [],
    heightMin: 69,
    heightMax: 75,
    heightCap: 76,
    rareShort: null,
    rareTall: null,
    weightMin: 175,
    weightMax: 210,
    weightCap: 222,
    raceWeights: [
      { value: "White", weight: 62 },
      { value: "Latino", weight: 18 },
      { value: "Black", weight: 12 },
      { value: "Asian American", weight: 4 },
      { value: "Mixed", weight: 4 },
    ],
  },
};

export function raceWeightsFor(position: Position): Weighted<Race>[] {
  return POSITION_RULES[position]?.raceWeights ?? DEFAULT_RACE_WEIGHTS;
}

/* ------------------------------------------------------------------ */
/* Names                                                               */
/* ------------------------------------------------------------------ */

type NamePool = { first: string[]; last: string[] };

const BLACK_NAMES: NamePool = {
  first: [
    "Jamari", "Deshun", "Marquise", "Javon", "Tariq", "Kendrick", "Malachi",
    "Amari", "Zaire", "Dontae", "Rashad", "Terrance", "Jaylen", "Cordell",
    "Demetrius", "Trevonte", "Jarrell", "Khalil", "Antwan", "Devonte",
    "Jaquan", "Raheem", "Marlon", "Tyrese", "Darius", "Kelvin", "Kavon",
    "Braylon", "Omari", "Shamar", "Torrey", "Cedric", "Jermaine", "Davion",
    "Keontae", "Quinton", "Tremaine", "Isaiah", "Donnell", "Rondell",
    "Jaheim", "Lamont", "Terrell", "Xavier", "Damarion", "Keyshawn",
    "Malik", "Jaylin", "Devante", "Trevion", "Jaylon", "Kobe", "Amir",
    "Zion", "Elijah", "Marcellus", "Deion", "Jaylan", "Tyree", "Deshawn",
    "Deandre", "Jaelen", "Cornelius", "Anfernee", "Jamal", "Rasheed", "Tavon",
    "Kareem", "Demarcus", "Javion", "Kentrell", "Jaquez", "Deonte", "Antonio",
    "Jaivon", "Marquez", "Deshaun", "Jamir", "Kyrell", "Tobias", "Jerimiah",
    "Kamari", "Deundre", "Amare", "Javeon", "Malikai",
    "Jabari", "Kwame", "Andre", "Reggie", "Corey", "Maurice", "Jerome",
    "Roderick", "Sherman", "Tyrone", "Marquis", "Devin", "Jalil", "Kenyon",
    "Darnell", "Reginald", "Emmitt", "Julius", "Maxwell", "Deshon", "Jayden",
    "Kobie", "Trevell", "Damarcus", "Jaleel", "Kwabena", "Sekou", "Otis",
    "Cornell", "Marquan", "Jaron", "Keon", "Tremayne", "Davonte", "Jamarion",
  ],
  last: [
    "Whitfield", "Beasley", "Colston", "Gaither", "Hollins", "Mabry",
    "Slaughter", "Truitt", "Withers", "Bostic", "Chatman", "Drummond",
    "Fennell", "Grimes", "Hargrove", "Ivory", "Kearse", "Lassiter",
    "Mackey", "Nesbitt", "Oglesby", "Pinkston", "Quarles", "Rucker",
    "Sanderlin", "Tillman", "Vaughns", "Whitlow", "Youngblood", "Battle",
    "Cheatham", "Eatman", "Gadsden", "Haywood", "Dunlap", "Rembert",
    "Pettaway", "Broadnax", "Culpepper", "Freeman", "Shabazz", "Ruffin",
    "Ballentine", "Bridgeforth", "Carrethers", "Dandridge", "Earls", "Fitzgerald", "Golston",
    "Hamer", "Jeter", "Kittrell", "Loften", "Macklin", "Nettles", "Odom",
    "Peete", "Quander", "Roundtree", "Sledge", "Tatum", "Underdue", "Vereen",
    "Waymer", "Yarbrough", "Zanders", "Abercrombie", "Bunche", "Claxton", "Deloach",
    "Etheridge", "Fontenot", "Glasco", "Hargress", "Jefferies", "Kilgore", "Loury",
    "Mabson", "Outlaw", "Parham", "Quarterman", "Rivers",
    "Threadgill", "Applewhite", "Bonner", "Cotten", "Dubose", "Elzy", "Faulk",
    "Goss", "Holston", "Ivey", "Jasper", "Kittles", "Lofton", "Meadows",
    "Nobles", "Onque", "Prather", "Quick", "Reddick", "Simms", "Threat",
    "Underdown", "Vines", "Ware", "Yeldon", "Zeno", "Ballard", "Chisolm",
    "Dortch", "Elston", "Farrow", "Grissom", "Hankerson", "Ingram", "Joyner",
  ],
};

const WHITE_NAMES: NamePool = {
  first: [
    "Brody", "Colton", "Griffin", "Tanner", "Beau", "Cade", "Drew",
    "Gunner", "Hayden", "Kellen", "Nolan", "Owen", "Reid", "Ryder",
    "Sawyer", "Trent", "Walker", "Wyatt", "Bennett", "Easton", "Grant",
    "Hudson", "Jace", "Keegan", "Landon", "Maddox", "Porter", "Rhett",
    "Silas", "Tucker", "Weston", "Blake", "Carsten", "Dane", "Finn",
    "Graham", "Holden", "Jonah", "Knox", "Levi", "Merrick", "Pierce",
    "Colt", "Blaine", "Garrett", "Brock", "Hunter", "Chase", "Wade",
    "Cody", "Brett", "Clint", "Duke", "Lane", "Ty", "Steele",
    "Ford", "Holt", "Boone", "Tripp", "Slade", "Dillon", "Preston",
    "Dalton", "Clayton", "Paxton", "Braxton", "Grayson", "Bryson", "Payton",
    "Flynn", "Brent", "Cord", "Trace", "Flint", "Chance", "Clay",
    "Buck", "Mack", "Griff", "Tyce", "Rafe", "Briggs", "Cutter",
    "Lawson", "Dixon", "Beckett", "Thatcher", "Spencer", "Fletcher", "Cooper",
    "Carter", "Parker", "Turner", "Garner", "Varner", "Larson", "Gentry",
    "Heston", "Remington", "Pendleton", "Addison", "Garrison", "Harrison", "Patterson",
    "Jamison", "Dennison", "Morrison", "Rollins", "Collins", "Hollins", "Mullins",
    "Rawlings", "Stallings", "Hastings", "Jennings", "Cummings", "Flemings", "Branning",
    "Manning", "Fanning", "Tanning",
    "Weber", "Cassidy", "Emerson", "Marshall", "Sterling", "Booker", "Truett",
    "Camden", "Wilder", "Ledger", "Maverick", "Justice", "Beckham", "Kingsley",
    "Ridge", "Case", "Fox", "Hollis", "Otto", "Vance", "Rowdy",
    "Bodie", "Chandler", "Dodge", "Ellis", "Griffith", "Huck", "Ike",
    "Jett", "Kellan", "Loman", "Mickey", "Nash", "Wilkes", "Yates",
  ],
  last: [
    "Ashcroft", "Bramble", "Corliss", "Deakins", "Ellender", "Fairbanks",
    "Garrity", "Hollenbeck", "Ingersoll", "Janssen", "Kirkpatrick",
    "Lindquist", "Mabrey", "Nordstrom", "Oakley", "Pemberton", "Quillen",
    "Radford", "Stapleton", "Thurman", "Underhill", "Vandergrift",
    "Whitaker", "Yancey", "Brennan", "Doyle", "Ekstrom", "Fenwick",
    "Granger", "Hollister", "Isley", "Jorgensen", "Kessler", "Lockridge",
    "Merritt", "Norwood", "Pruitt", "Renner", "Southwick", "Vollmer",
    "Harrington", "Calloway", "Whitmore", "Tillman", "Daley", "Briggs", "Langford",
    "Pruett", "Weston", "Barrington", "Caldwell", "Davenport", "Hathaway", "Hargrove",
    "Wainwright", "Ramsey", "Whitfield", "Langley", "Callahan", "Pennington", "Stafford",
    "Holloway", "Harmon", "Prescott", "Dunmore", "Ashford", "Gallagher", "Covington",
    "Dunbar", "Sherwood", "Blackwood", "Fairfield", "Stratton", "Cromwell", "Holbrook",
    "Ashworth", "Hartwell", "Stanfield", "Mercer", "Ashton", "Hollingsworth", "Templeton",
    "Wickham", "Carmichael", "Whitlow", "Kincaid", "Winslow", "Redmond", "Calhoun",
    "Whitcomb", "Ledbetter", "Stovall", "Garrick", "Holcomb", "Braddock", "Thorne",
    "Ridgeway", "Colfax", "Wexford", "Bramwell", "Ashby", "Hutchins", "Rutledge",
    "Sinclair", "Wentworth",
    "Ambrose", "Blackburn", "Cavanaugh", "Delahunt", "Eastwood", "Farnsworth", "Gladstone",
    "Hargis", "Ives", "Kettering", "Lambeth", "Marchetti", "Norcross", "Ostrander",
    "Pettibone", "Quimby", "Ravenscroft", "Standish", "Vandyke", "Upshaw", "Winthrop",
    "Axtell", "Beauregard", "Chatsworth", "Duckworth", "Ellsworth", "Farrington", "Grantham",
    "Hollowell", "Ingleside", "Jessup", "Kirtland", "Larrabee", "Marchbanks", "Northcutt",
  ],
};

const LATINO_NAMES: NamePool = {
  first: [
    "Mateo", "Diego", "Andres", "Rafael", "Emiliano", "Santiago", "Julian",
    "Cristian", "Marco", "Adrian", "Nico", "Esteban", "Ramiro", "Alonso",
    "Gabriel", "Hector", "Ivan", "Joaquin", "Luis", "Manny", "Omar",
    "Pablo", "Salvador", "Tomas", "Ulises", "Vicente", "Alejandro",
    "Bruno", "Camilo", "Danilo", "Enrique", "Fabian", "Gerardo", "Rey",
    "Mario", "Ricardo", "Fernando", "Eduardo", "Sergio", "Miguel", "Antonio",
    "Carlos", "Jorge", "Javier", "Roberto", "Alberto", "Armando", "Cesar",
    "Daniel", "Emilio", "Felipe", "Guillermo", "Humberto", "Israel", "Jaime",
    "Leonardo", "Martin", "Nestor", "Octavio", "Pedro", "Raul", "Rodrigo",
    "Samuel", "Tobias", "Valentin", "Xavier", "Yahir", "Zacarias", "Emmanuel",
    "Alexis", "Angel", "Bernardo", "Cristobal", "Damian", "Elias", "Francisco",
    "Gustavo", "Horacio", "Ignacio", "Jesus", "Lorenzo", "Mauricio", "Nicolas",
    "Osvaldo", "Patricio", "Rigoberto", "Silvestre", "Teodoro", "Urbano", "Wilfredo",
    "Abel", "Bartolo", "Cirilo", "Dario", "Efrain", "Florencio", "Geraldo",
    "Herminio", "Isidro", "Jacinto", "Leopoldo", "Modesto", "Norberto", "Rogelio",
  ],
  last: [
    "Alvarado", "Betancourt", "Carrillo", "Delgado", "Escamilla",
    "Fuentes", "Guzman", "Hinojosa", "Ibarra", "Jaramillo", "Lozano",
    "Maldonado", "Nieves", "Ontiveros", "Peralta", "Quintero", "Rivas",
    "Salcedo", "Tejada", "Urias", "Valadez", "Zamora", "Arreola",
    "Bustamante", "Cordova", "Duran", "Espinosa", "Galindo", "Montoya",
    "Sandoval", "Rosales", "Villalobos",
    "Aguilar", "Beltran", "Cabrera", "Dominguez", "Estrada", "Figueroa", "Gallegos",
    "Herrera", "Iniguez", "Juarez", "Larios", "Medina", "Navarro", "Ochoa",
    "Pacheco", "Quiroz", "Reyes", "Salazar", "Torres", "Uribe", "Vasquez",
    "Zavala", "Aponte", "Barrera", "Cazares", "Delacruz", "Espino", "Frias",
    "Guerra", "Hurtado", "Jimenez", "Lara", "Marroquin", "Nava", "Olvera",
    "Contreras", "Solis", "Rangel", "Cervantes", "Villareal", "Zuniga", "Mercado",
    "Palacios", "Robledo", "Camacho", "Escobedo", "Guerrero", "Lugo", "Marin",
    "Orozco", "Paredes", "Quintanilla", "Rendon", "Serrano", "Trejo", "Valenzuela",
    "Zaragoza", "Aranda", "Bravo", "Cardenas", "Duarte", "Elizondo", "Franco",
    "Godinez", "Huerta", "Lozada", "Manzano", "Nunez", "Olguin", "Pina",
  ],
};

const ASIAN_AMERICAN_NAMES: NamePool = {
  first: [
    "Kai", "Kenji", "Tai", "Jae", "Minh", "Quan", "Danny", "Justin",
    "Brandon", "Nathan", "Evan", "Marcus", "Bryce", "Ethan", "Isaac",
    "Lucas", "Ryan", "Aaron", "Devin", "Trey", "Colin", "Elliot",
    "Garrett", "Hiro", "Jordan", "Kane", "Miles", "Preston",
    "Andrew", "Alex", "Brian", "Calvin", "David", "Eric", "Felix",
    "Gordon", "Henry", "Ian", "Jason", "Kevin", "Leo", "Michael",
    "Nelson", "Oliver", "Peter", "Raymond", "Steven", "Timothy", "Victor",
    "William", "Kenny", "Derek", "Edwin", "Franklin", "Gilbert", "Harold",
    "Jeremy", "Kyle", "Leon", "Norman", "Phillip", "Russell", "Simon",
    "Wesley", "Adam", "Bradley", "Dennis", "Edmund", "Frederick", "Howard",
    "Jonathan", "Keith", "Larry", "Melvin", "Neil", "Perry", "Ronald",
    "Stanley", "Terrence", "Vincent", "Wallace", "Allan", "Barry", "Clifford",
    "Douglas", "Ernest", "Gary", "Herbert", "Irwin", "Jerry", "Kenneth",
    "Lloyd", "Milton", "Nolan", "Owen", "Paul", "Quentin", "Roland",
  ],
  last: [
    "Nakamura", "Chin", "Kaneshiro", "Matsuda", "Fujimoto", "Villanueva",
    "Dizon", "Bautista", "Nguyen", "Tran", "Yamamoto", "Watanabe",
    "Cheng", "Liu", "Sato", "Choi", "Ito", "Pham", "Vu", "Hasegawa",
    "Kwan", "Song", "Takeda", "Ozaki", "Manalo", "Sakai",
    "Wong", "Chen", "Wang", "Lin", "Huang", "Zhang", "Kim",
    "Park", "Lee", "Yang", "Kobayashi", "Suzuki", "Tanaka", "Yoshida",
    "Inoue", "Kato", "Yamada", "Nakagawa", "Endo", "Aoki", "Hirano",
    "Le", "Vo", "Dang", "Truong", "Bui", "Ly", "Cao",
    "Doan", "Mai", "Ngo", "Lam", "Ha", "Duong", "Phan",
    "Yamaguchi", "Fukushima", "Hattori", "Ishida", "Kimura", "Matsui", "Nishimura",
    "Okada", "Shimizu", "Takahashi", "Ueda", "Yokoyama", "Abe", "Baba",
    "Enomoto", "Goto", "Imai", "Kojima", "Maeda", "Nomura", "Oshiro",
    "Saito", "Uehara", "Wada", "Ando", "Fukuda", "Hori", "Ikeda",
    "Kudo", "Miura", "Nishida", "Onishi", "Sano", "Toyama", "Ishii",
  ],
};

const MIXED_EXTRA: NamePool = {
  first: [
    "Jaxen", "Cassius", "Ezekiel", "Kylan", "Roman", "Sincere", "Ari",
    "Bodhi", "Kaiden", "Zayden", "Amir", "Nasir", "Rocco", "Zion",
    "Kairo", "Zane", "Rune", "Cove", "Onyx", "Phoenix", "Kase",
    "Bex", "Wren", "Storm", "Adonis", "Maximus", "Titus", "Atlas",
    "Orion", "Kingston", "Legend", "Messiah", "Kylo", "Zaid",
    "Ezra", "Ronin", "Kade", "Zephyr", "Axl", "Bowie", "Colby",
    "Dax", "Ellison", "Fenix", "Gage", "Ira", "Jax", "Kace",
    "Leyton", "Milo", "Nyx", "Ocean", "Rome", "Sage", "Tate",
    "Uriah", "Vale", "Wilder", "Xen", "Yael", "Zed", "Bram",
    "Cruz", "Dane",
  ],
  last: [
    "Okafor-Reed", "Santos-Hill", "Bell-Ortiz", "Nakagawa-Price",
    "Cormier", "Beauchamp", "Delacroix", "Amoroso", "Kealoha",
    "Aiello", "Sanabria", "Tuiasosopo",
    "Reyes-Kim", "Alama", "Faleolo", "Tuilagi", "Kahale", "Solomona", "Fonoti",
    "Manu", "Iosefo", "Tuputala", "Alofa", "Vaifale", "Kalani", "Makoa",
    "Kealii", "Onyekachi", "Adeyemi", "Osei", "Boateng", "Mensah",
    "Kalama", "Naeole", "Puana", "Akana", "Kahananui", "Lopaka", "Maluia",
    "Nahale", "Palakiko", "Uluave", "Fifita", "Halavatau", "Ika", "Kaho",
    "Latu", "Moimoi", "Ngata", "Palu", "Sione", "Taumalolo", "Uili",
    "Vaega", "Wolfgramm", "Aumua", "Betham", "Gafa", "Hafoka", "Isaako",
    "Faapito", "Leaupepe",
  ],
};

/**
 * A small pool of conventional-sounding first names, used for a slice of QB
 * rolls only. Quarterback names get compared to real draft boards more than
 * any other position, so leaning slightly more normal there (and nowhere
 * else) reads truer without flattening the rest of the name generation.
 */
export const QB_COMMON_FIRST_NAMES: string[] = [
  "Jake", "Tyler", "Jordan", "Cameron", "Austin", "Dylan", "Mason", "Carson",
  "Bryce", "Will", "Sam", "Jack", "Drew", "Trevor", "Cooper", "Luke",
  "Michael", "Chris", "Matthew", "Josh",
];

export const NAME_POOLS: Record<Race, NamePool> = {
  Black: BLACK_NAMES,
  White: WHITE_NAMES,
  Latino: LATINO_NAMES,
  "Asian American": ASIAN_AMERICAN_NAMES,
  Mixed: {
    first: [
      ...MIXED_EXTRA.first,
      ...BLACK_NAMES.first.slice(0, 16),
      ...WHITE_NAMES.first.slice(0, 16),
      ...LATINO_NAMES.first.slice(0, 10),
    ],
    last: [
      ...MIXED_EXTRA.last,
      ...BLACK_NAMES.last.slice(0, 14),
      ...WHITE_NAMES.last.slice(0, 14),
      ...ASIAN_AMERICAN_NAMES.last.slice(0, 8),
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Geography                                                           */
/* ------------------------------------------------------------------ */

export type Region =
  | "Northeast"
  | "Southeast"
  | "Midwest"
  | "South Central"
  | "Mountain"
  | "West Coast";

export const STATE_REGION: Record<string, Region> = {
  ME: "Northeast", NH: "Northeast", VT: "Northeast", MA: "Northeast",
  RI: "Northeast", CT: "Northeast", NY: "Northeast", NJ: "Northeast",
  PA: "Northeast", DE: "Northeast", MD: "Northeast", DC: "Northeast",
  VA: "Southeast", WV: "Southeast", NC: "Southeast", SC: "Southeast",
  GA: "Southeast", FL: "Southeast", AL: "Southeast", TN: "Southeast",
  KY: "Southeast", MS: "Southeast",
  OH: "Midwest", MI: "Midwest", IN: "Midwest", IL: "Midwest",
  WI: "Midwest", MN: "Midwest", IA: "Midwest", MO: "Midwest",
  ND: "Midwest", SD: "Midwest", NE: "Midwest", KS: "Midwest",
  TX: "South Central", OK: "South Central", AR: "South Central",
  LA: "South Central", NM: "South Central",
  CO: "Mountain", UT: "Mountain", WY: "Mountain", MT: "Mountain",
  ID: "Mountain", NV: "Mountain", AZ: "Mountain",
  CA: "West Coast", OR: "West Coast", WA: "West Coast", HI: "West Coast",
  AK: "West Coast",
};

export function regionForState(state: string): Region {
  return STATE_REGION[state] ?? "Midwest";
}

export type Hometown = { city: string; state: string; weight: number };

export const HOMETOWNS: Hometown[] = [
  { city: "Massillon", state: "OH", weight: 3 },
  { city: "Cleveland", state: "OH", weight: 5 },
  { city: "Cincinnati", state: "OH", weight: 4 },
  { city: "Columbus", state: "OH", weight: 4 },
  { city: "Toledo", state: "OH", weight: 3 },
  { city: "Akron", state: "OH", weight: 3 },
  { city: "Canton", state: "OH", weight: 3 },
  { city: "Youngstown", state: "OH", weight: 3 },
  { city: "Dayton", state: "OH", weight: 3 },
  { city: "Lakewood", state: "OH", weight: 2 },
  { city: "Miami", state: "FL", weight: 5 },
  { city: "Tampa", state: "FL", weight: 4 },
  { city: "Jacksonville", state: "FL", weight: 4 },
  { city: "Orlando", state: "FL", weight: 4 },
  { city: "Fort Lauderdale", state: "FL", weight: 4 },
  { city: "Bradenton", state: "FL", weight: 3 },
  { city: "Pensacola", state: "FL", weight: 2 },
  { city: "Atlanta", state: "GA", weight: 5 },
  { city: "Marietta", state: "GA", weight: 3 },
  { city: "Valdosta", state: "GA", weight: 3 },
  { city: "Savannah", state: "GA", weight: 3 },
  { city: "Columbus", state: "GA", weight: 2 },
  { city: "Houston", state: "TX", weight: 5 },
  { city: "Dallas", state: "TX", weight: 5 },
  { city: "Katy", state: "TX", weight: 4 },
  { city: "Austin", state: "TX", weight: 3 },
  { city: "San Antonio", state: "TX", weight: 3 },
  { city: "Longview", state: "TX", weight: 3 },
  { city: "Odessa", state: "TX", weight: 2 },
  { city: "Tyler", state: "TX", weight: 2 },
  { city: "Baton Rouge", state: "LA", weight: 4 },
  { city: "New Orleans", state: "LA", weight: 4 },
  { city: "Shreveport", state: "LA", weight: 3 },
  { city: "Birmingham", state: "AL", weight: 4 },
  { city: "Mobile", state: "AL", weight: 3 },
  { city: "Montgomery", state: "AL", weight: 3 },
  { city: "Tuscaloosa", state: "AL", weight: 2 },
  { city: "Jackson", state: "MS", weight: 3 },
  { city: "Gulfport", state: "MS", weight: 2 },
  { city: "Memphis", state: "TN", weight: 4 },
  { city: "Nashville", state: "TN", weight: 3 },
  { city: "Knoxville", state: "TN", weight: 3 },
  { city: "Charlotte", state: "NC", weight: 4 },
  { city: "Greensboro", state: "NC", weight: 3 },
  { city: "Raleigh", state: "NC", weight: 3 },
  { city: "Columbia", state: "SC", weight: 3 },
  { city: "Greenville", state: "SC", weight: 3 },
  { city: "Rock Hill", state: "SC", weight: 2 },
  { city: "Richmond", state: "VA", weight: 3 },
  { city: "Virginia Beach", state: "VA", weight: 3 },
  { city: "Hampton", state: "VA", weight: 3 },
  { city: "Baltimore", state: "MD", weight: 4 },
  { city: "Bowie", state: "MD", weight: 2 },
  { city: "Washington", state: "DC", weight: 3 },
  { city: "Philadelphia", state: "PA", weight: 4 },
  { city: "Pittsburgh", state: "PA", weight: 4 },
  { city: "Aliquippa", state: "PA", weight: 2 },
  { city: "Erie", state: "PA", weight: 2 },
  { city: "Newark", state: "NJ", weight: 3 },
  { city: "Paramus", state: "NJ", weight: 2 },
  { city: "Brooklyn", state: "NY", weight: 3 },
  { city: "Rochester", state: "NY", weight: 2 },
  { city: "Hartford", state: "CT", weight: 2 },
  { city: "Boston", state: "MA", weight: 2 },
  { city: "Detroit", state: "MI", weight: 4 },
  { city: "Grand Rapids", state: "MI", weight: 3 },
  { city: "Ann Arbor", state: "MI", weight: 2 },
  { city: "Chicago", state: "IL", weight: 5 },
  { city: "Naperville", state: "IL", weight: 3 },
  { city: "Rockford", state: "IL", weight: 2 },
  { city: "Indianapolis", state: "IN", weight: 3 },
  { city: "Fort Wayne", state: "IN", weight: 2 },
  { city: "Milwaukee", state: "WI", weight: 3 },
  { city: "Green Bay", state: "WI", weight: 2 },
  { city: "Minneapolis", state: "MN", weight: 3 },
  { city: "St. Paul", state: "MN", weight: 2 },
  { city: "Des Moines", state: "IA", weight: 2 },
  { city: "Cedar Rapids", state: "IA", weight: 2 },
  { city: "Kansas City", state: "MO", weight: 3 },
  { city: "St. Louis", state: "MO", weight: 3 },
  { city: "Wichita", state: "KS", weight: 2 },
  { city: "Omaha", state: "NE", weight: 2 },
  { city: "Louisville", state: "KY", weight: 3 },
  { city: "Lexington", state: "KY", weight: 2 },
  { city: "Little Rock", state: "AR", weight: 2 },
  { city: "Tulsa", state: "OK", weight: 3 },
  { city: "Oklahoma City", state: "OK", weight: 3 },
  { city: "Denver", state: "CO", weight: 3 },
  { city: "Aurora", state: "CO", weight: 2 },
  { city: "Salt Lake City", state: "UT", weight: 2 },
  { city: "Provo", state: "UT", weight: 2 },
  { city: "Las Vegas", state: "NV", weight: 3 },
  { city: "Phoenix", state: "AZ", weight: 4 },
  { city: "Chandler", state: "AZ", weight: 3 },
  { city: "Albuquerque", state: "NM", weight: 2 },
  { city: "Boise", state: "ID", weight: 2 },
  { city: "Los Angeles", state: "CA", weight: 5 },
  { city: "Long Beach", state: "CA", weight: 4 },
  { city: "Santa Ana", state: "CA", weight: 3 },
  { city: "Fresno", state: "CA", weight: 3 },
  { city: "Oakland", state: "CA", weight: 3 },
  { city: "San Diego", state: "CA", weight: 3 },
  { city: "Sacramento", state: "CA", weight: 3 },
  { city: "Portland", state: "OR", weight: 2 },
  { city: "Eugene", state: "OR", weight: 2 },
  { city: "Seattle", state: "WA", weight: 3 },
  { city: "Tacoma", state: "WA", weight: 2 },
  { city: "Honolulu", state: "HI", weight: 2 },
  { city: "Charleston", state: "WV", weight: 2 },
];

/** High-school naming parts, combined with the hometown city. */
export const HS_SUFFIXES: string[] = [
  "Central",
  "Northside",
  "Southridge",
  "East",
  "West",
  "Catholic",
  "Prep",
  "Christian",
  "Heights",
  "Memorial",
  "Valley",
  "Union",
];

export const HS_SAINT_NAMES: string[] = [
  "St. Xavier",
  "St. Edward",
  "St. Ignatius",
  "Bishop Dunne",
  "Holy Cross Prep",
  "Cardinal Ritter",
  "Archbishop Kelley",
  "Sacred Heart Prep",
];

export const MASCOTS: string[] = [
  "Tigers",
  "Wildcats",
  "Panthers",
  "Eagles",
  "Bulldogs",
  "Ironmen",
  "Warriors",
  "Rams",
  "Falcons",
  "Cougars",
  "Vikings",
  "Hornets",
];

/* ------------------------------------------------------------------ */
/* Recruiting dataset                                                  */
/* ------------------------------------------------------------------ */

export type School = {
  school: string;
  state: string;
  conference: string;
  prestige: number;
};

export const SCHOOLS: School[] = [
  // SEC
  { school: "Alabama", state: "AL", conference: "SEC", prestige: 5.0 },
  { school: "Georgia", state: "GA", conference: "SEC", prestige: 5.0 },
  { school: "LSU", state: "LA", conference: "SEC", prestige: 4.9 },
  { school: "Texas", state: "TX", conference: "SEC", prestige: 4.9 },
  { school: "Oklahoma", state: "OK", conference: "SEC", prestige: 4.7 },
  { school: "Tennessee", state: "TN", conference: "SEC", prestige: 4.6 },
  { school: "Florida", state: "FL", conference: "SEC", prestige: 4.5 },
  { school: "Texas A&M", state: "TX", conference: "SEC", prestige: 4.5 },
  { school: "Auburn", state: "AL", conference: "SEC", prestige: 4.4 },
  { school: "Ole Miss", state: "MS", conference: "SEC", prestige: 4.2 },
  { school: "South Carolina", state: "SC", conference: "SEC", prestige: 4.0 },
  { school: "Missouri", state: "MO", conference: "SEC", prestige: 4.0 },
  { school: "Arkansas", state: "AR", conference: "SEC", prestige: 3.9 },
  { school: "Mississippi State", state: "MS", conference: "SEC", prestige: 3.9 },
  { school: "Kentucky", state: "KY", conference: "SEC", prestige: 3.9 },
  { school: "Vanderbilt", state: "TN", conference: "SEC", prestige: 3.5 },

  // Big Ten
  { school: "Ohio State", state: "OH", conference: "Big Ten", prestige: 5.0 },
  { school: "Michigan", state: "MI", conference: "Big Ten", prestige: 4.8 },
  { school: "Penn State", state: "PA", conference: "Big Ten", prestige: 4.7 },
  { school: "Wisconsin", state: "WI", conference: "Big Ten", prestige: 4.2 },
  { school: "Iowa", state: "IA", conference: "Big Ten", prestige: 4.1 },
  { school: "Nebraska", state: "NE", conference: "Big Ten", prestige: 4.0 },
  { school: "Michigan State", state: "MI", conference: "Big Ten", prestige: 3.8 },
  { school: "Indiana", state: "IN", conference: "Big Ten", prestige: 3.8 },
  { school: "Minnesota", state: "MN", conference: "Big Ten", prestige: 3.7 },
  { school: "Illinois", state: "IL", conference: "Big Ten", prestige: 3.6 },
  { school: "Purdue", state: "IN", conference: "Big Ten", prestige: 3.6 },
  { school: "Maryland", state: "MD", conference: "Big Ten", prestige: 3.6 },
  { school: "Rutgers", state: "NJ", conference: "Big Ten", prestige: 3.5 },
  { school: "Northwestern", state: "IL", conference: "Big Ten", prestige: 3.5 },

  // Big 12
  { school: "Oklahoma State", state: "OK", conference: "Big 12", prestige: 4.0 },
  { school: "TCU", state: "TX", conference: "Big 12", prestige: 4.0 },
  { school: "Kansas State", state: "KS", conference: "Big 12", prestige: 4.0 },
  { school: "Baylor", state: "TX", conference: "Big 12", prestige: 3.9 },
  { school: "Texas Tech", state: "TX", conference: "Big 12", prestige: 3.9 },
  { school: "BYU", state: "UT", conference: "Big 12", prestige: 3.9 },
  { school: "Iowa State", state: "IA", conference: "Big 12", prestige: 3.8 },
  { school: "West Virginia", state: "WV", conference: "Big 12", prestige: 3.7 },
  { school: "Cincinnati", state: "OH", conference: "Big 12", prestige: 3.7 },
  { school: "UCF", state: "FL", conference: "Big 12", prestige: 3.7 },
  { school: "Kansas", state: "KS", conference: "Big 12", prestige: 3.6 },
  { school: "Houston", state: "TX", conference: "Big 12", prestige: 3.5 },

  // ACC
  { school: "Clemson", state: "SC", conference: "ACC", prestige: 4.7 },
  { school: "Florida State", state: "FL", conference: "ACC", prestige: 4.6 },
  { school: "Miami (FL)", state: "FL", conference: "ACC", prestige: 4.5 },
  { school: "North Carolina", state: "NC", conference: "ACC", prestige: 4.0 },
  { school: "Louisville", state: "KY", conference: "ACC", prestige: 3.9 },
  { school: "NC State", state: "NC", conference: "ACC", prestige: 3.8 },
  { school: "Virginia Tech", state: "VA", conference: "ACC", prestige: 3.8 },
  { school: "SMU", state: "TX", conference: "ACC", prestige: 3.7 },
  { school: "Pittsburgh", state: "PA", conference: "ACC", prestige: 3.7 },
  { school: "Georgia Tech", state: "GA", conference: "ACC", prestige: 3.6 },
  { school: "Duke", state: "NC", conference: "ACC", prestige: 3.5 },
  { school: "Boston College", state: "MA", conference: "ACC", prestige: 3.4 },
  { school: "Syracuse", state: "NY", conference: "ACC", prestige: 3.4 },
  { school: "Virginia", state: "VA", conference: "ACC", prestige: 3.4 },
  { school: "Wake Forest", state: "NC", conference: "ACC", prestige: 3.4 },

  // Pac-12
  { school: "Oregon", state: "OR", conference: "Pac-12", prestige: 4.7 },
  { school: "USC", state: "CA", conference: "Pac-12", prestige: 4.6 },
  { school: "Washington", state: "WA", conference: "Pac-12", prestige: 4.4 },
  { school: "Utah", state: "UT", conference: "Pac-12", prestige: 4.1 },
  { school: "UCLA", state: "CA", conference: "Pac-12", prestige: 4.0 },
  { school: "Stanford", state: "CA", conference: "Pac-12", prestige: 3.6 },
  { school: "Arizona State", state: "AZ", conference: "Pac-12", prestige: 3.4 },
  { school: "Colorado", state: "CO", conference: "Pac-12", prestige: 3.4 },
  { school: "Arizona", state: "AZ", conference: "Pac-12", prestige: 3.3 },
  { school: "California", state: "CA", conference: "Pac-12", prestige: 3.2 },
  { school: "Oregon State", state: "OR", conference: "Pac-12", prestige: 3.2 },
  { school: "Washington State", state: "WA", conference: "Pac-12", prestige: 3.1 },

  // Independent
  { school: "Notre Dame", state: "IN", conference: "Independent", prestige: 4.8 },
  { school: "UConn", state: "CT", conference: "Independent", prestige: 2.0 },
  { school: "UMass", state: "MA", conference: "Independent", prestige: 1.8 },

  // American (AAC)
  { school: "Memphis", state: "TN", conference: "AAC", prestige: 3.0 },
  { school: "Tulane", state: "LA", conference: "AAC", prestige: 2.9 },
  { school: "UTSA", state: "TX", conference: "AAC", prestige: 2.6 },
  { school: "Navy", state: "MD", conference: "AAC", prestige: 2.6 },
  { school: "East Carolina", state: "NC", conference: "AAC", prestige: 2.5 },
  { school: "South Florida", state: "FL", conference: "AAC", prestige: 2.5 },
  { school: "Army", state: "NY", conference: "AAC", prestige: 2.5 },
  { school: "North Texas", state: "TX", conference: "AAC", prestige: 2.3 },
  { school: "UAB", state: "AL", conference: "AAC", prestige: 2.3 },
  { school: "Tulsa", state: "OK", conference: "AAC", prestige: 2.2 },
  { school: "Temple", state: "PA", conference: "AAC", prestige: 2.2 },
  { school: "Florida Atlantic", state: "FL", conference: "AAC", prestige: 2.2 },
  { school: "Rice", state: "TX", conference: "AAC", prestige: 2.1 },
  { school: "Charlotte", state: "NC", conference: "AAC", prestige: 2.0 },

  // Mountain West
  { school: "Boise State", state: "ID", conference: "Mountain West", prestige: 3.4 },
  { school: "Fresno State", state: "CA", conference: "Mountain West", prestige: 3.0 },
  { school: "San Diego State", state: "CA", conference: "Mountain West", prestige: 2.8 },
  { school: "Air Force", state: "CO", conference: "Mountain West", prestige: 2.7 },
  { school: "Colorado State", state: "CO", conference: "Mountain West", prestige: 2.4 },
  { school: "Wyoming", state: "WY", conference: "Mountain West", prestige: 2.4 },
  { school: "Utah State", state: "UT", conference: "Mountain West", prestige: 2.4 },
  { school: "UNLV", state: "NV", conference: "Mountain West", prestige: 2.3 },
  { school: "San Jose State", state: "CA", conference: "Mountain West", prestige: 2.2 },
  { school: "Nevada", state: "NV", conference: "Mountain West", prestige: 2.2 },
  { school: "Hawaii", state: "HI", conference: "Mountain West", prestige: 2.1 },
  { school: "New Mexico", state: "NM", conference: "Mountain West", prestige: 2.0 },

  // Sun Belt
  { school: "Appalachian State", state: "NC", conference: "Sun Belt", prestige: 2.9 },
  { school: "James Madison", state: "VA", conference: "Sun Belt", prestige: 2.8 },
  { school: "Louisiana", state: "LA", conference: "Sun Belt", prestige: 2.8 },
  { school: "Coastal Carolina", state: "SC", conference: "Sun Belt", prestige: 2.6 },
  { school: "Troy", state: "AL", conference: "Sun Belt", prestige: 2.6 },
  { school: "Marshall", state: "WV", conference: "Sun Belt", prestige: 2.6 },
  { school: "Georgia Southern", state: "GA", conference: "Sun Belt", prestige: 2.5 },
  { school: "South Alabama", state: "AL", conference: "Sun Belt", prestige: 2.3 },
  { school: "Southern Miss", state: "MS", conference: "Sun Belt", prestige: 2.3 },
  { school: "Arkansas State", state: "AR", conference: "Sun Belt", prestige: 2.2 },
  { school: "Texas State", state: "TX", conference: "Sun Belt", prestige: 2.2 },
  { school: "Old Dominion", state: "VA", conference: "Sun Belt", prestige: 2.2 },
  { school: "Georgia State", state: "GA", conference: "Sun Belt", prestige: 2.2 },
  { school: "Louisiana-Monroe", state: "LA", conference: "Sun Belt", prestige: 1.9 },

  // MAC
  { school: "Toledo", state: "OH", conference: "MAC", prestige: 2.6 },
  { school: "Miami (OH)", state: "OH", conference: "MAC", prestige: 2.5 },
  { school: "Ohio", state: "OH", conference: "MAC", prestige: 2.4 },
  { school: "Western Michigan", state: "MI", conference: "MAC", prestige: 2.3 },
  { school: "Northern Illinois", state: "IL", conference: "MAC", prestige: 2.3 },
  { school: "Bowling Green", state: "OH", conference: "MAC", prestige: 2.2 },
  { school: "Central Michigan", state: "MI", conference: "MAC", prestige: 2.2 },
  { school: "Buffalo", state: "NY", conference: "MAC", prestige: 2.1 },
  { school: "Ball State", state: "IN", conference: "MAC", prestige: 2.0 },
  { school: "Eastern Michigan", state: "MI", conference: "MAC", prestige: 2.0 },
  { school: "Kent State", state: "OH", conference: "MAC", prestige: 1.9 },
  { school: "Akron", state: "OH", conference: "MAC", prestige: 1.8 },

  // Conference USA
  { school: "Liberty", state: "VA", conference: "Conference USA", prestige: 2.7 },
  { school: "Western Kentucky", state: "KY", conference: "Conference USA", prestige: 2.4 },
  { school: "Louisiana Tech", state: "LA", conference: "Conference USA", prestige: 2.2 },
  { school: "Middle Tennessee", state: "TN", conference: "Conference USA", prestige: 2.1 },
  { school: "Sam Houston", state: "TX", conference: "Conference USA", prestige: 2.1 },
  { school: "Jacksonville State", state: "AL", conference: "Conference USA", prestige: 2.0 },
  { school: "New Mexico State", state: "NM", conference: "Conference USA", prestige: 1.9 },
  { school: "UTEP", state: "TX", conference: "Conference USA", prestige: 1.8 },
  { school: "Kennesaw State", state: "GA", conference: "Conference USA", prestige: 1.8 },
  { school: "FIU", state: "FL", conference: "Conference USA", prestige: 1.8 },

  // FCS
  { school: "North Dakota State", state: "ND", conference: "FCS", prestige: 2.2 },
  { school: "South Dakota State", state: "SD", conference: "FCS", prestige: 2.2 },
  { school: "Montana", state: "MT", conference: "FCS", prestige: 2.0 },
  { school: "Montana State", state: "MT", conference: "FCS", prestige: 2.0 },
  { school: "Northern Iowa", state: "IA", conference: "FCS", prestige: 1.9 },
  { school: "Delaware", state: "DE", conference: "FCS", prestige: 1.9 },
  { school: "Youngstown State", state: "OH", conference: "FCS", prestige: 1.8 },
  { school: "Villanova", state: "PA", conference: "FCS", prestige: 1.8 },
  { school: "Jackson State", state: "MS", conference: "FCS", prestige: 1.8 },
  { school: "Eastern Washington", state: "WA", conference: "FCS", prestige: 1.8 },
  { school: "Sacramento State", state: "CA", conference: "FCS", prestige: 1.8 },
  { school: "South Dakota", state: "SD", conference: "FCS", prestige: 1.8 },
  { school: "Incarnate Word", state: "TX", conference: "FCS", prestige: 1.7 },
  { school: "Richmond", state: "VA", conference: "FCS", prestige: 1.7 },
  { school: "Florida A&M", state: "FL", conference: "FCS", prestige: 1.7 },
  { school: "UC Davis", state: "CA", conference: "FCS", prestige: 1.7 },
  { school: "Idaho", state: "ID", conference: "FCS", prestige: 1.7 },
  { school: "Weber State", state: "UT", conference: "FCS", prestige: 1.7 },
  { school: "Tennessee State", state: "TN", conference: "FCS", prestige: 1.6 },
  { school: "North Carolina A&T", state: "NC", conference: "FCS", prestige: 1.6 },
  { school: "Southern", state: "LA", conference: "FCS", prestige: 1.6 },
  { school: "Grambling State", state: "LA", conference: "FCS", prestige: 1.6 },
  { school: "Illinois State", state: "IL", conference: "FCS", prestige: 1.6 },
  { school: "Missouri State", state: "MO", conference: "FCS", prestige: 1.6 },
  { school: "Southern Illinois", state: "IL", conference: "FCS", prestige: 1.6 },
  { school: "William & Mary", state: "VA", conference: "FCS", prestige: 1.6 },
  { school: "Chattanooga", state: "TN", conference: "FCS", prestige: 1.6 },
  { school: "Furman", state: "SC", conference: "FCS", prestige: 1.6 },
  { school: "Samford", state: "AL", conference: "FCS", prestige: 1.6 },
  { school: "The Citadel", state: "SC", conference: "FCS", prestige: 1.5 },
  { school: "Wofford", state: "SC", conference: "FCS", prestige: 1.5 },
  { school: "Elon", state: "NC", conference: "FCS", prestige: 1.5 },
  { school: "New Hampshire", state: "NH", conference: "FCS", prestige: 1.5 },
  { school: "Rhode Island", state: "RI", conference: "FCS", prestige: 1.5 },
  { school: "Holy Cross", state: "MA", conference: "FCS", prestige: 1.5 },
  { school: "McNeese", state: "LA", conference: "FCS", prestige: 1.5 },
  { school: "Nicholls", state: "LA", conference: "FCS", prestige: 1.5 },
  { school: "UT Martin", state: "TN", conference: "FCS", prestige: 1.5 },
  { school: "Eastern Kentucky", state: "KY", conference: "FCS", prestige: 1.5 },
  { school: "Howard", state: "DC", conference: "FCS", prestige: 1.5 },
  { school: "Alcorn State", state: "MS", conference: "FCS", prestige: 1.5 },
  { school: "Northern Arizona", state: "AZ", conference: "FCS", prestige: 1.5 },
  { school: "Cal Poly", state: "CA", conference: "FCS", prestige: 1.5 },
  { school: "Dayton", state: "OH", conference: "FCS", prestige: 1.4 },
  { school: "Duquesne", state: "PA", conference: "FCS", prestige: 1.4 },
  { school: "Robert Morris", state: "PA", conference: "FCS", prestige: 1.4 },
  { school: "Lehigh", state: "PA", conference: "FCS", prestige: 1.4 },
  { school: "Albany", state: "NY", conference: "FCS", prestige: 1.4 },
  { school: "Stony Brook", state: "NY", conference: "FCS", prestige: 1.4 },
  { school: "Maine", state: "ME", conference: "FCS", prestige: 1.4 },
  { school: "Central Connecticut", state: "CT", conference: "FCS", prestige: 1.4 },
  { school: "Austin Peay", state: "TN", conference: "FCS", prestige: 1.4 },
  { school: "Murray State", state: "KY", conference: "FCS", prestige: 1.4 },
  { school: "Southeast Missouri", state: "MO", conference: "FCS", prestige: 1.4 },
  { school: "Lindenwood", state: "MO", conference: "FCS", prestige: 1.4 },
  { school: "Portland State", state: "OR", conference: "FCS", prestige: 1.4 },
  { school: "Northern Colorado", state: "CO", conference: "FCS", prestige: 1.4 },
  { school: "Idaho State", state: "ID", conference: "FCS", prestige: 1.4 },
  { school: "Charleston Southern", state: "SC", conference: "FCS", prestige: 1.4 },

  // FCS depth, so every state has a credible local board of its own
  { school: "North Dakota", state: "ND", conference: "FCS", prestige: 1.8 },
  { school: "Southeastern Louisiana", state: "LA", conference: "FCS", prestige: 1.6 },
  { school: "Harvard", state: "MA", conference: "FCS", prestige: 1.6 },
  { school: "Princeton", state: "NJ", conference: "FCS", prestige: 1.6 },
  { school: "Mercer", state: "GA", conference: "FCS", prestige: 1.5 },
  { school: "Stephen F. Austin", state: "TX", conference: "FCS", prestige: 1.5 },
  { school: "Central Arkansas", state: "AR", conference: "FCS", prestige: 1.5 },
  { school: "Prairie View A&M", state: "TX", conference: "FCS", prestige: 1.5 },
  { school: "Alabama State", state: "AL", conference: "FCS", prestige: 1.5 },
  { school: "Alabama A&M", state: "AL", conference: "FCS", prestige: 1.5 },
  { school: "Bethune-Cookman", state: "FL", conference: "FCS", prestige: 1.5 },
  { school: "Norfolk State", state: "VA", conference: "FCS", prestige: 1.5 },
  { school: "Hampton", state: "VA", conference: "FCS", prestige: 1.5 },
  { school: "Towson", state: "MD", conference: "FCS", prestige: 1.5 },
  { school: "Monmouth", state: "NJ", conference: "FCS", prestige: 1.5 },
  { school: "Penn", state: "PA", conference: "FCS", prestige: 1.5 },
  { school: "Yale", state: "CT", conference: "FCS", prestige: 1.5 },
  { school: "Dartmouth", state: "NH", conference: "FCS", prestige: 1.5 },
  { school: "Southern Utah", state: "UT", conference: "FCS", prestige: 1.4 },
  { school: "San Diego", state: "CA", conference: "FCS", prestige: 1.4 },
  { school: "Abilene Christian", state: "TX", conference: "FCS", prestige: 1.4 },
  { school: "Tarleton State", state: "TX", conference: "FCS", prestige: 1.4 },
  { school: "Texas Southern", state: "TX", conference: "FCS", prestige: 1.4 },
  { school: "Northwestern State", state: "LA", conference: "FCS", prestige: 1.4 },
  { school: "Arkansas-Pine Bluff", state: "AR", conference: "FCS", prestige: 1.4 },
  { school: "North Alabama", state: "AL", conference: "FCS", prestige: 1.4 },
  { school: "Tennessee Tech", state: "TN", conference: "FCS", prestige: 1.4 },
  { school: "Gardner-Webb", state: "NC", conference: "FCS", prestige: 1.4 },
  { school: "Campbell", state: "NC", conference: "FCS", prestige: 1.4 },
  { school: "Indiana State", state: "IN", conference: "FCS", prestige: 1.4 },
  { school: "Eastern Illinois", state: "IL", conference: "FCS", prestige: 1.4 },
  { school: "Drake", state: "IA", conference: "FCS", prestige: 1.4 },
  { school: "Morgan State", state: "MD", conference: "FCS", prestige: 1.4 },
  { school: "Fordham", state: "NY", conference: "FCS", prestige: 1.4 },
  { school: "Colgate", state: "NY", conference: "FCS", prestige: 1.4 },
  { school: "Cornell", state: "NY", conference: "FCS", prestige: 1.4 },
  { school: "Bucknell", state: "PA", conference: "FCS", prestige: 1.4 },
  { school: "Sacred Heart", state: "CT", conference: "FCS", prestige: 1.4 },
  { school: "Bryant", state: "RI", conference: "FCS", prestige: 1.4 },
  { school: "Utah Tech", state: "UT", conference: "FCS", prestige: 1.3 },
  { school: "Houston Christian", state: "TX", conference: "FCS", prestige: 1.3 },
  { school: "Lamar", state: "TX", conference: "FCS", prestige: 1.3 },
  { school: "West Georgia", state: "GA", conference: "FCS", prestige: 1.3 },
  { school: "Stetson", state: "FL", conference: "FCS", prestige: 1.3 },
  { school: "Jacksonville", state: "FL", conference: "FCS", prestige: 1.3 },
  { school: "Presbyterian", state: "SC", conference: "FCS", prestige: 1.3 },
  { school: "Davidson", state: "NC", conference: "FCS", prestige: 1.3 },
  { school: "Morehead State", state: "KY", conference: "FCS", prestige: 1.3 },
  { school: "Valparaiso", state: "IN", conference: "FCS", prestige: 1.3 },
  { school: "Butler", state: "IN", conference: "FCS", prestige: 1.3 },
  { school: "Western Illinois", state: "IL", conference: "FCS", prestige: 1.3 },
  { school: "Delaware State", state: "DE", conference: "FCS", prestige: 1.3 },
  { school: "Georgetown", state: "DC", conference: "FCS", prestige: 1.3 },
  { school: "Wagner", state: "NY", conference: "FCS", prestige: 1.3 },
  { school: "Marist", state: "NY", conference: "FCS", prestige: 1.3 },
  { school: "Columbia", state: "NY", conference: "FCS", prestige: 1.3 },
  { school: "Brown", state: "RI", conference: "FCS", prestige: 1.3 },
  { school: "Merrimack", state: "MA", conference: "FCS", prestige: 1.3 },

  // Small-college programs, so states without an FCS option still recruit
  // their own low-rated locals instead of shipping them out of the region.
  { school: "St. Thomas", state: "MN", conference: "FCS", prestige: 1.6 },
  { school: "Washburn", state: "KS", conference: "Division II", prestige: 1.5 },
  { school: "Pittsburg State", state: "KS", conference: "Division II", prestige: 1.5 },
  { school: "Emporia State", state: "KS", conference: "Division II", prestige: 1.5 },
  { school: "Fort Hays State", state: "KS", conference: "Division II", prestige: 1.5 },
  { school: "Minnesota State", state: "MN", conference: "Division II", prestige: 1.5 },
  { school: "Bemidji State", state: "MN", conference: "Division II", prestige: 1.5 },
  { school: "Nebraska-Kearney", state: "NE", conference: "Division II", prestige: 1.5 },
  { school: "Wayne State (NE)", state: "NE", conference: "Division II", prestige: 1.5 },
  { school: "Doane", state: "NE", conference: "NAIA", prestige: 1.5 },
  { school: "Shepherd", state: "WV", conference: "Division II", prestige: 1.5 },
  { school: "West Virginia State", state: "WV", conference: "Division II", prestige: 1.5 },
  { school: "Fairmont State", state: "WV", conference: "Division II", prestige: 1.5 },
  { school: "Glenville State", state: "WV", conference: "Division II", prestige: 1.5 },
  { school: "Wisconsin-Whitewater", state: "WI", conference: "Division III", prestige: 1.5 },
  { school: "Wisconsin-La Crosse", state: "WI", conference: "Division III", prestige: 1.5 },
  { school: "Wisconsin-Oshkosh", state: "WI", conference: "Division III", prestige: 1.5 },
];

export function schoolByName(name: string): School | undefined {
  return SCHOOLS.find((entry) => entry.school === name);
}

/** Every state that appears in the hometown pool, for the build-a-prospect tab. */
export const HOMETOWN_STATES: string[] = [
  ...new Set(HOMETOWNS.map((entry) => entry.state)),
].sort();

/* ------------------------------------------------------------------ */
/* Development arcs                                                    */
/* ------------------------------------------------------------------ */

/**
 * College development is the reason a two-star can leave as a first-round pick
 * and a five-star can go undrafted. The arc shifts the NFL grade off the
 * baseline the recruiting rating implies.
 */
export type DevelopmentArc = {
  key: string;
  label: string;
  weight: number;
  minDelta: number;
  maxDelta: number;
  blurb: string;
};

export const DEVELOPMENT_ARCS: DevelopmentArc[] = [
  {
    key: "generational",
    label: "Generational riser",
    weight: 2,
    minDelta: 3.4,
    maxDelta: 5.4,
    blurb: "Almost nothing about the recruiting profile predicted this.",
  },
  {
    key: "breakout",
    label: "Late-blooming breakout",
    weight: 8,
    minDelta: 1.5,
    maxDelta: 3.4,
    blurb: "Outplayed his recruiting ranking by a full tier.",
  },
  {
    key: "riser",
    label: "Steady riser",
    weight: 14,
    minDelta: 0.6,
    maxDelta: 1.5,
    blurb: "Got measurably better every season on campus.",
  },
  {
    key: "advertised",
    label: "As advertised",
    weight: 34,
    minDelta: -0.4,
    maxDelta: 0.6,
    blurb: "Became roughly the player he was projected to be.",
  },
  {
    key: "underwhelmed",
    label: "Underwhelming return",
    weight: 18,
    minDelta: -1.3,
    maxDelta: -0.4,
    blurb: "Good, never great — the billing was always slightly ahead of him.",
  },
  {
    key: "injuries",
    label: "Injury-shortened arc",
    weight: 9,
    minDelta: -2.6,
    maxDelta: -0.8,
    blurb: "Availability, not ability, defined the college years.",
  },
  {
    key: "stalled",
    label: "Never developed",
    weight: 11,
    minDelta: -3.6,
    maxDelta: -1.6,
    blurb: "The leap never came; he is close to the player he arrived as.",
  },
  {
    key: "bust",
    label: "Full flameout",
    weight: 4,
    minDelta: -6.0,
    maxDelta: -3.6,
    blurb: "Lost the job, lost the room, and never got either back.",
  },
];

export function arcByLabel(label: string): DevelopmentArc | undefined {
  return DEVELOPMENT_ARCS.find((arc) => arc.label === label);
}

/** Describes an observed grade delta — used when both rating and grade are locked. */
export function arcFromDelta(delta: number): DevelopmentArc {
  const inRange = DEVELOPMENT_ARCS.find(
    (arc) => delta >= arc.minDelta && delta <= arc.maxDelta,
  );

  if (inRange) {
    return inRange;
  }

  let closest = DEVELOPMENT_ARCS[0] as DevelopmentArc;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const arc of DEVELOPMENT_ARCS) {
    const midpoint = (arc.minDelta + arc.maxDelta) / 2;
    const distance = Math.abs(midpoint - delta);

    if (distance < bestDistance) {
      bestDistance = distance;
      closest = arc;
    }
  }

  return closest;
}
