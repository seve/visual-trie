/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import GithubCorner from 'react-github-corner';

import Trie from './Trie';
import './App.css';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      <div className="App">
        <GithubCorner octoColor="#444151" bannerColor="#ffffff" href="https://github.com/seve/visual-trie" />
        <div className="canvas" style={{ marginTop: '32px' }}>
          <Trie />
        </div>
      </div>
    );
  }
}
export default App;
