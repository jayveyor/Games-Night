import React from 'react';
import Qs from 'qs';
import { Link } from 'react-router-dom';

class Owner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
        }
    }
    componentDidMount() {
        let user = this.props.user
        const dbref = firebase.database().ref(`/users/${user}/profile`);
        dbref.on('value', (snapshot) => {
            const data = snapshot.val();
            let state = [];
            for (let key in data) {
                state.push(data[key]);
            }
            state = state[0]
            this.setState({
                name: state.name
            });
        })
    }

    render() {
        return (
            <div>
                <h3>Owner: {this.state.name}</h3>
            </div>
        )
    }
}

export default Owner;