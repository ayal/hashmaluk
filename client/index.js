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
    $(window).resize(()=>{
      this.updateCanvas();
    })
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
    
    var positions = [[255,130,1.25], [160+14, 150,1.1], [97+10, 135, 0.9], [40, 115,0.9]];
    var query = this.props.location.query || '{}';
    if (query && query.v) {
      var texts = query.v.split(' ');
      positions.forEach((p,i)=>{
	if (texts[i]) {
	  ctx.font = ((window.innerWidth / 30) * p[2] * 1.05) + "px Arial";
	  if (texts[i].length > 4) {
	    ctx.font = ((window.innerWidth / 30) * p[2] * 0.8) + "px Arial";
	  }
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
	},100)
      }
    },100);
  }

  change(e) {
    this.setState({rendering:true});
    this.context.router.push({pathname: '/hashmaluk', query: {v:e.target.value}});
  }

  download(e) {
    if (navigator.userAgent.toUpperCase().indexOf('FBAV') !== -1) {
      e.preventDefault();
      alert('No download here :( open link in browser');
    }
  }
  
  render() {
    console.log('rendering app', this);
    var query = this.props.location.query;
    
    return (
      <div className="app">
	<input onChange={(e)=>this.change(e)} value={query.v} />
	{/*<img src={this.state.data} tyle={{display:!this.state.rendering?'block':'none'}} className="theimg" />*/}
	<canvas ref="canvas" />
	<a download="hashmaluk.png" className="download" href={this.state.data} onClick={(e)=>{this.download(e)}}>DOWNLOAD</a>
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
