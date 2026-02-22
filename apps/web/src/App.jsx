import React, { useEffect, useMemo, useRef, useState } from "react";
import { Application, Container, Graphics, Text } from "pixi.js";
import { SAMPLE_FRAGMENTS } from "./data/sampleFragments";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getIntensityColor(intensity) {
  const palette = {
    1: 0x69d2e7,
    2: 0xa7dbd8,
    3: 0xe0e4cc,
    4: 0xf38630,
    5: 0xfa6900,
  };
  return palette[intensity] ?? 0x7bdff2;
}

function createLayoutSignature(nodes) {
  return [...nodes]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((node) => `${node.id}:${node.clusterId}:${node.x}:${node.y}`)
    .join("|");
}

function computeAtlasBounds(atlas) {
  if (!atlas) return null;

  let xMin = Number.POSITIVE_INFINITY;
  let yMin = Number.POSITIVE_INFINITY;
  let xMax = Number.NEGATIVE_INFINITY;
  let yMax = Number.NEGATIVE_INFINITY;

  atlas.clusters.forEach((cluster) => {
    xMin = Math.min(xMin, cluster.centerX - cluster.radius - 18);
    xMax = Math.max(xMax, cluster.centerX + cluster.radius + 18);
    yMin = Math.min(yMin, cluster.centerY - cluster.radius - 34);
    yMax = Math.max(yMax, cluster.centerY + cluster.radius + 18);
  });

  atlas.nodes.forEach((node) => {
    xMin = Math.min(xMin, node.x - 12);
    xMax = Math.max(xMax, node.x + 12);
    yMin = Math.min(yMin, node.y - 12);
    yMax = Math.max(yMax, node.y + 12);
  });

  if (!Number.isFinite(xMin) || !Number.isFinite(yMin)) {
    return null;
  }

  return { xMin, yMin, xMax, yMax };
}

export default function App() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const worldRef = useRef(null);
  const wheelHandlerRef = useRef(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [seed, setSeed] = useState("spike-seed-01");
  const [clusterMode, setClusterMode] = useState("theme");
  const [atlas, setAtlas] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAtlas, setIsLoadingAtlas] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [snapshotIdInput, setSnapshotIdInput] = useState("");

  const selectedNode = useMemo(
    () => atlas?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [atlas, selectedNodeId],
  );

  const selectedFragment = useMemo(() => {
    if (!atlas || !selectedNode) return null;
    return atlas.fragments.find((fragment) => fragment.id === selectedNode.fragmentId) ?? null;
  }, [atlas, selectedNode]);

  const layoutSignature = useMemo(() => {
    if (!atlas) return "";
    return createLayoutSignature(atlas.nodes);
  }, [atlas]);

  const clusterSummary = useMemo(() => {
    if (!atlas) return [];
    return [...atlas.clusters]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((cluster) => ({
        id: cluster.id,
        label: cluster.label,
        reason: cluster.reason,
        nodeCount: cluster.nodeCount,
      }));
  }, [atlas]);

  function getCameraState() {
    const world = worldRef.current;
    if (!world) {
      return {
        zoom: 1,
        panX: 0,
        panY: 0,
      };
    }
    return {
      zoom: Number(world.scale.x.toFixed(4)),
      panX: Number(world.x.toFixed(2)),
      panY: Number(world.y.toFixed(2)),
    };
  }

  function handleSelectNode(nodeId) {
    setSelectedNodeId(nodeId);
    setStatusMessage(`Selected node: ${nodeId}`);
  }

  function clearSelection() {
    setSelectedNodeId(null);
    setStatusMessage("Selection cleared.");
  }

  function applyCameraState(uiState, fallbackAtlas) {
    const world = worldRef.current;
    if (!world) return;

    if (
      uiState &&
      Number.isFinite(uiState.zoom) &&
      Number.isFinite(uiState.panX) &&
      Number.isFinite(uiState.panY)
    ) {
      world.scale.set(clamp(uiState.zoom, 0.35, 3.5));
      world.x = uiState.panX;
      world.y = uiState.panY;
      return;
    }

    fitCameraToAtlas(fallbackAtlas);
  }

  function fitCameraToAtlas(targetAtlas) {
    const app = appRef.current;
    const world = worldRef.current;
    if (!app || !world || !canvasRef.current) return;
    const bounds = computeAtlasBounds(targetAtlas);
    if (!bounds) return;

    const viewWidth = canvasRef.current.clientWidth;
    const viewHeight = canvasRef.current.clientHeight;
    const padding = 32;
    const contentWidth = Math.max(bounds.xMax - bounds.xMin, 1);
    const contentHeight = Math.max(bounds.yMax - bounds.yMin, 1);
    const fitScale = Math.min(
      (viewWidth - padding * 2) / contentWidth,
      (viewHeight - padding * 2) / contentHeight,
    );
    const scale = clamp(fitScale, 0.35, 2.6);
    const centerX = (bounds.xMin + bounds.xMax) / 2;
    const centerY = (bounds.yMin + bounds.yMax) / 2;

    world.scale.set(scale);
    world.x = viewWidth / 2 - centerX * scale;
    world.y = viewHeight / 2 - centerY * scale;
  }

  async function runGeneration() {
    setIsGenerating(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/atlas/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fragments: SAMPLE_FRAGMENTS,
          seed,
          clusterMode,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate atlas");
      }

      setAtlas(payload);
      setSelectedNodeId(null);
      setSnapshotIdInput(payload.id ?? "");
      setStatusMessage(`Generated ${payload.nodeCount} nodes in ${payload.perf?.generationMs ?? "?"}ms.`);
      requestAnimationFrame(() => fitCameraToAtlas(payload));
    } catch (requestError) {
      setAtlas(null);
      setError(requestError.message || "Failed to generate atlas");
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveSnapshot() {
    if (!atlas?.id) {
      setError("Generate an atlas before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    setStatusMessage("");

    try {
      const payload = {
        ...atlas,
        uiState: {
          selectedNodeId,
          ...getCameraState(),
        },
      };

      const response = await fetch(`${API_BASE_URL}/atlas/${atlas.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Failed to save atlas snapshot");
      }

      setStatusMessage(`Snapshot saved: ${body.id}`);
      setSnapshotIdInput(body.id);
    } catch (requestError) {
      setError(requestError.message || "Failed to save atlas snapshot");
    } finally {
      setIsSaving(false);
    }
  }

  async function loadSnapshot() {
    const snapshotId = snapshotIdInput.trim();
    if (!snapshotId) {
      setError("Enter a snapshot id to load.");
      return;
    }

    setIsLoadingAtlas(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/atlas/${snapshotId}/load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load atlas snapshot");
      }

      setAtlas(payload);
      setSeed(payload.seed ?? seed);
      setClusterMode(payload.clusterMode ?? clusterMode);
      setSelectedNodeId(payload.uiState?.selectedNodeId ?? null);
      setStatusMessage(`Snapshot loaded: ${payload.id}`);
      requestAnimationFrame(() => applyCameraState(payload.uiState, payload));
    } catch (requestError) {
      setError(requestError.message || "Failed to load atlas snapshot");
    } finally {
      setIsLoadingAtlas(false);
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const app = new Application();
    let isDisposed = false;

    async function init() {
      await app.init({
        background: "#0f1226",
        resizeTo: canvasRef.current,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (isDisposed || !canvasRef.current) return;

      canvasRef.current.appendChild(app.canvas);
      appRef.current = app;

      const world = new Container();
      worldRef.current = world;
      app.stage.addChild(world);

      app.stage.eventMode = "static";
      app.stage.hitArea = app.screen;
      app.stage.on("pointerdown", (event) => {
        if (event.target !== app.stage) return;
        dragRef.current.active = true;
        dragRef.current.lastX = event.global.x;
        dragRef.current.lastY = event.global.y;
      });
      app.stage.on("pointerup", () => {
        dragRef.current.active = false;
      });
      app.stage.on("pointerupoutside", () => {
        dragRef.current.active = false;
      });
      app.stage.on("pointermove", (event) => {
        if (!dragRef.current.active) return;
        const dx = event.global.x - dragRef.current.lastX;
        const dy = event.global.y - dragRef.current.lastY;
        dragRef.current.lastX = event.global.x;
        dragRef.current.lastY = event.global.y;
        world.x += dx;
        world.y += dy;
      });
      app.stage.on("pointertap", (event) => {
        if (event.target === app.stage) {
          clearSelection();
        }
      });

      wheelHandlerRef.current = (event) => {
        event.preventDefault();
        const scaleBefore = world.scale.x;
        const scaleAfter = clamp(scaleBefore * (event.deltaY > 0 ? 0.92 : 1.08), 0.35, 3.5);
        if (scaleAfter === scaleBefore) return;

        const rect = app.canvas.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        const worldX = (pointerX - world.x) / scaleBefore;
        const worldY = (pointerY - world.y) / scaleBefore;

        world.scale.set(scaleAfter);
        world.x = pointerX - worldX * scaleAfter;
        world.y = pointerY - worldY * scaleAfter;
      };

      app.canvas.addEventListener("wheel", wheelHandlerRef.current, { passive: false });
    }

    init();

    return () => {
      isDisposed = true;
      const liveApp = appRef.current;
      if (liveApp?.canvas && wheelHandlerRef.current) {
        liveApp.canvas.removeEventListener("wheel", wheelHandlerRef.current);
      }
      if (liveApp) {
        liveApp.destroy(true, { children: true });
      }
      appRef.current = null;
      worldRef.current = null;
    };
  }, []);

  useEffect(() => {
    runGeneration();
    // Run once on boot with the default seed + mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    world.removeChildren();
    if (!atlas) return;

    const clusterById = new Map(atlas.clusters.map((cluster) => [cluster.id, cluster]));

    atlas.clusters.forEach((cluster) => {
      const region = new Graphics()
        .circle(0, 0, cluster.radius)
        .fill({ color: 0x2d4f77, alpha: 0.15 })
        .stroke({ color: 0x5a84b0, alpha: 0.55, width: 1 });

      region.x = Math.round(cluster.centerX);
      region.y = Math.round(cluster.centerY);
      world.addChild(region);

      const clusterLabel = new Text({
        text: `${cluster.label} (${cluster.nodeCount})`,
        style: {
          fill: 0xd9e9ff,
          fontSize: 13,
          fontWeight: "600",
          fontFamily: "monospace",
        },
      });
      clusterLabel.resolution = appRef.current?.renderer.resolution ?? window.devicePixelRatio ?? 1;
      clusterLabel.roundPixels = true;
      clusterLabel.x = Math.round(cluster.centerX - cluster.radius + 8);
      clusterLabel.y = Math.round(cluster.centerY - cluster.radius - 20);
      world.addChild(clusterLabel);
    });

    atlas.nodes.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      const fillColor = getIntensityColor(node.intensity);
      const nodeGraphic = new Graphics()
        .circle(0, 0, isSelected ? 10 : 8)
        .fill(fillColor)
        .stroke({ color: 0x0d1528, width: 2, alpha: 0.9 });

      nodeGraphic.x = Math.round(node.x);
      nodeGraphic.y = Math.round(node.y);
      nodeGraphic.eventMode = "static";
      nodeGraphic.cursor = "pointer";
      nodeGraphic.on("pointertap", () => {
        handleSelectNode(node.id);
      });

      const cluster = clusterById.get(node.clusterId);
      nodeGraphic.label = `${node.id} | ${cluster?.label ?? "unknown"}`;
      world.addChild(nodeGraphic);
    });
  }, [atlas, selectedNodeId]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    window.__dreamAtlasDebug = {
      getAtlas: () => atlas,
      getSelectedNodeId: () => selectedNodeId,
      getCameraState,
      selectNodeById: (nodeId) => {
        if (!atlas?.nodes?.some((node) => node.id === nodeId)) return false;
        handleSelectNode(nodeId);
        return true;
      },
      clearSelection: () => {
        clearSelection();
        return true;
      },
    };

    return () => {
      delete window.__dreamAtlasDebug;
    };
  }, [atlas, selectedNodeId]);

  return (
    <div className="page">
      <header>
        <h1>Dream Atlas — POC Scaffold</h1>
        <p>First end-to-end flow: sample fragments to seeded generation to interactive atlas.</p>
      </header>

      <section className="controls">
        <label htmlFor="seed-input">
          Seed
          <input
            id="seed-input"
            name="seed"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
          />
        </label>
        <label htmlFor="cluster-mode">
          Cluster mode
          <select
            id="cluster-mode"
            name="clusterMode"
            value={clusterMode}
            onChange={(event) => setClusterMode(event.target.value)}
          >
            <option value="theme">theme</option>
            <option value="intensity">intensity</option>
          </select>
        </label>
        <label htmlFor="snapshot-id">
          Snapshot ID
          <input
            id="snapshot-id"
            name="snapshotId"
            value={snapshotIdInput}
            onChange={(event) => setSnapshotIdInput(event.target.value)}
            placeholder="atlas-..."
          />
        </label>
        <button type="button" onClick={runGeneration} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Atlas"}
        </button>
        <button type="button" className="secondary" onClick={saveSnapshot} disabled={!atlas || isSaving}>
          {isSaving ? "Saving..." : "Save Snapshot"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={loadSnapshot}
          disabled={isLoadingAtlas}
        >
          {isLoadingAtlas ? "Loading..." : "Load Snapshot"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => fitCameraToAtlas(atlas)}
          disabled={!atlas}
        >
          Fit View
        </button>
        <button
          type="button"
          className="secondary"
          onClick={clearSelection}
          disabled={!selectedNodeId}
        >
          Clear Selection
        </button>
      </section>

      {error ? <p className="error">{error}</p> : null}
      {statusMessage ? <p className="status">{statusMessage}</p> : null}

      <section className="workspace">
        <div className="canvas-wrap" ref={canvasRef} />
        <aside className="panel">
          <h2>Run Summary</h2>
          <ul>
            <li>Snapshot: {atlas?.id ?? "-"}</li>
            <li>Fragments: {SAMPLE_FRAGMENTS.length}</li>
            <li>Nodes: {atlas?.nodeCount ?? 0}</li>
            <li>Clusters: {atlas?.clusters.length ?? 0}</li>
            <li>Mode: {atlas?.clusterMode ?? "-"}</li>
            <li>Layout: {atlas?.layout?.shape ?? "-"}</li>
            <li>Generation: {atlas?.perf?.generationMs ?? "-"} ms</li>
            <li>Signature: {layoutSignature ? `${layoutSignature.slice(0, 18)}...` : "-"}</li>
          </ul>

          <h2>Cluster Reasons</h2>
          {clusterSummary.length > 0 ? (
            <ul>
              {clusterSummary.map((cluster) => (
                <li key={cluster.id}>
                  {cluster.label} ({cluster.nodeCount}): {cluster.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p>No clusters loaded.</p>
          )}

          <h2>Selected Node</h2>
          {selectedNode && selectedFragment ? (
            <div className="selection">
              <p>
                <strong>{selectedFragment.id}</strong>
              </p>
              <p>{selectedFragment.text}</p>
              <p>Tags: {selectedFragment.theme_tags.join(", ")}</p>
              <p>Intensity: {selectedFragment.intensity}</p>
              <p>Source: {selectedFragment.source_type}</p>
              <p>Time bucket: {selectedFragment.timestamp_bucket}</p>
            </div>
          ) : (
            <p>Click a node in the atlas to inspect details.</p>
          )}
        </aside>
      </section>
    </div>
  );
}
