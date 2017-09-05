import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

var style = require('./style.scss');

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    this.image = new Image(60, 45);   // using optional size for image
    this.image.onload = ()=>{
      console.log(this.image.naturalWidth, this.image.naturalHeight);
      this.updateCanvas();
    };
    this.image.src = "/hash.png";
    
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

    ctx.font = (window.innerWidth / 28) + "px Arial";
    ctx.translate(20/320*window.innerWidth,-20/320*window.innerWidth)
    ctx.rotate(0.1);
    
    var positions = [[255,130], [160+17, 150], [97+10, 135], [40, 115]];
    var query = this.props.location.query || '{}';
    if (query && query.v) {
      var texts = query.v.split(' ');
      positions.forEach((p,i)=>{
	if (texts[i]) {
	  ctx.fillText(texts[i].split('').slice(0,7).join(''), p[0]/320*window.innerWidth, p[1]/320*window.innerWidth);
	}
      });
    }

    
    window.clearTimeout(this.toDataHandle);
    this.toDataHandle = setTimeout(()=>{
      var thedata = this.refs.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
      if (this.state.data !== thedata)
      this.setState({data:thedata});
    },100);
  }

  change(e) {
    this.context.router.push({query: {v:e.target.value}});
  }
  
  render() {
    console.log('rendering app', this);
    var query = this.props.location.query;
    
    return (
      <div className="app">
	<input onChange={(e)=>this.change(e)} value={query.v} />
	<canvas ref="canvas" />
	<a download="hashmaluk.png" href={this.state.data} >download</a>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.func.isRequired
};

ReactDOM.render(
  (<Router history={browserHistory}>
	<Route>
          <Route path="/" component={App} />
	  <Route path="/hashmaluk" component={App} />
	  <Route path="/hashmaluk/" component={App} />
	</Route>
  </Router>),
  document.getElementById("app"));
