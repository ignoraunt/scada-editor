var l = console.log;

export var structures;

export function oop() {
  var wrapper = document.querySelector(".active-wrapper");

  class Gauge {
    constructor(id, type, x, y, width, height) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;

      this.width = width || 100;
      this.height = height || 100;
    }

    getDOMElementByID() {
      var DOMElement = document.querySelector('[data-id="' + this.id + '"]');
      return DOMElement;
    }

    move(x, y) {
      // l(x, y);

      var gridStep = 30;

      // var elementX = e.x;
      // var elementY = e.y;

      x = Math.round(x / gridStep) * gridStep;
      y = Math.round(y / gridStep) * gridStep;

      var DOMElement = this.getDOMElementByID();
      DOMElement.remove();

      this.x = x;
      this.y = y;

      this.pushToDOM();
    }

    resize(width, height) {
      var DOMElement = this.getDOMElementByID();

      this.width = width;
      this.height = height;

      DOMElement.style.width = this.width + "px";
      DOMElement.style.height = this.height + "px";
    }

    pushToDOM() {
      var div = document.createElement("div");
      div.style.left = this.x + "px";
      div.style.top = this.y + "px";

      div.style.width = this.width + "px";
      div.style.height = this.height + "px";

      div.setAttribute("draggable", "true");
      div.dataset.id = this.id;
      div.dataset.type = this.type;
      div.innerText = this.id;
      wrapper.append(div);
    }
  }

  class Structures {
    constructor() {
      this.title = "no title";
      this.wrapper = null;
      this.gauges = {};
    }

    loadState(stateJSON) {
      this.title = stateJSON.title;
      this.wrapper = stateJSON.wrapper;
      this.gauges = stateJSON.gauges;
      this.applyState();
    }

    saveState() {
      return this;
    }

    applyState() {
      for (var id in this.gauges) {
        var gauge = this.gauges[id];
        this.makeGauge(gauge.id, gauge.type, gauge.x, gauge.y);
      }

      this.renderAllGauges();
    }

    inspectState() {
      console.group("State");
      console.dir(this);
      console.groupEnd("State");
    }

    getElementRecord(id) {
      return this.gauges[id];
    }

    getDOMElement(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      return DOMElement;
    }

    moveElement(id, x, y) {
      this.gauges[id].move(x, y);
    }

    resizeElement(id, width, height) {
      this.gauges[id].resize(width, height);
    }

    makeGauge(...params) {
      this.gauges[params[0]] = new Gauge(...params);
    }

    removeGauge(id) {
      delete this.gauges[id];
      var DOMElement = getDOMElement(id);
      DOMElement.remove();
    }

    changeGaugeID(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      DOMElement.dataset.id = id;
      DOMElement.innerText = id;
    }

    renderAllGauges() {
      for (var id in this.gauges) {
        this.gauges[id].pushToDOM();
      }
    }
  }

  structures = new Structures();

  // ==== ==== ====

  structures.makeGauge("600112", "gauge", 300, 300);

  structures.renderAllGauges();

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      structures.inspectState();
    }
  });
}
