var l = console.log;

import { state } from "./general.js";
import { pointedID } from "./elements-resizing.js";

export function contextMenu() {
  function renameElement(args) {
    var element = args.element;
    var type = args.type;

    if (type === "wrapper") return;

    var initialValue = element.innerText || element.value;

    var input = document.createElement("input");
    input.classList.add("element-renaming-input");
    input.value = initialValue;

    if (type === "button") {
      element.value = "";

      input.value = initialValue;

      var settings = state.getSettings();
      var wrapper = settings.wrapper;
      var wrapperDOMElement = wrapper.wrapperElement;

      var wrapperOffsetX = wrapperDOMElement.offsetLeft;
      var wrapperOffsetY = wrapperDOMElement.offsetTop;

      var rect = element.getBoundingClientRect();

      input.style.position = "absolute";

      input.style.left = rect.x + 2 - wrapperOffsetX + "px";
      input.style.top = rect.y + 2 - wrapperOffsetY + "px";

      input.style.width = rect.width - 10 + "px";
      input.style.height = rect.height - 10 + "px";

      input.classList.add("element-renaming-input-button");

      element.insertAdjacentElement("beforebegin", input);
    } else {
      element.innerText = "";
      element.append(input);
    }

    element.removeAttribute("draggable");

    // TODO better to find out whats's happening here
    setTimeout(() => {
      input.focus();
    });

    var removed = false;

    function applyRenaming() {
      if (removed) return;
      removed = true;

      var record = state.getElementRecord(args.id);

      element.classList.remove("invalid");
      element.setAttribute("draggable", "true");

      if (type === "gauge") {
        element.dataset.dbId = input.value;
        element.innerText = input.value;
        record.invalid = false;
        record.dbId = input.value;

        if (input.value === "") {
        }
      }

      if (type === "button") {
        element.value = input.value;
        record.text = input.value;

        if (input.value === "") {
          element.value = initialValue;
        }
      }

      if (type === "label") {
        element.innerText = input.value;
        record.text = input.value;

        if (input.value === "") {
          element.innerText = initialValue;
        }
      }

      if (input.value === "") {
        element.innerText = initialValue;
        element.value = initialValue;
        element.classList.add("invalid");
        record.invalid = true;
      }

      input.removeEventListener("keydown", handleBlur);
      input.removeEventListener("blur", handleBlur);

      input.remove();
    }

    function handleBlur(e) {
      var key = e.key;
      if (
        e.type === "blur" ||
        key === "Escape" ||
        key === "Enter" ||
        key === "Tab"
      ) {
        e.preventDefault();
        applyRenaming(e);
      }
    }

    input.addEventListener("keydown", handleBlur);
    input.addEventListener("blur", handleBlur);
  }

  function removeBlock(args) {
    state.removeElement(args.id);
  }

  function createBlock(args) {
    var settings = state.getSettings();
    var wrapper = settings.wrapper;
    var wrapperDOMElement = wrapper.wrapperElement;

    var pointerOffsetPosX = args.pointer[0] - wrapperDOMElement.offsetLeft;
    var pointerOffsetPosY = args.pointer[1] - wrapperDOMElement.offsetTop;

    var type = args.action.split("-")[1];

    var elementArgs = {
      id: "",
      type: type,
      x: pointerOffsetPosX,
      y: pointerOffsetPosY,
      invalid: true,
    };

    state.makeElement(elementArgs);
  }

  function selectColor(args) {
    var colors = {
      magenta: "hsl(300 30% 30%)",
      green: "hsl(160 30% 30%)",
      orange: "hsl(40 30% 30%)",
    };

    var isPickerOption = args.color.classList.contains("color-sample");

    if (isPickerOption) {
      args.element.style.backgroundColor = colors[args.color.dataset.color];
      args.dialog.close();
    }
  }

  function action(args) {
    if (args.action.slice(0, 3) === "add") {
      createBlock(args);
      return;
    }

    if (args.action === "rename") {
      renameElement(args);
      return;
    }

    if (args.action === "copy") {
      copyBlock(args);
      return;
    }

    if (args.action === "delete") {
      removeBlock(args);
      return;
    }

    if (args.action === "palette") {
      var dialog = document.querySelector(".palette-dialog");
      dialog.showModal();
      dialog.addEventListener(
        "click",
        (e) => {
          args.color = e.target;
          args.dialog = dialog;
          selectColor(args);
        },
        {
          once: true,
        }
      );
      return;
    }
  }

  var handleContexMenu = (() => {
    var isMenuOpen = false;
    var lastClickedElement = null;
    var menu = null;

    var menuOptions = {
      gauge: [
        ["Изменить идентификатор", "rename"],
        ["Изменить цвет", "palette"],
        ["Скопировать", "copy"],
        ["Удалить", "delete"],
      ],
      label: [
        ["Изменить надпись", "rename"],
        ["Изменить цвет", "palette"],
        ["Скопировать", "copy"],
        ["Удалить", "delete"],
      ],
      button: [
        ["Переименовать", "rename"],
        ["Изменить цвет", "palette"],
        ["Скопировать", "copy"],
        ["Удалить", "delete"],
      ],
      wrapper: [
        ["Добавить датчик", "add-gauge"],
        ["Добавить надпись", "add-label"],
        ["Добавить кнопку", "add-button"],
        ["Добавить изображение", "picture"],
      ],
    };

    function handleMenuClick(args) {
      closeMenuWindow();
      action(args);
    }

    function makeMenuWindow(args) {
      var pointer = args.pointer;
      var type = args.type;

      var menuWindow = document.createElement("div");
      menuWindow.classList.add("context-menu");
      menuWindow.style.left = pointer[0] + "px";
      menuWindow.style.top = pointer[1] + "px";

      var i;
      for (i = 0; i < menuOptions[type].length; i++) {
        var menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        menuItem.innerHTML = menuOptions[type][i][0];
        menuItem.dataset.action = menuOptions[type][i][1];
        menuWindow.append(menuItem);
      }

      document.body.append(menuWindow);

      menu = menuWindow;
      isMenuOpen = true;

      document.addEventListener("mousedown", closeMenuWindow, { once: true });
      menu.addEventListener(
        "mousedown",
        (e) => {
          args.pointer = [e.x, e.y];
          args.action = e.target.dataset.action;
          handleMenuClick(args);
        },
        { once: true }
      );
    }

    function closeMenuWindow() {
      if (lastClickedElement) {
        lastClickedElement.classList.remove("selected-gauge");
      }

      menu.remove();
      isMenuOpen = false;
    }

    var f = (e) => {
      e.preventDefault();

      var targetDOMElement = state.getDOMElement(pointedID);
      var targetType = targetDOMElement
        ? state.getElementType(pointedID)
        : "wrapper";
      var pointerPosition = [e.x, e.y];

      lastClickedElement = targetDOMElement;

      if (targetType !== "wrapper") {
        targetDOMElement.classList.add("selected-gauge");
      }

      if (isMenuOpen) {
        closeMenuWindow();
      }

      var args = {
        element: targetDOMElement,
        id: pointedID,
        type: targetType,
        pointer: pointerPosition,
      };

      makeMenuWindow(args);
    };

    return f;
  })();

  function disableContexMenu(e) {
    e.preventDefault();
  }

  var wrapper = state.settings.wrapper.wrapperElement;
  wrapper.addEventListener("contextmenu", handleContexMenu);
  document.addEventListener("contextmenu", disableContexMenu);
}
