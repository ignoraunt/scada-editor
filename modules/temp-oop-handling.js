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
      this.x = x;
      this.y = y;

      var DOMElement = document.querySelector('[data-id="' + this.id + '"]');
      DOMElement.remove();

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
      this.wrapper = null;
      this.gauges = {};
    }

    checkElementType(e) {
      l(e.target.dataset.type);
    }

    moveElement(id, x, y) {
      this.gauges[id].move(x, y);
    }

    makeGauge(...params) {
      this.gauges[params[0]] = new Gauge(...params);
    }

    removeGauge(id) {
      delete this.gauges[id];
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      DOMElement.remove();
    }

    changeGaugeID(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      DOMElement.dataset.id = id;
      DOMElement.innerText = id;
    }

    renderSingleGauge() {
      //
    }

    renderAllGauges() {
      for (var id in this.gauges) {
        this.gauges[id].pushToDOM();
      }
    }

    logState() {
      l(this);
    }
  }

  structures = new Structures();
  structures.makeGauge("600112", "gauge", 30, 30);
  // structures.makeGauge("600114", "gauge", 200, 100, 450, 450);

  structures.renderAllGauges();

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      structures.logState();
    }
  });
}
