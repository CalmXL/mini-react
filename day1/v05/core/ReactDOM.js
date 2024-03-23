const TEXT_ELEMENT_TYPE = "TEXT_ELEMENT";

function _render(vdom, container) {
  // 1. 创建对应真实 DOM
  const dom =
    vdom.type === TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(vdom.type);

  // 2. 处理 非 children 的 props
  Object.keys(vdom.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = vdom.props[key];
    }
  });

  // 3. 存在 children 处理 chilren
  const children = vdom.props.children;
  if (children) {
    children.forEach((child) => {
      _render(child, dom);
    });
  }

  // 4. 真实DOM渲染到页面
  container.append(dom);
}

function createRoot(container) {
  const render = (el) => {
    _render(el, container)
  }

  return {
    render
  }
}

export default {
  createRoot
}