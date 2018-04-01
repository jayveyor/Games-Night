import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
import Header from './header.js';
import DatePicker from "react-datepicker";
import moment from "moment";
import Game from "./game.js";
import Autosuggest from 'react-autosuggest';
const jsonData = require('../../games.json');


// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return jsonData.filter(library => regex.test(library.names));
};

const getSuggestionValue = suggestion => suggestion.names;

const renderSuggestion = suggestion => <span>{suggestion.names}</span>;

class NewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            value: '',
            suggestions: getSuggestions(''),
            currentSelection:'',
            savedGames: [],
            gamePicker: true,
            eventInfo: [],
            eventName: '',
            eventLocation:'',
            eventNotes: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.addGame = this.addGame.bind(this);
        this.showGames = this.showGames.bind(this);
        this.planEvent = this.planEvent.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.removeGame=this.removeGame.bind(this);
    }
    handleInput(event, field){
        const newState = Object.assign({}, this.state);
        newState[field] = event.target.value;
        this.setState(newState);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });

    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue
        });
        this.setState({
            currentSelection: newValue
        });
    };

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };

    addGame(event) {
        event.preventDefault();

        const newState = Array.from(this.state.savedGames);
        newState.push(this.state.currentSelection);
        this.setState({
            savedGames: newState,
        });
    }
    removeGame(event, game) {
        event.preventDefault();
        let newState = Array.from(this.state.savedGames);
        console.log(newState)
        newState = newState.filter((games) => {
            return games != game;
        });
        this.setState({
            savedGames: newState,
        });
    }
    showGames() {
        if (this.state.gamePicker === false) {
            this.setState({
                gamePicker: true
            });
        }
        else {
            this.setState({
                gamePicker: false
            });
        }
    }
    planEvent(event) {
        event.preventDefault();
        let moment;
        moment = this.state.startDate;
        moment = moment._d;
        moment = `${moment}`
        console.log(moment)
        let name = this.state.eventName;
        let location = this.state.eventLocation;
        let notes = this.state.eventNotes;
        let dbref = firebase.database().ref(`/events`);
        var newPostRef = dbref.push({ creator: firebase.auth().currentUser.uid, name: name, games: [{ games: this.state.savedGames, owner: firebase.auth().currentUser.uid}], date: moment, location: location, notes: notes, attending: firebase.auth().currentUser.uid});
        var postId = newPostRef.key;
        dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/events`);
        dbref.push(postId);
        window.location.replace(`/event/${postId}`);
    }
    
    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Search for a Game",
            value,
            onChange: this.onChange
        };
        let gamePicker; 
        if (this.state.gamePicker) {
            gamePicker = (
                <div className="gamesPicker">
                    <form onSubmit={(event) => this.addGame(event)}>
                    <div className="flex">
                        <Autosuggest // eslint-disable-line react/jsx-no-undef
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                        />
                    <button  className="add"  type="submit"><i class="fas fa-plus"></i></button>
                    </div>
                    </form>
                    <div className="gameSelects">
                    {this.state.savedGames.map((game) => {
                        return (
                            <div className="flex">
                                <h2>{game}</h2> 
                                <form className="remove" onSubmit={(event) => this.removeGame(event, game)}>
                                    <button type="submit"><i class="fas fa-times-circle"></i></button></form>
                            <Game gameTitle={game} />
                            </div>
                        )
                    })}
                    </div>
                </div>
            )
        }
        return (
            <div className="eventWrap">
            <Header/>
            <main >
                <div className="event">
                <div className="flex">
                <h2>Name your Event</h2>
                
                <input type="text" onChange={(event) => this.handleInput(event, "eventName")} />
                <h2>Select your Date</h2>
                <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                showTimeSelect
                dateFormat="LLL" 
                />
                <button class="eventButton" type="button" onClick={this.showGames}>Add your Games</button>
                {gamePicker}
                <h2>Pick your Location</h2>
                <input type="text" onChange={(event) => this.handleInput(event, "eventLocation")} />
                <h2> Aditional Notes</h2>
                <input type="textarea" onChange={(event) => this.handleInput(event, "eventNotes")} />
                <form onSubmit={(event) => this.planEvent(event)}>
                <button class="eventButton" type="submit">Plan Event</button>
                </form>
                </div>
                </div>
            </main>
            </div>
        )
    }
}

export default NewEvent;