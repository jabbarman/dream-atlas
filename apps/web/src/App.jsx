import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let app;

    async function init() {
      app = new Application();
      await app.init({
        background: "#0f1226",
        resizeTo: canvasRef.current,
        antialias: true,
      });

      canvasRef.current.appendChild(app.canvas);

      const node = new Graphics()
        .circle(0, 0, 14)
        .fill("#7bdff2");

      node.x = 240;
      node.y = 140;

      app.stage.addChild(node);
    }

    init();

    return () => {
      if (app) app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div className="page">
      <header>
        <h1>Dream Atlas — POC Scaffold</h1>
        <p>Core stack online: React + PixiJS + Node API.</p>
      </header>
      <section className="canvas-wrap" ref={canvasRef} />
    </div>
  );
}
