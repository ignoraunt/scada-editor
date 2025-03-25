var l = console.log;

import { utils } from "./overarching-utilities.js";

export function elementsResizing() {
  var currentBlock = null;
  var targetResizeAxis = "";

  function detectElementEdge(e) {
    var targetBlock = e.target;
    var isGauge = targetBlock.classList.contains("gauge");

    if (!isGauge) return;

    var padding = 6;
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
      currentBlock = targetBlock;
      targetResizeAxis = "x";
    } else if (isTopEdge) {
      targetBlock.classList.add("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-bottom");
      currentBlock = targetBlock;
      targetResizeAxis = "y";
    } else if (isRightEdge) {
      targetBlock.classList.add("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-bottom");
      currentBlock = targetBlock;
      targetResizeAxis = "x";
    } else if (isBottomEdge) {
      targetBlock.classList.add("gauge-resize-bottom");
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-right");
      targetResizeAxis = "y";
    } else {
      targetBlock.classList.remove("gauge-resize-left");
      targetBlock.classList.remove("gauge-resize-top");
      targetBlock.classList.remove("gauge-resize-right");
      targetBlock.classList.remove("gauge-resize-bottom");
      targetResizeAxis = "none";
    }
  }

  function handleMouseOut(e) {
    var lastElement = e.fromElement;
    setTimeout(() => {
      lastElement.classList.remove("gauge-resize-left");
      lastElement.classList.remove("gauge-resize-top");
      lastElement.classList.remove("gauge-resize-right");
      lastElement.classList.remove("gauge-resize-bottom");
      targetResizeAxis = "none";
    }, 25);
  }

  function activateResizing() {
    setTimeout(() => {
      if (!currentBlock) return;

      var isGauge = currentBlock.classList.contains("gauge");

      if (!isGauge) return;

      if (targetResizeAxis === "none") return;

      var activeWrapper = document.querySelector(".active-wrapper");
      var currentRect = currentBlock.getBoundingClientRect();

      var wrapperOffsetX = activeWrapper.offsetLeft;
      var wrapperOffsetY = activeWrapper.offsetTop;

      var newBlock = document.createElement("div");
      newBlock.classList.add("phantom-block");
      newBlock.style.width = currentRect.width + "px";
      newBlock.style.height = currentRect.height + "px";
      newBlock.style.left = wrapperOffsetX - currentRect.left + "px";
      newBlock.style.top = wrapperOffsetY - currentRect.top + "px";

      activeWrapper.append(newBlock);

      function handleMouseMove(e, r) {
        switch (r) {
          case "x":
            newBlock.style.width = e.x + "px";
            break;

          case "y":
            newBlock.style.height = e.y + "px";
            break;

          case "none":
            // newBlock.style.height = e.y + "px";
            break;

          default:
            break;
        }
      }

      function handleMouseUp() {
        newBlock.classList.remove("phantom-block");
        newBlock.classList.add("gauge");
        newBlock.draggable = "true";
        newBlock.innerText = currentBlock.innerText;
        currentBlock.remove();
        document.body.removeEventListener("mousemove", mouseMoveHandler);
      }

      function mouseMoveHandler(e) {
        var r = targetResizeAxis;
        l("!!", r);
        handleMouseMove(e, r);
      }

      document.body.addEventListener("mousemove", mouseMoveHandler);
      document.body.addEventListener("mouseup", handleMouseUp);
    }, 35);
  }

  var handleMouseMoveThrottled = utils.throttle(detectElementEdge, 10);

  function mm(e, targetBlock) {
    targetBlock.style.width = e.x + "px";

    document.body.addEventListener("mouseup", nn);
  }

  function nn(e) {
    document.body.removeEventListener("mousemove", mm);
  }

  function clickOnEdge(e) {
    var targetBlock = e.target;

    var isGauge = targetBlock.classList.contains("gauge");

    if (!isGauge) return;

    var padding = 6;
    var rect = targetBlock.getBoundingClientRect();

    var pointerXPositionWithinBlock = e.offsetX;
    var pointerYPositionWithinBlock = e.offsetY;

    var isLeftEdge = pointerXPositionWithinBlock < padding;
    var isTopEdge = pointerYPositionWithinBlock < padding;
    var isRightEdge = pointerXPositionWithinBlock + padding > rect.width;
    var isBottomEdge = pointerYPositionWithinBlock + padding > rect.height;

    // === === ===

    // === === ===

    if (isRightEdge) {
      var activeWrapper = document.querySelector(".active-wrapper");

      var wrapperOffsetX = activeWrapper.offsetLeft;
      var wrapperOffsetY = activeWrapper.offsetTop;

      var newBlock = document.createElement("div");
      newBlock.classList.add("phantom-block");
      newBlock.style.width = rect.width + "px";
      newBlock.style.height = rect.height + "px";
      newBlock.style.left = wrapperOffsetX - rect.left + "px";
      newBlock.style.top = wrapperOffsetY - rect.top + "px";

      activeWrapper.append(newBlock);

      document.body.addEventListener("mousemove", (e) => {
        mm(e, targetBlock);
      });
    }
  }

  document.body.addEventListener("mousedown", clickOnEdge);

  // document.addEventListener("mousedown", activateResizing);
  // document.addEventListener("mousemove", handleMouseMoveThrottled);
  // document.addEventListener("mouseout", handleMouseOut);
}
