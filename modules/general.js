export var state;

import { State } from "./classes.js";

export function general() {
  state = new State();

  state.instantiateWrapper(800, 800);

  var mockGauge = {
    id: "",
    type: "gauge",
    x: 160,
    y: 100,
    width: 100,
    height: 60,
  };

  var mockGauge2 = {
    id: "",
    type: "gauge",
    x: 40,
    y: 100,
    width: 100,
    height: 60,
  };

  var mockLabel = {
    id: "",
    type: "label",
    x: 40,
    y: 40,
    width: 220,
    height: 40,
    text: "Верхний бьеф",
  };

  var mockButton = {
    id: "",
    type: "button",
    x: 40,
    y: 180,
    width: 220,
    height: 60,
    text: "Нажимать!",
  };

  state.makeElement(mockGauge);
  state.makeElement(mockGauge2);
  state.makeElement(mockLabel);
  state.makeElement(mockButton);

  document.addEventListener("keydown", (e) => {
    if (e.key === "q") {
      state.inspectState();
    }
  });

  var viewerWindow = null;

  function runViewer() {
    var url = "../viewer/viewer.html";

    if (!viewerWindow) {
      viewerWindow = window.open(url);
    } else {
      var data = state.saveState();
      viewerWindow.receiveMessage(data);
    }
  }

  window.addEventListener("message", (e) => {
    if (!e.data) return;

    if (e.data === "loaded") {
      var data = state.saveState();
      viewerWindow.receiveMessage(data);
    }

    if (e.data === "closed") {
      viewerWindow = null;
    }
  });

  var btnRunViewer = document.querySelector(".button-run-viewer");
  btnRunViewer.addEventListener("click", runViewer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "ц") {
      runViewer();
    }
  });
}
