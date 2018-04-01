import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
import Game from "./game.js";
import Owner from "./owner.js";
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

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: getSuggestions(''),
            currentSelection: '',
            savedGames: [],
            gamePicker: true,
            eventInfo: [],
            eventName: '',
            eventLocation: '',
            eventNotes: '',
            eventHost:'',
            eventTime:'',
            currentGames: true,
            addGames: false,
            yourGames: [],
            eventAttending: [],
        }
        this.addGame = this.addGame.bind(this);
        this.showGames = this.showGames.bind(this);
        this.pushGame = this.pushGame.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
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
        const newState = Array.from(this.state.yourGames);
        newState.push(this.state.currentSelection);
        this.setState({
            yourGames: newState,
        });
    }
    pushGame(event, game) {
        event.preventDefault();
        let location = this.props.match.params.value;        
            let dbref = firebase.database().ref(`/events/${location}/games/`);
            dbref.push({ games: [game], owner: firebase.auth().currentUser.uid });

        let newState = Array.from(this.state.yourGames);
        console.log(newState)
        newState = newState.filter((games) => {
            return games != game;
        });
        this.setState({
            yourGames: newState,
        });
    }
    componentDidMount() {
        let location = this.props.match.params.value;
                const dbref = firebase.database().ref(`/events/${location}`);
                dbref.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const info = [];
                    for (let key in data) {
                        info.push(data[key]);
                    }
                    this.setState({
                        eventAttending: info[0],
                        eventHost: info[1],
                        eventTime: info[2],
                        savedGames: info[3],
                        eventLocation: info[4],
                        eventName: info[5],
                        eventNotes: info[6]
                    });
                });
        
    }
    showGames() {
        if (this.state.addGames === false) {
            this.setState({
                addGames: true
            });
        }
        else {
            this.setState({
                addGames: false
            });
        }
    }

    render() {
        const gameInfo = [];
        for (let key in this.state.savedGames) {
            gameInfo.push(this.state.savedGames[key]);
        }
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Search for a Game",
            value,
            onChange: this.onChange
        };
        let addGames;
        if (this.state.addGames) {
            addGames = (
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
                        {this.state.yourGames.map((game) => {
                            return (
                                <div className="flex">
                                    <h2>{game}</h2>
                                    <form onSubmit={(event) => this.pushGame(event, game)}>
                                    <button type="submit">Add This</button></form>
                                    <Game gameTitle={game} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Header/>
                <div className="event">

               
                <h1>{this.state.eventName}</h1>
                <h2>When:</h2>
                <h3>{this.state.eventTime}</h3>
                <h2>Where:</h2>
                <h3>{this.state.eventLocation}</h3>
                <h2>What:</h2>
                <h3>{this.state.eventNotes}</h3>
                <h2>Games:</h2>
                <div className="gameSelects">

                    |{gameInfo.map((owner) => {
                        let user = owner.owner
                        return (
                            <div className="flex">
                                {owner.games.map((game) => {
                                    return (
                                        <div className="flex">
                                            <h2 className="gameTitle">{game}</h2>
                                            <Owner user = {user}/>
                                            <Game gameTitle={game} />
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="yourGames">
                <button class="eventButton" type="button" onClick={this.showGames}>Add your Games</button>
                {addGames}
                </div>
                </div>
            </div>
        )
    }
}

export default Event;