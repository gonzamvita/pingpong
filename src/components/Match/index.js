import React, { Component } from 'react';
import { NewMatchLink } from '../MatchCreate'
import MatchSummaryCard from '../MatchSummary'
import { withFirebase } from '../Firebase';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

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
        const { matches, loading } = this.state;

        return (
            <div>
                <h1>Matches</h1>
                <div className={1}>
                    <Button variant="contained" color="primary" href="#contained-buttons">
                        <NewMatchLink />
                    </Button>
                </div>
                {loading && <div>Loading ...</div>}
                <MatchList matches={matches} />
            </div>
        );
    }
}

const MatchList = ({ matches }) => (
    <div style={{ width: '100%', background: 'transparent' }}>
        <Box display="flex" flexDirection="column" p={1} m={1} bgcolor="background.white">
            {
                matches.map(match => (
                    <Box p={1} bgcolor="grey.300">
                        <MatchSummaryCard match={match} />
                    </Box>
                ))
            }
        </Box>
    </div>
);

export default withFirebase(MatchPage);