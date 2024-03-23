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

export default {
  createTextElement,
  createElement
}