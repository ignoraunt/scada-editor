var l = console.log;

import { state } from "./general.js";

export function elementsMoving() {
  (function handleMovementListeners() {
    var settings = state.getSettings();
    var wrapper = settings.wrapper;
    var wrapperDOMElement = wrapper.wrapperElement;
    var gridStep = wrapper.gridStep;

    var wrapperOffsetX = wrapperDOMElement.offsetLeft;
    var wrapperOffsetY = wrapperDOMElement.offsetTop;

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

      state.moveElement(id, x, y);
    }

    wrapperDOMElement.addEventListener("dragstart", handleDragStart);
    wrapperDOMElement.addEventListener("dragend", handleDragEnd);
  })();
}
