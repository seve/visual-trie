(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{11:function(t,e,r){t.exports=r(20)},17:function(t,e,r){},19:function(t,e,r){},20:function(t,e,r){"use strict";r.r(e);var n=r(0),a=r.n(n),o=r(9),i=r.n(o),s=(r(17),r(2)),d=r(3),c=r(5),u=r(4),l=r(6),f=r(10),h=r.n(f),v=r(7),p=r(1),y=function(t){function e(t){var r;return Object(s.a)(this,e),(r=Object(c.a)(this,Object(u.a)(e).call(this,t))).state={root:[!1,0,!1],id:1,dict:[],renderedNodes:[],inputWord:""},r.state.dict[r.state.root]=[],r}return Object(l.a)(e,t),Object(d.a)(e,[{key:"addWord",value:function(t){for(var e=this,r=this.state.root,n=t.split("").entries(),a=n.next(),o=function(){for(var o,i=Object(v.a)(a.value,2),s=i[0],d=i[1],c=!1,u=e.state.dict[r].entries(),l=u.next(),f=function(){var n=Object(v.a)(l.value,2),a=n[0],o=n[1];if(o[0]===d)return s!==t.length-1||o[2]?(r,r=o):(e.setState(function(t){return t.dict[r][a]=[r[0],r[1],!0],{dict:t.dict}}),r,r=e.state.dict[r][a],e.setState(function(t){return t.dict[r]=e.state.dict[o],{dict:t.dict}}),e.setState(function(t){return delete t.dict[o],{dict:t.dict}})),c=!0,"break";l=u.next()};!l.done;){if("break"===f())break}if(!c){var h;h=s===t.length-1?[d,e.state.id,!0]:[d,e.state.id,!1];e.setState(((o=e.state).id+=1,{id:o.id}));e.setState(function(t){return t.dict[r].push(h),t.dict[h]=[],{dict:t.dict}}(e.state));var p=r;setTimeout(function(){return e.renderNewNode(p,h,s+1)},500*(s+1)),r,r=h}a=n.next()};!a.done;)o()}},{key:"findWordsFromNode",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.state.root;n[2]&&t.push(r),this.state.dict[n].forEach(function(n){var a=r+n[0];e.findWordsFromNode(t,a,n)})}},{key:"renderNewNode",value:function(t,e,r){var n,a=this,o=1,i=1,s=1e3/(o+1);if(this.state.renderedNodes[r]){o+=Object.keys(this.state.renderedNodes[r]).length,s=1e3/(o+1);this.setState((n=this.state,Object.keys(n.renderedNodes[r]).forEach(function(t){var e=n.renderedNodes[r][t];console.log("rerendering:",e[2].text()),console.log("counter:",i);var o=a.state.renderedNodes[r-1][e[5]][1],d=s*i,c=70*(r+1);e[1].transition().duration(500).attr("cx",d).attr("cy",c),e[2].transition().duration(500).attr("x",s*i-10).attr("y",70*(r+1)),e[3].transition().duration(500).attr("x1",o.attr("cx")).attr("y1",o.attr("cy")).attr("x2",d).attr("y2",c),e[4].forEach(function(t){t.transition().duration(500).attr("x1",d).attr("y1",c)}),i+=1}),{renderedNodes:n.renderedNodes}))}var d="#f3f3f3ff";e[2]&&(d="#fce5cdff"),console.log("creating:",e[0]);var c=this.state.renderedNodes[r-1][t][1],u=s*i,l=70*(r+1),f=p.a(this.refs.svg).append("line").attr("x1",c.attr("cx")).attr("y1",c.attr("cy")).attr("x2",c.attr("cx")).attr("y2",c.attr("cy")).attr("stroke","black").lower();f.transition().duration(500).attr("x2",u).attr("y2",l);var h=p.a(this.refs.svg).append("circle").attr("cx",u).attr("cy",l).attr("r",20).style("fill",d),v=p.a(this.refs.svg).append("text").attr("x",s*i-10).attr("y",5+70*(r+1)).text("'"+e[0]+"'").style("font-size","25px").style("fill","black"),y=[];this.state.renderedNodes[r-1][t][4].push(f);this.setState(function(n){return n.renderedNodes[r]?n.renderedNodes[r][e]=[e,h,v,f,y,t]:(n.renderedNodes[r]=[],n.renderedNodes[r][e]=[e,h,v,f,y,t]),{renderedNodes:n.renderedNodes}}(this.state))}},{key:"componentDidMount",value:function(){var t,e=p.a(this.refs.svg).append("circle").attr("cx",500).attr("cy",55).attr("r",20).style("fill","#f3f3f3ff"),r=p.a(this.refs.svg).append("text").attr("x",495).attr("y",55).text("''").style("font-size","25px").style("fill","black"),n=[];this.setState(((t=this.state).renderedNodes[0]=[],t.renderedNodes[0][[!1,0,!1]]=[[!1,0,!1],e,r,null,n,null],{renderedNodes:t.renderedNodes}))}},{key:"autocomplete",value:function(t){var e=this,r=[],n=this.state.root;console.log("currNode",n),t.split("").forEach(function(t){var a=!1;if(e.state.dict[n].forEach(function(e){e[0]!==t||a||(n=e,a=!0)}),!a)return console.error("PREFIX NOT IN TRIE"),r});var a=n;return this.findWordsFromNode(r,t,a),r}},{key:"handleSubmit",value:function(t){t.preventDefault(),this.state.inputWord.length>0&&(this.addWord(this.state.inputWord),this.setState({inputWord:""}))}},{key:"render",value:function(){var t=this;return console.log("render"),a.a.createElement("div",null,a.a.createElement("svg",{width:1e3,height:"800",id:"trie",ref:"svg",style:m}),a.a.createElement("form",{onSubmit:function(e){return t.handleSubmit(e)}},a.a.createElement("input",{value:this.state.inputWord,onChange:function(e){return t.setState({inputWord:e.target.value})},type:"text",placeholder:"New word"}),a.a.createElement("button",{type:"submit"},"Add Word")))}}]),e}(n.Component),m={backgroundColor:"#ffffff"},N=(r(19),function(t){function e(){return Object(s.a)(this,e),Object(c.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(d.a)(e,[{key:"render",value:function(){return a.a.createElement("div",{className:"App"},a.a.createElement(h.a,{octoColor:"#444151",bannerColor:"#ffffff",href:"https://github.com/seve/visual-trie"}),a.a.createElement("div",{className:"canvas",style:{marginTop:"32px"}},a.a.createElement(y,null)))}}]),e}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(N,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[11,1,2]]]);
//# sourceMappingURL=main.177db53c.chunk.js.map