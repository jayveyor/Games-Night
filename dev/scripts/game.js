import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';
const jsonData = require('../../games.json');

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInfo: [],
        }
    }

    componentDidMount() {
        let gameInfo = jsonData;
        gameInfo = gameInfo.filter((games) => {
            return games.names === this.props.gameTitle;
        });
        this.setState({
            gameInfo: gameInfo
        });
    }

    determinePlayTime(minutes) {
        if (minutes === 0) {
            return (
               'U/K'
        ) 
        } else if (minutes <= 15) {
            return (
                '15 minutes or less'
            )
        } else if (minutes <= 30) {
            return (
                '15 - 30 minutes'
            )
        } else if ( minutes <= 45) {
            return (
            '30 - 45 minutes'
            )
        }
        else if (minutes <= 60) {
            return (
            '1 hour'
            )
        }
        else if (minutes <= 90) {
            return (
            '1 hour & 1/2'
            )
        }
        else if (minutes <= 120) {
            return (
            '2 hours'
            )
        } else if (minutes <= 150) {
            return (
            '2 hours & 1/2'
            )
        } 
        else if (minutes <= 180) {
            return (
            '3 hours'
            )
        } else if (minutes <= 200) {
            return (
            '3 hours & 1/2'
            )
        } else if (minutes <= 240) {
            return (
            '4 hours'
            )
        } else if (minutes <= 300) {
            return (
            '5 hours'
            )
        } else if (minutes <= 360) {
            return (
            '6 hours'
            )
        } else if (minutes > 360) {
            return (
                'All Day'
            )
        } 
    }

    determineRating(rating) {
        if (rating <= 6) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                </div>
            )
        } else if (rating >= 8.5){
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
            )
        } else if (rating <= 6.5) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half"></i>
                </div>
            )
        } else if (rating <= 7) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>                   
                </div>
            )
        } else if (rating <= 7.25) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half"></i>
                </div>
            )
        }else if (rating <= 7.5) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
            )
        } else if (rating <= 7.75) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half"></i>
                </div>
            )
        }
        else if (rating <= 8) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>                    
                </div>
            )
        }
        else if (rating >= 8) {
            return (
                <div>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half"></i>
                </div>
            )
        }

    }
    determineDifficulty(weight) {
        
        if (weight <= 1.5) {
            return (
                <div>
                    <i class="fas fa-bolt"></i>
                </div>
            )
        } else if (weight <= 2.5) {
            return (
                <div>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                </div>
            )
        } else if (weight <= 3.5) {
            return (
                <div>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                </div>
            )
        } else if (weight <= 4.5) {
            return (
                <div>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                </div>
            )
        } else if (weight > 4.5) {
            return (
                <div>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                    <i class="fas fa-bolt"></i>
                </div>
            )
        }
    }

    render() {
        let gameInfo = this.state.gameInfo;

        gameInfo = gameInfo.map((info) => {
            let players; 
            if (info.max_players === 1 ) {
                players = (
                    <p>1 player</p>
                )
            } else if (info.max_players === info.min_players){
                players = (
                    <p> {info.min_players} players</p>
                )
            } else {
                players = (
                    <p> {info.min_players} to {info.max_players} players</p>
                )
            }
            return (
                
                <div className="gameInfo">
                <div className="grid">
                <img src={info.image_url} alt={`box art of ${info.names} game`}/>
                <div className="playTime">
                <h3>Playtime:</h3><p>{this.determinePlayTime(info.avg_time)}</p></div>
                <div className="players">
                <h3>Players:</h3>{players}</div>
                <div className="rating">
                <h3>Averge rating:</h3><p>{this.determineRating(info.avg_rating)}</p></div>
                <div className="difficulty">
                <h3>Difficulty:</h3><p> {this.determineDifficulty(info.weight)}</p></div>
                </div>
                </div>
            )
        });
        return (
            <div className="gameChoice">
             {gameInfo}
            </div>
        )
    }
}

export default Game;