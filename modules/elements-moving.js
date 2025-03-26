var l = console.log;

import { structures } from "./temp-oop-handling.js";

export var gridStep = 30;

export function elementsMoving() {
  (function handleMovementListeners() {
    var activeWrapper = document.querySelector(".active-wrapper");

    var wrapperOffsetX = activeWrapper.offsetLeft;
    var wrapperOffsetY = activeWrapper.offsetTop;

    var pointerOffsetX = 0;
    var pointerOffsetY = 0;

    function oopStartDrag(e) {
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

    activeWrapper.addEventListener("dragstart", oopStartDrag);
    activeWrapper.addEventListener("dragend", handleDragEnd);
  })();
}
