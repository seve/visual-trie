import React, { Component } from 'react'
import * as d3 from 'd3'

export default class Trie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      root: [false, 0, false],
      id: 1,
      dict: [],
      renderedNodes: []
    };
    this.state.dict[this.state.root] = [];
  }

  addWord(word) {
    let prevNode;
    let currNode = this.state.root;    
    
    const letterIter = word.split('').entries();
    let letterResult = letterIter.next();
          
    while (!letterResult.done) {

      const [i, letter] = letterResult.value;
      let foundLetter = false;
      const childIter = this.state.dict[currNode].entries();
      let childResult = childIter.next();
      
      while (!childResult.done) {

        const [j, node] = childResult.value;
        if (node[0] === letter) {
          if (i === word.length - 1 && !node[2]) {
            /* eslint-disable-next-line no-loop-func*/
            this.setState((state) => {
              state.dict[currNode][j] = [currNode[0], currNode[1], true];
              return { dict: state.dict }
            })
            // this.state.dict[currNode][j] = [currNode[0], currNode[1], true];
            prevNode = currNode;
            currNode = this.state.dict[currNode][j];
            
            
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
            prevNode = currNode;
            currNode = node;
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
        console.log("id before:", this.state.id);
        
        const updateId = (state) => {
          state.id += 1

          return { id: state.id }
        }
        this.setState(updateId(this.state));

        console.log("id after:", this.state.id);
        
        /* eslint-disable-next-line no-loop-func*/
        const updateDict = (state) => {
          state.dict[currNode].push(newNode)
          state.dict[newNode] = [];
          return { dict: state.dict } 
        }
        this.setState(updateDict(this.state));
        
        this.renderNewNode(currNode, newNode, i);

        
        // this.state.dict[currNode].push(newNode);
        // this.state.dict[newNode] = [];
        prevNode = currNode;
        currNode = newNode;
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

  renderNewNode(prevNode, node, level) {
    // TODO: Save the coupling of the circle and text to an array
        //          this will allow me to alter the rendering of the
        //          circles after intial rendering (allowing for shifting)
        // TODO: Save the parent circle, this will allow for drawing the
        //          line from parent to child. This needs to be svg and
        //          not the node data. This is because the x and y will
        //          change later if more nodes at the height are rendered.
        //          BUT, what if the previous node wasn't just created?
        //          How do we pass through the circle? We don't just send
        //          the node, when inserting the rendered objects into 
        //          renderedNodes also insert the nodes themselves so
        //          when we go to write the line you can search for the
        //          node in the renderedNodes collection.
        // TODO: Maybe make a d3 render method. At render time check 
        //          to see if there are any other nodes on the level.
        //          if there are, change the rendering of the other nodes
        //          then insert the new node
        // TODO: When rendering the nodes on a level, consider the
        //          entire level as 100% width. Once implemented consider
        //          switching to giving each parent node a specified 
        //          children width.  Then use that as 100%
        if(this.state.renderedNodes[level]){
          const newNumOnLevel = this.state.renderedNodes[level].length + 1
        } else {
          const newNumOnLevel = 1
        }
        let color = "#f3f3f3ff"
        if (node[2]) {
          color = "#fce5cdff"
        }
        let circle = d3.select(this.refs.svg).append("circle")
            .attr("cx", 60 * (this.state.renderedNodes[level].length))
            .attr("cy", 50 * (level + 2))
            .attr("r", 20)
            .style("fill", color);
        let text = d3.select(this.refs.svg).append("text")
          .attr("x", -12 + 60 * (this.state.renderedNodes[level].length))
          .attr("y", 5 + 50 * (level + 2))
          .text("'" + node[0] + "'")
          .style("font-size", "25px")
          .style("fill", "black");
        
        const updateRenderedNodes = ((state) => {
          if(state.renderedNodes[level]){
            state.renderedNodes[level].push([node, circle, text])
          } else {
            state.renderedNodes[level] =[node, circle, text] 
          }
          return {renderedNodes: state.renderedNodes};
        });

        this.setState(updateRenderedNodes(this.state));
  }

  componentDidMount() {
    d3.select(this.refs.svg).append("circle")
            .attr("cx", 60 * 3)
            .attr("cy", 50)
            .attr("r", 20)
            .style("fill", "#f3f3f3ff");
        d3.select(this.refs.svg).append("text")
        .attr("x", -5 + 60 * 3)
        .attr("y", 5 + 50)
        .text("''")
        .style("font-size", "25px")
        .style("fill", "black")
    this.addWord('matt')
    this.addWord('mattress')
    this.addWord('matthew')
    this.addWord('matilda')
    this.addWord('mathias')
    this.addWord('matromoney')
    console.log(this.state.dict);
    
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
