var l = console.log;

export function resizing() {
  var throttle = (callee, delay) => {
    var timeout = 0;
    return (...args) => {
      if (timeout !== 0) return;
      timeout = setTimeout(() => {
        callee(...args);
        clearTimeout(timeout);
        timeout = 0;
      }, delay);
    };
  };

  var currentBlock = null;
  var targetResizeAxis = "";

  function handleMouseMove(e) {
    var targetBlock = e.target;
    var isGauge = targetBlock.classList.contains("gauge");

    if (!isGauge) return;

    var pointerXPositionWithinBlock = e.offsetX;
    var pointerYPositionWithinBlock = e.offsetY;

    var padding = 10;
    var rect = targetBlock.getBoundingClientRect();

    var isLeftEdge = pointerXPositionWithinBlock < padding;
    var isTopEdge = pointerYPositionWithinBlock < padding;
    var isRightEdge = pointerXPositionWithinBlock + padding > rect.width;
    var isBottomEdge = pointerYPositionWithinBlock + padding > rect.height;

    if (isLeftEdge) {
      targetBlock.classList.add("gauge-resize-left");
      currentBlock = targetBlock;
      targetResizeAxis = "x";
    } else if (isTopEdge) {
      targetBlock.classList.add("gauge-resize-top");
      currentBlock = targetBlock;
      targetResizeAxis = "y";
    } else if (isRightEdge) {
      targetBlock.classList.add("gauge-resize-right");
      currentBlock = targetBlock;
      targetResizeAxis = "x";
    } else if (isBottomEdge) {
      targetBlock.classList.add("gauge-resize-bottom");
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
    }, 25);
  }

  var handleMouseMoveThrottled = throttle(handleMouseMove, 20);

  document.addEventListener("mousemove", handleMouseMoveThrottled);
  document.addEventListener("mouseout", handleMouseOut);

  function activateResizing() {
    if (!currentBlock) return;

    var isGauge = currentBlock.classList.contains("gauge");

    if (!isGauge) return;

    var currentRect = currentBlock.getBoundingClientRect();
    var newBlock = document.createElement("div");
    newBlock.classList.add("phantom-block");
    newBlock.style.width = currentRect.width + "px";
    newBlock.style.height = currentRect.height + "px";
    newBlock.style.left = currentRect.left + "px";
    newBlock.style.top = currentRect.top + "px";

    document.body.prepend(newBlock);

    function handleMouseMove(e) {
      switch (targetResizeAxis) {
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

      document.body.removeEventListener("mousemove", handleMouseMove);
    }

    document.body.addEventListener("mousemove", handleMouseMove);

    document.body.addEventListener("mouseup", handleMouseUp, { once: true });
  }

  document.addEventListener("mousedown", activateResizing, { once: true });
}
