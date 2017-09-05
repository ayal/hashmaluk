import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

var style = require('./style.scss');


var config = {
  imagePath: "public/hash.png", 
};


/*var config = {
  imagePath: "hash.png"
}*/


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
    ctx.direction = "rtl";
    
    var positions = [[255,130,1.6], [160+14, 150,1.3], [97+10, 135, 1.3], [40, 115,1.1]];
    var query = this.props.location.query || '{}';
    if (query && query.v) {
      var texts = query.v.split(' ');
      positions.forEach((p,i)=>{
	if (texts[i]) {
	  ctx.font = ((window.innerWidth / 30) * p[2] * 1.07) + "px Arial";
	  if (texts[i].length > 5) {
	    ctx.font = ((window.innerWidth / 30) * p[2] * 0.8) + "px Arial";
	  }
	  ctx.fillText(texts[i].split('').slice(0,7).join(''), p[0]/320*window.innerWidth, p[1]/320*window.innerWidth);
	}
      });
    }

    
    window.clearTimeout(this.toDataHandle);
    this.toDataHandle = setTimeout(()=>{
      var data = this.refs.canvas.toDataURL('image/png');
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

    callback(new Blob([u8arr], {type:'image/png'}));
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
	<canvas ref="canvas" />
	<a ref="download" className="download" onClick={(e)=>{this.download(e)}}>IMAGE</a>
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
