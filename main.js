import { initClasses } from "./modules/classes.js";
import { general } from "./modules/general.js";
import { elementsMoving } from "./modules/elements-moving.js";
import { elementsResizing } from "./modules/elements-resizing.js";
import { contextMenu } from "./modules/context-menu.js";
import { mainMenu } from "./modules/main-menu.js";
import { configurationHandling } from "./modules/state-files-handling.js";

(() => {
  var bootList = [
    initClasses,
    general,
    elementsMoving,
    elementsResizing,
    contextMenu,
    mainMenu,
    configurationHandling,
  ];

  var i;
  for (i = 0; i < bootList.length; i++) {
    setTimeout(
      (i) => {
        bootList[i]();
      },
      0,
      i
    );
  }
})();
