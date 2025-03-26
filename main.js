var l = console.log;

import { backgroundGrid } from "./modules/background-grid.js";
import { elementsMoving } from "./modules/elements-moving.js";
import { elementsResizing } from "./modules/elements-resizing.js";
import { contextMenu } from "./modules/context-menu.js";
import { configurationHandling } from "./modules/configuration-handling.js";

import { oop } from "./modules/temp-oop-handling.js";

(() => {
  var modulesToExecList = [
    backgroundGrid,
    elementsMoving,
    elementsResizing,
    contextMenu,
    configurationHandling,
    oop,
  ];

  var i;
  for (i = 0; i < modulesToExecList.length; i++) {
    setTimeout(
      (i) => {
        modulesToExecList[i]();
      },
      0,
      i
    );
  }
})();
