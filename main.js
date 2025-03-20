import { initCanvas } from "./modules/canvas.js";
import { movingAround } from "./modules/moving-around.js";
import { contextMenu } from "./modules/context-menu.js";
import { exporting } from "./modules/exporting.js";

(() => {
  var bootList = [initCanvas, movingAround, contextMenu, exporting];

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
