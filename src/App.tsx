import { useState } from "react";
import MorphScroll from "./MorphScroll";
import DroneIntro from "./DroneIntro";

export default function App() {
  // The drone landing is the first page. Only mount the heavy scroll experience
  // once the visitor presses "Explore", so its asset preload doesn't compete
  // with the 3D intro for bandwidth/GPU.
  const [entered, setEntered] = useState(false);

  return (
    <>
      {entered && <MorphScroll />}
      {!entered && <DroneIntro onEnter={() => setEntered(true)} />}
    </>
  );
}
