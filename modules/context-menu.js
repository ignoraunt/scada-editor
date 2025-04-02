var l = console.log;

import { state } from "./general.js";
import { pointedID } from "./elements-resizing.js";

export function contextMenu() {
  function renameBlock(clickedElement) {
    if (!clickedElement.classList.contains("gauge")) return;

    var isGaugeNew = clickedElement.classList.contains("new-gauge");

    var initialValue = clickedElement.innerText;
    clickedElement.innerText = "";

    var input = document.createElement("input");
    input.classList.add("gauge-renaming-input");

    if (isGaugeNew) {
      input.value = "";
    } else {
      input.value = initialValue;
    }

    clickedElement.removeAttribute("draggable");
    clickedElement.append(input);
    input.focus();

    function applyRenaming() {
      clickedElement.innerText = input.value;
      clickedElement.classList.remove("new-gauge");
      isGaugeNew = false;
      clickedElement.setAttribute("draggable", "true");

      if (input.value === "" || isGaugeNew) {
        clickedElement.innerText = initialValue;
        clickedElement.classList.add("new-gauge");
        isGaugeNew = true;
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

  // function copyBlock(e, target) {
  //   // ... ... ...
  // }

  function removeBlock(clickedElement) {
    clickedElement.remove();
  }

  function createBlock(clickedElement, pointerPosition) {
    var settings = state.getSettings();
    var wrapper = settings.wrapper;
    var wrapperDOMElement = wrapper.wrapperElement;

    var pointerOffsetPosX = pointerPosition[0] - wrapperDOMElement.offsetLeft;
    var pointerOffsetPosY = pointerPosition[1] - wrapperDOMElement.offsetTop;

    state.makeElement("000001", "gauge", pointerOffsetPosX, pointerOffsetPosY);
  }

  // function insertPicture() {
  //   var img = document.createElement("img");
  //   img.src = "./turbine.jpg";
  //   var src = document.createElement("div");
  //   src.style.position = "absolute";
  //   src.style.left = "200px";
  //   src.style.top = "200px";
  //   src.append(img);
  //   document.body.append(src);
  // }

  function selectColor(clickedElement, pickedColor, dialog) {
    var colors = {
      magenta: "hsl(300 30% 30%)",
      green: "hsl(160 30% 30%)",
      orange: "hsl(40 30% 30%)",
    };

    var isPickerOption = pickedColor.classList.contains("color-sample");

    if (isPickerOption) {
      clickedElement.style.backgroundColor = colors[pickedColor.dataset.color];
      dialog.close();
    }
  }

  function action(clickedElement, pointedID, pointerPosition, menuAction) {
    if (menuAction === "create") {
      createBlock(clickedElement, pointerPosition);
      return;
    }

    if (menuAction === "rename") {
      renameBlock(clickedElement);
      return;
    }

    // if (act === "copy") {
    //   copyBlock(target,pointerPosition);
    //   return
    // }

    if (menuAction === "delete") {
      // var id = clickedElement.dataset.id;
      state.removeElement(pointedID);
      return;
    }

    // if (menuAction === "picture") {
    //   insertPicture(clickedElement, pointerPosition);
    //   return;
    // }

    if (menuAction === "palette") {
      var dialog = document.querySelector(".palette");
      dialog.showModal();
      dialog.addEventListener(
        "click",
        (e) => {
          var pickedColor = e.target;
          selectColor(clickedElement, pickedColor, dialog);
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
        // ["Скопировать", "copy"],
        ["Удалить", "delete"],
      ],
      wrapper: [
        ["Создать элемент", "create"],
        ["Добавить изображение", "picture"],
      ],
    };

    function handleMenuClick(
      clickedElement,
      pointedID,
      pointerPosition,
      menuAction
    ) {
      closeMenuWindow();
      action(clickedElement, pointedID, pointerPosition, menuAction);
    }

    function makeMenuWindow(
      clickedDOMElement,
      pointedID,
      elementType,
      pointerPosition
    ) {
      var menuWindow = document.createElement("div");
      menuWindow.classList.add("context-menu");
      menuWindow.style.left = pointerPosition[0] + "px";
      menuWindow.style.top = pointerPosition[1] + "px";

      var i;
      for (i = 0; i < menuOptions[elementType].length; i++) {
        var menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        menuItem.innerHTML = menuOptions[elementType][i][0];
        menuItem.dataset.action = menuOptions[elementType][i][1];
        menuWindow.append(menuItem);
      }

      document.body.append(menuWindow);

      menu = menuWindow;
      isMenuOpen = true;

      document.addEventListener("mousedown", closeMenuWindow, { once: true });
      menu.addEventListener(
        "mousedown",
        (e) => {
          debugger
          var pointerPosition = [e.x, e.y];
          var menuAction = e.target.dataset.action;
          handleMenuClick(
            clickedDOMElement,
            pointedID,
            pointerPosition,
            menuAction
          );
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

      var clickedElement = state.getDOMElement(pointedID);
      var type = clickedElement ? state.getElementType(pointedID) : "wrapper";
      var pointerPosition = [e.x, e.y];

      if (type !== "wrapper") {
        clickedElement.classList.add("selected-gauge");
      }

      lastClickedElement = clickedElement;

      if (isMenuOpen) {
        closeMenuWindow();
      }

      makeMenuWindow(clickedElement, pointedID, type, pointerPosition);
    };

    return f;
  })();

  document.addEventListener("contextmenu", handleContexMenu);

  document.addEventListener("dblclick", (e) => {
    var clickedElement = e.target;
    renameBlock(clickedElement);
  });
}
