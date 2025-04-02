var l = console.log;

import { state } from "./general.js";

export function backgroundGrid() {
  var canvas = document.querySelector(".background-layer-canvas");
  var cs = canvas.getContext("2d");

  var settings = state.getSettings();
  var wrapper = settings.wrapper;
  var wrapperDOMElement = wrapper.wrapperElement;
  var gridStep = wrapper.gridStep;

  setTimeout(() => {
    wrapperDOMElement.classList.remove("invisible");
  });

  wrapperDOMElement.style.width = wrapper.width + "px";
  wrapperDOMElement.style.height = wrapper.height + "px";

  canvas.width = wrapperDOMElement.clientWidth;
  canvas.height = wrapperDOMElement.clientHeight;

  var horizontalLinesCount = Math.floor(canvas.width) / gridStep;
  var verticalLinesCount = Math.floor(canvas.height) / gridStep;

  cs.clearRect(0, 0, canvas.width, canvas.height);
  cs.beginPath();
  cs.fillStyle = "hsl(210, 18%, 22%)";
  cs.rect(0, 0, canvas.width, canvas.height);
  cs.fill();
  cs.strokeStyle = "hsl(0, 0%, 10%)";
  cs.lineWidth = 0.5;

  var i;
  for (i = 1; i < horizontalLinesCount; i++) {
    cs.moveTo(i * gridStep, 0);
    cs.lineTo(i * gridStep, canvas.height);
  }

  for (i = 1; i < verticalLinesCount; i++) {
    cs.moveTo(0, i * gridStep);
    cs.lineTo(canvas.width, i * gridStep);
  }

  cs.stroke();
  cs.closePath();
}
