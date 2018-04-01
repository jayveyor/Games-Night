import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
import Header from './header.js';

class JoinEvent extends React.Component {
    constructor() {
        super();
        this.state = {
            eventID: '',
        }
        this.joinEvent = this.joinEvent.bind(this);
    }
    handleInput(event, field) {
        const newState = Object.assign({}, this.state);
        newState[field] = event.target.value;
        this.setState(newState);
    }

    joinEvent(event) {
        event.preventDefault();
        let postId = this.state.eventID;
        let dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/events`);
        dbref.push(postId);
        window.location.replace(`/event/${postId}`);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="event">
                <h2>Enter the event ID bellow</h2>
                <h4>(It should look a little like this)</h4>
                <form onSubmit={(event) => this.joinEvent(event)}>
                <input placeholder="-L8yjHSaX6QwPPn7c6Mn" type="text" onChange={(event) => this.handleInput(event, "eventID")} />
                <button type="submit" class="eventButton">Join Event</button>
                </form>
                <p>If you don't have an event ID, ask your friend to send it to you so you can join the party!</p>
                <Link to="/NewEvent"><h4>Or you can click here to start your own event instead.</h4></Link>
                </div>
            </div>
        )
    }
}

export default JoinEvent;