import React, { Component } from 'react'
import * as d3 from 'd3'

const CIRCLE_RADIUS = 20;
const VERTICAL_SPACING = 70;
const CANVAS_WIDTH = 1000;

export default class Trie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Root node, string is false because and empty string will change to null
      root: [false, 0, false],
      // Incrementing unique id
      id: 1,
      // Array representing dict which will implement trie
      dict: [],
      // Arrary representing the rendered nodes
      renderedNodes: [],
      // The current word inside of the text input
      inputWord: '',
    };
    // Inserting the root node into the dict
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
              // TODO: Update existing node to be truncating node in visualizer
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
        
        const updateId = (state) => {
          state.id += 1

          return { id: state.id }
        }
        this.setState(updateId(this.state));

        
        /* eslint-disable-next-line no-loop-func*/
        const updateDict = (state) => {
          state.dict[currNode].push(newNode)
          state.dict[newNode] = [];
          return { dict: state.dict } 
        }
        this.setState(updateDict(this.state));
        
        // TODO: Set delay to this
        const parent = currNode;
        setTimeout(() => this.renderNewNode(parent, newNode, i + 1), 500 * (i + 1))


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

  renderNewNode(parent, node, level) {
    // Save the coupling of the circle and text to an array
    //          this will allow me to alter the rendering of the
    //          circles after intial rendering (allowing for shifting)
    // Save the parent circle, this will allow for drawing the
    //          line from parent to child. This needs to be svg and
    //          not the node data. This is because the x and y will
    //          change later if more nodes at the height are rendered.
    //          BUT, what if the previous node wasn't just created?
    //          How do we pass through the circle? We don't just send
    //          the node, when inserting the rendered objects into 
    //          renderedNodes also insert the nodes themselves so
    //          when we go to write the line you can search for the
    //          node in the renderedNodes collection.
    // Maybe make a d3 render method. At render time check 
    //          to see if there are any other nodes on the level.
    //          if there are, change the rendering of the other nodes
    //          then insert the new node
    // When rendering the nodes on a level, consider the
    //          entire level as 100% width. Once implemented consider
    //          switching to giving each parent node a specified 
    //          children width.  Then use that as 100%
    
    let newNumOnLevel = 1
    let counter = 1
    let availableSpace = (CANVAS_WIDTH) / (newNumOnLevel + 1)        
    if(this.state.renderedNodes[level]){          
      newNumOnLevel += Object.keys(this.state.renderedNodes[level]).length
      availableSpace = (CANVAS_WIDTH) / (newNumOnLevel + 1)
      const updateRenderedNodes = (state) =>{
        Object.keys(state.renderedNodes[level]).forEach((key) => {
          const item = state.renderedNodes[level][key]
          console.log('rerendering:', item[2].text());
          console.log('counter:', counter);
          

          const renderedParent = this.state.renderedNodes[level - 1][item[5]][1]
          
          const circleX = availableSpace * counter
          const circleY = VERTICAL_SPACING * (level + 1)

          // TODO: To fix the line, probably have to save the child node to rendered parent object
          //          Then when rerendering change the the x1 of the child node's line
          item[1].transition().duration(500)
            .attr("cx", circleX)
            .attr("cy", circleY)
          item[2].transition().duration(500)
            .attr("x", availableSpace * counter - 10 )
            .attr("y", VERTICAL_SPACING * (level + 1))

          item[3].transition().duration(500)
            .attr("x1", renderedParent.attr('cx'))
            .attr("y1", renderedParent.attr('cy'))
            .attr("x2", circleX)
            .attr("y2", circleY)

          item[4].forEach((line) => {
            line.transition().duration(500)
              .attr("x1", circleX)
              .attr("y1", circleY);
          })

          counter += 1
        })
        return { renderedNodes: state.renderedNodes }
      }
      this.setState(updateRenderedNodes(this.state))
    }

    let color = "#f3f3f3ff"
    if (node[2]) {
      color = "#fce5cdff"
    }

    console.log('creating:', node[0]);;
    

    const renderedParent = this.state.renderedNodes[level - 1][parent][1]

    const circleX = availableSpace * counter 
    const circleY = VERTICAL_SPACING * (level + 1)

    let line = d3.select(this.refs.svg).append("line")
      .attr("x1", renderedParent.attr('cx')).attr("y1", renderedParent.attr('cy'))
      .attr("x2", renderedParent.attr('cx')).attr("y2", renderedParent.attr('cy'))
      .attr("stroke", "black")
      .lower()

    line.transition().duration(500)
    .attr("x2", circleX).attr("y2", circleY)
      

    let circle = d3.select(this.refs.svg).append("circle")
      .attr("cx", circleX)
      .attr("cy", circleY)
      .attr("r", CIRCLE_RADIUS)
      .style("fill", color)
    
    let text = d3.select(this.refs.svg).append("text")
      .attr("x", availableSpace * counter - 10)
      .attr("y", 5 + VERTICAL_SPACING * (level + 1))
      .text("'" + node[0] + "'")
      .style("font-size", "25px")
      .style("fill", "black")

    let childLines = []

    this.state.renderedNodes[level - 1][parent][4].push(line);

    
    const addToRenderedNodes = ((state) => {
      if(state.renderedNodes[level]){
        state.renderedNodes[level][node] =[node, circle, text, line, childLines, parent]
      } else {
        state.renderedNodes[level] = []
        state.renderedNodes[level][node] = [node, circle, text, line, childLines, parent]
      }
      return {renderedNodes: state.renderedNodes};
    });

    this.setState(addToRenderedNodes(this.state));
  }

  componentDidMount() {
    const circle = d3.select(this.refs.svg).append("circle")
      .attr("cx", CANVAS_WIDTH/2 )
      .attr("cy", 55)
      .attr("r", CIRCLE_RADIUS)
      .style("fill", "#f3f3f3ff");
    const text = d3.select(this.refs.svg).append("text")
      .attr("x", CANVAS_WIDTH/2 - 5)
      .attr("y", 55 )
      .text("''")
      .style("font-size", "25px")
      .style("fill", "black")
    const childLines = [];
    const pushRootToRenderedNodes = (state) => {
      state.renderedNodes[0] = []
      state.renderedNodes[0][[false, 0, false]] = [[false, 0, false], circle, text, null, childLines, null]
    
      
      return {renderedNodes: state.renderedNodes}
    }
    this.setState(pushRootToRenderedNodes(this.state))
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

  handleSubmit(e) {
    e.preventDefault()

    if (this.state.inputWord.length > 0) {
      this.addWord(this.state.inputWord)
      this.setState({inputWord: ''})
    }
  }
  
  render() {
    console.log("render");
    
    return (
      <div>
      <svg width={CANVAS_WIDTH} height="800" id="trie" ref="svg" style={styles}>
      </svg>
      <form onSubmit={e => this.handleSubmit(e)}>
        <input value={this.state.inputWord} onChange={e => this.setState({ inputWord: e.target.value })}
        type="text" placeholder="New word"/>
        <button type="submit">Add Word</button>
      </form>
      </div>
    )
  }
}

const styles = {
  border: '1px solid'
}
