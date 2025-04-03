var l = console.log;

export var state;

export function general() {
  class Element {
    constructor(id, type, x, y, width, height) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;
      this.width = width || 100;
      this.height = height || 60;
    }

    getSettings() {
      return state.settings.wrapper.gridStep;
    }

    getDOMElementByID() {
      var DOMElement = document.querySelector('[data-id="' + this.id + '"]');
      return DOMElement;
    }

    alignToGrid(a, b) {
      var gridStep = this.getSettings();
      var aligned = [a, b];
      aligned[0] = Math.round(a / gridStep) * gridStep;
      aligned[1] = Math.round(b / gridStep) * gridStep;
      return aligned;
    }

    move(x, y) {
      var alignedCoordinates = this.alignToGrid(x, y);

      var updatedX = alignedCoordinates[0];
      var updatedY = alignedCoordinates[1];

      this.x = updatedX;
      this.y = updatedY;

      var DOMElement = this.getDOMElementByID();
      DOMElement.style.left = updatedX + "px";
      DOMElement.style.top = updatedY + "px";
    }

    resize(width, height) {
      var alignedCoordinates = this.alignToGrid(width, height);

      var updatedWidth = alignedCoordinates[0];
      var updatedHeight = alignedCoordinates[1];

      this.width = updatedWidth;
      this.height = updatedHeight;

      var DOMElement = this.getDOMElementByID();
      DOMElement.style.width = updatedWidth + "px";
      DOMElement.style.height = updatedHeight + "px";
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

      var wrapper = state.settings.wrapper.wrapperElement;

      wrapper.append(div);
    }
  }

  class State {
    constructor() {
      this.settings = {
        title: "no title",
        wrapper: {
          wrapperElement: null,
          width: 1024,
          height: 768,
          gridStep: 20,
        },
      };
      this.elements = {};
    }

    instantiateWrapper(width, height) {
      var wrapper = document.createElement("div");
      wrapper.classList.add("active-wrapper");
      wrapper.classList.add("invisible");
      document.body.append(wrapper);

      var canvas = document.createElement("canvas");
      canvas.classList.add("background-layer-canvas");
      wrapper.append(canvas);

      var stateWrapper = this.settings.wrapper;

      stateWrapper.width = width;
      stateWrapper.height = height;

      stateWrapper.wrapperElement = wrapper;
    }

    loadState(stateJSON) {
      // this.settings = stateJSON.settings;
      // this.wrapper = stateJSON.wrapper;
      // this.elements = stateJSON.elements;
      // this.applyState();
    }

    saveState() {
      return this;
    }

    applyState() {
      for (var id in this.elements) {
        var element = this.elements[id];
        this.makeElement(element.id, element.type, element.x, element.y);
      }

      this.renderAllElements();
    }

    inspectState() {
      console.group("State");
      console.dir(this);
      console.groupEnd("State");
    }

    getSettings() {
      return this.settings;
    }

    getElementRecord(id) {
      return this.elements[id];
    }

    getElementType(id) {
      return this.elements[id].type;
    }

    getDOMElement(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]') || null;
      return DOMElement;
    }

    moveElement(id, x, y) {
      this.elements[id].move(x, y);
    }

    resizeElement(id, width, height) {
      this.elements[id].resize(width, height);
    }

    makeElement(...params) {
      var newElement = new Element(...params);
      var id = params[0] || this.generateID();
      var x = params[2];
      var y = params[3];
      this.elements[id] = newElement;
      this.elements[id].id = id;
      this.elements[id].pushToDOM();
      this.elements[id].move(x, y);
    }

    removeElement(id) {
      delete this.elements[id];
      var DOMElement = this.getDOMElement(id);
      DOMElement.remove();
    }

    changeElementID(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      DOMElement.dataset.id = id;
      DOMElement.innerText = id;
    }

    renderSingleElement(id) {
      this.elements[id].pushToDOM();
    }

    renderAllElements() {
      for (var id in this.elements) {
        this.elements[id].pushToDOM();
      }
    }

    generateID() {
      function gen() {
        var r = ((Math.random() + 1) * 0x10000) | 0;
        var rr = r.toString(16).substring(2);
        return rr;
      }
      return gen() + "-" + gen();
    }
  }

  state = new State();

  state.instantiateWrapper(800, 800);
  state.makeElement("", "gauge", 40, 40);
  state.makeElement("", "gauge", 200, 40);

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      state.inspectState();
    }
  });
}
