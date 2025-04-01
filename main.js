var l = console.log;

import { general } from "./modules/general.js";
import { backgroundGrid } from "./modules/background-grid.js";
import { elementsMoving } from "./modules/elements-moving.js";
import { elementsResizing } from "./modules/elements-resizing.js";
import { contextMenu } from "./modules/context-menu.js";
import { configurationHandling } from "./modules/state-files-handling.js";

(() => {
  var bootList = [
    general,
    backgroundGrid,
    elementsMoving,
    elementsResizing,
    contextMenu,
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
