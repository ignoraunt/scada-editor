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

  function handleMouseMove(e) {
    var targetBlock = e.target;
    var isGauge = targetBlock.classList.contains("gauge");
    if (isGauge) {
      var pointerXPositionWithinBlock = e.offsetX;
      var pointerYPositionWithinBlock = e.offsetY;

      var padding = 10;
      var rect = targetBlock.getBoundingClientRect();

      var isLeftEdge = pointerXPositionWithinBlock < padding;
      var isTopEdge = pointerYPositionWithinBlock < padding;
      var isRightEdge = pointerXPositionWithinBlock + padding > rect.width;
      var isBottomEdge = pointerYPositionWithinBlock + padding > rect.height;

      if (isLeftEdge) {
        targetBlock.classList.add("guage-resize-left");
      } else if (isTopEdge) {
        targetBlock.classList.add("guage-resize-top");
      } else if (isRightEdge) {
        targetBlock.classList.add("guage-resize-right");
        currentBlock = targetBlock;
      } else if (isBottomEdge) {
        targetBlock.classList.add("guage-resize-bottom");
      } else {
        targetBlock.classList.remove("guage-resize-left");
        targetBlock.classList.remove("guage-resize-top");
        targetBlock.classList.remove("guage-resize-right");
        targetBlock.classList.remove("guage-resize-bottom");
      }
    }
  }

  function handleMouseOut(e) {
    var lastElement = e.fromElement;
    setTimeout(() => {
      lastElement.classList.remove("guage-resize-left");
      lastElement.classList.remove("guage-resize-top");
      lastElement.classList.remove("guage-resize-right");
      lastElement.classList.remove("guage-resize-bottom");
    }, 25);
  }

  var handleMouseMoveThrottled = throttle(handleMouseMove, 20);

  document.addEventListener("mousemove", handleMouseMoveThrottled);
  document.addEventListener("mouseout", handleMouseOut);

  var active = false;

  function activateResize() {
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
      newBlock.style.width = e.x + "px";
    }

    document.body.addEventListener("mousemove", handleMouseMove);

    document.body.addEventListener(
      "mouseup",
      () => {
        document.body.removeEventListener("mousemove", handleMouseMove);
        newBlock.classList.remove("phantom-block");
        newBlock.classList.add("gauge");
        newBlock.draggable = "true";
        newBlock.innerText = currentBlock.innerText;

        currentBlock.remove();
      },
      { once: true }
    );
  }

  document.addEventListener(
    "mousedown",
    activateResize,
    { once: true }
  );
}
