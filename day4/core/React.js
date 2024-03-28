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
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextElement(child) : child;
      }),
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

  root = nextWorkOfUnit;
}

function createDom(type) {
  return type === TEXT_ELEMENT_TYPE
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(fiber) {
  fiber.props &&
    Object.keys(fiber.props).forEach((key) => {
      if (key !== "children") {
        if (key.startsWith("on")) {
          const eventName = key.slice(2).toLowerCase();
          fiber.dom.addEventListener(eventName, fiber.props[key]);
        } else {
          fiber.dom[key] = fiber.props[key];
        }
      }
    });
}

function initChildren(fiber, children) {
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

function updateFunctionComponent(fiber) {
  let children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.type);
    updateProps(fiber);
  }

  let children = fiber.props?.children;

  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  if (!fiber) return;
  const isFunctionComponent = typeof fiber.type === "function";

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4. 返回下一个任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return fiber.parent?.sibling;
}

let nextWorkOfUnit = null;
let root = null;
function workLoop(idleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    if (nextWorkOfUnit) {
      nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    }

    if (!nextWorkOfUnit) {
      commitRoot();
    }
    shouldYield = idleDeadline.timeRemaining() < 1;
    requestIdleCallback(workLoop);
  }
}
requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export default {
  createElement,
  createTextElement,
  render,
};
