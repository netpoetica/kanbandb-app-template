import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import initialize from './services/API_KabanDB';
import Board from './containers/Board/Board';


function App() {
  // Initialize DB communications.
    initialize();

  return (
    <div className="App">
       <Board/>
    </div>
  );
}

export default App;
