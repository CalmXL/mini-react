const TEXT_ELEMENT_TYPE = "TEXT_ELEMENT";

function createTextElement(nodeValue) {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue,
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function render(vdom, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [vdom],
    },
  };
}

function createDom(type) {
  return type === TEXT_ELEMENT_TYPE
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(fiber) {
  Object.keys(fiber.props).forEach((key) => {
    if (key !== "children") {
      fiber.dom[key] = fiber.props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children &&
    children.forEach((child, index) => {
      const newWork = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
      };
      if (index === 0) {
        fiber.child = newWork;
      } else {
        prevChild.sibling = newWork;
      }
      prevChild = newWork;
    });
}

function performWorkOfUnit(fiber) {
  // console.log(fiber);
  // 1. create dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    fiber.parent.dom.append(dom);

    // 2. handle props
    updateProps(fiber);
  }
  // 3. 转换链表，设置指针
  initChildren(fiber);

  // 4. 返回下一个任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent?.sibling;
}

let nextWorkOfUnit = null;
function workLoop(idleDeadline) {
  let shouldYield = false;

  while (!shouldYield) {
    // run task
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = idleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export default {
  createTextElement,
  createElement,
  render,
};
