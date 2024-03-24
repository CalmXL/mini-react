import React from "./React.js";
const TEXT_ELEMENT_TYPE = "TEXT_ELEMENT";

function workLoop (idleDeadline) {
  let shouldYield = false

  while (!shouldYield) {
    // run task
    
    shouldYield = idleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}


function createRoot(container) {
  const render = (el) => {
    React.render(el, container)
  }

  return {
    render
  }
}

export default {
  createRoot
}