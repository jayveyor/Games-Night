import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Qs from 'qs';
const jsonData = require('../../games.json');
import Search from './Search.js';
import User from './user.js';
import NewEvent from './NewEvent.js';
import JoinEvent from './JoinEvent.js';
import Event from './event.js';
import Header from './header.js';
const API_KEY = '632317563386-uov247h7jhqdvmfr349ptp2vltatoovc.apps.googleusercontent.com';

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDYk9fvWR8yWyJcrkll3Gv3x9Ne6VF_Rws",
    authDomain: "bring-your-games-night.firebaseapp.com",
    databaseURL: "https://bring-your-games-night.firebaseio.com",
    projectId: "bring-your-games-night",
    storageBucket: "bring-your-games-night.appspot.com",
    messagingSenderId: "632317563386"
  };
  firebase.initializeApp(config);
var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

if (user != null) {
  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  emailVerified = user.emailVerified;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
}

class Home extends React.Component {
  constructor() {
    super();
  }
  
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="homeWrap">
      <Header/>
      <main className="homePage">
          <div className="mainTitle"><h1>Games Night</h1></div>
          <div className="flex">
          <div className="newEvent">
          <Link to="/NewEvent">
            <div className="flex">
            <i className="far fa-calendar-alt"></i>
            <h2>Plan your Night</h2>
            </div>
        </Link>
        </div>
        <div className="joinEvent">
        <Link to="/joinEvent">
            <div className="flex">
            <i className="far fa-calendar-alt"></i>
            <h2>Join Someone Elses</h2>
            </div>
        </Link>
        </div>
          </div>
      </main>
    </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      gameLibrary: [],
      gameTitles: [],
      suggestions:[],
      value: '',
    }
    this.setData = this.setData.bind(this);
  }

  setData () {
    this.setState({
      gameLibrary: jsonData
    })
  }
  componentDidMount() {
    this.setData();
  }
  
    render() {
      return (
        <div>
          <Router>
            <div>
              <Route path="/" exact component={Home} />
              <Route
                path="/Search"
                render={(props) => {
                  return <Search/>
                }}
              />
              <Route
                path="/NewEvent"
                render={(props) => {
                  return <NewEvent />
                }}
              />
              <Route
                path="/JoinEvent"
                render={(props) => {
                  return <JoinEvent />
                }}
              />
              <Route path="/event/:value" component={Event} />
            </div>
          </Router>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
