const THEMES = ["water", "flight", "family", "city", "forest", "work", "music", "memory"];
const SOURCE_TYPES = ["journal", "note", "voice-transcribed"];
const TIME_BUCKETS = ["dawn", "day", "dusk", "night"];

const THEME_SNIPPETS = {
  water: [
    "I kept walking beside a dark river that reflected neon signs.",
    "The tide was calm and every step sounded like distant rain.",
  ],
  flight: [
    "I floated above rooftops and could see streets folding into patterns.",
    "Lifting off felt effortless until the wind shifted near the bridge.",
  ],
  family: [
    "A familiar kitchen table appeared with people from different years.",
    "I heard old voices blending with present conversations.",
  ],
  city: [
    "The train map re-drew itself as I moved through side streets.",
    "Buildings were close enough to touch but changed color every block.",
  ],
  forest: [
    "Pines opened into a bright clearing with unusual stone circles.",
    "Footsteps on wet soil echoed like someone following at a distance.",
  ],
  work: [
    "I was finishing a project while the deadline clock moved backward.",
    "The office lights flickered each time I solved a small task.",
  ],
  music: [
    "A melody repeated and each repetition changed the room around me.",
    "I could identify every instrument but none of the performers.",
  ],
  memory: [
    "A hallway from childhood connected to a place I visited last week.",
    "Small details felt precise while faces remained blurry.",
  ],
};

const AMBIGUOUS_HINTS = [
  "The scene moved between two places without a clear transition.",
  "I knew the setting but could not explain why it mattered.",
  "Everything felt familiar and new at the same time.",
  "A single object connected two unrelated moments.",
];

const NOISY_TEXTS = [
  "Color, static, quick jump, then silence.",
  "Half sentence, missing context, unknown speaker.",
  "Notes are fragmented and unclear.",
  "Random symbols in a short burst of thought.",
  "Could not reconstruct sequence after waking.",
];

function buildFragment(index) {
  const theme = THEMES[index % THEMES.length];
  const secondaryTheme = THEMES[(index + 3) % THEMES.length];
  const isAmbiguous = index % 5 === 0;
  const isNoisy = [8, 19, 31, 42, 49].includes(index);
  const snippets = THEME_SNIPPETS[theme];

  let text = `${snippets[0]} ${snippets[1]}`;
  if (isAmbiguous) {
    text = `${text} ${AMBIGUOUS_HINTS[index % AMBIGUOUS_HINTS.length]}`;
  }
  if (isNoisy) {
    text = NOISY_TEXTS[index % NOISY_TEXTS.length];
  }

  return {
    id: `frag-${String(index + 1).padStart(3, "0")}`,
    text,
    theme_tags: isAmbiguous ? [theme, secondaryTheme] : [theme],
    intensity: (index % 5) + 1,
    timestamp_bucket: TIME_BUCKETS[index % TIME_BUCKETS.length],
    source_type: SOURCE_TYPES[index % SOURCE_TYPES.length],
  };
}

export const SAMPLE_FRAGMENTS = Array.from({ length: 50 }, (_, index) => buildFragment(index));
