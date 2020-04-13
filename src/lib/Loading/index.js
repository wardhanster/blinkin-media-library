// inspired from https://codemyui.com/circle-css3-animated-spinners/

import React from "react";

import "./loading.css";

export default function Loading() {
  return (
    <div className="loader-container d-flex justify-content-center">
      <div className="spinner spinner-3"></div>
    </div>
  );
}
