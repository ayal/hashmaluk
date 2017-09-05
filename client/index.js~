import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

var style = require('./style.scss');

export class App extends React.Component {
  constructor(props){
    super(props);
    //this.state = {};
  }

  goToAbout() {
    this.context.router.push('/about/kaki?x=1');
  }

    render() {
	console.log('rendering app', this)
	return (
	  <div>
	    <div>hello w0rld</div>
  	    <div onClick={this.goToAbout.bind(this)}>click about</div>
	  </div>
	);
    }
}

App.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export class About extends React.Component {
    constructor(props){
	super(props);
    }

    render() {
      console.log('rendering about', this);
      return (
	<div>
	<div>{this.props.params.message}</div>
	<div>{JSON.stringify(this.props.location.query)}</div>
	</div>
      );
    }
}


ReactDOM.render(
    (<Router history={browserHistory}>
      <Route>
        <Route path="/about/:message" component={About} />
        <Route path="/" component={App} />
      </Route>
     </Router>),
    document.getElementById("app"));
