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

    move(x, y) {
      var DOMElement = document.querySelector('[data-id="' + this.id + '"]');
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
      this.title = "no name";
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

    logState() {
      l(this);
    }

    // TODO
    applyState() {
      for (var id in this.gauges) {
        var g = this.gauges[id];
        this.makeGauge(g.id, g.type, g.x, g.y);
      }

      this.renderAllGauges();
    }

    // checkElementType(e) {
    //   l(e.target.dataset.type);
    // }

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
  structures.makeGauge("600112", "gauge", 30, 30);

  structures.renderAllGauges();

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      structures.logState();
    }
  });
}
