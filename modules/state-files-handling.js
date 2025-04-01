import { state } from "./general.js";
import { utils } from "./overarching-utilities.js";

export function configurationHandling() {
  var loadInput = document.querySelector(".input-load-configuration");
  var saveButton = document.querySelector(".button-save-configuration");

  function openFile() {
    var savedStateFile = loadInput.files[0];
    savedStateFile.text().then((stateString) => {
      var stateJSON = JSON.parse(stateString);
      state.loadState(stateJSON);
    });
  }

  function saveFile(stateBlob) {
    showSaveFilePicker({
      suggestedName: utils.getStateDate(),
    })
      .then((handle) => {
        return handle.createWritable();
      })
      .then((stream) => {
        stream.write(stateBlob);
        stream.close();
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err.name, err.message);
        }
      });
  }

  function handleSaving() {
    var stateJSON = state.saveState();
    var stateString = JSON.stringify(stateJSON, null, 2);
    var stateBlob = new Blob([stateString], {
      type: "application/json",
    });
    saveFile(stateBlob);
  }

  loadInput.addEventListener("change", openFile);
  saveButton.addEventListener("click", handleSaving);
}
