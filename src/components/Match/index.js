import React, { Component } from 'react';
import { NewMatchLink } from '../MatchCreate'
import { withFirebase } from '../Firebase';

const INITIAL_MATCH_STATE = {
    player1Id: '',
    player2Id: '',
    status: 'pending',
    date: null,
    winnerId: null,
};

class MatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            matches: [],
            ...INITIAL_MATCH_STATE
        };
    }
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.getMatches().then(querySnapshot => {
            const matchesList = querySnapshot.docs.map(doc => doc.data())
            this.setState({
                matches: matchesList,
                loading: false,
            });
        });
    }

    render() {
        const { matches, loading, player1Id, player2Id } = this.state;

        const isInvalid =
            player1Id === '' ||
            player2Id === '';

        return (
            <div>
                <h1>Match</h1>
                <NewMatchLink />
                <form onSubmit={this.onSubmit}>
                    <select>
                        <option>paco</option>
                        <option>luis</option>
                    </select>
                    <button disabled={isInvalid} type="submit">Sign Up</button>
                </form>
                {loading && <div>Loading ...</div>}
                <MatchList matches={matches} />
            </div>
        );
    }
}

const MatchList = ({ matches }) => (
    <ul>
        {matches.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>Username:</strong> {user.username}
                </span>
                <br />
                <span>
                    <strong>E-Mail:</strong> {user.email}
                </span>
                <br />
                <span>
                    <strong>UID:</strong> {user.uid}
                </span>
            </li>
        ))}
    </ul>
);

export default withFirebase(MatchPage);