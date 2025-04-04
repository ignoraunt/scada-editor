import { state } from "./general.js";

export function mainMenu() {
  function handleConfigEdit() {
    var dialog = document.querySelector(".configuration-menu-dialog");
    dialog.showModal();

    var cancelButton = document.querySelector(
      "input[name='conf-cancel-button'"
    );
    var saveButton = document.querySelector("input[name='conf-save-button'");

    var settings = state.getSettings();

    var title = document.querySelector("input[name='conf-title'");
    var width = document.querySelector("input[name='conf-wrapper-width'");
    var height = document.querySelector("input[name='conf-wrapper-height'");
    var step = document.querySelector("input[name='conf-wrapper-gridstep'");

    title.value = settings.title;
    width.value = settings.wrapper.width;
    height.value = settings.wrapper.height;
    step.value = settings.wrapper.gridStep;

    function saveSettings() {
      settings.title = title.value;
      settings.wrapper.width = width.value;
      settings.wrapper.height = height.value;
      settings.wrapper.gridStep = step.value;
      state.instantiateWrapper(width.value, height.value);
      dialog.close();

      cancelButton.removeEventListener("click", cancel);
      saveButton.removeEventListener("click", saveSettings);
    }

    function cancel() {
      dialog.close();

      cancelButton.removeEventListener("click", cancel);
      saveButton.removeEventListener("click", saveSettings);
    }

    cancelButton.addEventListener("click", cancel);
    saveButton.addEventListener("click", saveSettings);
  }

  var menuDialog = document.querySelector(".button-edit-configuration");
  menuDialog.addEventListener("click", handleConfigEdit);
}
