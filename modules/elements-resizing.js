var l = console.log;

import { state } from "./general.js";
import { utils } from "./overarching-utilities.js";

export var pointedID = "nope";

export function elementsResizing() {
  function addColoredEdge(DOMElement, edge) {
    var edges = ["left", "top", "right", "bottom"];

    var i;
    for (i = 0; i < edges.length; i++) {
      var element = edges[i];
      if (element === edge) {
        DOMElement.classList.add("gauge-resize-" + edge);
      } else {
        DOMElement.classList.remove("gauge-resize-" + element);
      }
    }
  }

  var activeEdge = "none";
  var isResizingMode = false;

  function getElementEdge(e, DOMElement) {
    var edgePadding = 12;

    var rect = DOMElement.getBoundingClientRect();

    var pointerXPositionWithinElement = e.offsetX;
    var pointerYPositionWithinElement = e.offsetY;

    var isLeftEdge = pointerXPositionWithinElement < edgePadding;
    var isTopEdge = pointerYPositionWithinElement < edgePadding;
    var isRightEdge = pointerXPositionWithinElement + edgePadding > rect.width;
    var isBottomEdge =
      pointerYPositionWithinElement + edgePadding > rect.height;

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

    activeEdge = edge;

    return edge;
  }

  function startElementResizing(e) {
    if (e.button !== 0) return;

    var id = e.target.dataset.id;

    if (!id) return;
    if (activeEdge === "none") return;

    isResizingMode = true;

    var wrapper = document.querySelector(".active-wrapper");
    var wrapperLeftOffset = wrapper.offsetLeft;
    var wrapperTopOffset = wrapper.offsetTop;

    var DOMElement = state.getDOMElement(id);
    DOMElement.removeAttribute("draggable", "");

    document.body.style.pointerEvents = "none";

    var elementRecord = state.getElementRecord(id);

    var phantomElement = document.createElement("div");
    phantomElement.style.left = elementRecord.x + "px";
    phantomElement.style.top = elementRecord.y + "px";
    phantomElement.style.width = elementRecord.width + "px";
    phantomElement.style.height = elementRecord.height + "px";
    phantomElement.classList.add("phantom-block");
    wrapper.append(phantomElement);

    function resizingPhantomElement(e) {
      var pointerX = e.x;
      var pointerY = e.y;

      switch (activeEdge) {
        case "left":
          var pointerOffsetX = pointerX - wrapperLeftOffset;
          var pointerDistance = elementRecord.x - pointerOffsetX;
          var newWidth = pointerDistance + elementRecord.width;

          if (newWidth < 50 || newWidth > 300) return;

          phantomElement.style.left = pointerOffsetX + "px";
          phantomElement.style.width = newWidth + "px";
          break;

        case "top":
          var pointerOffsetY = pointerY - wrapperTopOffset;
          var pointerDistance = elementRecord.y - pointerOffsetY;
          var newHeight = pointerDistance + elementRecord.height;

          if (newHeight < 50 || newHeight > 300) return;

          phantomElement.style.top = pointerOffsetY + "px";
          phantomElement.style.height = newHeight + "px";

          break;

        case "right":
          var newWidth = pointerX - elementRecord.x - wrapperLeftOffset;
          if (newWidth < 50 || newWidth > 300) return;
          phantomElement.style.width = newWidth + "px";
          break;

        case "bottom":
          var newHeight = pointerY - elementRecord.y - wrapperTopOffset;
          if (newHeight < 50 || newHeight > 300) return;
          phantomElement.style.height = newHeight + "px";
          break;

        default:
          break;
      }

      document.addEventListener("mouseup", applyResizing);
    }

    function applyResizing() {
      isResizingMode = false;

      var phantomElementRect = phantomElement.getBoundingClientRect();
      var phantomElementLeft = phantomElementRect.left - wrapperLeftOffset;
      var phantomElementTop = phantomElementRect.top - wrapperTopOffset;
      var phantomElementWidth = phantomElementRect.width;
      var phantomElementHeight = phantomElementRect.height;

      DOMElement.setAttribute("draggable", "true");

      document.body.style.pointerEvents = "initial";

      elementRecord.resize(phantomElementWidth, phantomElementHeight);
      elementRecord.move(phantomElementLeft, phantomElementTop);

      phantomElement.remove();

      document.removeEventListener("mousemove", resizingPhantomElement);
      document.removeEventListener("mouseup", applyResizing);
    }

    document.addEventListener("mousemove", resizingPhantomElement);
  }

  var handleMouseOutElementThrottled = utils.throttle(
    handleMouseOutElement,
    25
  );
  function handleMouseOutElement(e) {
    var id = e.fromElement.dataset.id;
    if (!id) return;

    pointedID = "nope";

    var DOMElement = state.getDOMElement(id);
    DOMElement.classList.remove("gauge-resize-left");
    DOMElement.classList.remove("gauge-resize-top");
    DOMElement.classList.remove("gauge-resize-right");
    DOMElement.classList.remove("gauge-resize-bottom");

    document.removeEventListener("mouseout", handleMouseOutElementThrottled);
    document.removeEventListener("mousedown", startElementResizing);
  }

  var handleMouseMoveThrottled = utils.throttle(handleMouseMove, 25);
  function handleMouseMove(e) {
    var id = e.target.dataset.id;
    pointedID = id;

    if (!id) return;
    if (isResizingMode) return;

    var DOMElement = state.getDOMElement(id);
    var elementEdge = getElementEdge(e, DOMElement);

    addColoredEdge(DOMElement, elementEdge);

    DOMElement.addEventListener("mouseout", handleMouseOutElementThrottled, {
      once: true,
    });

    DOMElement.addEventListener("mousedown", startElementResizing, {
      once: true,
    });
  }

  document.addEventListener("mousemove", handleMouseMoveThrottled);
}
