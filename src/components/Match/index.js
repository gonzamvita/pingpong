import React, { Component } from 'react';
import { NewMatchLink } from '../MatchCreate'
import MatchSummaryCard from '../MatchSummary'
import { withFirebase } from '../Firebase';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
                    <Button variant="contained" color="primary">
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
    <div style={{ width: '100%', padding: 20 }}>
        <Grid
            container
            spacing={3}
            direction="row-reverse"
            justify="flex-start"
            alignItems="stretch"
        >
            {
                matches.map((match, i) => (
                    <Grid item xs key={i}>
                        <MatchSummaryCard match={match} />
                    </Grid>
                ))
            }
        </Grid>
    </div>
);

export default withFirebase(MatchPage);