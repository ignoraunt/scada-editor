var l = console.log;

export var gridStep = 30;

export function movingAround() {
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

  // function generateBlocks(source) {
  //   var i;
  //   for (i = 0; i < source.length; i++) {
  //     var div = document.createElement("div");
  //     div.className = "gauge";
  //     div.innerText = "cloned";
  //     div.draggable = "true";
  //     div.style.left = source[i].x + "px";
  //     div.style.top = source[i].y + "px";
  //     div.style.width = source[i].width + "px";
  //     div.style.height = source[i].height + "px";
  //     document.body.prepend(div);
  //   }
  // }
}
