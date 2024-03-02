import { useEffect, useState } from "react";
import { AppManager } from "../babylonManager/AppManager";

import "./SceneContainer.css";

export default function SceneContainer() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setCanvas(document.getElementById("renderCanvas") as HTMLCanvasElement);
    if (!canvas) return;
    new AppManager(canvas);
  }, [canvas]);

  return (
    <div className="canvasContainer">
      <h3 className="projectTitle">Baby Nier Automata Minigame uwu</h3>
      <canvas id="renderCanvas" className="babylonCanvas" />
    </div>
  );
}
