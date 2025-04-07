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

  var saveFile = (() => {
    var blobHref = null;

    return (stateBlob) => {
      var fileName = utils.getCurrentDateTimeString();

      showSaveFilePicker ? FSAApi() : fallback();

      function fallback() {
        if (blobHref) {
          window.URL.revokeObjectURL(blobHref);
        }

        blobHref = window.URL.createObjectURL(stateBlob);

        var anchor = document.createElement("a");
        anchor.setAttribute("download", fileName);
        anchor.href = blobHref;
        document.body.appendChild(anchor);

        var event = new MouseEvent("click");
        anchor.dispatchEvent(event);
        anchor.remove();
      }

      function FSAApi() {
        showSaveFilePicker({
          suggestedName: utils.getCurrentDateTimeString() + ".json",
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
    };
  })();

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
