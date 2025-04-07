var l = console.log;

import { fillBackgroundCanvas } from "./background-grid.js";

export var state;

export function general() {
  class Element {
    constructor(id, type, x, y, width, height, name) {
      this.id = id;
      this.type = type;
      this.x = x;
      this.y = y;
      this.width = width || 100;
      this.height = height || 60;
      this.dbId = name || "0";
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

    rename() {
      var DOMElement = this.getDOMElementByID();
      DOMElement.innerText = this.dbId;
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
      div.innerText = this.dbId;

      // var wrapper = state.settings.wrapper.wrapperElement;
      var wrapper = document.querySelector(".user-wrapper");

      wrapper.append(div);
    }
  }

  class State {
    constructor() {
      this.settings = {
        title: "Нет заголовка",
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
      // var wrapperElement = this.settings.wrapper.wrapperElement;
      var wrapperElement = document.querySelector(".user-wrapper");
      var wrapperSettings = this.settings.wrapper;

      var width = width || wrapperSettings.width;
      var height = height || wrapperSettings.height;

      var title = document.querySelector(".title");
      title.innerText = this.settings.title;

      if (wrapperElement) {
        wrapperElement.classList.add("invisible");

        wrapperElement.style.width = width + "px";
        wrapperElement.style.height = height + "px";

        wrapperSettings.width = width;
        wrapperSettings.height = height;

        var canvas = document.querySelector("canvas");
        canvas.width = width;
        canvas.height = height;
      } else {
        wrapperElement = document.createElement("div");
        wrapperElement.classList.add("user-wrapper");
        wrapperElement.classList.add("invisible");
        wrapperElement.style.width = width + "px";
        wrapperElement.style.height = height + "px";
        document.body.append(wrapperElement);

        wrapperSettings.width = width;
        wrapperSettings.height = height;
        wrapperSettings.wrapperElement = wrapperElement;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        wrapperElement.append(canvas);
      }
      fillBackgroundCanvas(canvas, wrapperSettings.gridStep);

      setTimeout(() => {
        wrapperElement.classList.remove("invisible");
      });
    }

    loadState(stateJSON) {
      this.settings = stateJSON.settings;
      this.elements = stateJSON.elements;
      this.applyState();
    }

    saveState() {
      return this;
    }

    applyState() {
      this.instantiateWrapper();

      var wrapper = document.querySelector(".user-wrapper");
      var canvas = document.querySelector("canvas");
      wrapper.innerHTML = "";
      wrapper.append(canvas);

      this.settings.wrapper.wrapperElement = wrapper;

      for (var id in this.elements) {
        var el = this.elements[id];

        var arg = {
          id: el.id,
          type: el.type,
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          name: el.dbId,
        };

        this.makeElement(arg);
      }
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
      l(id, x);
      this.elements[id].move(x, y);
    }

    resizeElement(id, width, height) {
      this.elements[id].resize(width, height);
    }

    makeElement(args) {
      var id = args.id || this.generateID();
      var type = args.type;
      var x = args.x;
      var y = args.y;
      var width = args.width || 100;
      var height = args.height || 60;
      var name = args.name;

      var newElement = new Element(id, type, x, y, width, height, name);

      this.elements[id] = newElement;
      this.elements[id].id = id;
      this.elements[id].pushToDOM();
      this.elements[id].move(x, y);
      this.elements[id].resize(width, height);
      this.elements[id].rename(name);
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

  var mockElementState = {
    id: "",
    type: "gauge",
    x: 40,
    y: 40,
  };

  state.makeElement(mockElementState);

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      state.inspectState();
    }
  });
}
