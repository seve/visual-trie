export default class Trie {
  constructor(wordList = undefined) {
    this.id = 0;
    this.root = ['', this.id, false];
    this.id += 1;
    this.dict = [];
    this.dict[this.root] = [];

    if (wordList !== undefined) {
      wordList.forEach(word => this.addWord(word));
    }
  }

  addWord(word) {
    let currNode = this.root;
    console.log(word.split(''));
    
    const letterIter = word.split('').entries();
    let letterResult = letterIter.next();       
    while (!letterResult.done) {
      const [i, letter] = letterResult.value;
      console.log('test')
      let foundLetter = false;
      console.log(this.dict);
      console.log(this.dict[currNode]);
      const childIter = this.dict[currNode].entries();
      let childResult = childIter.next();
      while (!childResult.done) {
        const [j, node] = childResult.value;
        if (node[0] === letter) {
          if (letter === word.length - 1 && !node[2]) {
            this.dict[currNode][j] = [currNode[0], currNode[1], true];
            currNode = this.dict[currNode][j];
            this.dict[currNode] = this.dict[node];
            delete this.dict[node];
          } else {
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
          newNode = [letter, this.id, true];
        } else {
          newNode = [letter, this.id, false];
        }
        this.id += 1;
        this.dict[currNode].push(newNode);
        this.dict[newNode] = [];
        currNode = newNode;
      }
      letterResult = letterIter.next();
    }
  }

  findWordsFromNode(words, prefix = '', node = this.root) {
    if (node[2]) {
      words.push(prefix);
    }

    this.dict[node].forEach((child) => {
      const newPrefix = prefix + child[0];
      this.findWordsFromNode(words, newPrefix, child);
    });
  }

  autocomplete(prefix) {
    const words = [];
    let currNode = this.root;

    prefix.split('').forEach((letter) => {
      let foundLetter = false;

      this.dict[currNode].forEach((node) => {
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
}
