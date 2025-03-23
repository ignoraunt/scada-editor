var l = console.log;

export var gridStep = 30;

export function elementsMoving() {
  var activeWrapper = document.querySelector(".active-wrapper");

  var wrapperOffsetX = activeWrapper.offsetLeft;
  var wrapperOffsetY = activeWrapper.offsetTop;

  var pointerOffsetX = 0;
  var pointerOffsetY = 0;

  function dragStart(e) {
    l(e)
    pointerOffsetX = wrapperOffsetX + e.offsetX;
    pointerOffsetY = wrapperOffsetY + e.offsetY;
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

  activeWrapper.addEventListener("dragstart", dragStart);
  activeWrapper.addEventListener("dragend", dragEnd);
}
