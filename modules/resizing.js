var l = console.log;

export function resizing() {
  //

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

      var padding = 8;
      var rect = targetBlock.getBoundingClientRect();

      var isLeftEdge = pointerXPositionWithinBlock < padding;
      var isTopEdge = pointerYPositionWithinBlock < padding;
      var isRightEdge = pointerXPositionWithinBlock + padding > rect.width;
      var isBottomEdge = pointerYPositionWithinBlock + padding > rect.height;

      if (isLeftEdge) {
        targetBlock.style.boxShadow = "inset firebrick 3px 0px 0px 0px";
      } else if (isTopEdge) {
        targetBlock.style.boxShadow = "inset firebrick 0px 3px 0px 0px";
      } else if (isRightEdge) {
        targetBlock.style.boxShadow = "inset firebrick -3px 0px 0px 0px";
      } else if (isBottomEdge) {
        targetBlock.style.boxShadow = "inset firebrick 0px -3px 0px 0px";
      } else {
        targetBlock.style.boxShadow = "none";
      }
    }
  }

  function handleMouseOut(e) {
    var lastElement = e.fromElement;
    setTimeout(() => {
      lastElement.style.boxShadow = "none";
    }, 75);
  }

  var handleMouseMoveThrottled = throttle(handleMouseMove, 50);

  document.addEventListener("mousemove", handleMouseMoveThrottled);
  document.addEventListener("mouseout", handleMouseOut);
}
