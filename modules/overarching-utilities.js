export var throttle = (callee, delay) => {
  var timeout = 0;
  return (...args) => {
    if (timeout !== 0) return;
    timeout = setTimeout(() => {
      callee(...args);
      clearTimeout(timeout);
      timeout = 0;
    }, delay);
  };
};
