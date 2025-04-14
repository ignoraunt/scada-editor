import { fillBackgroundCanvas } from "./background-grid.js";

var State, Element;
export { Element, State };

import { state } from "./general.js";

export function initClasses() {
  class Element {
    constructor(args) {
      this.id = args.id;
      this.type = args.type;
      this.x = args.x;
      this.y = args.y;
      this.width = args.width || 100;
      this.height = args.height || 60;
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
  }

  class Gauge extends Element {
    constructor(args) {
      super(args);
      this.invalid = args.invalid || false;
      this.dbId = args.name || "0";
    }

    rename() {
      var DOMElement = this.getDOMElementByID();
      DOMElement.innerText = this.dbId;
    }

    pushToDOM() {
      var div = document.createElement("div");

      div.style.left = this.x + "px";
      div.style.top = this.y + "px";
      div.style.width = this.width + "px";
      div.style.height = this.height + "px";

      div.dataset.id = this.id;
      div.dataset.type = this.type;

      div.setAttribute("draggable", "true");

      div.innerText = this.dbId;

      if (this.invalid) {
        div.classList.add("invalid");
      }

      var wrapper = document.querySelector(".user-wrapper");
      wrapper.append(div);
    }
  }

  class Label extends Element {
    constructor(args) {
      super(args);
      this.text = args.text || "";
    }

    rename() {
      var DOMElement = this.getDOMElementByID();
      DOMElement.innerText = this.text;
    }

    pushToDOM() {
      var p = document.createElement("p");

      p.style.left = this.x + "px";
      p.style.top = this.y + "px";
      p.style.width = this.width + "px";
      p.style.height = this.height + "px";

      p.dataset.id = this.id;
      p.dataset.type = this.type;

      p.setAttribute("draggable", "true");

      var wrapper = document.querySelector(".user-wrapper");
      wrapper.append(p);
    }
  }

  class Button extends Element {
    constructor(args) {
      super(args);
      this.text = args.text || "";
    }

    rename() {
      var DOMElement = this.getDOMElementByID();
      DOMElement.value = this.text;
    }

    pushToDOM() {
      var input = document.createElement("input");

      input.style.left = this.x + "px";
      input.style.top = this.y + "px";
      input.style.width = this.width + "px";
      input.style.height = this.height + "px";

      input.dataset.id = this.id;
      input.dataset.type = this.type;

      input.setAttribute("draggable", "true");

      input.type = "button";
      // input.value = this.text;

      var wrapper = document.querySelector(".user-wrapper");
      wrapper.append(input);
    }
  }

  State = class State {
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
          invalid: el.invalid,
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
      this.elements[id].move(x, y);
    }

    resizeElement(id, width, height) {
      this.elements[id].resize(width, height);
    }

    makeElement(args) {
      var args = {
        id: args.id || this.generateID(),
        type: args.type,
        x: args.x,
        y: args.y,
        width: args.width || 100,
        height: args.height || 60,
        name: args.name,
        invalid: args.invalid || false,
        text: args.text || "- НАДПИСЬ - ",
      };

      if (args.type === "gauge") {
        var newElement = new Gauge(args);
      }

      if (args.type === "label") {
        var newElement = new Label(args);
      }

      if (args.type === "button") {
        var newElement = new Button(args);
      }

      var id = args.id;

      this.elements[id] = newElement;
      this.elements[id].id = args.id;
      this.elements[id].pushToDOM();
      this.elements[id].move(args.x, args.y);
      this.elements[id].resize(args.width, args.height);
      this.elements[id].rename(args.name);
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

    generateID() {
      function gen() {
        var r = ((Math.random() + 1) * 0x10000) | 0;
        var rr = r.toString(16).substring(2);
        return rr;
      }
      return gen() + "-" + gen();
    }
  };
}
