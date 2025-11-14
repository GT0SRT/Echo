import React from "react";
import micIcon from "../assets/mic.svg";
import "./MicBlob.css";

export default function MicBlob({ listening }) {
  return (
    <div className={`mic-blob ${listening ? "listening" : ""}`}>
      <img src={micIcon} alt="mic" className="mic-icon" />
    </div>
  );
}
