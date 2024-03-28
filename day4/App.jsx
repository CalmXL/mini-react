import React from "./core/React.js";

function Counter({ num }) {

  function handleClick () {
    console.log('click');
  }

  return <div>
    count: {num}
    <button onClick={ handleClick}>click</button>
  </div>;
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
