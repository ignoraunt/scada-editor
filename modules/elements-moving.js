var l = console.log;

import { structures } from "./temp-oop-handling.js";

export function elementsMoving() {
  (function handleMovementListeners() {
    var gridStep = 30;

    var activeWrapper = document.querySelector(".active-wrapper");

    var wrapperOffsetX = activeWrapper.offsetLeft;
    var wrapperOffsetY = activeWrapper.offsetTop;

    var pointerOffsetX = 0;
    var pointerOffsetY = 0;

    function handleDragStart(e) {
      pointerOffsetX = wrapperOffsetX + e.offsetX;
      pointerOffsetY = wrapperOffsetY + e.offsetY;
    }

    function handleDragEnd(e) {
      var id = e.target.dataset.id;

      var elementX = e.x;
      var elementY = e.y;

      var x = Math.round((elementX - pointerOffsetX) / gridStep) * gridStep;
      var y = Math.round((elementY - pointerOffsetY) / gridStep) * gridStep;

      structures.moveElement(id, x, y);
    }

    activeWrapper.addEventListener("dragstart", handleDragStart);
    activeWrapper.addEventListener("dragend", handleDragEnd);
  })();
}
