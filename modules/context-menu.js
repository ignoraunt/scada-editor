var l = console.log;

export function contextMenu() {
  function renameBlock(e, target) {
    var initialValue = target ? target.innerText : e.target.innerText;
    var target = target ? target : e.target;

    if (!target.classList.contains("gauge")) return;

    target.removeAttribute("draggable");

    target.innerText = "";

    var input = document.createElement("input");
    input.classList.add("gauge-renaming-input");

    if (initialValue === "- - -") {
      input.value = "";
    } else {
      input.value = initialValue;
    }

    target.append(input);
    input.focus();

    function applyRenaming() {
      target.innerText = input.value;
      target.classList.remove("new-gauge");
      target.setAttribute("draggable", "true");

      if (input.value === "" || input.value === "- - -") {
        target.innerText = initialValue;
      }

      input.remove();
    }

    function handleBlur(e) {
      l(e);
      if (e.key === "Escape" || e.key === "Enter") {
        applyRenaming();
      }
    }

    input.addEventListener("blur", applyRenaming, { once: true });
    document.addEventListener("keydown", handleBlur, { once: true });
  }

  function copyBlock(e, target) {
    // ... ... ...
  }

  function removeBlock(e, target) {
    target.remove();
  }

  function createBlock(e, target) {
    var posX = e.x;
    var posY = e.y;

    var div = document.createElement("div");
    div.classList.add("gauge");
    div.classList.add("new-gauge");
    div.innerText = "- - -";
    div.draggable = "true";
    div.style.left = posX - 15 + "px";
    div.style.top = posY - 15 + "px";
    div.style.width = 135 + "px";
    div.style.height = 45 + "px";
    document.body.prepend(div);
  }

  function insertPicture() {
    var img = document.createElement("img");
    img.src = "./turbine.jpg";
    var src = document.createElement("div");
    src.style.position = "absolute";
    src.style.left = "200px";
    src.style.top = "200px";
    src.append(img);
    document.body.append(src);
  }

  function selectColor(e, target) {
    var colors = {
      magenta: "hsl(300 30% 30%)",
      green: "hsl(160 30% 30%)",
      orange: "hsl(40 30% 30%)",
    };

    if (e.target.classList.contains("color-sample")) {
      target.style.backgroundColor = colors[e.target.dataset.color];
      var dialog = document.querySelector(".palette");
      dialog.close();
    }
  }

  function action(e, target, act) {
    if (act === "create") {
      createBlock(e, target);
      return;
    }

    if (act === "rename") {
      renameBlock(e, target);
      return;
    }

    // if (act === "copy") {
    //   copyBlock(e, target);
    //   return
    // }

    if (act === "delete") {
      removeBlock(e, target);
      return;
    }

    if (act === "picture") {
      insertPicture(e, target);
      return;
    }

    if (act === "palette") {
      var dialog = document.querySelector(".palette");
      dialog.showModal();
      dialog.addEventListener("click", (e) => selectColor(e, target), {
        once: true,
      });
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

    function handleMenuClick(e, target) {
      var menuAction = e.target.dataset.action;
      closeMenuWindow();
      action(e, target, menuAction);
    }

    function makeMenuWindow(e) {
      var targetType = "";

      var isTargetGauge = e.target.classList.contains("gauge");

      if (isTargetGauge) {
        targetType = "gauge";
      } else {
        targetType = "canvas";
      }

      isMenuOpen = true;

      var menuWindow = document.createElement("div");
      menuWindow.classList.add("context-menu");
      menuWindow.style.left = e.clientX + "px";
      menuWindow.style.top = e.clientY + "px";

      var i;
      for (i = 0; i < menuOptions[targetType].length; i++) {
        var menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        menuItem.innerHTML = menuOptions[targetType][i][0];
        menuItem.dataset.action = menuOptions[targetType][i][1];
        menuWindow.append(menuItem);
      }

      document.body.append(menuWindow);

      menu = menuWindow;

      var target = e.target;

      document.addEventListener("click", closeMenuWindow, { once: true });
      menu.addEventListener(
        "click",
        (e) => {
          handleMenuClick(e, target);
        },
        { once: true }
      );
    }

    function closeMenuWindow() {
      // TODO better to check a single element
      var gauges = document.querySelectorAll(".gauge");
      gauges.forEach((el) => {
        el.classList.remove("selected-gauge");
      });

      isMenuOpen = false;
      menu.remove();
    }

    var f = (e) => {
      e.preventDefault();

      var isTargetGauge = e.target.classList.contains("gauge");
      var isTargetUninitGauge = e.target.classList.contains("new-gauge");

      if (isTargetGauge && !isTargetUninitGauge)
        e.target.classList.add("selected-gauge");

      if (isMenuOpen) {
        closeMenuWindow();
      }

      makeMenuWindow(e);
    };

    return f;
  })();

  document.addEventListener("contextmenu", handleContexMenu);
  document.addEventListener("dblclick", renameBlock);
}
