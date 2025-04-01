var l = console.log;

import { state } from "./general.js";

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
    var activeWrapper = document.querySelector(".active-wrapper");
    var activeWrapperOffsetX = activeWrapper.offsetLeft;
    var activeWrapperOffsetY = activeWrapper.offsetTop;

    var div = document.createElement("div");
    div.classList.add("gauge");
    div.classList.add("new-gauge");
    div.innerText = "- - -";
    div.draggable = "true";
    div.style.left = pointerPosition[0] - activeWrapperOffsetX + "px";
    div.style.top = pointerPosition[1] - activeWrapperOffsetY + "px";
    div.style.width = 135 + "px";
    div.style.height = 45 + "px";
    activeWrapper.append(div);
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

  function action(clickedElement, pointerPosition, menuAction) {
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
      var id = clickedElement.dataset.id;
      state.removeElement(id);
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
    var menu = null;

    var menuOptions = {
      gauge: [
        ["Изменить идентификатор", "rename"],
        ["Изменить цвет", "palette"],
        // ["Скопировать", "copy"],
        ["Удалить", "delete"],
      ],
      canvas: [
        ["Создать элемент", "create"],
        ["Добавить изображение", "picture"],
      ],
    };

    function handleMenuClick(clickedElement, pointerPosition, menuAction) {
      closeMenuWindow();
      action(clickedElement, pointerPosition, menuAction);
    }

    function makeMenuWindow(clickedElement, pointerPosition) {
      var isTargetGauge = clickedElement.classList.contains("gauge");
      var clickedElementType = isTargetGauge ? "gauge" : "canvas";

      var menuWindow = document.createElement("div");
      menuWindow.classList.add("context-menu");
      menuWindow.style.left = pointerPosition[0] + "px";
      menuWindow.style.top = pointerPosition[1] + "px";

      var i;
      for (i = 0; i < menuOptions[clickedElementType].length; i++) {
        var menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        menuItem.innerHTML = menuOptions[clickedElementType][i][0];
        menuItem.dataset.action = menuOptions[clickedElementType][i][1];
        menuWindow.append(menuItem);
      }

      document.body.append(menuWindow);

      menu = menuWindow;
      isMenuOpen = true;

      document.addEventListener("click", closeMenuWindow, { once: true });
      menu.addEventListener(
        "click",
        (e) => {
          var pointerPosition = [e.x, e.y];
          var menuAction = e.target.dataset.action;
          handleMenuClick(clickedElement, pointerPosition, menuAction);
        },
        { once: true }
      );
    }

    function closeMenuWindow() {
      // TODO better to check just a single element
      var gauges = document.querySelectorAll(".gauge");
      gauges.forEach((el) => {
        el.classList.remove("selected-gauge");
      });

      menu.remove();
      isMenuOpen = false;
    }

    var f = (e) => {
      e.preventDefault();

      var clickedElement = e.target;
      var pointerPosition = [e.x, e.y];

      var isTargetGauge = clickedElement.classList.contains("gauge");
      var isTargetNewGauge = clickedElement.classList.contains("new-gauge");

      if (isTargetGauge && !isTargetNewGauge)
        clickedElement.classList.add("selected-gauge");

      if (isMenuOpen) {
        closeMenuWindow();
      }

      makeMenuWindow(clickedElement, pointerPosition);
    };

    return f;
  })();

  document.addEventListener("contextmenu", handleContexMenu);
  document.addEventListener("dblclick", (e) => {
    var clickedElement = e.target;
    renameBlock(clickedElement);
  });
}
