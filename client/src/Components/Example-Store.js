import React from 'react';
import { createStore, useStore } from 'react-hookstore';

createStore('clickStore', {
    counter : 0,
    counter2 : 0
});

export function StatefullHello() {
  // just use the useStore method to grab the state and the setState methods
  const [ timesClicked, setClicks ] = useStore('clickStore')

  return (
    <div>
      <h1>Hello, component!</h1>
      <h2>The button inside this component was clicked {timesClicked.counter} times</h2>
      <button type="button" onClick={() => setClicks({ counter : timesClicked.counter+1})}>Update</button>
    </div>
  );
}

export function AnotherComponent() {
  // you can name the state whatever you want
  const [ timesClicked ] = useStore('clickStore');
  return (
    <div>
      <h1>Hello, this is a second component, with no relation to the one on the top</h1>
      <h2>But it is still aware of how many times the button was clicked: {timesClicked.counter} </h2>
    </div>
  )
}