// eslint-disable jsx-filename-extension
import React, { Component } from 'react';
import Trie from './Trie'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    const trie = new Trie(['dog', 'dirt', 'dope', 'done', 'door']);
    this.state = {
       trie,
    }
  }
  
  render() {
    return (
      <div className="App">
        <div className="canvas">
          <Trie/>
        </div>
      </div>
    );
  }
}

export default App;
