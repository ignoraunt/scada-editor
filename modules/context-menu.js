var l = console.log;

import { state } from "./general.js";
import { pointedID } from "./elements-resizing.js";

export function contextMenu() {
  function renameBlock(args) {
    var element = args.element;
    var type = args.type;

    if (type !== "gauge") return;

    var initialValue = element.innerText;
    element.innerText = "";

    var input = document.createElement("input");
    input.classList.add("gauge-renaming-input");
    input.value = initialValue;

    element.removeAttribute("draggable");
    element.append(input);

    // TODO find out whats's happening here
    setTimeout(() => {
      input.focus();
    });

    function applyRenaming() {
      element.innerText = input.value;
      element.classList.remove("new-gauge");
      element.setAttribute("draggable", "true");

      if (input.value === "") {
        element.innerText = initialValue;
        element.classList.add("new-gauge");
      }

      input.remove();
      document.removeEventListener("keydown", handleBlur);
    }

    function handleBlur(e) {
      var key = e.key;
      if (key === "Escape" || key === "Enter") {
        applyRenaming();
      }
    }

    input.addEventListener("blur", applyRenaming, { once: true });
    document.addEventListener("keydown", handleBlur);
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

    state.makeElement("", "gauge", pointerOffsetPosX, pointerOffsetPosY);
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
    if (args.action === "create") {
      createBlock(args);
      return;
    }

    if (args.action === "rename") {
      renameBlock(args);
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
      var dialog = document.querySelector(".palette");
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
      wrapper: [
        ["Создать элемент", "create"],
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
      var targetElementType = targetDOMElement
        ? state.getElementType(pointedID)
        : "wrapper";
      var pointerPosition = [e.x, e.y];

      lastClickedElement = targetDOMElement;

      var args = {
        element: targetDOMElement,
        id: pointedID,
        type: targetElementType,
        pointer: pointerPosition,
      };

      if (targetElementType !== "wrapper") {
        targetDOMElement.classList.add("selected-gauge");
      }

      if (isMenuOpen) {
        closeMenuWindow();
      }

      makeMenuWindow(args);
    };

    return f;
  })();

  document.addEventListener("contextmenu", handleContexMenu);
}
