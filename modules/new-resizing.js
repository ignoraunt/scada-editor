var l = console.log;

import { structures } from "./temp-oop-handling.js";
import { utils } from "./overarching-utilities.js";

export function newResizing() {
  function applyColorByEdge(DOMElement, edge) {
    switch (edge) {
      case "left":
        DOMElement.classList.add("gauge-resize-left");
        DOMElement.classList.remove("gauge-resize-top");
        DOMElement.classList.remove("gauge-resize-right");
        DOMElement.classList.remove("gauge-resize-bottom");
        break;

      case "top":
        DOMElement.classList.add("gauge-resize-top");
        DOMElement.classList.remove("gauge-resize-left");
        DOMElement.classList.remove("gauge-resize-right");
        DOMElement.classList.remove("gauge-resize-bottom");
        break;

      case "right":
        DOMElement.classList.add("gauge-resize-right");
        DOMElement.classList.remove("gauge-resize-left");
        DOMElement.classList.remove("gauge-resize-top");
        DOMElement.classList.remove("gauge-resize-bottom");
        break;

      case "bottom":
        DOMElement.classList.add("gauge-resize-bottom");
        DOMElement.classList.remove("gauge-resize-left");
        DOMElement.classList.remove("gauge-resize-top");
        DOMElement.classList.remove("gauge-resize-right");
        break;

      default:
        DOMElement.classList.remove("gauge-resize-left");
        DOMElement.classList.remove("gauge-resize-top");
        DOMElement.classList.remove("gauge-resize-right");
        DOMElement.classList.remove("gauge-resize-bottom");
        break;
    }
  }

  function getEdge(e, DOMElement) {
    var padding = 12;

    var rect = DOMElement.getBoundingClientRect();

    var pointerXPositionWithinElement = e.offsetX;
    var pointerYPositionWithinElement = e.offsetY;

    var isLeftEdge = pointerXPositionWithinElement < padding;
    var isTopEdge = pointerYPositionWithinElement < padding;
    var isRightEdge = pointerXPositionWithinElement + padding > rect.width;
    var isBottomEdge = pointerYPositionWithinElement + padding > rect.height;

    var edge = "";

    if (isLeftEdge) {
      edge = "left";
    } else if (isTopEdge) {
      edge = "top";
    } else if (isRightEdge) {
      edge = "right";
    } else if (isBottomEdge) {
      edge = "bottom";
    } else {
      edge = "none";
    }

    return edge;
  }

  function handleMouseMove(e) {
    var id = e.target.dataset.id;

    if (!id) return;

    var DOMElement = structures.getDOMElement(id);

    var edge = getEdge(e, DOMElement);

    applyColorByEdge(DOMElement, edge);

    DOMElement.addEventListener("mouseout", handleMouseOutThrottled, {
      once: true,
    });

    DOMElement.addEventListener("mousedown", resizeElement, {
      once: true,
    });
  }

  var nonsense = null;

  function g() {
    l('remove mousemove')
    document.removeEventListener("mousemove", resizingPhantomElement);
  }

  function resizingPhantomElement(e) {
    l('resizing')
    nonsense.style.width = e.x + "px";
    document.addEventListener("mouseup", g);
  }

  function resizeElement(e) {
    var id = e.target.dataset.id;

    if (!id) return;

    // var DOMElement = structures.getDOMElement(id);

    var q = structures.getSomething(id);

    var wrap = document.querySelector(".active-wrapper");

    var offl = wrap.offsetLeft;
    var offt = wrap.offsetTop;

    var div = document.createElement("div");

    nonsense = div;

    div.classList.add("phantom-block");

    div.style.left = offl + q.x + "px";
    div.style.top = offt + q.y + "px";

    document.body.append(div);

    l(offl + q.x);
    l(div.offsetLeft);

    document.addEventListener("mousemove", resizingPhantomElement);
  }

  var handleMouseOutThrottled = utils.throttle(handleMouseOut, 25);
  function handleMouseOut(e) {
    var id = e.fromElement.dataset.id;
    if (!id) return;
    var DOMElement = structures.getDOMElement(id);
    DOMElement.classList.remove("gauge-resize-left");
    DOMElement.classList.remove("gauge-resize-top");
    DOMElement.classList.remove("gauge-resize-right");
    DOMElement.classList.remove("gauge-resize-bottom");
    document.removeEventListener("mouseout", handleMouseOutThrottled);
  }

  var handleMouseMoveThrottled = utils.throttle(handleMouseMove, 25);
  document.addEventListener("mousemove", handleMouseMoveThrottled);
}
