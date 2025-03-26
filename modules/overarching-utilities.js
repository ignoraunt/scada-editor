export var utils = {
  throttle: function (callee, delay) {
    var timeout = 0;
    return (...args) => {
      if (timeout !== 0) return;
      timeout = setTimeout(() => {
        callee(...args);
        clearTimeout(timeout);
        timeout = 0;
      }, delay);
    };
  },

  getStateDate: function () {
    var date = new Date();
    var y = date.getFullYear();
    var m = (date.getMonth() + 1).toString().padStart(2, "0");
    var d = date.getDate().toString().padStart(2, "0");
    var h = date.getHours().toString().padStart(2, "0");
    var min = date.getMinutes().toString().padStart(2, "0");
    return `${d}-${m}-${y}--${h}-${min}`;
  },
};
