var l = console.log;

import { state } from "./general.js";

export function elementsMoving() {
  (function handleMovementListeners() {
    var wrapperDOMElement = null;
    var wrapperOffsetX = 0;
    var wrapperOffsetY = 0;
    var pointerOffsetX = 0;
    var pointerOffsetY = 0;
    var gridStep = 0;

    function updateWrapperPos() {
      var settings = state.getSettings();
      var wrapper = settings.wrapper;
      wrapperDOMElement = wrapper.wrapperElement;
      gridStep = wrapper.gridStep;

      wrapperOffsetX = wrapperDOMElement.offsetLeft;
      wrapperOffsetY = wrapperDOMElement.offsetTop;
    }

    updateWrapperPos();

    function handleDragStart(e) {
      updateWrapperPos();
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
