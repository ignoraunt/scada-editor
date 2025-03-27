var l = console.log;

export var structures;

export function oop() {
  var wrapper = document.querySelector(".active-wrapper");

  class Gauge {
    constructor(id, type, x, y) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;
    }

    getDOMElementByID() {
      var DOMElement = document.querySelector('[data-id="' + this.id + '"]');
      return DOMElement;
    }

    move(x, y) {
      var DOMElement = this.getDOMElementByID();
      DOMElement.remove();

      this.x = x;
      this.y = y;

      this.pushToDOM();
    }

    pushToDOM() {
      var div = document.createElement("div");
      div.style.left = this.x + "px";
      div.style.top = this.y + "px";
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

    getSomething(id) {
      return this.gauges[id];
    }

    getDOMElement(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      return DOMElement;
    }

    moveElement(id, x, y) {
      this.gauges[id].move(x, y);
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
  // TESTING AREA

  structures.makeGauge("600112", "gauge", 30, 30);

  structures.renderAllGauges();

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      structures.inspectState();
    }
  });
}
