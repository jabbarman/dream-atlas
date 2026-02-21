const SUPPORTED_CLUSTER_MODES = new Set(["theme", "intensity"]);

function stringToSeed(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = stringToSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeFragment(raw) {
  const themeTags = Array.isArray(raw.theme_tags)
    ? raw.theme_tags
    : Array.isArray(raw.tags)
      ? raw.tags
      : [];

  const sanitizedTags = themeTags
    .filter((item) => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  return {
    id: safeString(raw.id, "fragment-unknown"),
    text: safeString(raw.text, "(missing fragment text)"),
    theme_tags: sanitizedTags.length > 0 ? sanitizedTags : ["uncategorized"],
    intensity: clamp(Number.parseInt(raw.intensity ?? 3, 10) || 3, 1, 5),
    timestamp_bucket: safeString(raw.timestamp_bucket, "unknown"),
    source_type: safeString(raw.source_type, "note"),
  };
}

function intensityBucket(intensity) {
  if (intensity <= 2) {
    return { id: "intensity-low", label: "Low intensity", reason: "Intensity bucket: 1-2" };
  }
  if (intensity === 3) {
    return { id: "intensity-medium", label: "Medium intensity", reason: "Intensity bucket: 3" };
  }
  return { id: "intensity-high", label: "High intensity", reason: "Intensity bucket: 4-5" };
}

function clusterFragments(fragments, clusterMode) {
  const groups = new Map();

  for (const fragment of fragments) {
    if (clusterMode === "intensity") {
      const bucket = intensityBucket(fragment.intensity);
      if (!groups.has(bucket.id)) {
        groups.set(bucket.id, {
          id: bucket.id,
          label: bucket.label,
          reason: bucket.reason,
          fragments: [],
        });
      }
      groups.get(bucket.id).fragments.push(fragment);
      continue;
    }

    const theme = fragment.theme_tags[0];
    const clusterId = `theme-${theme}`;
    if (!groups.has(clusterId)) {
      groups.set(clusterId, {
        id: clusterId,
        label: theme,
        reason: `Shared theme tag: ${theme}`,
        fragments: [],
      });
    }
    groups.get(clusterId).fragments.push(fragment);
  }

  return Array.from(groups.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function validateGenerateRequest(payload) {
  const body = payload ?? {};
  const errors = [];

  if (!SUPPORTED_CLUSTER_MODES.has(body.clusterMode ?? "theme")) {
    errors.push({
      field: "clusterMode",
      message: "clusterMode must be one of: theme, intensity",
    });
  }

  if (!Array.isArray(body.fragments) || body.fragments.length === 0) {
    errors.push({
      field: "fragments",
      message: "fragments must be a non-empty array",
    });
  } else {
    body.fragments.forEach((fragment, index) => {
      if (typeof fragment !== "object" || fragment === null) {
        errors.push({ field: `fragments[${index}]`, message: "fragment must be an object" });
        return;
      }
      if (typeof fragment.id !== "string" || fragment.id.trim().length === 0) {
        errors.push({ field: `fragments[${index}].id`, message: "id must be a non-empty string" });
      }
      if (typeof fragment.text !== "string" || fragment.text.trim().length === 0) {
        errors.push({
          field: `fragments[${index}].text`,
          message: "text must be a non-empty string",
        });
      }
      if (!Array.isArray(fragment.theme_tags) || fragment.theme_tags.length === 0) {
        errors.push({
          field: `fragments[${index}].theme_tags`,
          message: "theme_tags must be a non-empty array",
        });
      }
      if (
        typeof fragment.intensity !== "number" ||
        !Number.isFinite(fragment.intensity) ||
        fragment.intensity < 1 ||
        fragment.intensity > 5
      ) {
        errors.push({
          field: `fragments[${index}].intensity`,
          message: "intensity must be a number from 1 to 5",
        });
      }
      if (
        typeof fragment.timestamp_bucket !== "string" ||
        fragment.timestamp_bucket.trim().length === 0
      ) {
        errors.push({
          field: `fragments[${index}].timestamp_bucket`,
          message: "timestamp_bucket must be a non-empty string",
        });
      }
      if (typeof fragment.source_type !== "string" || fragment.source_type.trim().length === 0) {
        errors.push({
          field: `fragments[${index}].source_type`,
          message: "source_type must be a non-empty string",
        });
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      fragments: body.fragments,
      seed: safeString(body.seed ?? "default", "default"),
      clusterMode: body.clusterMode ?? "theme",
    },
  };
}

export function generateAtlasSnapshot({ fragments, seed, clusterMode }) {
  const start = Date.now();
  const rng = createRng(`${seed}:${clusterMode}:${fragments.length}`);
  const normalized = fragments.map((fragment) => normalizeFragment(fragment));
  const clusterGroups = clusterFragments(normalized, clusterMode);
  const clusters = [];
  const nodes = [];
  const totalClusters = Math.max(clusterGroups.length, 1);
  const baseRadius = 240;

  clusterGroups.forEach((cluster, clusterIndex) => {
    const angle = (Math.PI * 2 * clusterIndex) / totalClusters;
    const centerX = Math.cos(angle) * baseRadius;
    const centerY = Math.sin(angle) * baseRadius;
    const sortedFragments = [...cluster.fragments].sort((a, b) => a.id.localeCompare(b.id));

    sortedFragments.forEach((fragment, fragmentIndex) => {
      const localAngle = ((Math.PI * 2) / Math.max(sortedFragments.length, 1)) * fragmentIndex;
      const localRadius = 35 + rng() * 70;
      const jitterX = (rng() - 0.5) * 20;
      const jitterY = (rng() - 0.5) * 20;
      const x = centerX + Math.cos(localAngle) * localRadius + jitterX;
      const y = centerY + Math.sin(localAngle) * localRadius + jitterY;

      nodes.push({
        id: `node-${fragment.id}`,
        fragmentId: fragment.id,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        clusterId: cluster.id,
        intensity: fragment.intensity,
      });
    });

    clusters.push({
      id: cluster.id,
      label: cluster.label,
      reason: cluster.reason,
      centerX: Number(centerX.toFixed(2)),
      centerY: Number(centerY.toFixed(2)),
      radius: 95 + sortedFragments.length * 4,
      nodeCount: sortedFragments.length,
    });
  });

  return {
    id: `atlas-${stringToSeed(`${seed}:${clusterMode}:${normalized.length}`).toString(16)}`,
    seed,
    clusterMode,
    nodeCount: nodes.length,
    fragments: normalized,
    clusters,
    nodes,
    uiState: {
      selectedNodeId: null,
      zoom: 1,
      panX: 0,
      panY: 0,
    },
    perf: {
      generationMs: Date.now() - start,
    },
  };
}
