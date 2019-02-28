import React, { Component } from 'react'
import * as d3 from 'd3'

export default class Trie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      root: [false, 0, false],
      id: 1,
      dict: [],
      childrenPerLevel: []
    };
    this.state.dict[this.state.root] = [];
  }

  addWord(word) {
    let currNode = this.state.root;    
    
    const letterIter = word.split('').entries();
    let letterResult = letterIter.next();
          
    while (!letterResult.done) {

      const [i, letter] = letterResult.value;
      let foundLetter = false;
      const childIter = this.state.dict[currNode].entries();
      let childResult = childIter.next();
      
      while (!childResult.done) {
        console.log('childResult', childResult);


        const [j, node] = childResult.value;
        if (node[0] === letter) {
          if (letter === word.length - 1 && !node[2]) {
            /* eslint-disable-next-line no-loop-func*/
            this.setState({dict:this.state.dict.map()})
            this.setState((state) => {
              state.dict[currNode][j] = [currNode[0], currNode[1], true];
              return { dict: state.dict }
            })
            // this.state.dict[currNode][j] = [currNode[0], currNode[1], true];
            currNode = this.state.dict[currNode][j];
            console.log("currNode", currNode);
            
            
            /* eslint-disable-next-line no-loop-func*/
            this.setState((state) => {
              state.dict[currNode] = this.state.dict[node];
              return { dict: state.dict };
            })
            // this.state.dict[currNode] = this.state.dict[node];
            this.setState((state) => {
              delete state.dict[node];
              return { dict: state.dict }
            })
            // delete this.state.dict[node];
          } else {
            currNode = node;
            console.log("currNode", currNode);
            
          }
          foundLetter = true;
          break;
        }
        childResult = childIter.next();
      }
      if (!foundLetter) {
        let newNode;
        if (i === word.length - 1) {
          newNode = [letter, this.state.id, true];
        } else {
          newNode = [letter, this.state.id, false];
        }
        this.setState({ id: this.state.id + 1 })
        console.log("about to add node");
        /* eslint-disable-next-line no-loop-func*/
        const updateDict = (state) => {
          console.log("current letter", letter)
          console.log("currNode", currNode)
          console.log("state.dict", state.dict);
          console.log("state.dict[currNode]", state.dict[currNode]);
          state.dict[currNode].push(newNode)
          console.log('in set state', state.dict);
          state.dict[newNode] = [];
          if(state.childrenPerLevel[i]){
            state.childrenPerLevel[i] += 1;
          } else {
            state.childrenPerLevel[i] = 1
          }
          return { dict: state.dict } 
        }
        this.setState(updateDict(this.state));
        console.log('saved in dict', this.state.dict);
        console.log('num children', this.state.childrenPerLevel)
        console.log('ref', this.refs)
        d3.select(this.refs.svg).append("circle")
            .attr("cx", 60 * (this.state.childrenPerLevel[i]))
            .attr("cy", 50 * (i + 1))
            .attr("r", 20)
            .style("fill", "white")
            .style("stroke-width", 2)
            .style('stroke', 'black');
        d3.select(this.refs.svg).append("text")
        .attr("x", 55 * (this.state.childrenPerLevel[i]))
        .attr("y", 50 * (i + 1))
        .text(letter)
        .style("font-size", "25px")
        .style("fill", "black")
        

        
        // this.state.dict[currNode].push(newNode);
        // this.state.dict[newNode] = [];
        currNode = newNode;
        console.log("currNode", currNode);
      }
      letterResult = letterIter.next();
    }
  }

  findWordsFromNode(words, prefix = '', node = this.state.root) {
    if (node[2]) {
      words.push(prefix);
    }

    this.state.dict[node].forEach((child) => {
      const newPrefix = prefix + child[0];
      this.findWordsFromNode(words, newPrefix, child);
    });
  }

  componentDidMount() {
    this.addWord('test')
    this.addWord('ternary')
    this.addWord('testical')
    this.addWord('terrible')
    this.addWord('tim')
  }

  autocomplete(prefix) {
    const words = [];
    let currNode = this.state.root;
    console.log("currNode", currNode);

    prefix.split('').forEach((letter) => {
      let foundLetter = false;

      this.state.dict[currNode].forEach((node) => {
        if (node[0] === letter && !foundLetter) {
          currNode = node;
          foundLetter = true;
        }
      });
      if (!foundLetter) {
        console.error('PREFIX NOT IN TRIE');
        return words; 
      }
    });
    const baseNode = currNode;
    this.findWordsFromNode(words, prefix, baseNode);
    return words;
  }
  
  render() {
    console.log("render");
    
    return (
      <svg width="760" height="800" id="trie" ref="svg">
      </svg>
    )
  }
}
