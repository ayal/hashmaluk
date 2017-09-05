import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

var style = require('./style.scss');


var config = {
  imagePath: "public/hash.png", 
};

/*
var config = {
  imagePath: "hash.png"
}
*/

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {rendering:true};
  }
  
  componentDidMount() {
    this.image = new Image();   // using optional size for image
    this.image.onload = ()=>{
      console.log(this.image.naturalWidth, this.image.naturalHeight);
      this.updateCanvas();
    };
    this.image.src = config.imagePath;
    
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }
  
  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    
    this.refs.canvas.width = window.innerWidth;
    this.refs.canvas.height = this.image.naturalHeight * (window.innerWidth / this.image.naturalWidth);
    ctx.clearRect(0,0,  this.refs.canvas.width, this.refs.canvas.height);
    ctx.textAlign = "center";
    ctx.drawImage(this.image, 0, 0, window.innerWidth, this.image.naturalHeight * (window.innerWidth / this.image.naturalWidth));

    ctx.font = (window.innerWidth / 30) + "px Arial";
    ctx.translate(20/320*window.innerWidth,-20/320*window.innerWidth)
    ctx.rotate(0.1);
    
    var positions = [[255,130,1.4], [160+17, 150,1.2], [97+10, 135, 1], [40, 115,0.8]];
    var query = this.props.location.query || '{}';
    if (query && query.v) {
      var texts = query.v.split(' ');
      positions.forEach((p,i)=>{
	if (texts[i]) {
	  ctx.font = ((window.innerWidth / 30) * p[2]) + "px Arial";
	  ctx.fillText(texts[i].split('').slice(0,7).join(''), p[0]/320*window.innerWidth, p[1]/320*window.innerWidth);
	}
      });
    }

    
    window.clearTimeout(this.toDataHandle);
    this.toDataHandle = setTimeout(()=>{
      var data = this.refs.canvas.toDataURL('image/png').replace('image/png', 'application/octet-stream');
      if (this.state.data !== data) {
	this.setState({data});
	setTimeout(()=>{
	  this.setState({rendering:false});
	},500)
      }
      
    },500);
  }

  change(e) {
    this.setState({rendering:true});
    this.context.router.push({pathname: '/hashmaluk', query: {v:e.target.value}});
  }

  getImage() {
    location.href = this.state.data;
  }
  
  render() {
    console.log('rendering app', this);
    var query = this.props.location.query;
    
    return (
      <div className="app">
	<input onChange={(e)=>this.change(e)} value={query.v} />
	<img src={this.state.data} style={{display:!this.state.rendering?'block':'none'}} className="theimg" />
	<canvas ref="canvas" style={{display:this.state.rendering?'block':'none'}} />
	<div className="download" onClick={()=>this.getImage()}>DOWNLOAD</div>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.func.isRequired
};

console.log('nice');

ReactDOM.render(
  (<Router history={browserHistory}>
	<Route>
          <Route path="/" component={App} />
	  <Route path="/hashmaluk" component={App} />
	  <Route path="/hashmaluk/" component={App} />
	</Route>
  </Router>),
  document.getElementById("app"));
