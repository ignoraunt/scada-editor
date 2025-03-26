var l = console.log;

import { structures } from "./temp-oop-handling.js";

import { utils } from "./overarching-utilities.js";

export function newResizing() {
  function handleMouseMove(e) {
    var id = e.target.dataset.id;
    var targetBlock = structures.getDOMElement(id);

    if (!targetBlock) return;

    var padding = 15;

    var rect = targetBlock.getBoundingClientRect();

    var pointerXPositionWithinBlock = e.offsetX;
    var pointerYPositionWithinBlock = e.offsetY;

    var isLeftEdge = pointerXPositionWithinBlock < padding;
    var isTopEdge = pointerYPositionWithinBlock < padding;
    var isRightEdge = pointerXPositionWithinBlock + padding > rect.width;
    var isBottomEdge = pointerYPositionWithinBlock + padding > rect.height;

    if (isLeftEdge) {
      targetBlock.classList.add("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-bottom");
    } else if (isTopEdge) {
      targetBlock.classList.add("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-bottom");
    } else if (isRightEdge) {
      targetBlock.classList.add("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-bottom");
    } else if (isBottomEdge) {
      targetBlock.classList.add("gauge-resize-bottom");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-right");
    } else {
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-bottom");
    }

    document.addEventListener("mouseout", handleMouseOutThrottled, {
      once: true,
    });
  }

  function handleMouseOut(e) {
    var id = e.fromElement.dataset.id;

    var DOMElement = structures.getDOMElement(id);

    if (!DOMElement) return;

    DOMElement.classList.remove("gauge-resize-left");
    DOMElement.classList.remove("gauge-resize-top");
    DOMElement.classList.remove("gauge-resize-right");
    DOMElement.classList.remove("gauge-resize-bottom");

    document.removeEventListener("mouseout", handleMouseOutThrottled);
  }

  var handleMouseMoveThrottled = utils.throttle(handleMouseMove, 25);
  var handleMouseOutThrottled = utils.throttle(handleMouseOut, 25);

  document.addEventListener("mousemove", handleMouseMoveThrottled);
  // document.addEventListener("mouseout", handleMouseOutThrottled);
}
