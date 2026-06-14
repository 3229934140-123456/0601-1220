import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Storyboard from "@/pages/Storyboard";
import Painting from "@/pages/Painting";
import Characters from "@/pages/Characters";
import Text from "@/pages/Text";
import Color from "@/pages/Color";
import Composite from "@/pages/Composite";
import Share from "@/pages/Share";
import { useUIStore } from "@/store";
import type { WorkspaceKey } from "@/types";

const pathToWorkspace: Record<string, WorkspaceKey> = {
  "/": "home",
  "/workspace/storyboard": "storyboard",
  "/workspace/painting": "painting",
  "/workspace/characters": "characters",
  "/workspace/text": "text",
  "/workspace/color": "color",
  "/workspace/composite": "composite",
  "/workspace/share": "share",
};

function RouteSync() {
  const loc = useLocation();
  const setActive = useUIStore((s) => s.setActiveWorkspace);
  useEffect(() => {
    const key = pathToWorkspace[loc.pathname] || "home";
    setActive(key);
  }, [loc.pathname, setActive]);
  return null;
}

export default function App() {
  return (
    <Router>
      <RouteSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace/storyboard" element={<Storyboard />} />
        <Route path="/workspace/painting" element={<Painting />} />
        <Route path="/workspace/characters" element={<Characters />} />
        <Route path="/workspace/text" element={<Text />} />
        <Route path="/workspace/color" element={<Color />} />
        <Route path="/workspace/composite" element={<Composite />} />
        <Route path="/workspace/share" element={<Share />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
