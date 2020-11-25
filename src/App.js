import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import initialize from './KabanDB/index';
import Board from './containers/Board/Board';
import {useEffect,useState} from 'react';
import AddCard from './components/AddCard/AddCard';




function App() {

//   const [state,setState]= useState({
//     db:null
//   })

//   useEffect(()=>{
//     console.log('1');
//     console.log('object');
//     //  initialize().then(x=>{
// setState({
//       db :initialize()
//     })
//     //  });
    
    


  // },[])
  // Initialize DB communications.
  

  return (
    <div className="App">
       <Board />
       
    </div>
  );
}

export default App;
