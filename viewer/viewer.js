var l = console.log;

// fetch("./mock-data.json")
//   .then((res) => {
//     return res.json();
//   })
//   .then((json) => {
//     console.log(json);
//     renderTitle(json);
//     renderWrapper(json);
//     renderElements(json);
//   });

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

    var div = document.createElement("div");
    div.style.left = element.x + "px";
    div.style.top = element.y + "px";
    div.style.width = element.width + "px";
    div.style.height = element.height + "px";
    div.dataset.type = element.type;
    div.dataset.dbId = element.dbId;
    div.innerText = element.dbId;
    var wrapper = document.querySelector(".wrapper");
    wrapper.append(div);
  }
}

load.addEventListener("change", openFile);
