import { useEffect } from "react";
import { MainScene } from "./MainScene";

import "./SceneContainer.css";

export default function SceneContainer() {
  useEffect(() => {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    new MainScene(canvas);
  }, []);

  return (
    <div className="canvasContainer">
      <h3 className="projectTitle">Baby Nier Automata Minigame uwu</h3>
      <canvas id="renderCanvas" className="babylonCanvas" />
    </div>
  );
}
