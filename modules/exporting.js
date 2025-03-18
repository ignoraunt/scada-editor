var l = console.log;

export function exporting() {
  var saved = null;

  function exportConfiguration() {
    var list = [];

    var blocks = document.querySelectorAll(".gauge");

    for (var block of blocks) {
      var dims = {};

      var rect = block.getBoundingClientRect();

      var x = block.offsetLeft;
      var y = block.offsetTop;

      var width = rect.width;
      var height = rect.height;

      dims.x = x;
      dims.y = y;
      dims.width = width;
      dims.height = height;

      list.push(dims);
    }

    return list;
  }

  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "q") {
  //     l(exportConfiguration());
  //     saved = exportConfiguration();
  //     l("saved!");
  //   }
  // });

  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "w") {
  //     generateBlocks(saved);
  //   }
  // });
}
