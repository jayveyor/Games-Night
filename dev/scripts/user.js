import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
import Game from "./game.js";
import Autosuggest from 'react-autosuggest';
const jsonData = require('../../games.json');
import Header from './header.js';

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

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: getSuggestions(''),
            currentSelection: '',
            savedGames: [],
            gamePicker: false,
            listEvents: false,
            eventLocations: [],
            eventsList: ['none']
        }
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.addGame = this.addGame.bind(this);
        this.showGames = this.showGames.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.showEvents = this.showEvents.bind(this);
        this.findEvents = this.findEvents.bind(this);
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
    showEvents() {
        if (this.state.listEvents === false) {
            this.setState({
                listEvents: true
            });
        }
        else {
            this.setState({
                listEvents: false
            });
        }
    }
    findEvents() {
        const locations = Array.from(this.state.eventLocations);
      console.log(locations)
        locations.forEach((event) => {
            const dbref = firebase.database().ref(`/events/${event}`);
            dbref.on('value', (snapshot) => {
                const data = snapshot.val();
                const id = [];
                for (let key in data) {
                    id.push(data[key]);
                }
                let newState = Array.from(this.state.eventsList);
                newState.push({name: id[5], location: event});
                this.setState({
                    eventsList: newState,
                });
            });
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const dbref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/events`);
                dbref.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const state = [];
                    for (let key in data) {
                        state.push(data[key]);
                    }
                    this.setState({
                        eventLocations: state,
                    });
                });
            } else {
                
            }
            this.findEvents();
        })
    }
    

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Search for a Game",
            value,
            onChange: this.onChange
        };
        let events; 
        if (this.state.listEvents) {
            events = (
                <div className="eventsList">
                    {this.state.eventsList.map((event) => {
                            return (
                                <div className="flex">
                                    <Link to={`/event/${event.location}`}><h3>{event.name}</h3></Link>
                                    {/* <Link params={event.location} to={`/event/${event.location}`}><h2>{event.name}</h2> </Link> */}
                                    
                                </div>
                            )
                    })}
                </div>
            )
        }
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
                            <button className="add" type="submit"><i class="fas fa-plus"></i></button>
                        </div>
                    </form>
                    <div className="gameSelects">
                        {this.state.savedGames.map((game) => {
                            return (
                                <div className="flex">
                                    <h3>{game}</h3>
                                    <form onSubmit={(event) => this.removeGame(event, game)}>
                                        <button className="remove" type="submit"><i class="fas fa-times-circle"></i></button></form>
                                    <Game gameTitle={game} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        return (
            <div className="flex">
                <h2>Events You're a part of</h2>
                <p>Click through to see more information</p>
                <button className="headline" type="button" onClick={this.showEvents}>Your Game Nights</button>
                {events}
                <h2>Your Game Collection</h2>
                <p>keep track of games you own bellow, to quickly add them to your events.</p>
                <button className="headline" type="button" onClick={this.showGames}>Add your Games</button>
                {gamePicker}
            </div>
        )
    }
}

export default User;