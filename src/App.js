import React from 'react';
import logo from './logo.svg';
import './App.css';
import KanbanDB from 'kanbandb/dist/KanbanDB';

function initialize() {
  /**
   * 
   * Use KanbanDB like so (but you might want to move it) - types are provided:
   * 
   */

  KanbanDB.connect();

}

function App() {
  // Initialize DB communications.
  initialize();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
