export function fillBackgroundCanvas(canvas, gridStep) {
  var horizontalLinesCount = Math.floor(canvas.width) / gridStep;
  var verticalLinesCount = Math.floor(canvas.height) / gridStep;

  var cs = canvas.getContext("2d");

  cs.clearRect(0, 0, canvas.width, canvas.height);
  cs.beginPath();
  cs.fillStyle = "hsl(210, 14%, 16%)";
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
