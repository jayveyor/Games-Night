import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
import User from './user.js';
const API_KEY = '632317563386-uov247h7jhqdvmfr349ptp2vltatoovc.apps.googleusercontent.com';
const jsonData = require('../../games.json');


class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            moreInfo: false,
            gameTitles: [],
            loggedIn: false,
            user: {}
        }
        this.showPopup = this.showPopup.bind(this);
        this.getTitles = this.getTitles.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.userInfo = this.userInfo.bind(this);
    }
    handleChange(event, field) {
        const newState = Object.assign({}, this.state);
        newState[field] = event.target.value;
        this.setState(newState);
    }

    signOut() {
        firebase.auth().signOut().then(function (success) {
            console.log('Signed out!')
        }, function (error) {
            console.log(error);
        });
    }

    signIn(event) {
        event.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        let userInfo;
        userInfo = firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const token = result.credential.accessToken;

            // Get the signed-in user info.
            const user = result.user;
            const dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/profile`);
            dbref.push({ name: user.displayName, photo: user.photoURL, email: user.email });
        }).catch(function (error) {
            // Error handling goes in here.
            console.log(error)
        });
    }

    getTitles() {
        let titles = jsonData;
        titles = titles.map((title) => {
            return title.names
        })
        this.setState({
            gameTitles: titles
        })
    }
    showPopup() {
        if (this.state.moreInfo === false) {
            this.setState({
                moreInfo: true
            });
        }
        else {
            this.setState({
                moreInfo: false
            });
        }
    }

    userInfo() {
        let userInfo;
        userInfo = this.state.user;
        return (
            <div className="userInfo">
                <div>
                    <h2>Hello</h2>
                <h3>{userInfo.name}</h3>
                </div>
                <img src={userInfo.photo} alt="users google profile photo" />
            </div>
        )
    }

    componentDidMount() {
        this.getTitles();

        var dbRef = firebase.database().ref();
        dbRef.on('value', (data) => {
            // console.log(data.val());
        });



        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/profile`);
                dbref.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const state = [];
                    for (let key in data) {
                        state.push(data[key]);
                    }

                    this.setState({
                        loggedIn: true,
                        user: state[0],
                    });
                });
            } else {
                this.setState({ loggedIn: false });
            }
        })
    }

    render() {
        let moreInfo;
        if (this.state.moreInfo) {
            moreInfo = (
                <aside className="userPopup">
                    <User />
                </aside>
            )
        }
        let profile;
        if (this.state.loggedIn) {
            profile = (
                <div className="userProfile">
                    {this.userInfo()}
                    < button onClick={this.signOut} > Sign Out</button >
                </div>
            )
        } else {
            profile = (
                <div className="userProfile">
                    <button onClick={this.signIn}>Sign In</button>
                </div>
            )
        }
        return (
            <header>
                <div className="topBar wrap">
                    <div className="flex">
                        <button className="showPopup" onClick={this.showPopup}>Your Info</button>
                        {profile}
                    </div>
                </div>
                {moreInfo}
            </header>
        )
    }
}

export default Header;