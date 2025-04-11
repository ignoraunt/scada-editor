import { state } from "./general.js";

export function mainMenu() {
  var dialog = document.querySelector(".configuration-menu-dialog");
  var mainMenuButton = document.querySelector(".button-edit-configuration");
  var cancelButton = document.querySelector(".conf-cancel-button");
  var saveButton = document.querySelector(".conf-save-button");

  var openMainMenu = (() => {
    var settings = state.getSettings();
    var title = document.querySelector(".conf-title");
    var width = document.querySelector(".conf-wrapper-width");
    var height = document.querySelector(".conf-wrapper-height");
    var step = document.querySelector(".conf-wrapper-gridstep");

    title.value = settings.title;
    width.value = settings.wrapper.width;
    height.value = settings.wrapper.height;
    step.value = settings.wrapper.gridStep;

    function cancel() {
      dialog.close();
    }

    function save() {
      settings.title = title.value;
      settings.wrapper.width = width.value;
      settings.wrapper.height = height.value;
      settings.wrapper.gridStep = step.value;
      state.instantiateWrapper(width.value, height.value);
      dialog.close();
    }

    function handleKeyboard(e) {
      if (e.key === "Escape") {
        cancel();
      }
      if (e.key === "Enter" && e.target !== cancelButton) {
        e.preventDefault();
        save();
      }
    }

    dialog.addEventListener("keydown", handleKeyboard);
    cancelButton.addEventListener("click", cancel);
    saveButton.addEventListener("click", save);

    return function () {
      dialog.showModal();
    };
  })();

  mainMenuButton.addEventListener("click", openMainMenu);
}
