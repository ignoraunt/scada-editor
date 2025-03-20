import { gridStep } from "/modules/moving-around.js";

export function initCanvas() {
  var canvas = document.querySelector("canvas");
  var cs = canvas.getContext("2d");

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  var horizontalStripesCount = Math.floor(canvas.width) / gridStep;
  var verticalStripesCount = Math.floor(canvas.height) / gridStep;

  cs.clearRect(0, 0, canvas.width, canvas.height);

  cs.beginPath();
  cs.strokeStyle = "hsla(210, 5%, 15%, 0.7)";
  cs.lineWidth = 1;

  var i;
  for (i = 1; i < horizontalStripesCount; i++) {
    cs.moveTo(i * gridStep, 0);
    cs.lineTo(i * gridStep, canvas.height);
  }

  for (i = 1; i < verticalStripesCount; i++) {
    cs.moveTo(0, i * gridStep);
    cs.lineTo(canvas.width, i * gridStep);
  }

  cs.stroke();
  cs.closePath();
}
