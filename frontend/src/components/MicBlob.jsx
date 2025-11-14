import React, { useState } from "react";
import micIcon from "../assets/mic.svg";
import "./MicBlob.css";

export default function MicBlob() {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`mic-blob ${active ? "listening" : ""}`}
      onClick={() => setActive(!active)}
    >
      <img src={micIcon} alt="" className="mic-icon" />
    </div>
  );
}
