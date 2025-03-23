var l = console.log;

export var gridStep = 30;

export function elementsMoving() {
  var pointerOffsetX = 0;
  var pointerOffsetY = 0;

  function dragStart(e) {
    pointerOffsetX = e.offsetX;
    pointerOffsetY = e.offsetY;
  }

  function dragEnd(e) {
    var blockX = e.x;
    var blockY = e.y;

    var gridSnappedX =
      Math.round((blockX - pointerOffsetX) / gridStep) * gridStep;
    var gridSnappedY =
      Math.round((blockY - pointerOffsetY) / gridStep) * gridStep;

    e.toElement.style.left = gridSnappedX + "px";
    e.toElement.style.top = gridSnappedY + "px";
  }

  document.addEventListener("dragstart", dragStart);
  document.addEventListener("dragend", dragEnd);
}
