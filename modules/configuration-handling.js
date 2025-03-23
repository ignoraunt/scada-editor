var l = console.log;

export function configurationHandling() {
  var fileInput = document.querySelector(".input-load-configuration");

  function renderBlocks(source) {
    var i;
    for (i = 0; i < source.length; i++) {
      var div = document.createElement("div");
      div.className = "gauge";
      div.innerText = source[i].id;
      div.draggable = "true";

      div.style.backgroundColor = source[i].color;
      div.style.left = source[i].x + "px";
      div.style.top = source[i].y + "px";
      div.style.width = source[i].width + "px";
      div.style.height = source[i].height + "px";
      document.body.prepend(div);
    }
  }

  function openFile() {
    var file = fileInput.files[0];
    file.text().then((configurationString) => {
      var json = JSON.parse(configurationString);
      renderBlocks(json);
    });
  }

  function exportConfiguration() {
    var list = [];

    var blocks = document.querySelectorAll(".gauge");

    for (var block of blocks) {
      var dims = {};

      var rect = block.getBoundingClientRect();

      var x = block.offsetLeft;
      var y = block.offsetTop;

      var width = rect.width;
      var height = rect.height;

      dims.x = x;
      dims.y = y;
      dims.width = width;
      dims.height = height;

      dims.id = block.innerText;

      dims.color = window
        .getComputedStyle(block)
        .getPropertyValue("background-color");

      list.push(dims);
    }

    return list;
  }

  var saveFile = (configuration) => {
    showSaveFilePicker({
      suggestedName: "hi",
    })
      .then((handle) => {
        return handle.createWritable();
      })
      .then((stream) => {
        stream.write(configuration);
        stream.close();
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err.name, err.message);
        }
      });
  };

  function handleSaving() {
    var conf = exportConfiguration();
    var confString = JSON.stringify(conf, null, 2);
    var confBlob = new Blob([confString], {
      type: "application/json",
    });
    saveFile(confBlob);
  }

  var saveButton = document.querySelector(".button-save-configuration");
  saveButton.addEventListener("click", handleSaving);

  fileInput.addEventListener("change", openFile);

  document.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      l(exportConfiguration());
    }
  });
}
