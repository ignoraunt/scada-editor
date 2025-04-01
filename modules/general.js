var l = console.log;

export var state;

export function general() {
  var wrapper = document.querySelector(".active-wrapper");

  class Element {
    constructor(id, type, x, y, width, height) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;
      this.width = width || 80;
      this.height = height || 80;
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
      var aligned = this.alignToGrid(x, y);
      this.x = aligned[0];
      this.y = aligned[1];
      this.pushToDOM();
      var DOMElement = this.getDOMElementByID();
      DOMElement.remove();
    }

    resize(width, height) {
      var aligned = this.alignToGrid(width, height);
      this.width = aligned[0];
      this.height = aligned[1];
      var DOMElement = this.getDOMElementByID();
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

  class State {
    constructor() {
      this.settings = {
        title: "no title",
        wrapper: {
          wrapperElement: wrapper,
          width: 1024,
          height: 768,
          gridStep: 20,
        },
      };
      this.elements = {};
    }

    loadState(stateJSON) {
      this.settings = stateJSON.settings;
      this.wrapper = stateJSON.wrapper;
      this.elements = stateJSON.elements;
      this.applyState();
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

    getDOMElement(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      return DOMElement;
    }

    moveElement(id, x, y) {
      this.elements[id].move(x, y);
    }

    resizeElement(id, width, height) {
      this.elements[id].resize(width, height);
    }

    makeElement(...params) {
      this.elements[params[0]] = new Element(...params);
    }

    removeElement(id) {
      delete this.elements[id];
      var DOMElement = getDOMElement(id);
      DOMElement.remove();
    }

    changeElementID(id) {
      var DOMElement = document.querySelector('[data-id="' + id + '"]');
      DOMElement.dataset.id = id;
      DOMElement.innerText = id;
    }

    renderAllElements() {
      for (var id in this.elements) {
        this.elements[id].pushToDOM();
      }
    }
  }

  state = new State();

  // ==== ==== ====

  state.makeElement("600112", "gauge", 80, 80);
  state.makeElement("700014", "gauge", 240, 80);

  state.renderAllElements();

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      state.inspectState();
    }
  });
}
