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
      
      var width = Math.min(window.innerWidth, 500);
      var ratio1 = (width / this.image.naturalWidth);
      var ratio2 = 1 / 320*width;
      
    this.refs.canvas.width = width;
    this.refs.canvas.height = this.image.naturalHeight * ratio1;
    
    ctx.clearRect(0,0,  this.refs.canvas.width, this.refs.canvas.height);
    ctx.textAlign = "center";
    ctx.drawImage(this.image, 0, 0, width, this.image.naturalHeight * ratio1);

    ctx.font = (width / 30) + "px Arial";
    ctx.translate(20*ratio2,-20*ratio2)
    ctx.rotate(0.1);
    
    var positions = [[255,130,1.6], [160+14, 150,1.3], [97+10, 135, 1.3], [40, 115,1.1]];
    var query = this.props.location.query || '{}';
    if (query && query.v) {
      var texts = query.v.split(' ');
      positions.forEach((p,i)=>{
	if (texts[i]) {
	  ctx.font = ((width / 30) * p[2] * 1.07) + "px Arial";
	  if (texts[i].length > 5) {
	    ctx.font = ((width / 30) * p[2] * 0.8) + "px Arial";
	  }
	  ctx.fillText(texts[i].split('').slice(0,7).join(''), p[0]*ratio2, p[1]*ratio2);
	}
      });
    }

    
    window.clearTimeout(this.toDataHandle);
    this.toDataHandle = setTimeout(()=>{
      var data = this.refs.canvas.toDataURL('image/jpg');
      if (this.state.data !== data) {
	this.setState({data});
	setTimeout(()=>{
	  this.setState({rendering:false});
	  this._download(this.state.data);
	},100)
      }
    },100);
  }

  change(e) {
    this.setState({rendering:true});
    this.context.router.push({pathname: '/hashmaluk', query: {v:e.target.value}});
  }

  _download(dataurl) {
    var callback = (blob) => {
      var a = this.refs.download;
	var realData = URL.createObjectURL(blob);
	a.href = realData;
    };

    var arr = dataurl.split(','),
        bstr = arr[1] && atob(arr[1]), n = bstr && bstr.length, u8arr = n && new Uint8Array(n);

    if (!bstr) {
      return;
    }
    
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    callback(new Blob([u8arr], {type:'image/jpg'}));
  }


  download(e) {
    /* if (navigator.userAgent.toUpperCase().indexOf('FBAV') !== -1) {
     *   e.preventDefault();
     *   alert('No download here :( open link in browser');
     * }*/
  }
  
  render() {
    console.log('rendering app', this);
    var query = this.props.location.query;
    
    return (
      <div className="app">
	<input onChange={(e)=>this.change(e)} value={query.v} />
	{/*<img src={this.state.data} tyle={{display:!this.state.rendering?'block':'none'}} className="theimg" />*/}
	<canvas ref="canvas" dir="rtl" />
	<a download="hashmaluk.jpg" ref="download" className="download" onClick={(e)=>{this.download(e)}}>DOWNLOAD</a>
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
