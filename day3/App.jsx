import React from "./core/React.js";

function Counter({ num }) {
  return <div>count: {num}</div>;
}

const App = (
  <div class="box">
    hi-minireact
    <Counter num={10} />
    <Counter num={20} />
  </div>
);

// console.log(App);

export default App;
