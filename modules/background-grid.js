import { gridStep } from "/modules/elements-moving.js";

export function backgroundGrid() {
  var canvas = document.querySelector("canvas");
  var cs = canvas.getContext("2d");

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  var horizontalLinesCount = Math.floor(canvas.width) / gridStep;
  var verticalLinesCount = Math.floor(canvas.height) / gridStep;

  cs.clearRect(0, 0, canvas.width, canvas.height);

  cs.beginPath();
  cs.strokeStyle = "hsl(0, 0%, 10%)";
  cs.lineWidth = 1;

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
