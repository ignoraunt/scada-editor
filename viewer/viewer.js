window.opener.postMessage("loaded", "*");

function sendInactive() {
  window.opener.postMessage("closed", "*");
}

window.addEventListener("beforeunload", sendInactive);

function receiveMessage(message) {
  document.body.innerHTML = "";
  renderTitle(message);
  renderWrapper(message);
  renderElements(message);
}

var load = document.querySelector("input");
var label = document.querySelector("label");

function openFile() {
  var savedStateFile = load.files[0];
  load.remove();
  label.remove();
  savedStateFile.text().then((stateString) => {
    var stateJSON = JSON.parse(stateString);
    console.dir(stateJSON);
    renderTitle(stateJSON);
    renderWrapper(stateJSON);
    renderElements(stateJSON);
  });
}

function renderTitle(data) {
  var title = data.settings.title;

  var h1 = document.createElement("h1");
  h1.classList.add("title");
  h1.innerText = title;

  document.body.append(h1);
}

function renderWrapper(data) {
  var wrapper = data.settings.wrapper;

  var width = wrapper.width;
  var height = wrapper.height;

  var div = document.createElement("div");
  div.classList.add("wrapper");
  div.style.width = width + "px";
  div.style.height = height + "px";

  document.body.append(div);
}

function renderElements(data) {
  var elements = data.elements;

  var id;
  for (id in elements) {
    var element = elements[id];

    var wrapper = document.querySelector(".wrapper");

    if (element.type === "gauge") {
      var div = document.createElement("div");
      div.style.left = element.x + "px";
      div.style.top = element.y + "px";
      div.style.width = element.width + "px";
      div.style.height = element.height + "px";
      div.dataset.type = element.type;
      div.dataset.dbId = element.dbId;

      var inn = document.createElement("div");
      inn.innerText = element.dbId;

      div.append(inn);
      wrapper.append(div);
    }

    if (element.type === "label") {
      var p = document.createElement("p");
      p.style.left = element.x + "px";
      p.style.top = element.y + "px";
      p.style.width = element.width + "px";
      p.style.height = element.height + "px";
      p.dataset.id = element.id;
      p.dataset.type = element.type;
      p.innerText = element.text;
      wrapper.append(p);
    }

    if (element.type === "button") {
      var input = document.createElement("input");
      input.style.left = element.x + "px";
      input.style.top = element.y + "px";
      input.style.width = element.width + "px";
      input.style.height = element.height + "px";
      input.dataset.id = element.id;
      input.dataset.type = element.type;
      input.type = "button";
      input.value = element.text;
      wrapper.append(input);
    }
  }
}

load.addEventListener("change", openFile);
