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
}
